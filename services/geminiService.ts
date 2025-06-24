import { getActiveOpenRouterApiKey } from './openRouterService';
import { 
    GEMINI_TEXT_MODEL_NAME, 
    GEMINI_VISION_MODEL_NAME, 
    OPENROUTER_API_BASE_URL, 
    CHATBOT_SYSTEM_PROMPT,
    SENSITIVE_CONTENT_KEYWORDS,
    SENSITIVE_CONTENT_ERROR_PREFIX
} from '../constants';
import { ChatMessage, ChatMessageContentPart, ChatRole, UploadedFile } from '../types';


const getHeaders = (apiKey: string) => ({
  'Authorization': `Bearer ${apiKey}`,
  'Content-Type': 'application/json',
  'HTTP-Referer': typeof window !== 'undefined' ? window.location.href : 'http://localhost:3000', 
  'X-Title': 'KreatorAI', 
});

const getOpenRouterModelName = (baseModelName: string) => {
  if (baseModelName.startsWith('gemini-')) {
    return `google/${baseModelName}`;
  }
  return baseModelName;
};

const isSensitiveContentError = (errorMessage: string): boolean => {
  if (!errorMessage) return false;
  const lowerErrorMessage = errorMessage.toLowerCase();
  return SENSITIVE_CONTENT_KEYWORDS.some(keyword => lowerErrorMessage.includes(keyword));
};

const handleOpenRouterError = (errorData: any, responseStatus: number, responseStatusText: string, operationName: string): Error => {
    const messageDetail = errorData.error?.message || errorData.detail || responseStatusText || "Tidak ada detail error.";
    
    if (isSensitiveContentError(messageDetail)) {
        return new Error(`${SENSITIVE_CONTENT_ERROR_PREFIX}${operationName} gagal karena konten terdeteksi sensitif.`);
    }

    if (responseStatus === 402 || messageDetail.toLowerCase().includes("credit") || messageDetail.toLowerCase().includes("token")) {
        return new Error(`Kredit untuk layanan AI pendukung (${operationName}) tidak mencukupi atau permintaan terlalu besar. Silakan hubungi Admin atau coba permintaan yang lebih sederhana.`);
    }
    
    return new Error(`${operationName} gagal. Layanan AI pendukung tidak merespon dengan benar (Status: ${responseStatus}). Silakan coba beberapa saat lagi.`);
};

