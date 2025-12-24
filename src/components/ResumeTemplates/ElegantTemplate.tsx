import React from 'react';
import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import { normalizeExternalUrl } from '@/lib/urls';

interface Props {
  data: ResumeData;
}

export const ElegantTemplate: React.FC<Props> = ({ data }) => {
  const accentColor = data.accentColor || '#1e293b'; // Default slate-800

  return (
    <div 
      className="resume-root w-full bg-[#fcfcfc] text-gray-800 p-12" 
      style={{ fontFamily: data.fontFamily || 'Georgia, serif', fontSize: '10.5pt' }}
    >
      <header className="text-center mb-12 space-y-4">
        {data.photo && (
          <div className="w-24 h-24 mx-auto rounded-full overflow-hidden ring-2 ring-offset-4 ring-gray-200 mb-4">
            <img src={data.photo} alt={data.fullName} className="w-full h-full object-cover" />
          </div>
        )}
        <h1 className="text-4xl font-light tracking-[0.2em] uppercase text-gray-900">{data.fullName}</h1>
        <div className="flex justify-center items-center gap-6 text-[8pt] uppercase tracking-widest text-gray-500">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.address && <span>{data.address}</span>}
        </div>
        <div className="flex justify-center gap-4 pt-2">
          {data.linkedin && <Linkedin size={14} className="text-gray-400" />}
          {data.github && <Github size={14} className="text-gray-400" />}
        </div>
      </header>

      <div className="grid grid-cols-12 gap-12">
        <div className="col-span-12">
          {data.summary && (
            <section className="mb-10 text-center max-w-2xl mx-auto">
              <p className="italic text-gray-600 leading-relaxed">{data.summary}</p>
            </section>
          )}
        </div>

        <div className="col-span-8 space-y-10">
          {data.experience.length > 0 && (
            <section>
              <h2 className="text-[9pt] font-bold uppercase tracking-[0.3em] text-gray-400 mb-6 border-b pb-2">Experience</h2>
              <div className="space-y-8">
                {data.experience.map(exp => (
                  <div key={exp.id} className="resume-item space-y-2">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-lg font-medium text-gray-900">{exp.role}</h3>
                      <span className="text-[8pt] text-gray-400 italic">{exp.startDate} — {exp.endDate}</span>
                    </div>
                    <div className="text-sm font-bold text-gray-700 uppercase tracking-wider">{exp.company}</div>
                    <p className="text-gray-600 leading-relaxed text-[10pt]">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.projects && data.projects.length > 0 && (
            <section>
              <h2 className="text-[9pt] font-bold uppercase tracking-[0.3em] text-gray-400 mb-6 border-b pb-2">Selected Projects</h2>
              <div className="grid grid-cols-1 gap-6">
                {data.projects.map(proj => (
                  <div key={proj.id} className="resume-item space-y-1">
                    <h3 className="font-bold text-gray-900">{proj.name}</h3>
                    {proj.link && (
                      <a
                        href={normalizeExternalUrl(proj.link)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[9pt] inline-flex items-center gap-1 underline text-gray-500"
                      >
                        <Globe size={12} /> {proj.link.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                    <p className="text-gray-600 text-[10pt]">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="col-span-4 space-y-10">
          <section>
            <h2 className="text-[9pt] font-bold uppercase tracking-[0.3em] text-gray-400 mb-6 border-b pb-2">Expertise</h2>
            <div className="space-y-4">
              {(!data.skillStyle || data.skillStyle === 'levels') && data.skills.map(skill => (
                <div key={skill.id} className="space-y-1">
                  <div className="text-[9pt] font-medium text-gray-700">{skill.name}</div>
                  <div className="h-1 bg-gray-100 w-full rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-400" 
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
                    <span key={skill.id} className="px-2 py-1 border border-gray-200 text-[8pt] text-gray-600 rounded-full">
                      {skill.name}
                    </span>
                  ))}
                </div>
              )}

              {data.skillStyle === 'bullets' && (
                <ul className="space-y-2">
                  {data.skills.map(skill => (
                    <li key={skill.id} className="text-[9pt] text-gray-600 flex items-center gap-2 italic">
                      <span className="text-[6pt]">●</span> {skill.name}
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
                  <div key={category} className="space-y-1">
                    <div className="text-[7pt] font-bold text-gray-400 uppercase tracking-widest">{category}</div>
                    <div className="text-[9pt] text-gray-600">{skills.join(', ')}</div>
                  </div>
                ))
              )}
            </div>
          </section>

          {data.education.length > 0 && (
            <section>
              <h2 className="text-[9pt] font-bold uppercase tracking-[0.3em] text-gray-400 mb-6 border-b pb-2">Education</h2>
              <div className="space-y-6">
                {data.education.map(edu => (
                  <div key={edu.id} className="resume-item space-y-1">
                    <div className="text-[9pt] font-bold text-gray-800">{edu.school}</div>
                    <div className="text-[8pt] text-gray-600">{edu.degree}</div>
                    <div className="text-[8pt] text-gray-400">{edu.endDate}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
