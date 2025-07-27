'use client';

import { Loader2, Send } from 'lucide-react';

interface ChatInputProps {
    text: string;
    submitting: boolean;
    onTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onSubmit: () => void;
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

const ChatInput = ({ text, submitting, onTextChange, onSubmit }: ChatInputProps) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
        }
    };

    return (
        <div className="absolute bg-gray-900">
            <textarea
                className="h-18 text-md w-[calc(100%-4rem)] overflow-y-auto bg-transparent px-5 py-5 outline-none md:w-3/4"
                rows={2}
                placeholder="Type your message here..."
                onChange={onTextChange}
                style={{ resize: 'none' }}
                value={text}
                onKeyDown={handleKeyDown}
                disabled={submitting}
            />

            <Button
                onClick={onSubmit}
                className="absolute right-6 top-1/2 inline-flex -translate-y-1/2 items-center gap-3 rounded bg-blue-600 px-5 py-2"
                disabled={submitting}
            >
                {submitting ? (
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                ) : (
                    <Send className="h-5 w-5 text-white" />
                )}
            </Button>
        </div>
    );
};

export default ChatInput;
