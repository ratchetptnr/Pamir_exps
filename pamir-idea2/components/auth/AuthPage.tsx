"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface AuthPageProps {
    onLogin: () => void;
    onSetup: () => void;
}

export function AuthPage({ onLogin, onSetup }: AuthPageProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Mock Auth Latency
        setTimeout(() => {
            setIsLoading(false);
            onLogin();
        }, 1500);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-sm space-y-8"
            >
                {/* Branding */}
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative w-24 h-24 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center overflow-hidden">
                        <Image
                            src="/PamirAI.png"
                            alt="Pamir AI Logo"
                            width={96}
                            height={96}
                            className="object-cover"
                            priority
                        />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Pamir OS</h1>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Ambient Intelligence Platform</p>
                    </div>
                </div>

                {/* Login Form */}
                <Card className="p-6 border-zinc-200 dark:border-zinc-800 shadow-sm bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-500 uppercase">Email Address</label>
                            <Input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-white dark:bg-zinc-950"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-500 uppercase">Password</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-white dark:bg-zinc-950"
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In to Device"}
                        </Button>
                    </form>
                </Card>

                {/* Setup Link */}
                <div className="text-center space-y-4">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-zinc-50 dark:bg-zinc-950 px-2 text-zinc-500">Or</span>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full" onClick={onSetup}>
                        Set Up New Device <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </div>

                <p className="text-center text-xs text-zinc-400">
                    Protected by Pamir Neural Hardware Security
                </p>
            </motion.div>
        </div>
    );
}
