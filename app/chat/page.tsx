'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useChatStore } from '@/store';

type Props = {};

interface Message {
    role: string;
    content: string;
}

interface Conversation {
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

const storeLocalStorage = (conversation: Conversation) => {
    if (localStorage.getItem(`chat-${conversation.id}`)) {
        const oldConversation = JSON.parse(
            localStorage.getItem(`chat-${conversation.id}`) as string
        );
        conversation.messages = [
            ...oldConversation.messages,
            ...conversation.messages,
        ];
    } else {
        const chatTitle = prompt('Enter a title for this chat');
        conversation.title = chatTitle || 'No Title';
    }

    localStorage.setItem(
        `chat-${conversation.id}`,
        JSON.stringify(conversation)
    );
};

export default function Page({}: Props) {
    const [text, setText] = useState<string>('');
    const { chat, setChat } = useChatStore();
    const [submitting, setSubmitting] = useState<boolean>(false);

    const handleClick = async () => {
        const conversation: Conversation = {
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

                setChat(conversation);
                storeLocalStorage(conversation);
            }
        }
        setSubmitting(false);
    };

    const textAreaOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target;
        setText(value);
    };
    return (
        <section className="mx-auto h-screen max-h-screen max-w-[80%] p-12 ">
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
                                                    ? ' mr-2 rounded-full rounded-br-none bg-blue-600'
                                                    : ' rounded-4xl ml-10 mr-2 rounded-3xl rounded-tl-none bg-gray-600 '
                                            } max-w-[85%] px-5 py-2`}
                                        >
                                            {message?.content}
                                        </div>
                                    </div>
                                )}

                                {message?.role === 'user' && (
                                    <div className="relative h-8 w-8">
                                        <Image
                                            src="/images/user-image.png"
                                            fill
                                            alt="User"
                                            className="absolute left-0 top-0 z-10 h-8 w-8 rounded-full"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
            </div>
            <div className="relative bg-gray-900 ">
                <textarea
                    className="h-18 text-md w-3/4 overflow-y-auto bg-transparent py-5 px-5 outline-none"
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
                    {submitting ? 'Processing' : 'Send'}
                    {submitting && (
                        <svg
                            className="ml-3 h-5 w-5 animate-spin text-white"
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
                    )}
                </Button>
            </div>
        </section>
    );
}
