'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ResumeForm } from '@/components/ResumeForm';
import { ModernTemplate } from '@/components/ResumeTemplates/ModernTemplate';
import { CreativeTemplate } from '@/components/ResumeTemplates/CreativeTemplate';
import { ElegantTemplate } from '@/components/ResumeTemplates/ElegantTemplate';
import { MinimalTemplate } from '@/components/ResumeTemplates/MinimalTemplate';
import { ModernDarkTemplate } from '@/components/ResumeTemplates/ModernDarkTemplate';
import { PdfResumePreview } from '@/components/PdfResumePreview';
import { ResumeData } from '@/types/resume';
import { Download, FileText, RotateCcw, LayoutTemplate, Plus, ArrowRight, Sparkles, User, Briefcase as BriefcaseIcon, ChevronLeft, Upload, CheckCircle2, ArrowLeft, Lightbulb, Loader2 } from 'lucide-react';
 
import { motion, AnimatePresence } from 'framer-motion';
import { PROFESSIONAL_TEMPLATES, PROFESSIONAL_TEMPLATE_META } from '@/lib/templates';
import { generateTailoredResume } from '@/lib/groq';
import { generateAtsSuggestions, type AtsSuggestion } from '@/lib/groq';
import { analyzeAtsKeywords, resumeDataToText, scoreAtsMatch, scoreAtsMatchFromText } from '@/lib/ats';

const initialData: ResumeData = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  linkedin: '',
  github: '',
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  jobDescription: '',
  skillStyle: 'categorized'
};