export const optimizePrompt = async (promptText: string): Promise<string> => {
  const operationName = "Optimasi prompt";
  if (!promptText.trim()) return "";

  const activeKey = getActiveOpenRouterApiKey();
  if (!activeKey || !activeKey.key) {
    console.error("Layanan AI pendukung tidak aktif atau tidak valid untuk Optimasi Prompt.");
    throw new Error("Layanan AI pendukung tidak aktif atau tidak valid. Silakan atur di halaman Pengaturan.");
  }

  const systemInstruction = "You are an expert prompt engineer. Your task is to expand and enrich a user's simple idea into a detailed, vivid, and descriptive prompt for an AI image generator. Add relevant keywords like styles (e.g., photorealistic, cinematic), lighting, composition, and mood. Only output the final, optimized prompt text, without any introductions, explanations, or quotation marks.";
  
  const payload = {
    model: getOpenRouterModelName(GEMINI_TEXT_MODEL_NAME),
    messages: [
      { role: "system", content: systemInstruction },
      { role: "user", content: promptText }
    ],
    max_tokens: 1024,
  };

  try {
    const response = await fetch(`${OPENROUTER_API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: getHeaders(activeKey.key),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: response.statusText }));
      console.error(`Error ${operationName} dari layanan AI pendukung:`, response.status, errorData);
      throw handleOpenRouterError(errorData, response.status, response.statusText, operationName);
    }

    const result = await response.json();
    if (result.choices && result.choices.length > 0 && result.choices[0].message && result.choices[0].message.content) {
      return result.choices[0].message.content.trim();
    }
    throw new Error(`Respon tidak valid dari layanan AI pendukung saat ${operationName}.`);

  } catch (error: any) {
    console.error(`Error saat ${operationName}:`, error);
    if (error.message.startsWith(SENSITIVE_CONTENT_ERROR_PREFIX) || error.message.includes("layanan AI pendukung")) throw error;
    throw new Error(`Gagal menghubungi layanan AI pendukung untuk ${operationName}. Periksa koneksi internet Anda.`);
  }
};

export const analyzeImageForPrompt = async (base64Image: string, mimeType: string): Promise<{ indonesianPrompt: string, englishPrompt: string }> => {
  const operationName = "Analisa gambar";
  const activeKey = getActiveOpenRouterApiKey();
  if (!activeKey || !activeKey.key) {
    console.error("Layanan AI pendukung tidak aktif atau tidak valid untuk Analisa Gambar.");
    throw new Error("Layanan AI pendukung tidak aktif atau tidak valid. Silakan atur di halaman Pengaturan.");
  }

  const systemInstruction = "You are a world-class promptographer AI. Your task is to analyze the user's uploaded image and generate an exceptionally detailed and powerful prompt for an AI image generator to recreate a similar image. The prompt should capture the essence of the subject, setting, composition, lighting, colors, artistic style, and any specific important details. Combine all these elements into a single, flowing paragraph for each language requested. Provide this complete prompt in two languages, clearly separated by '---'. First, the Indonesian version under a 'Versi Indonesia:' header. Second, the English version under an 'English Version:' header. Do not add any other text, explanation, introduction, or break down the prompt into components in your final output; only the complete paragraph for each language.";

  const payload = {
    model: getOpenRouterModelName(GEMINI_VISION_MODEL_NAME), 
    messages: [
      { role: "system", content: systemInstruction },
      {
        role: "user",
        content: [
          { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64Image}` } },
          { type: "text", text: "Analyze this image and generate detailed prompts in Indonesian and English as per the system instructions." }
        ]
      }
    ],
    max_tokens: 2048,
  };
  
  try {
    const response = await fetch(`${OPENROUTER_API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: getHeaders(activeKey.key),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: response.statusText }));
      console.error(`Error ${operationName} dari layanan AI pendukung:`, response.status, errorData);
      throw handleOpenRouterError(errorData, response.status, response.statusText, operationName);
    }
    
    const result = await response.json();
    if (!result.choices || result.choices.length === 0 || !result.choices[0].message || !result.choices[0].message.content) {
        throw new Error(`Respon tidak valid dari layanan AI pendukung saat ${operationName}.`);
    }

    const fullText = result.choices[0].message.content.trim();
    const parts = fullText.split('---');
    
    let finalIndonesianPrompt = `Tidak dapat menghasilkan prompt versi Indonesia dari layanan AI pendukung.`;
    let finalEnglishPrompt = `Could not generate English version prompt from supporting AI service.`;

    if (parts[0]) {
        const cleaned = parts[0].trim().replace(/^Versi Indonesia:\s*/i, '').trim();
        if (cleaned) {
            finalIndonesianPrompt = cleaned;
        }
    }

    if (parts[1]) {
        const cleaned = parts[1].trim().replace(/^English Version:\s*/i, '').trim();
        if (cleaned) {
            finalEnglishPrompt = cleaned;
        }
    }
    
    return { indonesianPrompt: finalIndonesianPrompt, englishPrompt: finalEnglishPrompt };

  } catch (error: any) {
    console.error(`Error saat ${operationName}:`, error);
    if (error.message.startsWith(SENSITIVE_CONTENT_ERROR_PREFIX) || error.message.includes("layanan AI pendukung")) throw error;
    throw new Error(`Gagal menghubungi layanan AI pendukung untuk ${operationName}. Periksa koneksi internet Anda.`);
  }
};

export const sendChatMessage = async (
  chatHistory: ChatMessage[],
  currentUserInput: string,
  uploadedImageFile?: UploadedFile | null
): Promise<string> => {
  const operationName = "Chatbot";
  const activeKey = getActiveOpenRouterApiKey();
  if (!activeKey || !activeKey.key) {
    console.error("Layanan AI pendukung tidak aktif atau tidak valid untuk Chatbot.");
    throw new Error("Layanan AI pendukung tidak aktif atau tidak valid. Silakan atur di halaman Pengaturan.");
  }

  const messagesPayload: Array<{ role: ChatRole, content: string | ChatMessageContentPart[] }> = [
    { role: "system", content: CHATBOT_SYSTEM_PROMPT }
  ];

  chatHistory.forEach(msg => {
    if (msg.role === 'user') {
      let userContent: ChatMessageContentPart[] = [{ type: 'text', text: msg.content as string }]; 
      if (typeof msg.content === 'string') {
         userContent = [{ type: 'text', text: msg.content }];
      } else if (Array.isArray(msg.content)) {
         userContent = msg.content;
      }
      messagesPayload.push({ role: 'user', content: userContent });
    } else if (msg.role === 'assistant') {
      // Exclude previous error messages from assistant to keep API history clean
      if (!(msg.content as string).startsWith('Maaf, terjadi kesalahan:') && 
          !(msg.content as string).startsWith(SENSITIVE_CONTENT_ERROR_PREFIX) &&
          !(msg.content as string).includes("layanan AI pendukung") &&
          !(msg.content as string).startsWith("Kredit untuk layanan AI pendukung")) {
         messagesPayload.push({ role: 'assistant', content: msg.content as string });
      }
    }
  });

  const currentUserContent: ChatMessageContentPart[] = [{ type: 'text', text: currentUserInput }];
  if (uploadedImageFile) {
    currentUserContent.unshift({ 
      type: 'image_url',
      image_url: { url: `data:${uploadedImageFile.mimeType};base64,${uploadedImageFile.base64}` }
    });
  }
  messagesPayload.push({ role: 'user', content: currentUserContent });

  const payload = {
    model: getOpenRouterModelName(GEMINI_VISION_MODEL_NAME),
    messages: messagesPayload,
    max_tokens: 4096,
  };

  try {
    const response = await fetch(`${OPENROUTER_API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: getHeaders(activeKey.key),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: response.statusText }));
      console.error(`Error ${operationName} dari layanan AI pendukung:`, response.status, errorData);
      throw handleOpenRouterError(errorData, response.status, response.statusText, operationName);
    }

    const result = await response.json();
    if (result.choices && result.choices.length > 0 && result.choices[0].message && result.choices[0].message.content) {
      return result.choices[0].message.content.trim();
    }
    throw new Error(`Respon tidak valid dari layanan AI pendukung untuk ${operationName}.`);

  } catch (error: any) {
    console.error(`Error saat mengirim pesan ${operationName}:`, error);
    if (error.message.startsWith(SENSITIVE_CONTENT_ERROR_PREFIX) || error.message.includes("layanan AI pendukung")) throw error;
    throw new Error(`Gagal menghubungi layanan AI pendukung untuk ${operationName}. Periksa koneksi internet Anda.`);
  }
};