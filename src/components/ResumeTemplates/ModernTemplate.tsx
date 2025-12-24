import React from 'react';
import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import { normalizeExternalUrl } from '@/lib/urls';

interface Props {
  data: ResumeData;
}

export const ModernTemplate: React.FC<Props> = ({ data }) => {
  const accentColor = data.accentColor || '#000000';

  return (
    <div 
      className="resume-root box-border w-full min-h-[297mm] p-12 bg-white text-black shadow-sm" 
      id="resume-preview"
      style={{ fontFamily: data.fontFamily || 'serif', fontSize: '11pt', lineHeight: '1.5' }}
    >
      <header className="text-center mb-6">
        {data.photo && (
          <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 border-2" style={{ borderColor: accentColor }}>
            <img src={data.photo} alt={data.fullName} className="w-full h-full object-cover" />
          </div>
        )}
        <h1 className="text-3xl font-bold text-black mb-2">{data.fullName}</h1>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10pt] text-gray-700">
          {data.email && (
            <span className="flex items-center gap-1">
              <Mail size={12} style={{ color: accentColor }} /> {data.email}
            </span>
          )}
          {data.phone && (
            <span className="flex items-center gap-1">
              <Phone size={12} style={{ color: accentColor }} /> {data.phone}
            </span>
          )}
          {data.address && (
            <span className="flex items-center gap-1">
              <MapPin size={12} style={{ color: accentColor }} /> {data.address}
            </span>
          )}
          {data.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin size={12} style={{ color: accentColor }} /> {data.linkedin.replace(/^https?:\/\//, '')}
            </span>
          )}
          {data.github && (
            <span className="flex items-center gap-1">
              <Github size={12} style={{ color: accentColor }} /> {data.github.replace(/^https?:\/\//, '')}
            </span>
          )}
        </div>
      </header>

      {data.summary && (
        <section className="mb-5 resume-section">
          <h2 className="text-sm font-bold text-black border-b-2 mb-2 uppercase tracking-wide" style={{ borderColor: accentColor }}>Professional Summary</h2>
          <p className="text-sm text-gray-800 leading-snug">{data.summary}</p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="mb-5 resume-section">
          <h2 className="text-sm font-bold text-black border-b-2 mb-2 uppercase tracking-wide" style={{ borderColor: accentColor }}>Experience</h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id} className="resume-item">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-bold text-black">{exp.company}</h3>
                  <span className="text-xs font-medium text-gray-600">{exp.startDate} — {exp.endDate}</span>
                </div>
                <div className="text-sm italic text-gray-800 mb-1">{exp.role}</div>
                <p className="text-sm text-gray-700 whitespace-pre-line pl-2 border-l-2" style={{ borderLeftColor: accentColor + '40' }}>{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.education.length > 0 && (
        <section className="mb-5 resume-section">
          <h2 className="text-sm font-bold text-black border-b-2 mb-2 uppercase tracking-wide" style={{ borderColor: accentColor }}>Education</h2>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id} className="resume-item">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-bold text-black">{edu.school}</h3>
                  <span className="text-xs font-medium text-gray-600">{edu.startDate} — {edu.endDate}</span>
                </div>
                <div className="text-sm text-gray-800">{edu.degree}</div>
                {edu.description && <p className="text-sm text-gray-700 mt-1">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.projects && data.projects.length > 0 && (
        <section className="mb-5 resume-section">
          <h2 className="text-sm font-bold text-black border-b-2 mb-2 uppercase tracking-wide" style={{ borderColor: accentColor }}>Projects</h2>
          <div className="space-y-4">
            {data.projects.map((proj) => (
              <div key={proj.id} className="resume-item">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-bold text-black">{proj.name}</h3>
                  {proj.link && (
                    <a
                      className="text-xs flex items-center gap-1 underline"
                      style={{ color: accentColor }}
                      href={normalizeExternalUrl(proj.link)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Globe size={10} /> {proj.link.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
                <p className="text-sm text-gray-700">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.skills.length > 0 && (
        <section className="mb-5 resume-section">
          <h2 className="text-sm font-bold text-black border-b-2 mb-2 uppercase tracking-wide" style={{ borderColor: accentColor }}>Skills</h2>
          <div className="mt-2">
            {(!data.skillStyle || data.skillStyle === 'pills') && (
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill) => (
                  <span key={skill.id} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded" style={{ borderLeft: `2px solid ${accentColor}` }}>
                    {skill.name}
                  </span>
                ))}
              </div>
            )}

            {data.skillStyle === 'bullets' && (
              <div className="grid grid-cols-3 gap-2">
                {data.skills.map((skill) => (
                  <div key={skill.id} className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }}></div>
                    {skill.name}
                  </div>
                ))}
              </div>
            )}

            {data.skillStyle === 'levels' && (
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {data.skills.map((skill) => (
                  <div key={skill.id} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-gray-500">{skill.level}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
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
              <div className="space-y-3">
                {Object.entries(
                  data.skills.reduce((acc, skill) => {
                    const cat = skill.category || 'Other';
                    if (!acc[cat]) acc[cat] = [];
                    acc[cat].push(skill.name);
                    return acc;
                  }, {} as Record<string, string[]>)
                ).map(([category, skills]) => (
                  <div key={category} className="flex gap-4">
                    <div className="w-24 shrink-0 text-xs font-bold text-gray-500 uppercase pt-0.5">{category}</div>
                    <div className="text-sm text-gray-700">{skills.join(', ')}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
