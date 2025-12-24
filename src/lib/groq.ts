import Groq from "groq-sdk";
import type { ResumeData } from "@/types/resume";

const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || "";
const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });

const cleanJsonString = (str: string): string => {
  const start = Math.min(
    str.indexOf('{') === -1 ? Infinity : str.indexOf('{'),
    str.indexOf('[') === -1 ? Infinity : str.indexOf('[')
  );
  const end = Math.max(
    str.lastIndexOf('}'),
    str.lastIndexOf(']')
  );

  if (start === Infinity || end === -1 || end < start) {
    return str.replace(/```json/g, '').replace(/```/g, '').trim();
  }

  return str.substring(start, end + 1);
};

export const improveText = async (text: string, type: 'summary' | 'experience' | 'skill'): Promise<string> => {
  if (!apiKey) {
    return "API Key not found. Please add NEXT_PUBLIC_GROQ_API_KEY to your .env.local file.";
  }

  try {
    let prompt = "";

    switch (type) {
      case 'summary':
        prompt = `Professionalize and improve this resume summary: "${text}". Keep it concise and impactful. Return only the improved text.`;
        break;
      case 'experience':
        prompt = `Rewrite this job description to be highly professional, action-oriented, and result-driven for a top-tier tech company (like Google/Meta). 
        Use the STAR method (Situation, Task, Action, Result) and include quantifiable metrics where possible. 
        Original text: "${text}". 
        Return only the improved text as a concise list of bullet points (using •).`;
        break;
      case 'skill':
        prompt = `Suggest related skills or improve the wording of this skill: "${text}". Return a comma-separated list of 3-5 related skills. Return only the list.`;
        break;
    }

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
    });

    return completion.choices[0]?.message?.content || "Failed to generate content.";
  } catch (error) {
    console.error("Error generating content:", error);
    return "Failed to generate content. Please try again.";
  }
};

export const generateResumeFromText = async (text: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  try {
    const prompt = `
      Extract resume data from the following text and return it as a JSON object matching this structure:
      {
        "fullName": "",
        "email": "",
        "phone": "",
        "address": "",
        "summary": "",
        "experience": [
          { "id": "1", "company": "", "role": "", "startDate": "", "endDate": "", "description": "" }
        ],
        "education": [
          { "id": "1", "school": "", "degree": "", "startDate": "", "endDate": "", "description": "" }
        ],
        "skills": [
          { "id": "1", "name": "", "category": "", "level": "Intermediate" }
        ],
        "projects": [
          { "id": "1", "name": "", "description": "", "link": "" }
        ]
      }
      
      If a field is missing in the text, leave it as an empty string. 
      Ensure the JSON is valid and strictly follows the schema.
      Do not include any markdown formatting or explanations, just the raw JSON string.

      Text to process:
      "${text}"
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
    });

    const responseText = completion.choices[0]?.message?.content || "{}";
    return cleanJsonString(responseText);
  } catch (error) {
    console.error("Error generating resume from text:", error);
    throw error;
  }
};

export const generateTailoredResume = async (userInfo: string, jobInfo: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key not found");

  try {
    const prompt = `
      You are an expert resume writer. Create a highly professional, ATS-friendly resume tailored specifically for a job description.
      
      USER INFORMATION:
      "${userInfo}"
      
      TARGET JOB DESCRIPTION:
      "${jobInfo}"
      
      TASK:
      1. Extract personal details (name, email, etc.) from USER INFORMATION.
      2. Rewrite the professional summary to align with the TARGET JOB DESCRIPTION.
      3. Structure the experience using the STAR method, highlighting achievements relevant to the TARGET JOB DESCRIPTION.
      4. Extract and categorize skills that match the requirements of the TARGET JOB DESCRIPTION.
      5. Format everything into a JSON object matching this structure:
      {
        "fullName": "",
        "email": "",
        "phone": "",
        "address": "",
        "summary": "",
        "experience": [
          { "id": "1", "company": "", "role": "", "startDate": "", "endDate": "", "description": "" }
        ],
        "education": [
          { "id": "1", "school": "", "degree": "", "startDate": "", "endDate": "", "description": "" }
        ],
        "skills": [
          { "id": "1", "name": "", "category": "", "level": "Intermediate" }
        ],
        "projects": [
          { "id": "1", "name": "", "description": "", "link": "" }
        ]
      }
      
      Return ONLY the raw JSON string. No markdown, no explanations.
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
    });

    const responseText = completion.choices[0]?.message?.content || "{}";
    return cleanJsonString(responseText);
  } catch (error) {
    console.error("Error generating tailored resume:", error);
    throw error;
  }
};

