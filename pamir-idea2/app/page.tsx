"use client";

import { useState } from "react";
import { ChatInput } from "@/components/shell/ChatInput";
import { Message, MessageList } from "@/components/shell/MessageList";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

import { EmptyState } from "@/components/shell/EmptyState";
import { Canvas, CanvasMode } from "@/components/shell/Canvas";
import { cn } from "@/lib/utils";

// Demo Clock App
const ClockApp = () => (
    <div className="flex flex-col items-center justify-center h-full">
        <div className="text-4xl font-bold tracking-tighter">12:45</div>
        <div className="text-xs mt-1 uppercase tracking-widest opacity-60">Wednesday</div>
        <div className="mt-4 border-t border-zinc-400 w-full pt-2 flex justify-between px-2">
            <span className="text-[10px]">72°F</span>
            <span className="text-[10px]">AQI 12</span>
        </div>
    </div>
);

// Mock Process Type reuse
interface Process {
    id: string;
    name: string;
    status: "running" | "stopped" | "error";
    cpu: number;
}

export default function Home() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isThinking, setIsThinking] = useState(false);

    // Canvas/Deck State (Unified Right Pane)
    const [isDeckOpen, setIsDeckOpen] = useState(false);
    const [deckMode, setDeckMode] = useState<CanvasMode>("device");
    const [canvasContent, setCanvasContent] = useState<React.ReactNode>(null);

    // System State
    const [activeProcesses, setActiveProcesses] = useState<Process[]>([]);

    // Model State
    const [selectedModelId, setSelectedModelId] = useState("claude-3-5-sonnet");

    const handleSend = async (content: string) => {
        // Add User Message
        const userMsg: Message = {
            id: uuidv4(),
            role: "user",
            content,
            timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, userMsg]);
        setIsThinking(true);

        // --- Intepret Intent (Mock) ---
        const isClock = content.toLowerCase().includes("clock") || content.toLowerCase().includes("time");
        const isMonitor = content.toLowerCase().includes("monitor") || content.toLowerCase().includes("cpu");

        // Simulate AI Latency
        setTimeout(() => {
            setIsThinking(false);

            let aiContent = "";

            if (isClock) {
                aiContent = "I've written a basic digital clock script for the e-ink display. I'm pushing it to the emulator now.";
                // Trigger Device Mode
                setTimeout(() => {
                    setDeckMode("device");
                    setCanvasContent(<ClockApp />);
                    setIsDeckOpen(true);
                }, 1000);

            } else if (isMonitor) {
                aiContent = "I've started the system monitoring daemon. You can view the dashboard in the web preview.";
                // Trigger Web Mode
                setTimeout(() => {
                    setDeckMode("web");
                    setCanvasContent(null);
                    setIsDeckOpen(true);
                }, 1000);

                // Start Mock Process
                if (!activeProcesses.find(p => p.name === "monitor.py")) {
                    setActiveProcesses(prev => [...prev, { id: "proc_8821", name: "monitor.py", status: "running", cpu: 12 }]);
                }

            } else {
                aiContent = "I can help with that. I'm analyzing your request.";

                // Demo: If discussing system/files, open Deck
                if (content.toLowerCase().includes("system") || content.toLowerCase().includes("process")) {
                    setDeckMode("system");
                    setIsDeckOpen(true);
                    aiContent = "Opening System Monitor.";
                } else if (content.toLowerCase().includes("file") || content.toLowerCase().includes("explorer")) {
                    setDeckMode("files");
                    setIsDeckOpen(true);
                    aiContent = "Here are the files in your project workspace.";
                }
            }

            const aiMsg: Message = {
                id: uuidv4(),
                role: "assistant",
                content: aiContent,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, aiMsg]);

        }, 1500);
    };

    const handleKillProcess = (id: string) => {
        setActiveProcesses(prev => prev.filter(p => p.id !== id));
        toast.error("Process Terminated", { description: `PID ${id} has been stopped.` });
    };

    const handleToggleSystemHeader = () => {
        // If Deck is closed, open it to System
        if (!isDeckOpen) {
            setDeckMode("system");
            setIsDeckOpen(true);
        } else {
            // If Deck is open..
            if (deckMode === "system") {
                // ...and in System mode, close it
                setIsDeckOpen(false);
            } else {
                // ...and in other mode, switch to System
                setDeckMode("system");
            }
        }
    }

    return (
        <main className="flex h-screen w-full bg-zinc-50 dark:bg-zinc-950 overflow-hidden font-sans text-zinc-900 dark:text-zinc-100">

            {/* CENTER PANE: Chat Interface (Flex-1) */}
            <div className="flex-1 flex flex-col relative h-full transition-all duration-300 ease-in-out">
                {/* Header */}
                <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-zinc-900 dark:bg-zinc-100 shadow-sm" />
                        <span className="font-semibold tracking-tight text-sm">Pamir OS // Shell</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleToggleSystemHeader}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-full shadow-sm border border-zinc-200 dark:border-zinc-800 transition-transform hover:scale-105 active:scale-95"
                        >
                            <div className={cn("w-2 h-2 rounded-full", isDeckOpen ? "bg-indigo-500" : (activeProcesses.length > 0 ? "bg-green-500 animate-pulse" : "bg-zinc-400"))} />
                            <span className="text-xs font-mono font-medium text-zinc-600 dark:text-zinc-300">
                                {isDeckOpen ? "System Active" : (activeProcesses.length > 0 ? `${activeProcesses.length} Running` : "System Normal")}
                            </span>
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                {messages.length === 0 ? (
                    <EmptyState onActionSelect={handleSend} />
                ) : (
                    <MessageList messages={messages} isThinking={isThinking} />
                )}

                {/* Input */}
                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background via-background to-transparent pb-8">
                    <ChatInput
                        onSend={handleSend}
                        disabled={isThinking}
                        selectedModelId={selectedModelId}
                        onModelChange={setSelectedModelId}
                    />
                </div>
            </div>

            {/* RIGHT PANE: Canvas (System Deck) */}
            <div className={cn(
                "transition-all duration-500 ease-in-out bg-zinc-50 dark:bg-zinc-950/50 border-l border-zinc-200 dark:border-zinc-800 z-30",
                isDeckOpen ? "w-[600px] translate-x-0 opacity-100" : "w-0 translate-x-full opacity-0 overflow-hidden border-l-0"
            )}>
                <Canvas
                    mode={deckMode}
                    content={canvasContent}
                    webUrl={deckMode === "web" ? "http://localhost:3000/monitor" : undefined}
                    isOpen={isDeckOpen}
                    onClose={() => setIsDeckOpen(false)}
                    activeProcesses={activeProcesses}
                    onKillProcess={handleKillProcess}
                />
            </div>
        </main >
    );
}