"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { DeviceSimulator } from "./DeviceSimulator";
import {
    Globe, Smartphone, Minimize2, TerminalSquare,
    Folder, FileJson, FileCode, FileText, ExternalLink, ChevronRight, ChevronDown,
    Activity, Ban, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export type CanvasMode = "device" | "web" | "files" | "system";

interface Process {
    id: string;
    name: string;
    status: "running" | "stopped" | "error";
    cpu: number;
}

interface CanvasProps {
    mode: CanvasMode;
    content: React.ReactNode; // For Device Mode
    webUrl?: string;          // For Web Mode
    isOpen: boolean;
    onClose: () => void;

    // System Props (Merged from SystemSidebar)
    activeProcesses?: Process[];
    onKillProcess?: (id: string) => void;
}

// --- MOCK DATA (Merged) ---
const FILES = [
    {
        name: "app", type: "folder", children: [
            { name: "main.py", type: "file", icon: FileCode },
            { name: "utils.py", type: "file", icon: FileCode },
            { name: "styles.css", type: "file", icon: FileText },
        ]
    },
    {
        name: "config", type: "folder", children: [
            { name: "settings.json", type: "file", icon: FileJson },
            { name: "secrets.env", type: "file", icon: LockIcon },
        ]
    },
    {
        name: "logs", type: "folder", children: [
            { name: "startup.log", type: "file", icon: FileText },
            { name: "error.log", type: "file", icon: FileText },
        ]
    },
    { name: "README.md", type: "file", icon: FileText },
];

function LockIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    )
}

