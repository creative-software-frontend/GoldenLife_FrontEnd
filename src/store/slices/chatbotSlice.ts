import { StateCreator } from 'zustand';
import axios from 'axios';
import { baseURL } from '../utils';
import type { AppState } from '../useAppStore';

export interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export interface ChatbotSlice {
  studentMessages: ChatMessage[];
  vendorMessages: ChatMessage[];
  instructorMessages: ChatMessage[];
  isChatbotLoading: boolean;
  sendChatbotMessage: (message: string, mode: 'student' | 'vendor' | 'instructor') => Promise<void>;
  clearChatbotMessages: (mode: 'student' | 'vendor' | 'instructor') => void;
}

export const createChatbotSlice: StateCreator<AppState, [], [], ChatbotSlice> = (set, get) => ({
  studentMessages: [],
  vendorMessages: [],
  instructorMessages: [],
  isChatbotLoading: false,

  sendChatbotMessage: async (text: string, mode: 'student' | 'vendor' | 'instructor') => {
    if (!text.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const key = mode === 'student' ? 'studentMessages' : mode === 'vendor' ? 'vendorMessages' : 'instructorMessages';
    
    // 1. Add User Message
    const userMsg: ChatMessage = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp,
    };

    set((state) => ({
      [key]: [...(state[key] as ChatMessage[]), userMsg],
      isChatbotLoading: true,
    }));

    try {
      // 2. Call API
      const formData = new FormData();
      formData.append('message', text);

      const response = await axios.post(`${baseURL}/api/chat`, formData);

      // 3. Handle Bot Response
      const botReply = response.data?.reply || "দুঃখিত, আমি এই মুহূর্তে উত্তর দিতে পারছি না। অনুগ্রহ করে পরে চেষ্টা করুন।";
      
      const botMsg: ChatMessage = {
        id: Date.now() + 1,
        text: botReply,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      set((state) => ({
        [key]: [...(state[key] as ChatMessage[]), botMsg],
      }));
    } catch (error) {
      console.error("Chatbot API Error:", error);
      
      const errorMsg: ChatMessage = {
        id: Date.now() + 2,
        text: "সার্ভারের সাথে সংযোগ বিচ্ছিন্ন হয়ে গেছে। অনুগ্রহ করে ইন্টারনেট কানেকশন চেক করুন।",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      set((state) => ({
        [key]: [...(state[key] as ChatMessage[]), errorMsg],
      }));
    } finally {
      set({ isChatbotLoading: false });
    }
  },

  clearChatbotMessages: (mode) => {
    const key = mode === 'student' ? 'studentMessages' : mode === 'vendor' ? 'vendorMessages' : 'instructorMessages';
    set({ [key]: [] });
  },
});
