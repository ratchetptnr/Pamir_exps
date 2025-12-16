"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, Terminal, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { StreamingText } from "@/components/shell/StreamingText";

export type ActionType = "thinking" | "terminal" | "approval" | "done";

export interface ActionData {
    type: ActionType;
    title?: string;
    content: string; // Logs, reasoning, or prompt
    isCollapsed?: boolean;
}

interface ActionBlockProps {
    data: ActionData;
    onApprove?: (always: boolean) => void;
    onDeny?: () => void;
    stream?: boolean;
    onStreamComplete?: () => void;
}

export function ActionBlock({ data, onApprove, onDeny, stream = false, onStreamComplete }: ActionBlockProps) {
    // If not streaming (e.g. history), show full content. 
    // If streaming, ensure it's expanded initially to show the stream.
    const [isCollapsed, setIsCollapsed] = React.useState(data.isCollapsed ?? false);

    // If we are streaming, we want to auto-expand to show the content.
    React.useEffect(() => {
        if (stream) {
            setIsCollapsed(false);
        }
    }, [stream]);

    if (data.type === "thinking") {
        return (
            <div className="my-2 border-l-2 border-muted pl-4 py-1">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <motion.div
                        animate={{ rotate: isCollapsed ? 0 : 90 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </motion.div>
                    <span className="font-medium">Thinking Process</span>
                </button>
                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="mt-2 text-sm text-muted-foreground font-mono bg-muted/30 p-3 rounded-md whitespace-pre-wrap">
                                {stream ? (
                                    <StreamingText content={data.content} speed={10} onComplete={onStreamComplete} />
                                ) : (
                                    data.content
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    if (data.type === "terminal") {
        return (
            <div className="my-4 rounded-lg overflow-hidden border bg-zinc-950 dark:bg-zinc-950 border-zinc-800 shadow-sm">
                <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border-b border-zinc-800">
                    <Terminal className="w-4 h-4 text-zinc-400" />
                    <span className="text-xs font-mono text-zinc-400">{data.title || "Terminal"}</span>
                </div>
                <div className="p-4 font-mono text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto">
                    {stream ? (
                        <StreamingText content={data.content} speed={5} onComplete={onStreamComplete} />
                    ) : (
                        data.content
                    )}
                </div>
            </div>
        );
    }

    if (data.type === "approval") {
        return (
            <div className="my-4 p-4 rounded-lg border border-amber-500/50 bg-amber-500/10 dark:bg-amber-950/20">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                    <div className="flex-1">
                        <h4 className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-1">
                            Permission Required
                        </h4>
                        <p className="text-sm text-foreground/80 mb-4">{data.content}</p>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="default"
                                className="bg-amber-600 hover:bg-amber-700 text-white border-none"
                                onClick={() => onApprove?.(false)}
                            >
                                Allow
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/50"
                                onClick={() => onApprove?.(true)}
                            >
                                Allow Always
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={onDeny}
                            >
                                Deny
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (data.type === "done") {
        return (
            <div className="my-2 flex items-center gap-2 text-green-600 dark:text-green-500 text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>{data.content}</span>
            </div>
        );
    }

    return null;
}
