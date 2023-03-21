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
            {conversations.map((conversation) => {
                return <div key={conversation.id}>{conversation.title}</div>;
            })}
        </div>
    );
}
