import { NextRequest, NextResponse } from 'next/server';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import type { ResumeData } from '@/types/resume';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type TemplateId = 'modern' | 'creative' | 'elegant' | 'minimal' | 'dark';

type PdfRequestBody = {
  resumeData: ResumeData;
  templateId: TemplateId;
  fileName?: string;
  marginMm?: number;
};

function clampMarginMm(value: unknown) {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return 10;
  return Math.min(25, Math.max(0, Math.round(n)));
}

function sanitizeFileName(value: string) {
  const trimmed = value.trim() || 'resume';
  return trimmed
    .replace(/[\\/:*?"<>|]+/g, '_')
    .replace(/\s+/g, '_')
    .slice(0, 80);
}

export async function POST(req: NextRequest) {
  let body: PdfRequestBody;
  try {
    body = (await req.json()) as PdfRequestBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body?.resumeData || !body?.templateId) {
    return NextResponse.json({ error: 'Missing resumeData or templateId' }, { status: 400 });
  }

  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host');
  const proto = req.headers.get('x-forwarded-proto') ?? 'http';
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (host ? `${proto}://${host}` : null);

  if (!baseUrl) {
    return NextResponse.json({ error: 'Unable to determine base URL' }, { status: 500 });
  }

  const printUrl = `${baseUrl}/print`;
  const marginMm = clampMarginMm(body.marginMm);

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });

  try {
    const page = await browser.newPage();

    // A4 @ 96 DPI-ish viewport so layout matches typical CSS pixels
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });

    await page.evaluateOnNewDocument(
      (resumeData: ResumeData, templateId: TemplateId, marginMm: number) => {
        localStorage.setItem('resume-maker:resumeData', JSON.stringify(resumeData));
        localStorage.setItem('resume-maker:templateId', templateId);
        localStorage.setItem('resume-maker:marginMm', String(marginMm));
      },
      body.resumeData,
      body.templateId,
      marginMm
    );

    await page.goto(printUrl, { waitUntil: 'networkidle0' });

    await page.waitForFunction(() => (window as any).__RESUME_PRINT_READY__ === true, {
      timeout: 20_000,
    });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      // Margins are controlled via @page on /print (and set from localStorage).
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
    });

    const fileBase = sanitizeFileName(body.fileName || body.resumeData.fullName || 'resume');

    const pdfBody = Buffer.from(pdf);

    return new NextResponse(pdfBody, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileBase}_Resume.pdf"`,
        'Cache-Control': 'no-store',
      },
    });
  } finally {
    await browser.close();
  }
}
