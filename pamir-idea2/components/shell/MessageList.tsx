"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { ActionBlock, ActionData } from "@/components/shell/ActionBlock";

export type Message = {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: number;
    actions?: ActionData[];
};

interface MessageListProps {
    messages: Message[];
    isThinking?: boolean;
}

export function MessageList({ messages, isThinking }: MessageListProps) {
    const scrollRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
        }
    }, [messages, isThinking]);

    return (
        <div className="flex-1 overflow-y-auto px-4 py-8" ref={scrollRef}>
            <div className="max-w-3xl mx-auto space-y-10">
                <AnimatePresence initial={false}>
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className={cn(
                                "flex gap-4",
                                message.role === "user" ? "justify-end" : "justify-start"
                            )}
                        >
                            {message.role !== "user" && (
                                <div className="w-8 h-8 mt-1 flex-shrink-0 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs select-none">
                                    OS
                                </div>
                            )}

                            <div
                                className={cn(
                                    "relative max-w-[85%] text-base leading-relaxed",
                                    message.role === "user"
                                        ? "bg-primary text-primary-foreground px-5 py-3 rounded-2xl rounded-tr-sm"
                                        : "text-foreground px-0 py-1" // AI: No background, just text
                                )}
                            >
                                {/* Text Content */}
                                {message.content && (
                                    <div className="whitespace-pre-wrap">{message.content}</div>
                                )}

                                {/* System Actions (Only for AI) */}
                                {message.actions && message.actions.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        {message.actions.map((action, idx) => (
                                            <ActionBlock key={idx} data={action} />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {message.role === "user" && (
                                <Avatar className="w-8 h-8 mt-1 border">
                                    <AvatarFallback>U</AvatarFallback>
                                </Avatar>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isThinking && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-4"
                    >
                        <div className="w-8 h-8 mt-1 flex-shrink-0 flex items-center justify-center rounded-full bg-muted text-muted-foreground text-xs select-none">
                            OS
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm px-0 py-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                    </motion.div>
                )}

                {/* Spacer for bottom input */}
                <div className="h-32" />
            </div>
        </div>
    );
}
