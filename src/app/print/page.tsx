'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { ResumeData } from '@/types/resume';
import { ModernTemplate } from '@/components/ResumeTemplates/ModernTemplate';
import { CreativeTemplate } from '@/components/ResumeTemplates/CreativeTemplate';
import { ElegantTemplate } from '@/components/ResumeTemplates/ElegantTemplate';
import { MinimalTemplate } from '@/components/ResumeTemplates/MinimalTemplate';
import { ModernDarkTemplate } from '@/components/ResumeTemplates/ModernDarkTemplate';

declare global {
  interface Window {
    __RESUME_PRINT_READY__?: boolean;
  }
}

const STORAGE_RESUME = 'resume-maker:resumeData';
const STORAGE_TEMPLATE = 'resume-maker:templateId';
const STORAGE_MARGIN = 'resume-maker:marginMm';

type TemplateId = 'modern' | 'creative' | 'elegant' | 'minimal' | 'dark';

function pickTemplate(id: TemplateId, data: ResumeData) {
  switch (id) {
    case 'creative':
      return <CreativeTemplate data={data} />;
    case 'elegant':
      return <ElegantTemplate data={data} />;
    case 'minimal':
      return <MinimalTemplate data={data} />;
    case 'dark':
      return <ModernDarkTemplate data={data} />;
    case 'modern':
    default:
      return <ModernTemplate data={data} />;
  }
}

function isTemplateId(value: string | null): value is TemplateId {
  return value === 'modern' || value === 'creative' || value === 'elegant' || value === 'minimal' || value === 'dark';
}

export default function PrintPage() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [templateId, setTemplateId] = useState<TemplateId>('modern');
  const [marginMm, setMarginMm] = useState<number>(10);

  useEffect(() => {
    window.__RESUME_PRINT_READY__ = false;

    try {
      const storedTemplateId = localStorage.getItem(STORAGE_TEMPLATE);
      const storedResume = localStorage.getItem(STORAGE_RESUME);
      const storedMargin = localStorage.getItem(STORAGE_MARGIN);

      if (isTemplateId(storedTemplateId)) {
        setTemplateId(storedTemplateId);
      }

      if (storedResume) {
        setResumeData(JSON.parse(storedResume));
      }

      if (storedMargin) {
        const n = Number(storedMargin);
        if (Number.isFinite(n)) {
          setMarginMm(Math.min(25, Math.max(0, Math.round(n))));
        }
      }
    } catch {
      setResumeData(null);
    }
  }, []);

  const rendered = useMemo(() => {
    if (!resumeData) return null;
    return pickTemplate(templateId, resumeData);
  }, [resumeData, templateId]);

  useEffect(() => {
    if (!rendered) return;

    const markReady = async () => {
      try {
        // Ensure layout + fonts are settled before Puppeteer prints
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fonts = (document as any).fonts;
        if (fonts?.ready) {
          await fonts.ready;
        }
        await new Promise((r) => setTimeout(r, 50));
      } finally {
        window.__RESUME_PRINT_READY__ = true;
      }
    };

    markReady();
  }, [rendered]);

  const effectiveMarginMm = templateId === 'dark' || templateId === 'creative' ? 0 : marginMm;
  const printableWidth = `${210 - (effectiveMarginMm * 2)}mm`;

  return (
    <div className="bg-white">
      {/* Apply per-page margins and break rules in the print layout (used by Puppeteer/Chromium). */}
      <style>{`
        @media print {
          @page { size: A4; margin: ${effectiveMarginMm}mm; }

          /* Match the template height to the printable page height.
             If we force 297mm while margins are non-zero, Chromium will overflow
             and create an extra (often blank) page. */
          #resume-print-root .resume-root {
            box-sizing: border-box;
            min-height: calc(297mm - ${effectiveMarginMm * 2}mm);
          }

          .resume-section, section { break-inside: auto; page-break-inside: auto; }
          .resume-item { break-inside: auto; page-break-inside: auto; }
          h1, h2, h3, h4, h5, h6 { break-after: avoid; page-break-after: avoid; }

          /* If margin is set to 0, remove template-root padding so there is no
             extra whitespace that looks like a margin (e.g. from p-10/p-12). */
          #resume-print-root[data-page-margin='0'] .resume-root { padding: 0 !important; }
        }
      `}</style>
      <div
        id="resume-print-root"
        className="bg-white"
        data-page-margin={String(effectiveMarginMm)}
        style={{ width: printableWidth }}
      >
        {rendered ?? (
          <div className="p-8 text-sm text-gray-600">
            Nothing to print.
          </div>
        )}
      </div>
    </div>
  );
}
