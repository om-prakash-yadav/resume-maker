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
import { Download, FileText, RotateCcw, LayoutTemplate, Plus, ArrowRight, Sparkles, User, Briefcase as BriefcaseIcon, ChevronLeft, Upload, CheckCircle2, ArrowLeft } from 'lucide-react';
 
import { motion, AnimatePresence } from 'framer-motion';
import { PROFESSIONAL_TEMPLATES } from '@/lib/templates';
import { generateTailoredResume } from '@/lib/groq';

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

  const fileInputRef = useRef<HTMLInputElement>(null);

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
    
    // Determine template ID
    let newTemplateId: 'modern' | 'creative' | 'elegant' | 'minimal' | 'dark' = 'modern';
    if (templateKey === 'product_manager') newTemplateId = 'creative';
    else if (templateKey === 'data_scientist') newTemplateId = 'dark';
    else if (templateKey === 'marketing_manager') newTemplateId = 'minimal';
    else if (templateKey === 'software_engineer') newTemplateId = 'modern';
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
      const response = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData,
          templateId,
          marginMm,
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
      <nav className="bg-white shadow-sm sticky top-0 z-30 border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600 cursor-pointer" onClick={() => setStep('landing')}>
            <FileText size={24} />
            <span className="text-xl font-bold tracking-tight">AI Resume Builder</span>
          </div>
          <div className="flex items-center gap-3">
            {step === 'builder' && (
              <>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 text-gray-600 hover:text-red-600 px-3 py-2 rounded-md transition-colors text-sm font-medium"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Margins</span>
                  <select
                    value={marginMm}
                    onChange={(e) => setMarginMm(Number(e.target.value))}
                    className="border border-gray-300 rounded-md px-2 py-2 bg-white text-gray-900 text-sm"
                  >
                    <option value={0}>0mm</option>
                    <option value={5}>5mm</option>
                    <option value={10}>10mm</option>
                    <option value={15}>15mm</option>
                    <option value={20}>20mm</option>
                  </select>
                </div>
                
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md font-medium"
                >
                  <Download size={18} />
                  Download PDF
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Step 1: Landing Page with Template Previews */}
        {step === 'landing' && (
          <div className="max-w-5xl mx-auto space-y-12 py-10">
            <div className="text-center space-y-4">
              <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
                Create a <span className="text-blue-600">Google-Ready</span> Resume in Minutes
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Choose a professional template and let our AI tailor it perfectly to your target job description.
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <button 
                  onClick={() => { setSubStep(1); setStep('input'); }}
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <Sparkles size={20} />
                  Start with AI Auto-Fill
                </button>
                <button 
                  onClick={() => { setResumeData({ ...initialData, fullName: ' ' }); setSubStep(1); setStep('builder'); }}
                  className="bg-white text-gray-700 border-2 border-gray-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  <Plus size={20} />
                  Start from Scratch
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2 text-gray-800 border-b pb-4">
                <LayoutTemplate size={24} className="text-blue-600" />
                <h2 className="text-2xl font-bold">Professional Templates</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(PROFESSIONAL_TEMPLATES).map(([key, template]) => (
                  <div key={key} className="group relative bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                    <div className="aspect-[3/4] bg-gray-100 overflow-hidden relative">
                      {/* Mini Preview */}
                      <div className="absolute inset-0 scale-[0.25] origin-top-left p-10 w-[400%] h-[400%] pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity">
                        {key === 'software_engineer' ? <ModernTemplate data={template} /> : 
                         key === 'product_manager' ? <CreativeTemplate data={{...template, accentColor: '#3b82f6'}} /> :
                         key === 'data_scientist' ? <ModernDarkTemplate data={template} /> :
                         key === 'marketing_manager' ? <MinimalTemplate data={template} /> :
                         <ModernTemplate data={template} />}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                        <button 
                          onClick={() => loadTemplate(key)}
                          className="w-full bg-white text-blue-600 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-50 transition-colors"
                        >
                          Use Template
                        </button>
                      </div>
                    </div>
                    <div className="p-4 border-t border-gray-100">
                      <h3 className="font-bold text-gray-900 capitalize">{key.replace('_', ' ')}</h3>
                      <p className="text-xs text-gray-500 mt-1">ATS-Optimized & Professional</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
                  className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-100/50 border border-gray-100 space-y-8"
                >
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-bold uppercase tracking-wider">
                      Step 1 of 2
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">Your Professional Background</h2>
                    <p className="text-gray-500 text-lg">Upload your current resume or paste your career history.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-8">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="relative group cursor-pointer"
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                      <div className="relative flex flex-col items-center justify-center p-10 bg-white border-2 border-dashed border-gray-200 rounded-3xl hover:border-blue-500 transition-all">
                        {isExtracting ? (
                          <div className="flex flex-col items-center gap-4">
                            <RotateCcw size={40} className="text-blue-600 animate-spin" />
                            <p className="font-bold text-gray-900">Reading your PDF...</p>
                          </div>
                        ) : userInfo ? (
                          <div className="flex flex-col items-center gap-4 text-center">
                            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                              <CheckCircle2 size={32} />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-lg">Information Captured!</p>
                              <p className="text-gray-500 text-sm">Click to replace with another file</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                              <Upload size={32} />
                            </div>
                            <p className="font-bold text-gray-900 text-lg">Upload PDF Resume</p>
                            <p className="text-gray-500">Drag and drop or click to browse</p>
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
                      <div className="absolute left-6 -top-3 px-3 bg-white text-xs font-bold text-gray-400 uppercase tracking-widest">Or Paste Manually</div>
                      <textarea
                        placeholder="Paste your LinkedIn bio, existing resume text, or career summary here..."
                        className="w-full p-8 border-2 border-gray-100 rounded-3xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none h-64 text-gray-800 transition-all text-lg leading-relaxed"
                        value={userInfo}
                        onChange={(e) => setUserInfo(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => setSubStep(2)}
                      disabled={!userInfo.trim()}
                      className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-xl hover:shadow-blue-200"
                    >
                      Next Step
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-100/50 border border-gray-100 space-y-8"
                >
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-bold uppercase tracking-wider">
                      Step 2 of 2
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">Target Job Details</h2>
                    <p className="text-gray-500 text-lg">Paste the job description you're aiming for.</p>
                  </div>

                  <div className="space-y-4">
                    <textarea
                      placeholder="Paste the job description here. AI will use this to highlight your most relevant skills and achievements..."
                      className="w-full p-8 border-2 border-gray-100 rounded-3xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50/50 outline-none h-[400px] text-gray-800 transition-all text-lg leading-relaxed"
                      value={jobInfo}
                      onChange={(e) => setJobInfo(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <button
                      onClick={() => setSubStep(1)}
                      className="px-8 py-4 text-gray-500 font-bold hover:text-gray-900 transition-colors"
                    >
                      Back to Step 1
                    </button>
                    <button
                      onClick={handleGenerateTailored}
                      disabled={isGenerating || !jobInfo.trim()}
                      className="px-12 py-5 bg-blue-600 text-white rounded-2xl font-bold text-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-blue-200 flex items-center gap-3"
                    >
                      {isGenerating ? (
                        <>
                          <RotateCcw size={24} className="animate-spin" />
                          Crafting Resume...
                        </>
                      ) : (
                        <>
                          <Sparkles size={24} />
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
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
            {/* Editor Section */}
            <div className="xl:col-span-5 space-y-6">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 border-l-4 border-blue-500 flex justify-between items-center">
                <div>
                  <h2 className="font-bold text-gray-900 flex items-center gap-2">
                    <RotateCcw size={16} className="text-blue-500" />
                    Real-time Editor
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Your changes are automatically saved.
                  </p>
                </div>
                <button 
                  onClick={() => setStep('landing')}
                  className="text-sm text-blue-600 font-medium hover:underline"
                >
                  Change Template
                </button>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <ResumeForm data={resumeData} onChange={setResumeData} />
              </div>
            </div>

            {/* Preview Section */}
            <div className="xl:col-span-7 xl:sticky xl:top-24">
              <div className="overflow-y-auto max-h-[calc(100vh-5rem)] bg-gray-100 rounded-2xl border border-gray-200 p-4 md:p-8 flex justify-center items-start">
                 {/* The resume content to be printed */}
                <div className="origin-top transition-transform duration-300 scale-[0.6] sm:scale-[0.7] md:scale-[0.8] lg:scale-[0.9] xl:scale-100">
                  <PdfResumePreview resumeData={resumeData} templateId={templateId} marginMm={marginMm} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
