import React, { useState, useRef } from 'react';
import { ResumeData, Experience, Education, Skill } from '@/types/resume';
import { Plus, Trash2, Wand2, Sparkles, Type, Linkedin, Github, Mail, Phone, MapPin, Briefcase, User, Camera, Palette } from 'lucide-react';
import { improveText, generateResumeFromText, extractSkillsFromJD } from '@/lib/groq';

const GOOGLE_FONTS = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Arimo',
  'Tinos',
  'Montserrat',
  'Raleway',
  'Poppins',
  'Merriweather',
  'Playfair Display',
  'Lora',
  'Nunito'
];

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export const ResumeForm: React.FC<Props> = ({ data, onChange }) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [aiInput, setAiInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof ResumeData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange('photo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAutoFill = async () => {
    if (!aiInput.trim()) return;
    setIsGenerating(true);
    try {
      const jsonString = await generateResumeFromText(aiInput);
      const parsedData = JSON.parse(jsonString);
      // Merge with existing IDs to avoid key issues if possible, or just replace
      // Ensure IDs are present
      const processedData = {
        ...parsedData,
        experience: parsedData.experience?.map((e: any) => ({ ...e, id: Date.now().toString() + Math.random() })) || [],
        education: parsedData.education?.map((e: any) => ({ ...e, id: Date.now().toString() + Math.random() })) || [],
        skills: parsedData.skills?.map((e: any) => ({ ...e, id: Date.now().toString() + Math.random() })) || [],
        fontFamily: data.fontFamily // preserve font
      };
      onChange(processedData);
      setAiInput('');
    } catch (error) {
      console.error("Failed to parse AI response", error);
      alert("Failed to generate resume. Please try again with more details.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImprove = async (field: string, text: string, type: 'summary' | 'experience' | 'skill') => {
    setLoading(field);
    const improved = await improveText(text, type);
    setLoading(null);
    if (field === 'summary') {
      handleInputChange('summary', improved);
    }
    // Handle other fields logic if needed, for now simple replacement
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    onChange({ ...data, experience: [...data.experience, newExp] });
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    const newExp = data.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp);
    onChange({ ...data, experience: newExp });
  };

  const removeExperience = (id: string) => {
    onChange({ ...data, experience: data.experience.filter(exp => exp.id !== id) });
  };

  const improveExperience = async (id: string, text: string) => {
    setLoading(`exp-${id}`);
    const improved = await improveText(text, 'experience');
    setLoading(null);
    updateExperience(id, 'description', improved);
  };

  // Similar functions for Education and Skills...
  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      school: '',
      degree: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    onChange({ ...data, education: [...data.education, newEdu] });
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    const newEdu = data.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu);
    onChange({ ...data, education: newEdu });
  };

  const removeEducation = (id: string) => {
    onChange({ ...data, education: data.education.filter(edu => edu.id !== id) });
  };

  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      level: 'Intermediate'
    };
    onChange({ ...data, skills: [...data.skills, newSkill] });
  };

  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    const newSkills = data.skills.map(skill => skill.id === id ? { ...skill, [field]: value } : skill);
    onChange({ ...data, skills: newSkills });
  };

  const removeSkill = (id: string) => {
    onChange({ ...data, skills: data.skills.filter(skill => skill.id !== id) });
  };

  const addProject = () => {
    const newProj = { id: Date.now().toString(), name: '', description: '', link: '' };
    onChange({ ...data, projects: [...(data.projects || []), newProj] });
  };

  const updateProject = (id: string, field: string, value: string) => {
    const newProj = data.projects.map(p => p.id === id ? { ...p, [field]: value } : p);
    onChange({ ...data, projects: newProj });
  };

  const removeProject = (id: string) => {
    onChange({ ...data, projects: data.projects.filter(p => p.id !== id) });
  };

  const improveProject = async (id: string, text: string) => {
    setLoading(`proj-${id}`);
    const improved = await improveText(text, 'experience');
    setLoading(null);
    updateProject(id, 'description', improved);
  };

  const handleExtractSkills = async () => {
    if (!data.jobDescription?.trim()) return;
    setLoading('extract-skills');
    try {
      const extractedSkills = await extractSkillsFromJD(data.jobDescription);
      const newSkills: Skill[] = extractedSkills.map(s => ({
        id: Math.random().toString(36).substr(2, 9),
        name: s.name,
        category: s.category,
        level: 'Intermediate'
      }));
      
      // Filter out duplicates
      const existingNames = new Set(data.skills.map(s => s.name.toLowerCase()));
      const uniqueNewSkills = newSkills.filter(s => !existingNames.has(s.name.toLowerCase()));
      
      onChange({ ...data, skills: [...data.skills, ...uniqueNewSkills] });
    } catch (error) {
      console.error("Failed to extract skills", error);
    } finally {
      setLoading(null);
    }
  };


  return (
    <div className="space-y-6 p-4 md:p-6 bg-white">
      
      {/* Font Selection */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-gray-800">
          <Palette size={18} className="text-blue-600" />
          <h2 className="text-lg font-semibold">Design & Customization</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
            <select
              value={data.fontFamily || 'Inter'}
              onChange={(e) => handleInputChange('fontFamily', e.target.value)}
              className="w-full p-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {GOOGLE_FONTS.map(font => (
                <option key={font} value={font} className="text-gray-900 bg-white">{font}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Accent Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={data.accentColor || '#3b82f6'}
                onChange={(e) => handleInputChange('accentColor', e.target.value)}
                className="h-9 w-16 p-1 border border-gray-200 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={data.accentColor || '#3b82f6'}
                onChange={(e) => handleInputChange('accentColor', e.target.value)}
                className="flex-1 p-2 border border-gray-200 rounded-lg text-sm text-gray-900"
                placeholder="#000000"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skill Display Style</label>
            <select
              value={data.skillStyle || 'categorized'}
              onChange={(e) => handleInputChange('skillStyle', e.target.value)}
              className="w-full p-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="categorized">Categorized (Standard)</option>
              <option value="pills">Modern Pills</option>
              <option value="bullets">Bullet Points</option>
              <option value="levels">With Proficiency Levels</option>
            </select>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-gray-800">
          <User size={18} className="text-blue-600" />
          <h2 className="text-lg font-semibold">Personal Information</h2>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex flex-col items-center gap-3">
            <div 
              className="w-28 h-28 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 overflow-hidden relative group cursor-pointer hover:border-blue-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {data.photo ? (
                <>
                  <img src={data.photo} alt="Profile" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="text-white" size={24} />
                  </div>
                </>
              ) : (
                <>
                  <Camera className="text-gray-400" size={28} />
                  <span className="text-[10px] text-gray-500 font-medium mt-1">Add Photo</span>
                </>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handlePhotoUpload} 
            />
            {data.photo && (
              <button 
                onClick={() => handleInputChange('photo', '')}
                className="text-xs text-red-500 hover:underline font-medium"
              >
                Remove Photo
              </button>
            )}
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-2 pl-10 text-sm border border-gray-200 rounded-lg placeholder:text-gray-400 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                value={data.fullName || ''}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-2 pl-10 text-sm border border-gray-200 rounded-lg placeholder:text-gray-400 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                value={data.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full p-2 pl-10 text-sm border border-gray-200 rounded-lg placeholder:text-gray-400 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                value={data.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Location (City, State)"
                className="w-full p-2 pl-10 text-sm border border-gray-200 rounded-lg placeholder:text-gray-400 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                value={data.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </div>
            <div className="relative">
              <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="linkedin.com/in/username"
                className="w-full p-2 pl-10 text-sm border border-gray-200 rounded-lg placeholder:text-gray-400 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                value={data.linkedin || ''}
                onChange={(e) => handleInputChange('linkedin', e.target.value)}
              />
            </div>
            <div className="relative">
              <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="github.com/username"
                className="w-full p-2 pl-10 text-sm border border-gray-200 rounded-lg placeholder:text-gray-400 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                value={data.github || ''}
                onChange={(e) => handleInputChange('github', e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Professional Summary</h2>
          <button
            onClick={() => handleImprove('summary', data.summary, 'summary')}
            disabled={!data.summary || loading === 'summary'}
            className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 disabled:opacity-50"
          >
            <Wand2 size={16} />
            {loading === 'summary' ? 'Improving...' : 'AI Improve'}
          </button>
        </div>
        <textarea
          placeholder="e.g. Experienced Software Engineer with 5+ years of expertise in building scalable web applications using React and Node.js..."
          className="w-full p-3 text-sm border rounded-lg h-28 placeholder:text-gray-400 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
          value={data.summary || ''}
          onChange={(e) => handleInputChange('summary', e.target.value)}
        />
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Experience</h2>
          <button onClick={addExperience} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
            <Plus size={16} /> Add Experience
          </button>
        </div>
        {data.experience.map((exp) => (
          <div key={exp.id} className="p-4 border rounded bg-white space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="e.g. Senior Software Engineer"
                className="p-2 text-sm border rounded-lg placeholder:text-gray-400 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                value={exp.role || ''}
                onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
              />
              <input
                type="text"
                placeholder="e.g. Google"
                className="p-2 text-sm border rounded-lg placeholder:text-gray-400 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                value={exp.company || ''}
                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
              />
              <input
                type="text"
                placeholder="e.g. Jan 2020"
                className="p-2 text-sm border rounded-lg placeholder:text-gray-400 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                value={exp.startDate || ''}
                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
              />
              <input
                type="text"
                placeholder="e.g. Present"
                className="p-2 text-sm border rounded-lg placeholder:text-gray-400 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                value={exp.endDate || ''}
                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
              />
            </div>
            <div className="relative">
              <textarea
                placeholder="e.g. Led a team of 5 developers to rebuild the core payment processing system, resulting in a 20% reduction in transaction latency..."
                className="w-full p-3 pr-20 border rounded-lg h-32 placeholder:text-gray-400 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                value={exp.description || ''}
                onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
              />
              <div className="absolute top-2 right-2 flex gap-1">
                 <button
                  onClick={() => improveExperience(exp.id, exp.description)}
                  disabled={!exp.description || loading === `exp-${exp.id}`}
                  className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                  title="AI Improve"
                >
                  <Wand2 size={16} />
                </button>
                <button
                  onClick={() => removeExperience(exp.id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Education</h2>
          <button onClick={addEducation} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
            <Plus size={16} /> Add Education
          </button>
        </div>
        {data.education.map((edu) => (
          <div key={edu.id} className="p-4 border rounded-xl bg-white space-y-3 relative">
            <button
              onClick={() => removeEducation(edu.id)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1"
            >
              <Trash2 size={16} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="e.g. Stanford University"
                className="p-2 text-sm border rounded-lg placeholder:text-gray-400 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                value={edu.school || ''}
                onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
              />
              <input
                type="text"
                placeholder="e.g. Bachelor of Science in Computer Science"
                className="p-2 text-sm border rounded-lg placeholder:text-gray-400 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                value={edu.degree || ''}
                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
              />
              <input
                type="text"
                placeholder="e.g. Sep 2016"
                className="p-2 text-sm border rounded-lg placeholder:text-gray-400 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                value={edu.startDate || ''}
                onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
              />
              <input
                type="text"
                placeholder="e.g. Jun 2020"
                className="p-2 text-sm border rounded-lg placeholder:text-gray-400 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                value={edu.endDate || ''}
                onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
              />
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Skills</h2>
          <div className="flex gap-4">
            {data.jobDescription && (
              <button
                onClick={handleExtractSkills}
                disabled={loading === 'extract-skills'}
                className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 disabled:opacity-50"
              >
                <Sparkles size={16} />
                {loading === 'extract-skills' ? 'Extracting...' : 'Extract from JD'}
              </button>
            )}
            <button onClick={addSkill} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
              <Plus size={16} /> Add Skill
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.skills.map((skill) => (
            <div key={skill.id} className="flex flex-col gap-3 bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:border-blue-200 transition-colors">
              <div className="flex justify-between items-center gap-2">
                <input
                  type="text"
                  placeholder="Skill Name"
                  className="font-bold text-gray-900 border-b border-transparent focus:border-blue-500 outline-none placeholder:text-gray-400 w-full py-1"
                  value={skill.name || ''}
                  onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                />
                <button
                  onClick={() => removeSkill(skill.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Category (e.g. Frontend)"
                  className="w-full text-xs p-2 border border-gray-100 rounded-lg bg-gray-50 placeholder:text-gray-400 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={skill.category || ''}
                  onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                />
                <select
                  className="w-full text-xs p-2 border border-gray-100 rounded-lg bg-white text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={skill.level}
                  onChange={(e) => updateSkill(skill.id, 'level', e.target.value as any)}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Projects</h2>
          <button onClick={addProject} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
            <Plus size={16} /> Add Project
          </button>
        </div>
        {data.projects?.map((proj) => (
          <div key={proj.id} className="p-4 border rounded-xl bg-white space-y-3 relative">
            <div className="flex justify-between items-start gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                <input
                  type="text"
                  placeholder="Project Name"
                  className="p-2 text-sm border rounded-lg placeholder:text-gray-400 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={proj.name || ''}
                  onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Link (optional)"
                  className="p-2 text-sm border rounded-lg placeholder:text-gray-400 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={proj.link || ''}
                  onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                />
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => improveProject(proj.id, proj.description)}
                  disabled={!proj.description || loading === `proj-${proj.id}`}
                  className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                  title="AI Improve"
                >
                  <Wand2 size={16} />
                </button>
                <button
                  onClick={() => removeProject(proj.id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <textarea
              placeholder="Describe your project, technologies used, and impact..."
              className="w-full p-3 border rounded-lg placeholder:text-gray-400 text-gray-900 h-28 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={proj.description || ''}
              onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
            />
          </div>
        ))}
      </section>
    </div>
  );
};
