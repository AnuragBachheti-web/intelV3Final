import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useChatStore = create(
  persist(
    (set) => ({
      companionConversation: [
        { label: 'AGENT · Analyse', text: '18.4% share, #3 of 47. Drop traces to Seller QRS — 12 ASINs, reprices 14×/day.', type: 'agent' },
        { label: 'AGENT · Playbook', text: 'QRS: 70% activity 06:00–09:00 ET. Floor-price suppression strategy.', action: 'View evidence', type: 'agent' },
      ],
      isCompanionThinking: false,
      addCompanionMessage: (msg) => set((state) => ({ companionConversation: [...state.companionConversation, msg] })),
      setCompanionThinking: (val) => set({ isCompanionThinking: val }),
    }),
    { name: 'chat-storage' }
  )
);
