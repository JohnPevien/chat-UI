import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useChatStore } from '@/store';

import { toast } from 'react-toastify';
type Props = {
    setShowMobileNav: Dispatch<SetStateAction<boolean>>;
};

export default function Conversations({ setShowMobileNav }: Props) {
    const { setChat, chats, setChats } = useChatStore();

    const [confirmClear, setConfirmClear] = useState(false);

    useEffect(() => {
        const fetchChats = () => {
            const localStorageObj = { ...localStorage };
            const conversationKeys: string[] = Object.keys(
                localStorageObj
            ).filter((key) => key.startsWith('chat'));
            let Chats = [];
            if (conversationKeys.length !== 0) {
                Chats = conversationKeys.map((key) => {
                    const conversationString = localStorage.getItem(key);
                    if (
                        conversationString === undefined ||
                        conversationString === 'undefined'
                    )
                        return;
                    const conversation = JSON.parse(
                        (localStorage.getItem(key) as string) ?? {}
                    );

                    return {
                        id: key,
                        ...conversation,
                    };
                });
            }
            // remove undefined
            Chats = Chats.filter((chat) => chat !== undefined);

            setChats(Chats);
        };

        fetchChats();
    }, []);

    const onConversationClick = (id: string) => {
        const conversation = chats.find(
            (conversation) => conversation.id === id
        );

        if (!conversation) {
            toast.error('Conversation not found');
            return;
        } else {
            setChat(conversation);
            setShowMobileNav(false);
        }
    };

    const clearChats = () => {
        const localStorageObj = { ...localStorage };
        const conversationKeys: string[] = Object.keys(localStorageObj).filter(
            (key) => key.startsWith('chat')
        );

        conversationKeys.forEach((key) => {
            localStorage.removeItem(key);
        });

        setChats([]);
        setChat({});
        setConfirmClear(false);
        setShowMobileNav(false);
        toast.info('Successfully Cleared All Conversations');
    };

    return (
        <aside>
            <div className="h-80 overflow-y-scroll md:mb-12">
                {chats.map((chat) => {
                    return (
                        <div
                            key={chat.id}
                            onClick={() => onConversationClick(chat?.id || '')}
                            className="cursor-pointer rounded p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 "
                        >
                            {chat.title}
                        </div>
                    );
                })}
            </div>

            <button
                className="mb-5 block w-full  rounded bg-blue-600
                    px-5 py-2 hover:bg-blue-800"
                onClick={() => {
                    setChat({});
                    setShowMobileNav(false);
                }}
            >
                New Chat
            </button>

            {!confirmClear && (
                <button
                    className="mb-5 block w-full rounded bg-red-500 py-2 px-4 text-white hover:bg-red-700"
                    onClick={() => setConfirmClear(true)}
                >
                    Clear Conversations
                </button>
            )}

            {confirmClear && (
                <button
                    className="mb-5 block w-full  rounded bg-red-500 py-2 px-4 text-white hover:bg-red-700"
                    onClick={clearChats}
                >
                    Are you sure?
                </button>
            )}
        </aside>
    );
}
