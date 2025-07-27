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

export const ChatInput = ({ text, submitting, onTextChange, onSubmit }: ChatInputProps) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
        }
    };

    return (
        <div className="relative flex w-full items-center gap-3 rounded-lg bg-gray-900 p-3">
            <textarea
                className="flex-1 resize-none bg-transparent text-white placeholder-gray-400 outline-none"
                rows={2}
                placeholder="Type your message here..."
                onChange={onTextChange}
                value={text}
                onKeyDown={handleKeyDown}
                disabled={submitting}
            />

            <Button
                onClick={onSubmit}
                className="flex-shrink-0 inline-flex items-center justify-center gap-2 rounded bg-blue-600 px-4 py-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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

ChatInput.displayName = 'ChatInput';
