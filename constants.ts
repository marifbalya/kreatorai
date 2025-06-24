import { Page, NavItem, ImageStyle, AspectRatio, VideoTab, VideoTabItem, VideoAspectRatioOption, HistoryFilterType, HistoryFilterOption, OpenRouterApiKeyEntry, VideoDurationOption, DisplayCreditType } from './types';
import HomeIcon from './components/icons/HomeIcon';
import ChatIcon from './components/icons/ChatIcon';
import AnalyzeIcon from './components/icons/AnalyzeIcon';
import ImageIcon from './components/icons/ImageIcon';
import CubeIcon from './components/icons/CubeIcon';
import VideoIcon from './components/icons/VideoIcon';
import HistoryIcon from './components/icons/HistoryIcon';
import CogIcon from './components/icons/CogIcon';

// IMPORTANT: Storing API keys directly in client-side code is a security risk.
// These should ideally be handled via a backend proxy or environment variables
// not directly exposed to the browser. For Wavespeed, as it was in original script.
// Gemini API Key is expected from process.env.API_KEY.
export const WAVESPEED_API_KEY = ""; // Effectively remove default key

export const API_KEYS_LOCAL_STORAGE_KEY = 'kreatorAiUserApiKeys'; // For WaveSpeed keys (Kredit)
export const OPENROUTER_API_KEYS_LOCAL_STORAGE_KEY = 'kreatorAiOpenRouterApiKeys'; // For OpenRouter keys (Server AI)

export const DEFAULT_WAVESPEED_API_KEY_ID = 'default-wavespeed-key'; // ID remains for structure, but won't be used if WAVESPEED_API_KEY is empty
export const ADMIN_WHATSAPP_NUMBER = '6288276730124';


export const NAV_ITEMS: NavItem[] = [
  { id: Page.Home, label: 'Home', icon: HomeIcon },
  { id: Page.Chatbot, label: 'Chatbot Kreator', icon: ChatIcon }, 
  { id: Page.Analisa, label: 'Analisa Image', icon: AnalyzeIcon },
  { id: Page.Gambar, label: 'Gambar', icon: ImageIcon },
  { id: Page.ThreeD, label: '3D Image', icon: CubeIcon },
  { id: Page.Video, label: 'Video', icon: VideoIcon },
  { id: Page.History, label: 'History', icon: HistoryIcon },
  { id: Page.Setting, label: 'Setting', icon: CogIcon },
];

export const BOTTOM_NAV_ITEMS: NavItem[] = [
  { id: Page.Home, label: 'Home', icon: HomeIcon },
  { id: Page.History, label: 'Tersimpan', icon: HistoryIcon },
  { id: Page.Setting, label: 'Setting', icon: CogIcon },
];

export const IMAGE_STYLES: ImageStyle[] = [
  { value: 'default', label: 'Default' },
  { value: 'photorealistic', label: 'Photorealistic' },
  { value: 'realistic', label: 'Realistic' },
  { value: 'anime', label: 'Anime & Manga' },
  { value: 'cinematic', label: 'Cinematic Film' },
  { value: 'fantasy', label: 'Fantasy Art' },
  { value: 'scifi_futuristic', label: 'Sci-Fi Futuristic' },
  { value: 'cyberpunk_neon', label: 'Cyberpunk & Neon' },
  { value: 'vintage_retro', label: 'Vintage & Retro' },
  { value: 'comic_cartoon', label: 'Comic & Cartoon' },
  { value: '3d_cgi', label: '3D CGI' },
  { value: 'studio_ghibli', label: 'Studio Ghibli' },
  { value: 'miniature_fantasy', label: 'Miniature Fantasy' },
];

export const ASPECT_RATIOS: AspectRatio[] = [
  { value: '768*1344', label: 'Potret (9:16)' },
  { value: '1344*768', label: 'Layar Lebar (16:9)' },
  { value: '1024*1024', label: 'Kotak (1:1)' },
  { value: '832*1216', label: 'Potret (2:3)' },
  { value: '1216*832', label: 'Lanskap (3:2)' },
];

export const VIDEO_TABS: VideoTabItem[] = [
  { id: VideoTab.TextToVideo, label: 'Teks ke Video' },
  { id: VideoTab.ImageToVideo, label: 'Gambar ke Video' },
];

export const VIDEO_ASPECT_RATIOS: VideoAspectRatioOption[] = [
  { value: '16:9', label: 'Layar Lebar (16:9)' },
  { value: '9:16', label: 'Potret (9:16)' },
  { value: '1:1', label: 'Kotak (1:1)' },
  { value: '4:3', label: 'Standar (4:3)' },
  { value: '3:4', label: 'Potret (3:4)' },
];

export const VIDEO_DURATION_OPTIONS: VideoDurationOption[] = [
  { value: '5', label: '5 detik' },
  { value: '10', label: '10 detik' },
];

export const DEFAULT_VIDEO_DURATION = 5; // seconds


// Model names for OpenRouter (must be prefixed if not using Google's direct API)
// The geminiService will handle prefixing (e.g., "google/")
export const GEMINI_TEXT_MODEL_NAME = 'google/gemini-2.0-flash-001';
export const GEMINI_VISION_MODEL_NAME = 'google/gemini-2.0-flash-001'; // Also used for multimodal chat

