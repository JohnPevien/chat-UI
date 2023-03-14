'use client';

import { useState } from 'react';

type Props = {};

interface Message {
    role: string;
    content: string;
}

const Button = ({
    className,
    onClick,
    children,
}: {
    onClick: () => void;
    className: string;
    children: React.ReactNode;
}) => {
    return (
        <button type="button" className={className} onClick={onClick}>
            {children}
        </button>
    );
};

export default function Page({}: Props) {
    const [text, setText] = useState<string>('');
    const [chat, setChat] = useState<any[]>([]);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const handleClick = async () => {
        const conversation = [...chat, { role: 'user', content: text }];
        setChat(conversation);
        let newConversation = [...conversation];

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
                newConversation = [
                    ...conversation,
                    {
                        role: 'assistant',
                        content: res.choices[0]?.message.content || '',
                    },
                ];

                setChat(newConversation);
            }
        }
        setSubmitting(false);
    };

    const textAreaOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target;
        if (value.length > 0) {
            setText(value);
        }
    };

    return (
        <section className=" mx-auto h-screen max-w-[80%] px-12">
            <div className="mb-10 h-[80vh] w-full overflow-y-auto">
                <div className="flex flex-col gap-5">
                    {chat &&
                        chat.map((message, index) => (
                            <div
                                key={index}
                                className={`flex flex-row gap-2 whitespace-pre-wrap ${
                                    message?.role === 'user'
                                        ? 'justify-end'
                                        : 'justify-start'
                                }`}
                            >
                                {message?.role && (
                                    <p className="font-semibold capitalize">
                                        {message?.role}:
                                    </p>
                                )}

                                {message?.content && (
                                    <p className="text-gray-300">
                                        {message.content}
                                    </p>
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
                />
                {!submitting && (
                    <Button
                        onClick={handleClick}
                        className=" absolute right-6 top-1/2 -translate-y-1/2 rounded bg-blue-600
                    px-3 py-1"
                    >
                        Send
                    </Button>
                )}
            </div>
        </section>
    );
}
