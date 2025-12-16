"use client";

import { useEffect, useState } from "react";

interface StreamingTextProps {
    content: string;
    speed?: number; // ms per character
    onComplete?: () => void;
}

export function StreamingText({ content, speed = 15, onComplete }: StreamingTextProps) {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        setDisplayedText(""); // Reset when content changes
        let i = 0;

        const intervalId = setInterval(() => {
            if (i < content.length) {
                setDisplayedText((prev) => prev + content.charAt(i));
                i++;
            } else {
                clearInterval(intervalId);
                onComplete?.();
            }
        }, speed);

        return () => clearInterval(intervalId);
    }, [content, speed, onComplete]);

    return (
        <div className="whitespace-pre-wrap">
            {displayedText}
            {displayedText.length < content.length && (
                <span className="inline-block w-1.5 h-4 ml-0.5 align-middle bg-primary animate-pulse" />
            )}
        </div>
    );
}