function FileItem({ item, depth = 0 }: { item: any, depth?: number }) {
    const [isOpen, setIsOpen] = React.useState(true);
    const handleOpenVSCode = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.open("https://vscode.dev", "_blank");
    };

    return (
        <div>
            <div
                className={cn(
                    "flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer text-sm transition-colors group",
                    depth > 0 && "ml-4"
                )}
                onClick={() => item.type === "folder" && setIsOpen(!isOpen)}
            >
                {item.type === "folder" ? (
                    <>
                        {isOpen ? <ChevronDown className="w-3 h-3 text-zinc-400" /> : <ChevronRight className="w-3 h-3 text-zinc-400" />}
                        <Folder className="w-4 h-4 text-blue-500 fill-blue-500/20" />
                        <span className="font-medium flex-1 truncate">{item.name}</span>
                    </>
                ) : (
                    <>
                        <div className="w-3" />
                        {item.icon ? <item.icon className="w-4 h-4 text-zinc-500" /> : <FileText className="w-4 h-4 text-zinc-500" />}
                        <span className="text-zinc-600 dark:text-zinc-300 flex-1 truncate">{item.name}</span>
                        <Button
                            variant="ghost" size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={handleOpenVSCode}
                            title="Open in VS Code"
                        >
                            <ExternalLink className="w-3 h-3 text-zinc-400 hover:text-blue-500" />
                        </Button>
                    </>
                )}
            </div>
            {item.type === "folder" && isOpen && item.children && (
                <div>
                    {item.children.map((child: any) => (
                        <FileItem key={child.name} item={child} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}

export function Canvas({ mode, content, webUrl, isOpen, onClose, activeProcesses = [], onKillProcess }: CanvasProps) {
    const [activeMode, setActiveMode] = React.useState<CanvasMode>(mode);

    // Sync internal state if prop changes (allows parent to force switch)
    React.useEffect(() => {
        setActiveMode(mode);
    }, [mode]);

    if (!isOpen) return null;

    const navItemClass = (itemMode: CanvasMode) => cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
        activeMode === itemMode
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
    );

    return (
        <div className="h-full flex flex-col border-l bg-zinc-50/95 dark:bg-zinc-950/95 backdrop-blur-xl border-border/50 transition-all duration-500 ease-in-out">
            {/* Canvas Header (Deck Navigation) */}
            <div className="h-14 border-b flex items-center justify-between px-4 bg-background/50">
                <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
                    <button onClick={() => setActiveMode("device")} className={navItemClass("device")}>
                        <Smartphone className="w-3.5 h-3.5" /> Device
                    </button>
                    <button onClick={() => setActiveMode("web")} className={navItemClass("web")}>
                        <Globe className="w-3.5 h-3.5" /> Browser
                    </button>
                    <button onClick={() => setActiveMode("files")} className={navItemClass("files")}>
                        <Folder className="w-3.5 h-3.5" /> Files
                    </button>
                    <button onClick={() => setActiveMode("system")} className={navItemClass("system")}>
                        <Activity className="w-3.5 h-3.5" /> System
                    </button>
                </div>

                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-muted-foreground">
                    <Minimize2 className="w-4 h-4" />
                </Button>
            </div>

            {/* Canvas Body */}
            <div className="flex-1 overflow-hidden relative">

                {/* 1. DEVICE MODE */}
                {activeMode === "device" && (
                    <DeviceSimulator
                        content={content}
                        ledColor="bg-green-500 animate-pulse"
                    />
                )}

                {/* 2. WEB MODE */}
                {activeMode === "web" && (
                    <div className="w-full h-full bg-white flex flex-col">
                        <div className="h-8 bg-zinc-100 border-b flex items-center px-4 gap-2 shrink-0">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                            </div>
                            <div className="flex-1 mx-4 h-5 bg-white border rounded text-[10px] flex items-center px-2 text-zinc-400 font-mono">
                                {webUrl || "localhost:3000"}
                            </div>
                        </div>
                        <div className="flex-1 bg-white relative">
                            {webUrl ? (
                                <iframe src={webUrl} className="w-full h-full border-none" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-zinc-300">
                                    <Globe className="w-12 h-12 mb-4 opacity-50" />
                                    <span className="text-sm">No Active Web Process</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 3. FILES MODE */}
                {activeMode === "files" && (
                    <div className="h-full flex flex-col bg-background">
                        <div className="px-4 py-3 border-b border-border/50">
                            <h3 className="text-sm font-semibold">Project Files</h3>
                            <p className="text-xs text-muted-foreground">/Users/praneeth/pamir-idea2</p>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-1">
                            {FILES.map((file) => <FileItem key={file.name} item={file} />)}
                        </div>
                    </div>
                )}

                {/* 4. SYSTEM MODE */}
                {activeMode === "system" && (
                    <div className="h-full flex flex-col bg-background">
                        <div className="px-4 py-3 border-b border-border/50">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold">Active Processes</h3>
                                <span className={cn("text-xs px-2 py-0.5 rounded-full border", activeProcesses.length > 0 ? "bg-green-500/10 text-green-600 border-green-200" : "bg-zinc-100 text-zinc-500 border-zinc-200")}>
                                    {activeProcesses.length} Running
                                </span>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {activeProcesses.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-48 text-zinc-400 border-2 border-dashed rounded-xl">
                                    <TerminalSquare className="w-8 h-8 mb-2 opacity-50" />
                                    <span className="text-sm">System Idle</span>
                                </div>
                            ) : (
                                activeProcesses.map((proc) => (
                                    <div key={proc.id} className="flex items-center justify-between p-3 rounded-lg bg-card border shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-2 h-2 rounded-full animate-pulse", proc.status === "running" ? "bg-green-500" : "bg-red-500")} />
                                            <div>
                                                <div className="font-mono text-sm font-medium">{proc.name}</div>
                                                <div className="text-xs text-muted-foreground">CPU: {proc.cpu}% • ID: {proc.id}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-blue-500">
                                                <RefreshCw className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500"
                                                onClick={() => onKillProcess && onKillProcess(proc.id)}
                                            >
                                                <Ban className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="p-4 border-t border-border/50 bg-muted/20">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-muted-foreground">Memory Usage</span>
                                <span className="text-xs text-muted-foreground">1.2GB / 8GB</span>
                            </div>
                            <Progress value={15} className="h-2" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