export default function Home() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [step, setStep] = useState<'landing' | 'input' | 'builder'>('landing');
  const [subStep, setSubStep] = useState<1 | 2>(1);
  const [userInfo, setUserInfo] = useState('');
  const [jobInfo, setJobInfo] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [templateId, setTemplateId] = useState<'modern' | 'creative' | 'elegant' | 'minimal' | 'dark'>('modern');
  const [marginMm, setMarginMm] = useState<number>(10);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const [showAtsSuggestions, setShowAtsSuggestions] = useState(false);
  const [atsSuggestions, setAtsSuggestions] = useState<AtsSuggestion[]>([]);
  const [atsSuggestionsLoading, setAtsSuggestionsLoading] = useState(false);
  const [atsSuggestionsError, setAtsSuggestionsError] = useState<string | null>(null);
  const [selectedAtsSuggestionIds, setSelectedAtsSuggestionIds] = useState<Set<string>>(new Set());
  const [atsApplying, setAtsApplying] = useState(false);

  const MAX_SUMMARY_CHARS = 450;
  const MAX_SKILLS = 40;
  const MAX_SKILL_NAME_CHARS = 40;
  const MAX_BULLET_CHARS = 180;
  const MAX_BULLETS_PER_EXPERIENCE = 6;
  const MAX_EXPERIENCE_DESC_CHARS = 900;

  const ats = React.useMemo(() => scoreAtsMatch(resumeData), [resumeData]);
  const atsDraft = React.useMemo(() => scoreAtsMatchFromText(userInfo, jobInfo), [userInfo, jobInfo]);
  const atsKeywordAnalysis = React.useMemo(
    () => analyzeAtsKeywords(resumeDataToText(resumeData), resumeData.jobDescription || ''),
    [resumeData]
  );

  const applyAtsActionToResume = (prev: ResumeData, action: any): ResumeData => {
    if (!action || typeof action !== 'object' || typeof action.type !== 'string') return prev;

    switch (action.type) {
      case 'set_summary': {
        const value = String(action.value ?? '')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, MAX_SUMMARY_CHARS);
        if (!value) return prev;
        return { ...prev, summary: value };
      }
      case 'add_skill': {
        if ((prev.skills || []).length >= MAX_SKILLS) return prev;
        const name = String(action.name ?? '')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, MAX_SKILL_NAME_CHARS);
        if (!name) return prev;
        const exists = (prev.skills || []).some(s => s.name.trim().toLowerCase() === name.toLowerCase());
        if (exists) return prev;
        const category = action.category ? String(action.category).trim() : undefined;
        const level = (action.level as any) || 'Intermediate';
        return {
          ...prev,
          skills: [
            ...(prev.skills || []),
            {
              id: Math.random().toString(36).slice(2, 11),
              name,
              category,
              level,
            },
          ],
        };
      }
      case 'set_skill_category': {
        const name = String(action.name ?? '').trim().toLowerCase();
        const category = String(action.category ?? '').trim();
        if (!name || !category) return prev;
        return {
          ...prev,
          skills: (prev.skills || []).map(s =>
            s.name.trim().toLowerCase() === name ? { ...s, category } : s
          ),
        };
      }
      case 'append_experience_bullet': {
        const experienceId = String(action.experienceId ?? '').trim();
        const bullet = String(action.bullet ?? '')
          .replace(/^•\s*/g, '')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, MAX_BULLET_CHARS);
        if (!experienceId || !bullet) return prev;
        return {
          ...prev,
          experience: (prev.experience || []).map(e => {
            if (e.id !== experienceId) return e;
            const current = (e.description || '').trim();

            const lines = current ? current.split(/\r?\n/).map(l => l.trim()).filter(Boolean) : [];
            const bulletLines = lines.filter(l => l.startsWith('•'));
            if (bulletLines.length >= MAX_BULLETS_PER_EXPERIENCE) return e;

            const normalizedExisting = current.toLowerCase();
            const normalizedNew = bullet.toLowerCase();
            if (normalizedExisting.includes(normalizedNew)) return e;

            const candidate = current ? `${current}\n• ${bullet}` : `• ${bullet}`;
            if (candidate.length > MAX_EXPERIENCE_DESC_CHARS) return e;

            const next = candidate;
            return { ...e, description: next };
          }),
        };
      }
      default:
        return prev;
    }
  };

  const applySelectedAtsSuggestions = () => {
    const selected = new Set(selectedAtsSuggestionIds);
    if (!selected.size) return;

    const toApply = atsSuggestions.filter(s => selected.has(s.id));
    if (!toApply.length) return;

    // Show loader immediately, then apply on next tick so UI updates first.
    setAtsApplying(true);
    setAtsSuggestionsError(null);

    setTimeout(() => {
      setResumeData(prev => {
        let next = prev;
        for (const s of toApply) {
          next = applyAtsActionToResume(next, (s as any).action);
        }
        return next;
      });

      setSelectedAtsSuggestionIds(new Set());
      setAtsSuggestions([]);
      setAtsApplying(false);
      setShowAtsSuggestions(false);
    }, 150);
  };

  const fetchAtsSuggestions = async () => {
    if (!resumeData.jobDescription?.trim()) {
      setAtsSuggestionsError('Paste a job description to get suggestions.');
      setAtsSuggestions([]);
      return;
    }

    setAtsSuggestionsLoading(true);
    setAtsSuggestionsError(null);
    try {
      const resumeText = resumeDataToText(resumeData);
      const analysis = analyzeAtsKeywords(resumeText, resumeData.jobDescription);
      const suggestions = await generateAtsSuggestions({
        resumeData,
        atsScore: ats.score,
        matchedKeywords: analysis.matched,
        missingKeywords: analysis.missing,
      });
      setAtsSuggestions(suggestions);
      setSelectedAtsSuggestionIds(new Set());
      if (!suggestions.length) setAtsSuggestionsError('No suggestions generated. Try adding more job description details.');
    } catch (e: any) {
      setAtsSuggestionsError(e?.message || 'Failed to generate suggestions.');
      setAtsSuggestions([]);
      setSelectedAtsSuggestionIds(new Set());
    } finally {
      setAtsSuggestionsLoading(false);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['All', ...Array.from(new Set(Object.values(PROFESSIONAL_TEMPLATE_META).map(m => m.badge).filter(Boolean)))];

  const extractTextFromPDF = async (file: File) => {
    setIsExtracting(true);
    try {
      // Use the legacy build to avoid DOMMatrix errors in some environments
      const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
      // Use unpkg CDN which is more reliable for specific npm versions
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.4.449/legacy/build/pdf.worker.min.mjs`;
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
      }
      
      setUserInfo(fullText);
    } catch (error) {
      console.error('Error extracting PDF:', error);
      alert('Failed to read PDF. Please try pasting the text manually.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      extractTextFromPDF(file);
    } else if (file) {
      alert('Please upload a PDF file.');
    }
  };

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('resumeData');
    const savedStep = localStorage.getItem('currentStep');
    if (savedData) {
      try {
        setResumeData(JSON.parse(savedData));
        if (savedStep) setStep(savedStep as any);
      } catch (e) {
        console.error('Failed to parse saved data', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('resumeData', JSON.stringify(resumeData));
      localStorage.setItem('currentStep', step);
    }
  }, [resumeData, step, isLoaded]);

  const handleReset = () => {
    if (confirm('Are you sure you want to reset? All your data will be lost.')) {
      setResumeData(initialData);
      setUserInfo('');
      setJobInfo('');
      setStep('landing');
      localStorage.removeItem('resumeData');
      localStorage.removeItem('currentStep');
    }
  };

  const loadTemplate = (templateKey: string) => {
    const templateData = PROFESSIONAL_TEMPLATES[templateKey];
    if (!templateData) return;

    const meta = PROFESSIONAL_TEMPLATE_META[templateKey];
    const newTemplateId: 'modern' | 'creative' | 'elegant' | 'minimal' | 'dark' = meta?.templateId ?? 'modern';
    setTemplateId(newTemplateId);

    // If user is already in the builder or has entered data, just switch the visual style
    const hasData = (resumeData.fullName && resumeData.fullName.trim() !== '') || 
                    (userInfo && userInfo.trim() !== '') ||
                    step === 'builder';
    
    if (hasData) {
      setResumeData(prev => ({
        ...prev,
        accentColor: templateData.accentColor,
        fontFamily: templateData.fontFamily,
        skillStyle: templateData.skillStyle
      }));
      setStep('builder');
    } else {
      // Fresh start with sample data
      setResumeData(templateData);
      
      // Pre-fill userInfo with template content for AI to tailor
      const experienceText = templateData.experience.map(exp => `${exp.role} at ${exp.company}\n${exp.description}`).join('\n\n');
      const skillsText = templateData.skills.map(s => s.name).join(', ');
      setUserInfo(`Name: ${templateData.fullName}\nEmail: ${templateData.email}\n\nExperience:\n${experienceText}\n\nSkills: ${skillsText}`);
      
      setSubStep(1);
      setStep('input');
    }
  };

  const handleGenerateTailored = async () => {
    if (!userInfo.trim() || !jobInfo.trim()) return;
    setIsGenerating(true);
    try {
      const jsonString = await generateTailoredResume(userInfo, jobInfo);
      const parsedData = JSON.parse(jsonString);
      const processedData = {
        ...parsedData,
        experience: parsedData.experience?.map((e: any) => ({ ...e, id: Math.random().toString(36).substr(2, 9) })) || [],
        education: parsedData.education?.map((e: any) => ({ ...e, id: Math.random().toString(36).substr(2, 9) })) || [],
        skills: parsedData.skills?.map((e: any) => ({ ...e, id: Math.random().toString(36).substr(2, 9) })) || [],
        projects: parsedData.projects?.map((p: any) => ({ ...p, id: Math.random().toString(36).substr(2, 9) })) || [],
        jobDescription: jobInfo,
        skillStyle: 'categorized',
        fontFamily: 'Inter'
      };
      setResumeData(processedData);
      setStep('builder');
    } catch (error) {
      console.error("Failed to generate tailored resume", error);
      alert("Failed to generate resume. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const effectiveMarginMm = templateId === 'dark' || templateId === 'creative' ? 0 : marginMm;
      const response = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData,
          templateId,
          marginMm: effectiveMarginMm,
          fileName: resumeData.fullName,
        }),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(text || 'Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const fileBase = (resumeData.fullName || 'resume').trim().replace(/\s+/g, '_');
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileBase}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF generation failed', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const renderTemplate = (data: ResumeData) => {
    switch (templateId) {
      case 'creative': return <CreativeTemplate data={data} />;
      case 'elegant': return <ElegantTemplate data={data} />;
      case 'minimal': return <MinimalTemplate data={data} />;
      case 'dark': return <ModernDarkTemplate data={data} />;
      default: return <ModernTemplate data={data} />;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => setStep('landing')}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
              <FileText size={22} />
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900">Resu<span className="text-blue-600">Make</span></span>
          </div>
          <div className="flex items-center gap-4">
            {step === 'builder' && (
              <>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 text-gray-500 hover:text-red-600 px-4 py-2 rounded-xl transition-all text-sm font-bold"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>

                {templateId !== 'creative' && templateId !== 'dark' && (
                  <>
                    <div className="h-6 w-px bg-gray-200 mx-2" />

                    <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                      <span className="text-xs font-black uppercase tracking-wider text-gray-400">Margins</span>
                      <select
                        value={marginMm}
                        onChange={(e) => setMarginMm(Number(e.target.value))}
                        className="bg-transparent text-gray-900 text-sm font-bold focus:outline-none cursor-pointer"
                      >
                        <option value={0}>0mm</option>
                        <option value={5}>5mm</option>
                        <option value={10}>10mm</option>
                        <option value={15}>15mm</option>
                        <option value={20}>20mm</option>
                      </select>
                    </div>
                  </>
                )}
                
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-gray-200 hover:shadow-blue-200 font-bold text-sm"
                >
                  <Download size={18} />
                  Download PDF
                </button>
              </>
            )}
            {step !== 'builder' && (
              <button
                onClick={() => {
                  setSubStep(1);
                  setStep('input');
                }}
                className="hidden sm:flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 font-bold text-sm"
              >
                <Sparkles size={18} />
                Get Started
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Step 1: Modern Landing Page */}
        {step === 'landing' && (
          <div className="space-y-20 pb-20">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-3xl animate-pulse delay-700" />
              </div>

              <div className="max-w-4xl mx-auto text-center space-y-8 px-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-6">
                    <Sparkles size={16} />
                    AI-Powered Resume Builder
                  </span>
                  <h1 className="text-6xl md:text-7xl font-black text-gray-900 tracking-tight leading-[1.1]">
                    Land Your Dream Job with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">AI Precision</span>
                  </h1>
                  <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Create a professional, ATS-optimized resume in minutes. Use AI to tailor your experience to any job description.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                >
                  <button
                    onClick={() => {
                      setSubStep(1);
                      setStep('input');
                    }}
                    className="w-full sm:w-auto bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2 group"
                  >
                    <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                    Start with AI
                  </button>
                  <button
                    onClick={() => {
                      setResumeData({ ...initialData, fullName: ' ' });
                      setSubStep(1);
                      setStep('builder');
                    }}
                    className="w-full sm:w-auto bg-white text-gray-700 border-2 border-gray-100 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    <Plus size={20} />
                    Start from Scratch
                  </button>
                </motion.div>
              </div>
            </section>

            {/* How it Works */}
            <section className="max-w-6xl mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                  { icon: <LayoutTemplate className="text-blue-600" />, title: "Pick a Template", desc: "Choose from our collection of professional, ATS-friendly designs." },
                  { icon: <Sparkles className="text-indigo-600" />, title: "AI Tailoring", desc: "Our AI analyzes the job description and optimizes your resume content." },
                  { icon: <Download className="text-emerald-600" />, title: "Download PDF", desc: "Get your polished resume in high-quality PDF format instantly." }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center space-y-4 p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-2">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                    <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Template Showcase */}
            <section className="max-w-7xl mx-auto px-4 space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold text-gray-900">Professional Templates</h2>
                <p className="text-gray-500 text-lg">Select a starting point that fits your industry</p>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat || 'All')}
                    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                      selectedCategory === (cat || 'All')
                        ? 'bg-gray-900 text-white shadow-lg'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {Object.entries(PROFESSIONAL_TEMPLATES)
                  .filter(([key]) => {
                    if (selectedCategory === 'All') return true;
                    return PROFESSIONAL_TEMPLATE_META[key]?.badge === selectedCategory;
                  })
                  .map(([key, template]) => {
                    const meta = PROFESSIONAL_TEMPLATE_META[key];
                    const title = meta?.title ?? key.replaceAll('_', ' ');
                    const subtitle = meta?.subtitle ?? 'ATS-Optimized';
                    const badge = meta?.badge;
                    const previewTemplateId = meta?.templateId ?? 'modern';

                    const miniPreview = (() => {
                      switch (previewTemplateId) {
                        case 'creative': return <CreativeTemplate data={{ ...template, accentColor: template.accentColor || '#3b82f6' }} />;
                        case 'elegant': return <ElegantTemplate data={template} />;
                        case 'minimal': return <MinimalTemplate data={template} />;
                        case 'dark': return <ModernDarkTemplate data={template} />;
                        default: return <ModernTemplate data={template} />;
                      }
                    })();

                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={key}
                        className="group relative flex flex-col"
                      >
                        <div className="relative aspect-[3/4] bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
                          {/* Preview Container */}
                          <div className="absolute inset-0 scale-[0.35] origin-top-left p-4 w-[285%] h-[285%] pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity">
                            <div className="bg-white shadow-2xl rounded-xl overflow-hidden h-full">
                              {miniPreview}
                            </div>
                          </div>

                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-8">
                            <button
                              onClick={() => loadTemplate(key)}
                              className="w-full bg-white text-gray-900 py-4 rounded-2xl font-bold shadow-xl hover:bg-blue-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0"
                            >
                              Use This Template
                            </button>
                          </div>

                          {badge && (
                            <div className="absolute top-6 left-6">
                              <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/90 backdrop-blur-sm text-gray-900 shadow-sm border border-gray-100">
                                {badge}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-6 px-2">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{title}</h3>
                          <p className="text-gray-500 font-medium">{subtitle}</p>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </section>
          </div>
        )}

        {/* Step 2: AI Input Page */}
        {step === 'input' && (
          <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="mb-12 flex items-center justify-between">
              <button 
                onClick={() => {
                  if (subStep === 2) setSubStep(1);
                  else setStep('landing');
                }}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-all font-medium group"
              >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                {subStep === 1 ? 'Back to Templates' : 'Previous Step'}
              </button>
              
              <div className="flex items-center gap-4">
                <div className={`h-2 w-12 rounded-full transition-all duration-500 ${subStep >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                <div className={`h-2 w-12 rounded-full transition-all duration-500 ${subStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {subStep === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl shadow-blue-100/50 border border-gray-100 space-y-6"
                >
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
                      Step 1 of 2
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Your Professional Background</h2>
                    <p className="text-gray-500 text-base">Upload your current resume or paste your career history.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-8">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="relative group cursor-pointer"
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                      <div className="relative flex flex-col items-center justify-center p-6 md:p-8 bg-white border-2 border-dashed border-gray-200 rounded-3xl hover:border-blue-500 transition-all">
                        {isExtracting ? (
                          <div className="flex flex-col items-center gap-4">
                            <RotateCcw size={28} className="text-blue-600 animate-spin" />
                            <p className="font-bold text-gray-900 text-sm">Reading your PDF...</p>
                          </div>
                        ) : userInfo ? (
                          <div className="flex flex-col items-center gap-4 text-center">
                            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                              <CheckCircle2 size={24} />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-base">Information Captured!</p>
                              <p className="text-gray-500 text-sm">Click to replace with another file</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                              <Upload size={24} />
                            </div>
                            <p className="font-bold text-gray-900 text-base">Upload PDF Resume</p>
                            <p className="text-gray-500 text-sm">Drag and drop or click to browse</p>
                          </>
                        )}
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept=".pdf" 
                          onChange={handleFileUpload} 
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute left-4 -top-3 px-2 bg-white text-[11px] font-bold text-gray-400 uppercase tracking-widest">Or Paste Manually</div>
                      <textarea
                        placeholder="Paste your LinkedIn bio, existing resume text, or career summary here..."
                        className="w-full p-4 md:p-5 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none h-44 md:h-52 text-gray-800 transition-all text-sm md:text-base leading-relaxed"
                        value={userInfo}
                        onChange={(e) => setUserInfo(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => setSubStep(2)}
                      disabled={!userInfo.trim()}
                      className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-base hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg hover:shadow-blue-200"
                    >
                      Next Step
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl shadow-blue-100/50 border border-gray-100 space-y-6"
                >
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
                      Step 2 of 2
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Target Job Details</h2>
                    <p className="text-gray-500 text-base">Paste the job description you’re aiming for.</p>
                  </div>

                  <div className="space-y-4">
                    <textarea
                      placeholder="Paste the job description here. AI will use this to highlight your most relevant skills and achievements..."
                      className="w-full p-4 md:p-5 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none h-64 md:h-80 text-gray-800 transition-all text-sm md:text-base leading-relaxed"
                      value={jobInfo}
                      onChange={(e) => setJobInfo(e.target.value)}
                    />

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-medium">
                        Live ATS match: <span className="text-gray-900 font-bold">{atsDraft.score}/100</span>
                      </span>
                      <span className="text-gray-400 font-medium">
                        Keywords matched: {atsDraft.matchedKeywords}/{atsDraft.totalKeywords || 0}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <button
                      onClick={() => setSubStep(1)}
                      className="px-5 py-2.5 text-gray-500 font-bold hover:text-gray-900 transition-colors"
                    >
                      Back to Step 1
                    </button>
                    <button
                      onClick={handleGenerateTailored}
                      disabled={isGenerating || !jobInfo.trim()}
                      className="px-8 py-3.5 bg-blue-600 text-white rounded-xl font-bold text-base md:text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-blue-200 flex items-center gap-3"
                    >
                      {isGenerating ? (
                        <>
                          <RotateCcw size={18} className="animate-spin" />
                          Crafting Resume...
                        </>
                      ) : (
                        <>
                          <Sparkles size={18} />
                          Generate Resume
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Step 3: Builder UI */}
        {step === 'builder' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
            {/* Editor Section */}
            <div className="xl:col-span-5 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <User size={24} />
                  </div>
                  <div>
                    <h2 className="font-black text-gray-900 tracking-tight">
                      Resume Editor
                    </h2>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mt-0.5">
                      Live Preview Enabled
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">ATS Match</div>
                    <div className="text-sm font-black text-gray-900 leading-tight">{ats.score}/100</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !showAtsSuggestions;
                      setShowAtsSuggestions(next);
                      if (next) {
                        // Always refresh to reflect latest resume edits.
                        setAtsSuggestions([]);
                        setSelectedAtsSuggestionIds(new Set());
                        setAtsSuggestionsError(null);
                        if (!atsSuggestionsLoading && !atsApplying) {
                          fetchAtsSuggestions();
                        }
                      }
                    }}
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors border border-gray-100"
                    title="ATS suggestions"
                  >
                    <Lightbulb size={18} />
                  </button>
                  <button 
                    onClick={() => setStep('landing')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 text-gray-600 text-sm font-bold hover:bg-gray-100 transition-colors"
                  >
                    <LayoutTemplate size={16} />
                    Templates
                  </button>
                </div>
              </div>

              {showAtsSuggestions && (
                <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-black text-gray-900">ATS Suggestions</div>
                      <div className="text-xs text-gray-500">
                        Missing keywords: {atsKeywordAnalysis.missing.slice(0, 8).join(', ') || '—'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={fetchAtsSuggestions}
                        disabled={atsSuggestionsLoading || atsApplying}
                        className="px-3 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                      >
                        {atsSuggestionsLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                        {atsSuggestionsLoading ? 'Generating…' : 'Generate'}
                      </button>
                      <button
                        type="button"
                        onClick={applySelectedAtsSuggestions}
                        disabled={!selectedAtsSuggestionIds.size || atsApplying}
                        className="px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                      >
                        {atsApplying ? 'Applying…' : `Apply (${selectedAtsSuggestionIds.size})`}
                      </button>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    {atsApplying && (
                      <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray-600 font-medium">
                        <Loader2 size={18} className="animate-spin" />
                        Applying suggestions…
                      </div>
                    )}

                    {atsSuggestionsError && (
                      <div className="text-sm text-red-600 font-medium">{atsSuggestionsError}</div>
                    )}

                    {!atsApplying && !atsSuggestionsError && !atsSuggestions.length && !atsSuggestionsLoading && (
                      <div className="text-sm text-gray-500">No suggestions yet. Click Generate.</div>
                    )}

                    {!atsApplying && atsSuggestions.map((s) => (
                      <div key={s.id} className="border border-gray-100 rounded-xl p-3 bg-gray-50">
                        <div className="flex items-start justify-between gap-3">
                          <label className="flex items-start gap-3 min-w-0 cursor-pointer">
                            <input
                              type="checkbox"
                              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              checked={selectedAtsSuggestionIds.has(s.id)}
                              onChange={() =>
                                setSelectedAtsSuggestionIds(prev => {
                                  const next = new Set(prev);
                                  if (next.has(s.id)) next.delete(s.id);
                                  else next.add(s.id);
                                  return next;
                                })
                              }
                            />
                            <span className="min-w-0">
                              <span className="block text-sm font-bold text-gray-900 truncate">{s.title}</span>
                              <span className="block text-xs text-gray-600 mt-1">{s.reason}</span>
                              {s.expectedImpact && (
                                <span className="block text-xs text-gray-500 mt-1">Expected: {s.expectedImpact}</span>
                              )}
                            </span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <ResumeForm data={resumeData} onChange={setResumeData} />
              </div>
            </div>

            {/* Preview Section */}
            <div className="xl:col-span-7 xl:sticky xl:top-28">
              <div className="bg-gray-900/5 rounded-[2.5rem] p-4 md:p-10 flex justify-center items-start min-h-[800px] border-2 border-dashed border-gray-200">
                 {/* The resume content to be printed */}
                <div className="origin-top transition-transform duration-300 scale-[0.55] sm:scale-[0.7] md:scale-[0.8] lg:scale-[0.9] xl:scale-100 shadow-2xl shadow-black/10">
                  <PdfResumePreview resumeData={resumeData} templateId={templateId} marginMm={marginMm} />
                </div>
              </div>
              <div className="mt-6 flex justify-center gap-4">
                <p className="text-sm text-gray-400 font-medium flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-green-500" />
                  Changes saved automatically
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
