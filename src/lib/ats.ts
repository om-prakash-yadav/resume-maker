import type { ResumeData } from '@/types/resume';

export type AtsScoreResult = {
  score: number; // 0..100
  keywordMatchPercent: number; // 0..100
  matchedKeywords: number;
  totalKeywords: number;
  missingBasics: string[];
};

export type AtsKeywordAnalysis = {
  keywords: string[];
  matched: string[];
  missing: string[];
};

const STOP_WORDS = new Set([
  'a','an','the','and','or','but','if','then','else','when','while','of','to','in','on','for','from','with','by','as','at','into','over','under','about','across','after','before','between','during','without','within',
  'is','are','was','were','be','been','being','do','does','did','doing','have','has','had','having','can','could','should','would','will','may','might','must',
  'you','your','we','our','they','their','i','me','my','he','she','him','her','them',
  'this','that','these','those','it','its','there','here','not','no','yes','also','such','more','most','some','any','all',
  'job','role','position','candidate','responsibilities','requirements','experience','skills','preferred','plus',
]);

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const normalize = (text: string) =>
  (text || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9+#.\s-]/g, ' ') // keep tech tokens like c++, c#, node.js
    .replace(/\s+/g, ' ')
    .trim();

const tokenize = (text: string) =>
  normalize(text)
    .split(' ')
    .map(t => t.trim())
    .filter(Boolean);

const stemLite = (word: string) => {
  // super-light stemming to help match plurals/verbs without breaking common tech nouns
  const w = (word || '').trim();
  if (w.length <= 4) return w;

  if (/ies$/i.test(w) && w.length > 4) return w.replace(/ies$/i, 'y');
  if (/ing$/i.test(w) && w.length > 5) return w.replace(/ing$/i, '');
  if (/ed$/i.test(w) && w.length > 5) return w.replace(/ed$/i, '');
  if (/ers$/i.test(w) && w.length > 6) return w.replace(/ers$/i, '');
  if (/er$/i.test(w) && w.length > 6) return w.replace(/er$/i, '');

  // Avoid turning 'kubernetes' -> 'kubernete' and 'business' -> 'busines'
  if (/s$/i.test(w) && w.length > 6 && !/us$/i.test(w) && !/ss$/i.test(w)) return w.replace(/s$/i, '');

  return w;
};

const extractKeywords = (jobDescription: string, maxKeywords = 20) => {
  const words = tokenize(jobDescription)
    .map(w => w.replace(/^-+|-+$/g, ''))
    .filter(w => w.length >= 3)
    .filter(w => !STOP_WORDS.has(w));

  const freq = new Map<string, number>();
  for (const w of words) {
    const key = stemLite(w);
    freq.set(key, (freq.get(key) ?? 0) + 1);
  }

  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => k)
    .slice(0, maxKeywords);
};

export const analyzeAtsKeywords = (resumeText: string, jobDescription: string, maxKeywords = 20): AtsKeywordAnalysis => {
  const jd = (jobDescription || '').trim();
  if (!jd) return { keywords: [], matched: [], missing: [] };

  const keywords = extractKeywords(jd, maxKeywords);
  const resumeTokens = tokenize(resumeText)
    .map(w => w.replace(/^-+|-+$/g, ''))
    .filter(w => w.length >= 2)
    .map(stemLite);
  const resumeStemSet = new Set(resumeTokens);

  const matched: string[] = [];
  const missing: string[] = [];

  for (const kw of keywords) {
    if (resumeStemSet.has(kw)) matched.push(kw);
    else missing.push(kw);
  }

  return { keywords, matched, missing };
};

export const resumeDataToText = (data: ResumeData) => {
  const parts: string[] = [];

  parts.push(data.fullName, data.email, data.phone, data.address, data.linkedin || '', data.github || '');
  parts.push(data.summary || '');

  for (const exp of data.experience || []) {
    parts.push(exp.role, exp.company, exp.startDate, exp.endDate, exp.description);
  }

  for (const edu of data.education || []) {
    parts.push(edu.degree, edu.school, edu.startDate, edu.endDate, edu.description);
  }

  for (const skill of data.skills || []) {
    parts.push(skill.name, skill.category || '', skill.level);
  }

  for (const proj of data.projects || []) {
    parts.push(proj.name, proj.description, proj.link || '');
  }

  return parts.filter(Boolean).join('\n');
};

const basicsMissing = (data: ResumeData) => {
  const missing: string[] = [];

  if (!data.fullName?.trim()) missing.push('Name');
  if (!data.email?.trim() && !data.phone?.trim()) missing.push('Email/Phone');
  if (!data.summary?.trim()) missing.push('Summary');
  if (!data.experience?.length) missing.push('Experience');
  if (!data.education?.length) missing.push('Education');
  if (!data.skills?.length) missing.push('Skills');

  return missing;
};

export const scoreAtsMatchFromText = (resumeText: string, jobDescription: string): AtsScoreResult => {
  const jd = (jobDescription || '').trim();
  if (!jd) {
    return {
      score: 0,
      keywordMatchPercent: 0,
      matchedKeywords: 0,
      totalKeywords: 0,
      missingBasics: [],
    };
  }

  const analysis = analyzeAtsKeywords(resumeText, jd);
  const total = analysis.keywords.length;
  const matched = analysis.matched.length;
  const keywordMatchPercent = total ? Math.round((matched / total) * 100) : 0;

  // Text-only score: do not penalize short resumes; ATS match is primarily keyword alignment.
  const score = clamp(keywordMatchPercent, 0, 100);

  return {
    score,
    keywordMatchPercent,
    matchedKeywords: matched,
    totalKeywords: total,
    missingBasics: [],
  };
};

export const scoreAtsMatch = (data: ResumeData): AtsScoreResult => {
  const missing = basicsMissing(data);
  const resumeText = resumeDataToText(data);
  const jd = (data.jobDescription || '').trim();

  const base = scoreAtsMatchFromText(resumeText, jd);

  // Data-aware score: keyword match dominates, completeness is a smaller factor.
  const completeness = clamp(Math.round(((6 - missing.length) / 6) * 100), 0, 100);
  const score = clamp(Math.round(base.keywordMatchPercent * 0.85 + completeness * 0.15), 0, 100);

  return {
    ...base,
    score,
    missingBasics: missing,
  };
};
