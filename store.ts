import { create } from 'zustand';

interface Message {
    role: 'user' | 'assistant' | 'system';
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
    chats: Chat[];
    setChats: (state: Chat[]) => void;
};

export const useChatStore = create<chatStore>((set) => ({
    chat: {} as Chat,
    setChat: (state: Chat) => {
        set({ chat: state });
    },
    chats: [] as Chat[],
    setChats: (state: Chat[]) => {
        set({ chats: state });
    },
}));
