import { create } from 'zustand';

interface Message {
    role: string;
    content: string;
}

interface Chat {
    id?: string;
    messages?: Message[];
    title?: string;
}

type chatStore = {
    chat: Chat;
    setChat: (state: Chat) => void;
    conversations: Chat[];
    setConversations: (state: Chat[]) => void;
};

export const useChatStore = create<chatStore>((set) => ({
    chat: {} as Chat,
    setChat: (state: Chat) => {
        set({ chat: state });
    },
    conversations: [] as Chat[],
    setConversations: (state: Chat[]) => {
        set({ conversations: state });
    },
}));
