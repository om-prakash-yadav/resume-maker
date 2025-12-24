import React from 'react';
import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';

interface Props {
  data: ResumeData;
}

export const ModernDarkTemplate: React.FC<Props> = ({ data }) => {
  const accentColor = data.accentColor || '#6366f1';

  return (
    <div 
      className="resume-root w-full bg-[#0f172a] text-slate-300 overflow-hidden flex flex-col" 
      style={{ fontFamily: data.fontFamily || 'Inter', fontSize: '10pt' }}
    >
      <header className="p-12 bg-slate-900/50 border-b border-slate-800 flex items-center gap-8">
        {data.photo && (
          <div className="w-28 h-28 rounded-full border-4 border-slate-800 overflow-hidden shrink-0">
            <img src={data.photo} alt={data.fullName} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="space-y-3">
          <h1 className="text-5xl font-black text-white tracking-tight">{data.fullName}</h1>
          <div className="flex flex-wrap gap-4 text-slate-400 text-sm">
            {data.email && <span className="flex items-center gap-1"><Mail size={14} /> {data.email}</span>}
            {data.linkedin && <span className="flex items-center gap-1"><Linkedin size={14} /> {data.linkedin.split('/').pop()}</span>}
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Left Column */}
        <div className="w-1/3 p-12 bg-slate-900/30 border-r border-slate-800 space-y-10">
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Expertise</h2>
            <div className="space-y-3">
              {(!data.skillStyle || data.skillStyle === 'levels') && data.skills.map(skill => (
                <div key={skill.id} className="space-y-1">
                  <div className="flex justify-between text-[9pt]">
                    <span>{skill.name}</span>
                    <span className="text-slate-500">{skill.level}</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-1000" 
                      style={{ 
                        backgroundColor: accentColor,
                        width: skill.level === 'Expert' ? '100%' : 
                               skill.level === 'Advanced' ? '80%' : 
                               skill.level === 'Intermediate' ? '60%' : '40%' 
                      }}
                    ></div>
                  </div>
                </div>
              ))}

              {data.skillStyle === 'pills' && (
                <div className="flex flex-wrap gap-2">
                  {data.skills.map(skill => (
                    <span key={skill.id} className="px-2 py-1 bg-slate-800 text-slate-200 text-[8pt] rounded border border-slate-700">
                      {skill.name}
                    </span>
                  ))}
                </div>
              )}

              {data.skillStyle === 'bullets' && (
                <ul className="space-y-1">
                  {data.skills.map(skill => (
                    <li key={skill.id} className="text-[9pt] flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full" style={{ backgroundColor: accentColor }}></div>
                      {skill.name}
                    </li>
                  ))}
                </ul>
              )}

              {data.skillStyle === 'categorized' && (
                Object.entries(
                  data.skills.reduce((acc, skill) => {
                    const cat = skill.category || 'Other';
                    if (!acc[cat]) acc[cat] = [];
                    acc[cat].push(skill.name);
                    return acc;
                  }, {} as Record<string, string[]>)
                ).map(([category, skills]) => (
                  <div key={category} className="text-[9pt]">
                    <div className="font-bold text-slate-400 uppercase text-[7pt] tracking-wider mb-1">{category}</div>
                    <div className="text-slate-300">{skills.join(', ')}</div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Education</h2>
            <div className="space-y-6">
              {data.education.map(edu => (
                <div key={edu.id} className="resume-item space-y-1">
                  <div className="text-white font-bold">{edu.school}</div>
                  <div className="text-sm text-slate-400">{edu.degree}</div>
                  <div className="text-xs text-slate-500">{edu.endDate}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="w-2/3 p-12 space-y-10">
          {data.summary && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-4">About Me</h2>
              <p className="text-slate-400 leading-relaxed">{data.summary}</p>
            </section>
          )}

          <section className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Experience</h2>
            <div className="space-y-8">
              {data.experience.map(exp => (
                <div key={exp.id} className="resume-item space-y-2 group">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors" style={{ color: accentColor }}>{exp.role}</h3>
                    <span className="text-xs text-slate-500">{exp.startDate} — {exp.endDate}</span>
                  </div>
                  <div className="text-sm font-medium text-slate-300">{exp.company}</div>
                  <p className="text-slate-400 text-sm leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
