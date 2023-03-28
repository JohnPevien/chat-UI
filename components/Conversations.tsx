'use client';
import { useEffect, useState } from 'react';
import { useChatStore } from '@/store';
type Props = {};

export default function Conversations({}: Props) {
    const [conversations, setConversations] = useState<any[]>([]);
    const { setChat } = useChatStore();

    const [confirmClear, setConfirmClear] = useState(false);

    useEffect(() => {
        const fetchConversations = () => {
            const localStorageObj = { ...localStorage };
            const conversationKeys: string[] = Object.keys(
                localStorageObj
            ).filter((key) => key.startsWith('chat'));

            const conversations = conversationKeys.map((key) => {
                const conversation = JSON.parse(
                    localStorage.getItem(key) as string
                );
                return {
                    id: key,
                    ...conversation,
                };
            });

            setConversations(conversations);
        };

        fetchConversations();
    });

    const onConversationClick = (id: string) => {
        const conversation = conversations.find(
            (conversation) => conversation.id === id
        );
        setChat(conversation);
    };

    const clearConversations = () => {
        const localStorageObj = { ...localStorage };
        const conversationKeys: string[] = Object.keys(localStorageObj).filter(
            (key) => key.startsWith('chat')
        );

        conversationKeys.forEach((key) => {
            localStorage.removeItem(key);
        });

        setConversations([]);
        setChat({});
        setConfirmClear(false);
    };

    return (
        <aside>
            <div className="h-80 overflow-y-scroll md:mb-12">
                {conversations.map((conversation) => {
                    return (
                        <div
                            key={conversation.id}
                            onClick={() => onConversationClick(conversation.id)}
                            className="cursor-pointer rounded p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 "
                        >
                            {conversation.title}
                        </div>
                    );
                })}
            </div>
            {!confirmClear && (
                <button
                    className="mb-5 rounded bg-red-500 py-2 px-4 text-white hover:bg-red-700"
                    onClick={() => setConfirmClear(true)}
                >
                    Clear Conversations
                </button>
            )}

            {confirmClear && (
                <button
                    className="mb-5 rounded bg-red-500 py-2 px-4 text-white hover:bg-red-700"
                    onClick={clearConversations}
                >
                    Are you sure?
                </button>
            )}
        </aside>
    );
}
