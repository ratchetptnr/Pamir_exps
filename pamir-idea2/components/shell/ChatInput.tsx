"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

import { ModelSelector } from "@/components/shell/ModelSelector";

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
    selectedModelId: string;
    onModelChange: (id: string) => void;
}

export function ChatInput({ onSend, disabled, selectedModelId, onModelChange }: ChatInputProps) {
    const [input, setInput] = React.useState("");
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (input.trim()) {
                onSend(input);
                setInput("");
            }
        }
    };

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
        }
    };

    React.useEffect(() => {
        adjustHeight();
    }, [input]);

    return (
        <div className="relative flex flex-col w-full max-w-3xl mx-auto p-4 pb-14 bg-background border rounded-2xl shadow-sm focus-within:ring-2 ring-ring/20 transition-all duration-300">
            <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="What should we build today?"
                className="min-h-[24px] max-h-[200px] w-full resize-none border-0 bg-transparent p-3 focus-visible:ring-0 shadow-none text-base"
                disabled={disabled}
                rows={1}
                suppressHydrationWarning
            />

            <div className="absolute left-4 bottom-4">
                <ModelSelector
                    selectedModelId={selectedModelId}
                    onModelChange={onModelChange}
                    disabled={disabled}
                />
            </div>

            <Button
                size="icon"
                className={cn(
                    "mb-1 ml-2 rounded-full transition-all absolute right-4 bottom-4",
                    input.trim() ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
                )}
                onClick={() => {
                    if (input.trim()) {
                        onSend(input);
                        setInput("");
                    }
                }}
                disabled={disabled}
            >
                <ArrowUp className="w-5 h-5" />
            </Button>
        </div>
    );
}