export const WAVESPEED_API_BASE_URL = "https://api.wavespeed.ai/api/v3";
export const OPENROUTER_API_BASE_URL = "https://openrouter.ai/api/v1";

// Default OpenRouter API Keys (Server AI)
export const DEFAULT_OPENROUTER_API_KEYS: OpenRouterApiKeyEntry[] = [
  { id: 'server-1', name: 'Server 1', key: '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', isActive: true },
  { id: 'server-2', name: 'Server 2', key: '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', isActive: false },
  { id: 'server-3', name: 'Server 3', key: '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', isActive: false },
  { id: 'server-4', name: 'Server 4', key: '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', isActive: false },
  { id: 'server-5', name: 'Server 5', key: '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', isActive: false },
];


// --- History Feature Constants ---
export const HISTORY_LOCAL_STORAGE_KEY = 'kreatorAiHistory';

export const HISTORY_PAGE_FILTERS: HistoryFilterOption[] = [
  { value: HistoryFilterType.All, label: 'Semua' },
  { value: HistoryFilterType.Chat, label: 'Chatbot' }, // Added Chatbot filter
  { value: HistoryFilterType.Image, label: 'Gambar' },
  { value: HistoryFilterType.Analysis, label: 'Analisa' },
  { value: HistoryFilterType.ThreeD, label: '3D Model' },
  { value: HistoryFilterType.Video, label: 'Video' },
];

// --- Chatbot Constants ---
export const CHATBOT_SYSTEM_PROMPT = "Anda adalah Kreator Asisten, sebuah AI yang dibuat oleh tim santridigital untuk program kelas kreator AI, JAWAB DENGAN SINGKAT DAN KAMU DILARANG PAKAI KARAKTER *#_- ATAU YANG LAIN, USAHAKAN SENATURAL MUNGKIN SEPERTI MANUSIA!! KAMU sangat ahli dalam membantu pengguna membuat berbagai jenis konten digital. Fokus utama Anda adalah memberikan ide, saran, struktur, dan bahkan draf awal untuk konten seperti posting media sosial, artikel blog, skrip video, ide gambar/video AI, dan strategi konten. Anda harus selalu ramah, suportif, dan proaktif dalam menawarkan bantuan dan bertanya kepada user. Jika pengguna mengirim gambar, gunakan gambar tersebut sebagai konteks untuk memberikan saran konten yang relevan. Misalnya, jika pengguna mengirim gambar produk, bantu mereka membuat deskripsi produk yang menarik atau ide postingan promosi. Selalu berikan jawaban yang terstruktur, jelas, bersih, rapi, dan langsung ke intinya (to the point). Hindari penggunaan karakter format yang tidak perlu seperti tanda bintang (*) atau markdown dan bahasa2 kode yang lain. Hindari menjelaskan bagaimana Anda menghasilkan jawaban atau menyebut diri Anda sebagai AI, kecuali jika diminta secara eksplisit. Prioritaskan jawaban dalam Bahasa Indonesia yang santay kasual dan jawab dengan singkat dan jelas.JAWABAN/OUTPUT HARUS BERUPA TEKS SAJA DAN TANDA BACA YANG DIPERLUKAN!";

export const KREATOR_AI_LOGO_URL = "https://i.postimg.cc/3r9Dd7nZ/file-000000009e4061f9a3147b17c8fb2b49-1.png";

// --- Sensitive Content Handling ---
export const SENSITIVE_CONTENT_KEYWORDS = [
    "sensitive", // General keyword
    "flagged",   // Often used in "content flagged as..."
    "violence",
    "sexual",
    "hate speech",
    "policy violation",
    "safety policy",
    "adult content",
    "nudity",
    "self-harm"
    // Add more keywords as needed, keep them lowercase for case-insensitive matching
];
export const SENSITIVE_CONTENT_ERROR_PREFIX = "SENSITIVE_CONTENT_ERROR:";

// --- Display Credit System Constants ---
export const ADMIN_CODE_CREDIT_MAP: Record<string, number> = {
  'SANTRI2K': 2000,
  'SANTRI3K': 3000,
  'SANTRI4K': 4000,
  'SANTRI5K': 5000,
  'SANTRI6K': 6000,
  'SANTRI7K': 7000,
  'SANTRI8K': 8000,
  'SANTRI9K': 9000,
  'SANTRI10K': 10000,
  // Tambahkan kode lain jika perlu
};

export const FEATURE_DISPLAY_COSTS: Record<string, number> = {
  // Menu Gambar
  buat_gambar: 6,
  edit_gambar: 40,
  gabung_gambar: 40,
  // Menu 3D Image
  image_to_3d: 10,
  // Menu Video
  text_to_video_5s: 80,
  text_to_video_10s: 120,
  image_to_video_5s: 80,
  image_to_video_10s: 120,
  // Fitur lain bisa ditambahkan di sini
};

export const DISPLAY_CREDIT_TYPE_OPTIONS: { value: DisplayCreditType; label: string }[] = [
  { value: 'free', label: 'Kode Gratis' },
  { value: 'fixed_1000', label: '1.000 Kredit' },
  { value: 'custom', label: 'Custom Kredit' },
];