export const extractSkillsFromJD = async (jobDescription: string): Promise<{ name: string; category: string }[]> => {
  if (!apiKey) throw new Error("API Key not found");

  try {
    const prompt = `
      Extract the key technical and soft skills from the following job description.
      Categorize each skill (e.g., Frontend, Backend, Tools, Soft Skills).
      Return the result as a JSON array of objects: [{"name": "Skill Name", "category": "Category Name"}]
      Return ONLY the raw JSON string.

      Job Description:
      "${jobDescription}"
    `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
    });

    const responseText = completion.choices[0]?.message?.content || "[]";
    const cleanJson = cleanJsonString(responseText);
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Error extracting skills:", error);
    return [];
  }
};

export type AtsSuggestionAction =
  | { type: 'set_summary'; value: string }
  | { type: 'add_skill'; name: string; category?: string; level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' }
  | { type: 'set_skill_category'; name: string; category: string }
  | { type: 'append_experience_bullet'; experienceId: string; bullet: string };

export type AtsSuggestion = {
  id: string;
  title: string;
  reason: string;
  expectedImpact?: string;
  action: AtsSuggestionAction;
};

const safeJsonParse = <T>(raw: string, fallback: T): T => {
  try {
    const clean = cleanJsonString(raw);
    return JSON.parse(clean) as T;
  } catch {
    return fallback;
  }
};

export const generateAtsSuggestions = async (params: {
  resumeData: ResumeData;
  atsScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
}): Promise<AtsSuggestion[]> => {
  if (!apiKey) {
    throw new Error('API Key not found');
  }

  const { resumeData, atsScore, matchedKeywords, missingKeywords } = params;

  const experienceIds = (resumeData.experience || []).map(e => e.id);
  const missingTop = (missingKeywords || []).slice(0, 12);
  const matchedTop = (matchedKeywords || []).slice(0, 12);

  const prompt = `
You are an ATS optimization assistant.

Goal: Provide actionable suggestions to increase the ATS match score.

Return ONLY valid JSON (no markdown) as an array of suggestions matching this TypeScript shape:
[
  {
    "id": "string",
    "title": "string",
    "reason": "string",
    "expectedImpact": "string",
    "action":
      | { "type": "set_summary", "value": "string" }
      | { "type": "add_skill", "name": "string", "category": "string", "level": "Beginner|Intermediate|Advanced|Expert" }
      | { "type": "set_skill_category", "name": "string", "category": "string" }
      | { "type": "append_experience_bullet", "experienceId": "string", "bullet": "string" }
  }
]

Rules:
- Suggest 3 to 6 items.
- Primary objective: MAXIMIZE ATS score increase per edit while keeping the resume concise.
- Prefer actions that add missing keywords with minimal bloat: add_skill and set_summary.
- Keep summary <= 450 characters.
- Add_skill names must be concise (<= 40 chars).
- Use at most 2 append_experience_bullet suggestions total.
- Each bullet must be <= 180 characters, start with an action verb, and include 1-2 missing keywords.
- For append_experience_bullet, you MUST use an existing experienceId from this list: ${JSON.stringify(experienceIds)}
- Do NOT invent new experience entries.
- Do NOT include personally sensitive data.

Current ATS score (0-100): ${atsScore}

Matched keywords (sample): ${JSON.stringify(matchedTop)}
Missing keywords (high priority): ${JSON.stringify(missingTop)}

Resume JSON (for context):
${JSON.stringify(
  {
    fullName: resumeData.fullName,
    summary: resumeData.summary,
    experience: resumeData.experience,
    skills: resumeData.skills,
    education: resumeData.education,
    projects: resumeData.projects,
    jobDescription: resumeData.jobDescription,
  },
  null,
  2
)}
`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
  });

  const raw = completion.choices[0]?.message?.content || '[]';
  const parsed = safeJsonParse<AtsSuggestion[]>(raw, []);

  // Basic shape guard
  const suggestions = Array.isArray(parsed) ? parsed : [];
  return suggestions
    .filter(s => s && typeof s === 'object')
    .slice(0, 6)
    .map((s, idx) => ({
      id: typeof s.id === 'string' && s.id.trim() ? s.id : `sugg-${idx + 1}`,
      title: String((s as any).title ?? 'Suggestion'),
      reason: String((s as any).reason ?? ''),
      expectedImpact: (s as any).expectedImpact ? String((s as any).expectedImpact) : undefined,
      action: (s as any).action,
    }));
};
