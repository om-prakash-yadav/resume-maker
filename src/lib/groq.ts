import Groq from "groq-sdk";

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
