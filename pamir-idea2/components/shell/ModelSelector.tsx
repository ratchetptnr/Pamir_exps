"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Cpu, Sparkles, Zap, Lock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// Define the available models and their metadata
const MODELS = [
    {
        id: "claude-3-5-sonnet",
        name: "Claude 3.5 Sonnet",
        provider: "Anthropic",
        icon: Sparkles,
        color: "text-orange-500",
        description: "Best for coding & reasoning",
    },
    {
        id: "gpt-4o",
        name: "GPT-4o",
        provider: "OpenAI",
        icon: Zap,
        color: "text-green-500",
        description: "Fast verbal reasoning",
    },
    {
        id: "gemini-1-5-pro",
        name: "Gemini 1.5 Pro",
        provider: "Google",
        icon: Cpu,
        color: "text-blue-500",
        description: "Large context window",
    },
];

interface ModelSelectorProps {
    selectedModelId: string;
    onModelChange: (modelId: string) => void;
    disabled?: boolean;
}

export function ModelSelector({ selectedModelId, onModelChange, disabled }: ModelSelectorProps) {
    const [isLoggingIn, setIsLoggingIn] = React.useState(false);
    const selectedModel = MODELS.find((m) => m.id === selectedModelId) || MODELS[0];

    const handleSelect = (model: typeof MODELS[0]) => {
        if (model.id === selectedModelId) return;

        // Simulate "Login" flow if switching providers (Mock Logic)
        if (model.provider === "OpenAI" && !isLoggingIn) {
            setIsLoggingIn(true);
            const toastId = toast.loading(`Connecting to ${model.provider}...`, {
                description: "Verifying credentials via browser redirect."
            });

            setTimeout(() => {
                toast.dismiss(toastId);
                toast.success(`Connected to ${model.name}`, {
                    description: "You are now authenticated.",
                    icon: <Lock className="w-4 h-4 text-green-500" />
                });
                setIsLoggingIn(false);
                onModelChange(model.id);
            }, 2000);
            return;
        }

        onModelChange(model.id);
        toast.success(`Switched to ${model.name}`);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                disabled={disabled || isLoggingIn}
                className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-fit justify-between items-center gap-2 h-9 px-3 rounded-full border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all font-mono text-xs data-[state=open]:bg-zinc-100 dark:data-[state=open]:bg-zinc-800"
                )}
            >
                {isLoggingIn ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                ) : (
                    <selectedModel.icon className={cn("w-3.5 h-3.5", selectedModel.color)} />
                )}
                <span className="truncate max-w-[120px] hidden sm:inline-block">
                    {isLoggingIn ? "Authenticating..." : selectedModel.name}
                </span>
                <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[280px]">
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs font-normal text-muted-foreground px-2 py-1.5">
                        Select Active Brain
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {MODELS.map((model) => (
                        <DropdownMenuItem
                            key={model.id}
                            onClick={() => handleSelect(model)}
                            className="flex items-start gap-3 p-3 focus:bg-zinc-100 dark:focus:bg-zinc-800 cursor-pointer"
                        >
                            <div className={cn("mt-0.5 p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border", model.id === selectedModelId ? "border-primary/20" : "border-transparent")}>
                                <model.icon className={cn("w-4 h-4", model.color)} />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-medium flex items-center gap-2">
                                    {model.name}
                                    {model.id === selectedModelId && <Check className="w-3 h-3 text-primary" />}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {model.description}
                                </span>
                            </div>
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-xs p-2 justify-center text-muted-foreground opacity-50 cursor-not-allowed">
                        <Lock className="w-3 h-3 mr-2" />
                        Add New Provider
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
