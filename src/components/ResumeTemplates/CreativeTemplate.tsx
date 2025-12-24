import React from 'react';
import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import { normalizeExternalUrl } from '@/lib/urls';

interface Props {
  data: ResumeData;
}

export const CreativeTemplate: React.FC<Props> = ({ data }) => {
  const accentColor = data.accentColor || '#3b82f6'; // Default blue-500

  return (
    <div 
      className="resume-root w-full bg-white text-black flex" 
      style={{ fontFamily: data.fontFamily || 'Inter', fontSize: '10pt' }}
    >
      {/* Sidebar */}
      <div className="w-1/3 bg-gray-900 text-white p-8 flex flex-col gap-8">
        {data.photo && (
          <div className="w-32 h-32 mx-auto rounded-full border-4 overflow-hidden" style={{ borderColor: accentColor }}>
            <img src={data.photo} alt={data.fullName} className="w-full h-full object-cover" />
          </div>
        )}
        
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b pb-2" style={{ borderColor: accentColor }}>Contact</h2>
          <div className="space-y-3 text-[9pt] opacity-90">
            {data.email && <div className="flex items-center gap-2"><Mail size={12} style={{ color: accentColor }} /> {data.email}</div>}
            {data.phone && <div className="flex items-center gap-2"><Phone size={12} style={{ color: accentColor }} /> {data.phone}</div>}
            {data.address && <div className="flex items-center gap-2"><MapPin size={12} style={{ color: accentColor }} /> {data.address}</div>}
            {data.linkedin && <div className="flex items-center gap-2"><Linkedin size={12} style={{ color: accentColor }} /> {data.linkedin.split('/').pop()}</div>}
            {data.github && <div className="flex items-center gap-2"><Github size={12} style={{ color: accentColor }} /> {data.github.split('/').pop()}</div>}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest border-b pb-2" style={{ borderColor: accentColor }}>Skills</h2>
          <div className="space-y-3">
            {(!data.skillStyle || data.skillStyle === 'pills') && (
              <div className="flex flex-wrap gap-2">
                {data.skills.map(skill => (
                  <span key={skill.id} className="px-2 py-1 bg-white/10 rounded text-[8pt]">
                    {skill.name}
                  </span>
                ))}
              </div>
            )}

            {data.skillStyle === 'bullets' && (
              <ul className="space-y-1 text-[8pt] opacity-90">
                {data.skills.map(skill => (
                  <li key={skill.id} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full" style={{ backgroundColor: accentColor }}></div>
                    {skill.name}
                  </li>
                ))}
              </ul>
            )}

            {data.skillStyle === 'levels' && (
              <div className="space-y-2">
                {data.skills.map(skill => (
                  <div key={skill.id} className="space-y-1">
                    <div className="flex justify-between text-[8pt]">
                      <span>{skill.name}</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full" 
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
              </div>
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
                <div key={category} className="text-[8pt]">
                  <div className="font-bold opacity-60 uppercase text-[7pt] mb-1">{category}</div>
                  <div className="opacity-90">{skills.join(', ')}</div>
                </div>
              ))
            )}
          </div>
        </section>

        {data.education.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest border-b pb-2" style={{ borderColor: accentColor }}>Education</h2>
            <div className="space-y-4">
              {data.education.map(edu => (
                <div key={edu.id} className="resume-item space-y-1">
                  <div className="font-bold text-[9pt]">{edu.school}</div>
                  <div className="text-[8pt] opacity-80">{edu.degree}</div>
                  <div className="text-[8pt] opacity-60">{edu.startDate} - {edu.endDate}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-10 space-y-8">
        <header>
          <h1 className="text-4xl font-black uppercase tracking-tighter" style={{ color: accentColor }}>{data.fullName}</h1>
          <div className="h-1 w-20 mt-2" style={{ backgroundColor: accentColor }}></div>
        </header>

        {data.summary && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: accentColor }}>Profile</h2>
            <p className="text-gray-700 leading-relaxed">{data.summary}</p>
          </section>
        )}

        {data.experience.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: accentColor }}>Experience</h2>
            <div className="space-y-6">
              {data.experience.map(exp => (
                <div key={exp.id} className="resume-item relative pl-4 border-l-2" style={{ borderColor: `${accentColor}20` }}>
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></div>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-gray-900">{exp.role}</h3>
                    <span className="text-[8pt] font-bold text-gray-500">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div className="text-sm font-medium mb-2" style={{ color: accentColor }}>{exp.company}</div>
                  <p className="text-gray-600 text-[9pt] whitespace-pre-line">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.projects && data.projects.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: accentColor }}>Projects</h2>
            <div className="grid grid-cols-1 gap-4">
              {data.projects.map(proj => (
                <div key={proj.id} className="resume-item p-3 bg-gray-50 rounded-lg border-l-4" style={{ borderColor: accentColor }}>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-gray-900">{proj.name}</h3>
                    {proj.link && (
                      <a
                        href={normalizeExternalUrl(proj.link)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[9pt] flex items-center gap-1 underline"
                        style={{ color: accentColor }}
                      >
                        <Globe size={12} /> {proj.link.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                  </div>
                  <p className="text-gray-600 text-[9pt]">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
