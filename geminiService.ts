
import { GoogleGenAI, Type } from "@google/genai";
import { AIClassification, ThoughtCategory } from "./types";

export const classifyThought = async (text: string): Promise<AIClassification> => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  
  // 检查 API key 是否有效
  if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY' || apiKey === 'your_api_key_here') {
    throw new Error('API key not configured. Please set GEMINI_API_KEY in .env.local file.');
  }
  
  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `作为一名温暖且具有洞察力的心理与效率教练，请分析以下这段在专注时跳出的念头：
    
    内容: "${text}"
    
    请将其归入以下四类之一：
    1. TRAUMA: 涉及过去的负面回忆、情绪创伤、自我怀疑或遗憾。
    2. TODO: 明确的行动任务、未来计划或需要解决的问题。
    3. CREATIVE: 深刻的洞察、创意火花、抽象的哲学感悟或有趣的想法。
    4. OTHER: 生活琐碎、白日梦、随笔记录、或难以被定义的小事。
    
    回复规则：
    - TRAUMA: 提供疗愈性金句、温柔建议(advice)，并推荐1-2本有助于内心成长的书。
    - TODO: 优化该任务的表达(refinedTask)，使其更具行动导向。
    - CREATIVE: 提炼3个相关的核心关键词作为标签(tags)，并在 advice 字段提供一段关于这个灵感的深度解析或它可能带来的启发(AI分析)。
    - OTHER: 分析文字背后的情绪底色（如：宁静、凌乱、幽默、怀旧）放入 sentiment 字段。
    
    请以 JSON 格式返回。`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          advice: { type: Type.STRING, description: "疗愈建议或灵感解析" },
          books: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                author: { type: Type.STRING },
                reason: { type: Type.STRING },
              },
            },
          },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          sentiment: { type: Type.STRING },
          refinedTask: { type: Type.STRING }
        },
        required: ["category"]
      },
    },
  });

  try {
    if (!response.text) {
      console.error("AI Analysis failed: No text in response");
      return { category: ThoughtCategory.OTHER };
    }
    return JSON.parse(response.text.trim()) as AIClassification;
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return { category: ThoughtCategory.OTHER };
  }
};
