import { forwardRef } from 'react';
import Image from 'next/image';

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

interface Chat {
    id?: string;
    messages?: Message[];
    title?: string;
}

interface ChatMessagesProps {
    chat: Chat | null;
    streaming: boolean;
    streamReply: string;
}

export const ChatMessages = forwardRef<HTMLDivElement, ChatMessagesProps>(
    ({ chat, streaming, streamReply }, ref) => {
        return (
            <div className="flex flex-col gap-5" ref={ref}>
                {chat?.messages &&
                    chat.messages.map((message, index) => (
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
                                    className={`flex flex-col ${
                                        message?.role === 'user'
                                            ? 'items-end'
                                            : 'items-start'
                                    }`}
                                >
                                    <div
                                        className={`rounded-xl ${
                                            message?.role === 'user'
                                                ? 'mr-10 bg-blue-600'
                                                : 'ml-10 bg-gray-600'
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
                        className="relative flex flex-row items-center justify-start gap-2 whitespace-pre-wrap"
                    >
                        <div className="absolute left-0 top-2 z-10 h-8 w-8 rounded-full bg-gradient-to-r from-red-400 to-blue-500"></div>

                        <div className="flex flex-col items-start">
                            <div className="ml-10 max-w-[85%] rounded-xl bg-gray-600 px-4 py-3">
                            
                                {streamReply}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
);

ChatMessages.displayName = 'ChatMessages';

