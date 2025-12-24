'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { ResumeData } from '@/types/resume';

type TemplateId = 'modern' | 'creative' | 'elegant' | 'minimal' | 'dark';

type Props = {
  resumeData: ResumeData;
  templateId: TemplateId;
  marginMm: number;
  className?: string;
};

const WORKER_VERSION = '5.4.449';

function clampMarginMm(value: number) {
  if (!Number.isFinite(value)) return 10;
  return Math.min(25, Math.max(0, Math.round(value)));
}

export function PdfResumePreview({ resumeData, templateId, marginMm, className }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const requestBody = useMemo(
    () => ({
      resumeData,
      templateId,
      marginMm: clampMarginMm(marginMm),
      fileName: resumeData.fullName,
    }),
    [resumeData, templateId, marginMm]
  );

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const debounce = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        });

        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(text || 'Failed to generate PDF');
        }

        const buf = await res.arrayBuffer();
        if (cancelled) return;
        setPdfBytes(buf);
      } catch (e) {
        if (cancelled) return;
        if ((e as any)?.name === 'AbortError') return;
        setError('Failed to generate preview.');
        setPdfBytes(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }, 450);

    return () => {
      cancelled = true;
      controller.abort();
      clearTimeout(debounce);
    };
  }, [requestBody]);

  useEffect(() => {
    let cancelled = false;

    const render = async () => {
      if (!pdfBytes || !containerRef.current) {
        setPageCount(0);
        return;
      }

      const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
      // Use CDN worker to avoid bundling issues.
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${WORKER_VERSION}/legacy/build/pdf.worker.min.mjs`;

      const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
      const pdf = await loadingTask.promise;
      if (cancelled) return;

      const nextCount = pdf.numPages;
      setPageCount(nextCount);

      const container = containerRef.current;
      container.innerHTML = '';

      for (let pageNumber = 1; pageNumber <= nextCount; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        if (cancelled) return;

        const viewport = page.getViewport({ scale: 2 });

        const pageWrap = document.createElement('div');
        pageWrap.className = 'bg-white shadow-2xl';
        pageWrap.style.width = '210mm';

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        canvas.style.display = 'block';

        pageWrap.appendChild(canvas);

        container.appendChild(pageWrap);

        // pdfjs types differ across builds; keep runtime correct.
        await (page as any).render({ canvasContext: ctx, viewport }).promise;
      }
    };

    render();

    return () => {
      cancelled = true;
    };
  }, [pdfBytes]);

  return (
    <div className={className}>
      {(isLoading || error) && (
        <div className="mb-3 text-sm">
          {isLoading && <span className="text-gray-600">Generating preview…</span>}
          {!isLoading && error && <span className="text-red-600">{error}</span>}
        </div>
      )}

      <div className="flex flex-col gap-6" ref={containerRef} />

      {!isLoading && !error && pageCount === 0 && (
        <div className="text-sm text-gray-500">No preview.</div>
      )}
    </div>
  );
}
