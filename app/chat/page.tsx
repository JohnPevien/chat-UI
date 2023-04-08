'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useChatStore } from '@/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Props = {};

interface Message {
    role: string;
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

export default function Page({}: Props) {
    const [text, setText] = useState<string>('');
    const { chat, setChat, chats, setChats } = useChatStore();
    const [submitting, setSubmitting] = useState<boolean>(false);

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

    const handleClick = async () => {
        const conversation: Chat = {
            id: chat?.id || '',
            title: chat?.title || '',
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

        setSubmitting(true);
        if (text.length > 0) {
            setText('');

            const req = await fetch('/api/openai', {
                method: 'POST',
                body: JSON.stringify(conversation),
                mode: 'cors',
            });

            const res = await req.json();

            if (res) {
                if (!conversation?.id) conversation.id = res.id;
                conversation.messages = [
                    ...conversation.messages,
                    {
                        role: 'assistant',
                        content: res.choices[0]?.message.content || '',
                    },
                ];

                storeLocalStorage(conversation);
                updateConversationsList(conversation);
                setChat(conversation);
            }
        }
        setSubmitting(false);
    };

    const textAreaOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target;
        setText(value);
    };

    return (
        <section className="h-screen max-h-screen w-full max-w-full p-4 md:mx-auto md:max-w-[90%]  md:p-12 ">
            <div className="mb-10 h-[75vh] w-full overflow-y-auto">
                <div className="flex flex-col gap-5">
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
                                            <div className="absolute left-0 top-0 z-10 h-8 w-8 rounded-full bg-gradient-to-r from-red-400 to-blue-500"></div>
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
                                            className={`${
                                                message?.role === 'user'
                                                    ? ' mr-2 rounded-xl  bg-blue-600'
                                                    : ' rounded-4xl ml-10 mr-2 rounded-xl bg-gray-600 '
                                            } max-w-[85%] px-4 py-3`}
                                        >
                                            {message?.content}
                                        </div>
                                    </div>
                                )}

                                {message?.role === 'user' && (
                                    <div className="relative h-8 min-h-[2rem] w-8 min-w-[2rem]">
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
                </div>
            </div>
            <div className="relative bg-gray-900 ">
                <textarea
                    className="h-18 text-md w-[calc(100%-4rem)]  overflow-y-auto bg-transparent py-5 px-5 outline-none md:w-3/4"
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
                />

                <Button
                    onClick={handleClick}
                    className=" absolute right-6 top-1/2 inline-flex -translate-y-1/2 items-center gap-3 rounded bg-blue-600
                    px-5 py-2"
                    disabled={submitting}
                >
                    {submitting ? (
                        <svg
                            className="h-5 w-5 animate-spin text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                    ) : (
                        <svg
                            className=" h-5 w-5 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3.3938 2.20468C3.70395 1.96828 4.12324 1.93374 4.4679 2.1162L21.4679 11.1162C21.7953 11.2895 22 11.6296 22 12C22 12.3704 21.7953 12.7105 21.4679 12.8838L4.4679 21.8838C4.12324 22.0662 3.70395 22.0317 3.3938 21.7953C3.08365 21.5589 2.93922 21.1637 3.02382 20.7831L4.97561 12L3.02382 3.21692C2.93922 2.83623 3.08365 2.44109 3.3938 2.20468ZM6.80218 13L5.44596 19.103L16.9739 13H6.80218ZM16.9739 11H6.80218L5.44596 4.89699L16.9739 11Z"
                                fill="#fff"
                            />
                        </svg>
                    )}
                </Button>
            </div>
            <ToastContainer position="bottom-right" theme="dark" />
        </section>
    );
}
