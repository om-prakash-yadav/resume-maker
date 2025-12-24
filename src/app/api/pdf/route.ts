import { NextRequest, NextResponse } from 'next/server';
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import type { ResumeData } from '@/types/resume';
import fs from 'node:fs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

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

function firstExistingPath(paths: Array<string | undefined>) {
  for (const p of paths) {
    if (!p) continue;
    try {
      if (fs.existsSync(p)) return p;
    } catch {
      // ignore
    }
  }
  return undefined;
}

function findLocalBrowserExecutablePath() {
  const fromEnv =
    process.env.PUPPETEER_EXECUTABLE_PATH?.trim() ||
    process.env.CHROME_EXECUTABLE_PATH?.trim();

  if (fromEnv) return fromEnv;

  if (process.platform === 'win32') {
    return firstExistingPath([
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    ]);
  }

  if (process.platform === 'darwin') {
    return firstExistingPath([
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    ]);
  }

  // linux (non-serverless local/dev): user can provide PUPPETEER_EXECUTABLE_PATH
  return undefined;
}

function getChromiumPackUrl() {
  const override = process.env.CHROMIUM_PACK_URL?.trim();
  if (override) return override;

  if (!process.env.VERCEL) return undefined;

  const arch = process.arch === 'arm64' ? 'arm64' : 'x64';
  return `https://github.com/Sparticuz/chromium/releases/download/v143.0.0/chromium-v143.0.0-pack.${arch}.tar`;
}

async function resolveChromiumExecutablePath() {
  if (process.platform !== 'linux') {
    return findLocalBrowserExecutablePath();
  }

  // Prefer the bundled Brotli files first (no network). If that fails on Vercel,
  // fall back to the remote "pack" tar to ensure the binary is available.
  const packUrl = getChromiumPackUrl();
  if (process.env.VERCEL && packUrl) {
    try {
      const localPath = await chromium.executablePath();
      if (localPath && fs.existsSync(localPath)) return localPath;
    } catch {
      // fall back to remote pack
    }
    return chromium.executablePath(packUrl);
  }

  return chromium.executablePath();
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

  // On serverless Linux (Vercel), use Sparticuz chromium headless_shell.
  // On local Windows/macOS, use a locally installed Chrome/Edge via executablePath.
  const isLinux = process.platform === 'linux';
  const headlessMode = (isLinux ? ('shell' as const) : true) as any;
  const executablePath = await resolveChromiumExecutablePath();

  if (!executablePath) {
    return NextResponse.json(
      {
        error:
          isLinux
            ? 'Chromium executable path not resolved. On Vercel, set CHROMIUM_PACK_URL (see Sparticuz/chromium release pack files).'
            : 'Local browser executable not found. Set PUPPETEER_EXECUTABLE_PATH (or CHROME_EXECUTABLE_PATH) to your Chrome/Edge binary.',
      },
      { status: 500 }
    );
  }

  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null;
  try {
    browser = await puppeteer.launch({
      args: isLinux
        ? puppeteer.defaultArgs({ args: chromium.args, headless: headlessMode })
        : puppeteer.defaultArgs(),
      executablePath,
      headless: headlessMode,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        error: 'Failed to launch Chromium',
        details: message,
        isLinux,
        executablePath,
        usedRemotePack: Boolean(process.env.VERCEL && getChromiumPackUrl()),
      },
      { status: 500 }
    );
  }

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
    try {
      for (const page of await browser.pages()) {
        await page.close();
      }
    } catch {
      // ignore
    }
    await browser.close();
  }
}
