import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export const improveText = async (text: string, type: 'summary' | 'experience' | 'skill'): Promise<string> => {
  if (!apiKey) {
    return "API Key not found. Please add NEXT_PUBLIC_GEMINI_API_KEY to your .env file.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview" });
    let prompt = "";

    switch (type) {
      case 'summary':
        prompt = `Professionalize and improve this resume summary: "${text}". Keep it concise and impactful.`;
        break;
      case 'experience':
        prompt = `Rewrite this job description to be more professional, action-oriented, and result-driven for a resume: "${text}". Use bullet points if appropriate but return as a single string with newlines.`;
        break;
      case 'skill':
        prompt = `Suggest related skills or improve the wording of this skill: "${text}". Return a comma-separated list of 3-5 related skills.`;
        break;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
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
    const model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview" });
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
          { "id": "1", "name": "", "level": "Intermediate" }
        ]
      }
      
      If a field is missing in the text, leave it as an empty string. 
      Ensure the JSON is valid and strictly follows the schema.
      Do not include any markdown formatting or explanations, just the raw JSON string.

      Text to process:
      "${text}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Clean up potential markdown code blocks
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    return cleanJson;
  } catch (error) {
    console.error("Error generating resume from text:", error);
    throw error;
  }
};
