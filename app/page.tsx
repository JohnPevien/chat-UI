'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useChatStore } from '@/store';
import { ToastContainer } from 'react-toastify';
import { Loader2, Send } from 'lucide-react';

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

const Button = ({
    className,
    onClick,
    children,
    disabled,
}: {
    onClick: () => void;
    className: string;
    children: React.ReactNode;
    disabled?: boolean;
}) => {
    return (
        <button
            type="button"
            className={className}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

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

            let text = '';

            setStreaming(true);

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value);
                text += chunkValue;
                setStreamReply(text);
            }

            setStreaming(false);

            conversation.messages = [
                ...conversation.messages,
                {
                    role: 'assistant',
                    content: text,
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
        <section className="mx-auto h-full max-h-screen max-w-full px-8 sm:max-w-[90%] sm:p-12  ">
            <div className="relative mb-10 mt-5 h-[75vh] w-full overflow-y-auto md:mt-0">
                <div className="flex flex-col gap-5" ref={chatbox}>
                    {chat &&
                        chat?.messages?.map((message, index) => (
                            <div
                                key={index}
                                className={`relative flex flex-row items-center gap-2 whitespace-pre-wrap ${
                                    message?.role === 'user'
                                        ? 'justify-end'
                                        : 'justify-start'
                                }`}
                            >
                                {message?.role && (
                                    <>
                                        {message?.role !== 'user' && (
                                            <div className="absolute left-0 top-2 z-10 h-8 w-8 rounded-full bg-gradient-to-r from-red-400 to-blue-500"></div>
                                        )}
                                    </>
                                )}

                                {message?.content && (
                                    <div
                                        className={`flex flex-col
                                    ${
                                        message?.role === 'user'
                                            ? 'items-end'
                                            : 'items-start'
                                    }
                                    `}
                                    >
                                        <div
                                            className={` rounded-xl ${
                                                message?.role === 'user'
                                                    ? ' mr-10  bg-blue-600'
                                                    : '  ml-10  bg-gray-600 '
                                            } max-w-[85%] px-4 py-3`}
                                        >
                                            {message?.content}
                                        </div>
                                    </div>
                                )}

                                {message?.role === 'user' && (
                                    <div className="absolute right-0 top-2 h-8 min-h-[2rem] w-8 min-w-[2rem]">
                                        <Image
                                            src="/images/user-image.png"
                                            fill
                                            alt="User"
                                            className="absolute left-0 top-0 z-10 rounded-full"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    {streaming && (
                        <div
                            className={`relative flex flex-row items-center justify-start gap-2 whitespace-pre-wrap`}
                        >
                            <div className="absolute left-0 top-2 z-10 h-8 w-8 rounded-full bg-gradient-to-r from-red-400 to-blue-500"></div>

                            <div
                                className={`flex flex-col
                                    items-start
                                    `}
                            >
                                <div
                                    className={` ml-10 max-w-[85%]  rounded-xl bg-gray-600 px-4 py-3`}
                                >
                                    {streamReply}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="absolute bg-gray-900 ">
                <textarea
                    className="h-18 text-md w-[calc(100%-4rem)]  overflow-y-auto bg-transparent px-5 py-5 outline-none md:w-3/4"
                    rows={2}
                    placeholder="Type your message here..."
                    onChange={textAreaOnChange}
                    style={{ resize: 'none' }}
                    value={text}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleClick();
                        }
                    }}
                    disabled={submitting}
                />

                <Button
                    onClick={handleClick}
                    className=" absolute right-6 top-1/2 inline-flex -translate-y-1/2 items-center gap-3 rounded bg-blue-600
                    px-5 py-2"
                    disabled={submitting}
                >
                    {submitting ? (
                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                    ) : (
                        <Send className="h-5 w-5 text-white" />
                    )}
                </Button>
            </div>
            <ToastContainer position="bottom-right" theme="dark" />
        </section>
    );
};

export default Page;
