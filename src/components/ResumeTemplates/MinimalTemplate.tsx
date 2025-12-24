import React from 'react';
import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';

interface Props {
  data: ResumeData;
}

export const MinimalTemplate: React.FC<Props> = ({ data }) => {
  const accentColor = data.accentColor || '#000000';

  return (
    <div 
      className="resume-root w-full bg-white text-gray-900 p-12" 
      style={{ fontFamily: data.fontFamily || 'Inter', fontSize: '10pt' }}
    >
      <header className="flex justify-between items-start mb-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">{data.fullName}</h1>
          <div className="flex flex-wrap gap-4 text-gray-500 text-sm">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>{data.phone}</span>}
            {data.address && <span>{data.address}</span>}
          </div>
        </div>
        {data.photo && (
          <div className="w-20 h-20 rounded-lg overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
            <img src={data.photo} alt={data.fullName} className="w-full h-full object-cover" />
          </div>
        )}
      </header>

      <div className="space-y-10">
        {data.summary && (
          <section>
            <p className="text-lg text-gray-600 leading-relaxed">{data.summary}</p>
          </section>
        )}

        <section className="grid grid-cols-12 gap-8">
          <div className="col-span-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Experience</h2>
          </div>
          <div className="col-span-9 space-y-8">
            {data.experience.map(exp => (
              <div key={exp.id} className="resume-item space-y-2">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-gray-900">{exp.role}</h3>
                  <span className="text-sm text-gray-400">{exp.startDate} — {exp.endDate}</span>
                </div>
                <div className="text-sm font-medium" style={{ color: accentColor }}>{exp.company}</div>
                <p className="text-gray-600 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-12 gap-8">
          <div className="col-span-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Skills</h2>
          </div>
          <div className="col-span-9">
            <div className="space-y-4">
              {(!data.skillStyle || data.skillStyle === 'bullets') && (
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {data.skills.map(skill => (
                    <div key={skill.id} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }}></div>
                      <span className="font-medium">{skill.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {data.skillStyle === 'pills' && (
                <div className="flex flex-wrap gap-2">
                  {data.skills.map(skill => (
                    <span key={skill.id} className="px-3 py-1 bg-gray-50 text-gray-900 text-xs font-bold rounded-md border border-gray-100">
                      {skill.name}
                    </span>
                  ))}
                </div>
              )}

              {data.skillStyle === 'levels' && (
                <div className="grid grid-cols-2 gap-4">
                  {data.skills.map(skill => (
                    <div key={skill.id} className="flex justify-between items-center border-b border-gray-50 pb-1">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-[8pt] text-gray-400 uppercase font-bold">{skill.level}</span>
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
                      <span className="text-[8pt] font-bold text-gray-400 uppercase w-20 shrink-0">{category}</span>
                      <span className="text-gray-600">{skills.join(', ')}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-12 gap-8">
          <div className="col-span-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">Education</h2>
          </div>
          <div className="col-span-9 space-y-4">
            {data.education.map(edu => (
              <div key={edu.id} className="resume-item">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-gray-900">{edu.school}</h3>
                  <span className="text-sm text-gray-400">{edu.endDate}</span>
                </div>
                <div className="text-sm text-gray-600">{edu.degree}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
