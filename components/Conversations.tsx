'use client';
import { useEffect, useState } from 'react';
type Props = {};
export default function Conversations({}: Props) {
    const [conversations, setConversations] = useState<any[]>([]);

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
    return (
        <div>
        <div className="h-80 overflow-y-scroll">
        <div className="h-80 overflow-y-scroll md:mb-12">
            {conversations.map((conversation) => {
                return <div key={conversation.id}>{conversation.title}</div>;
                        className="cursor-pointer rounded p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
            })}
        </div>
    );
}
