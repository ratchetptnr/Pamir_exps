"use client";

import { motion } from "framer-motion";
import { Terminal, Clock, Activity, Command } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
    onActionSelect: (action: string) => void;
}

export function EmptyState({ onActionSelect }: EmptyStateProps) {
    const suggestions = [
        {
            icon: Clock,
            label: "Build a Clock",
            action: "Create a digital clock app for the display",
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
            borderColor: "border-blue-200 dark:border-blue-900",
        },
        {
            icon: Activity,
            label: "System Monitor",
            action: "Show me CPU and Memory usage",
            color: "text-green-500",
            bgColor: "bg-green-500/10",
            borderColor: "border-green-200 dark:border-green-900",
        },
        {
            icon: Terminal,
            label: "Run Script",
            action: "Run a python script to ping google.com",
            color: "text-amber-500",
            bgColor: "bg-amber-500/10",
            borderColor: "border-amber-200 dark:border-amber-900",
        },
        {
            icon: Command,
            label: "Custom Tool",
            action: "Help me build a new tool",
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
            borderColor: "border-purple-200 dark:border-purple-900",
        },
    ];

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
            >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-primary/20 to-primary/5 flex items-center justify-center shadow-inner">
                    <div className="w-8 h-8 rounded-full bg-primary/20 animate-pulse" />
                </div>
                <h1 className="text-3xl font-semibold tracking-tight mb-2">
                    Good Afternoon.
                </h1>
                <p className="text-muted-foreground text-lg">
                    What shall we build today?
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
                {suggestions.map((item, index) => (
                    <motion.button
                        key={item.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                        onClick={() => onActionSelect(item.action)}
                        className={cn(
                            "flex items-center gap-4 p-4 text-left rounded-xl border transition-all hover:shadow-md hover:-translate-y-0.5",
                            "bg-card hover:bg-accent/50",
                            item.borderColor
                        )}
                    >
                        <div className={cn("p-3 rounded-lg", item.bgColor, item.color)}>
                            <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="font-medium text-sm">{item.label}</div>
                            <div className="text-xs text-muted-foreground line-clamp-1">{item.action}</div>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
