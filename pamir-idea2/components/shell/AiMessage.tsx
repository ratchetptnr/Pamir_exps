"use client";

import * as React from "react";
import { Message } from "./MessageList";
import { StreamingText } from "./StreamingText";
import { ActionBlock } from "./ActionBlock";
import { cn } from "@/lib/utils";

interface AiMessageProps {
    message: Message;
}

export function AiMessage({ message }: AiMessageProps) {
    // Stage 0: Main Content Streaming
    // Stage 1+: Actions Streaming (Index = Stage - 1)
    const [stage, setStage] = React.useState(0);
    const [completedStages, setCompletedStages] = React.useState<Set<number>>(new Set());

    // If message is old (not the last one?), we should probably skip animation?
    // For now, let's just animate. It's a demo.

    const handleStageComplete = (completedStage: number) => {
        setCompletedStages(prev => new Set(prev).add(completedStage));
        setStage(completedStage + 1);
    };

    return (
        <div className="flex-1 min-w-0">
            {/* Main Content */}
            <div className="text-base text-foreground leading-relaxed">
                {stage === 0 ? (
                    <StreamingText
                        content={message.content}
                        onComplete={() => handleStageComplete(0)}
                    />
                ) : (
                    // Logic to avoid re-rendering StreamingText when done?
                    // Actually, StreamingText handles "done" state, but we want to render static text once done for performance/stability.
                    <div className="whitespace-pre-wrap">{message.content}</div>
                )}
            </div>

            {/* Actions */}
            {message.actions && message.actions.length > 0 && (
                <div className="mt-4 space-y-4">
                    {message.actions.map((action, idx) => {
                        // Action index 0 corresponds to Stage 1.
                        const actionStage = idx + 1;

                        // If current stage is less than this action's stage, don't render yet.
                        if (stage < actionStage) return null;

                        const isStreaming = stage === actionStage;
                        const isDone = completedStages.has(actionStage);

                        return (
                            <ActionBlock
                                key={idx}
                                data={action}
                                stream={isStreaming}
                                onStreamComplete={() => handleStageComplete(actionStage)}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}
