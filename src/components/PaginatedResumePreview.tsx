'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

type Props = {
  children: React.ReactNode;
  className?: string;
  marginMm?: number;
};

/**
 * WYSIWYG paginated preview that shows exactly how the PDF will look.
 * Each page is an A4 sheet with the selected margins applied.
 */
export function PaginatedResumePreview({
  children,
  className,
  marginMm = 10,
}: Props) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [contentHeightPx, setContentHeightPx] = useState<number>(0);
  const [printableHeightPx, setPrintableHeightPx] = useState<number>(0);

  // Convert mm to px (assuming 96 DPI: 1mm ≈ 3.7795px)
  const mmToPx = (mm: number) => mm * 3.7795;
  
  const pageHeightMm = 297;
  const pageWidthMm = 210;
  const printableHeightMm = pageHeightMm - (marginMm * 2);

  useEffect(() => {
    const measureContent = async () => {
      const el = measureRef.current;
      if (!el) return;

      // Wait for fonts
      try {
        const fonts = (document as any).fonts;
        if (fonts?.ready) await fonts.ready;
      } catch {}

      await new Promise(r => requestAnimationFrame(() => r(null)));

      const height = el.scrollHeight;
      setContentHeightPx(height);
      setPrintableHeightPx(mmToPx(printableHeightMm));
    };

    measureContent();

    const ro = new ResizeObserver(() => measureContent());
    if (measureRef.current) {
      ro.observe(measureRef.current);
    }

    return () => ro.disconnect();
  }, [children, marginMm, printableHeightMm]);

  const pageCount = useMemo(() => {
    if (!printableHeightPx || !contentHeightPx) return 1;
    return Math.max(1, Math.ceil(contentHeightPx / printableHeightPx));
  }, [contentHeightPx, printableHeightPx]);

  return (
    <div className={className}>
      {/* Hidden measurer - measures content at the printable width */}
      <div
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 0,
          width: `${pageWidthMm - (marginMm * 2)}mm`,
          visibility: 'hidden',
        }}
      >
        <div ref={measureRef}>{children}</div>
      </div>

      {/* Visible pages */}
      <div className="flex flex-col gap-6">
        {Array.from({ length: pageCount }).map((_, pageIndex) => (
          <div
            key={pageIndex}
            className="bg-white shadow-2xl relative"
            style={{
              width: `${pageWidthMm}mm`,
              height: `${pageHeightMm}mm`,
              overflow: 'hidden',
            }}
          >
            {/* Page content area with margins */}
            <div
              style={{
                position: 'absolute',
                top: `${marginMm}mm`,
                left: `${marginMm}mm`,
                right: `${marginMm}mm`,
                bottom: `${marginMm}mm`,
                overflow: 'hidden',
              }}
            >
              {/* Content shifted up for each page */}
              <div
                style={{
                  transform: `translateY(-${pageIndex * printableHeightPx}px)`,
                }}
              >
                {children}
              </div>
            </div>
            
            {/* Page number indicator */}
            {pageCount > 1 && (
              <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                Page {pageIndex + 1} of {pageCount}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
