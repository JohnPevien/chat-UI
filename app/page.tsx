'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useChatStore } from '@/store';
import { ToastContainer } from 'react-toastify';
import { ChatInput, ChatMessages } from '@/components';

import 'react-toastify/dist/ReactToastify.css';

type Props = {};

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

interface Chat {
    id: string;
    messages: Message[];
    title: string;
}

const storeLocalStorage = (chat: Chat) => {
    if (!localStorage.getItem(`chat-${chat.id}`)) {
        const chatTitle = prompt('Enter a title for this chat');
        chat.title = chatTitle || 'No Title';
    }

    localStorage.setItem(`chat-${chat.id}`, JSON.stringify(chat));
};

const Page = ({}: Props) => {
    const [text, setText] = useState<string>('');
    const { chat, setChat, chats, setChats } = useChatStore();
    const [streamReply, setStreamReply] = useState<string>('');
    const [streaming, setStreaming] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const chatbox = useRef<HTMLDivElement>(null);

    const updateConversationsList = (chat: Chat) => {
        const chatToUpdateIndex = chats.findIndex(
            (conversation) => conversation.id === chat.id
        );

        if (chatToUpdateIndex !== -1) {
            const updatedChat = { ...chat };
            const newConversations = [
                ...chats.slice(0, chatToUpdateIndex),
                updatedChat,
                ...chats.slice(chatToUpdateIndex + 1),
            ];
            setChats(newConversations);
        } else {
            setChats([...chats, chat]);
        }
    };

    const scrollTobottom = () => {
        if (chatbox.current) {
            chatbox?.current?.lastElementChild?.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
                inline: 'nearest',
            });
        }
    };

    useEffect(() => {
        const scrollInterval = setInterval(() => {
            if (streaming) {
                scrollTobottom();
            }
        }, 250);

        return () => clearInterval(scrollInterval);
    }, [streaming]);

    const handleClick = async () => {
        const chatId = chat?.id || `chat-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const conversation: Chat = {
            id: chatId,
            title: chat?.title || 'New Chat',
            messages: [],
        };

        if (chat?.messages && chat?.messages.length > 0) {
            conversation.messages = [
                ...chat.messages,
                { role: 'user', content: text },
            ];
        } else {
            conversation.messages = [{ role: 'user', content: text }];
        }

        setChat(conversation);
        setText('');
        setTimeout(() => {
            scrollTobottom();
        }, 100);

        setSubmitting(true);
        if (text.length > 0) {
            const response = await fetch('/api/openai', {
                method: 'POST',
                body: JSON.stringify(conversation),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            const data = response.body;
            if (!data) {
                return;
            }

            const reader = data.getReader();
            const decoder = new TextDecoder();
            let done = false;

            let responseText = '';

            setStreaming(true);

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value);
                responseText += chunkValue;
                setStreamReply(responseText);
            }

            setStreaming(false);

            conversation.messages = [
                ...conversation.messages,
                {
                    role: 'assistant',
                    content: responseText,
                },
            ];

            storeLocalStorage(conversation);
            updateConversationsList(conversation);
            setChat(conversation);
        }
        setSubmitting(false);
        setTimeout(() => {
            scrollTobottom();
        }, 100);
    };

    const textAreaOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target;
        setText(value);
    };

    return (
        <section className="flex h-full max-h-screen flex-col px-4 sm:px-8 lg:px-12">
            <div className="flex-1 overflow-y-auto py-6">
                <div className="mx-auto max-w-4xl">
                    <ChatMessages
                        ref={chatbox}
                        chat={chat}
                        streaming={streaming}
                        streamReply={streamReply}
                    />
                </div>
            </div>
            
            <div className="border-t border-gray-700 px-4 py-4">
                <div className="mx-auto max-w-4xl">
                    <ChatInput
                        text={text}
                        submitting={submitting}
                        onTextChange={textAreaOnChange}
                        onSubmit={handleClick}
                    />
                </div>
            </div>

            <ToastContainer position="bottom-right" theme="dark" />
        </section>
    );
};

export default Page;
