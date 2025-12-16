"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Wifi, Smartphone, ArrowRight, Check, RefreshCw, Radio, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type OnboardingStep = "WELCOME" | "CONNECT_AP" | "WIFI_CONFIG" | "PROVISIONING" | "DISCOVERY" | "COMPLETE";

interface OnboardingFlowProps {
    onComplete: () => void;
    onBack?: () => void;
}

export function OnboardingFlow({ onComplete, onBack }: OnboardingFlowProps) {
    const [step, setStep] = useState<OnboardingStep>("WELCOME");
    const [wifiSSID, setWifiSSID] = useState("");
    const [wifiPassword, setWifiPassword] = useState("");
    const [provisionProgress, setProvisionProgress] = useState(0);

    // Mock SoftAP Detection
    useEffect(() => {
        if (step === "CONNECT_AP") {
            const timer = setTimeout(() => {
                // Simulate detecting user connected to Pamir-Setup
                setStep("WIFI_CONFIG");
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [step]);

    // Mock Provisioning
    useEffect(() => {
        if (step === "PROVISIONING") {
            const interval = setInterval(() => {
                setProvisionProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setStep("DISCOVERY");
                        return 100;
                    }
                    return prev + 2; // 2% every tick
                });
            }, 50);
            return () => clearInterval(interval);
        }
    }, [step]);

    return (
        <div className="fixed inset-0 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-6 z-50 font-sans">
            <div className="w-full max-w-md">
                <AnimatePresence mode="wait">

                    {/* STEP 1: WELCOME */}
                    {step === "WELCOME" && (
                        <motion.div
                            key="welcome"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="text-center space-y-6"
                        >
                            <div className="w-20 h-20 bg-zinc-900 dark:bg-zinc-100 rounded-2xl mx-auto shadow-xl flex items-center justify-center overflow-hidden">
                                <Image
                                    src="/PamirAI.png"
                                    alt="Pamir OS Logo"
                                    width={80}
                                    height={80}
                                    className="object-cover"
                                    priority
                                />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-2xl font-bold tracking-tight">Welcome to Pamir OS</h1>
                                <p className="text-zinc-500 dark:text-zinc-400">
                                    The center for your ambient computing world. <br />
                                    Let's get your first Node set up.
                                </p>
                            </div>
                            <Button size="lg" className="w-full" onClick={() => setStep("CONNECT_AP")}>
                                Set Up New Device <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                            {onBack && (
                                <Button variant="ghost" className="w-full text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300" onClick={onBack}>
                                    Back to Login
                                </Button>
                            )}
                        </motion.div>
                    )}

                    {/* STEP 2: CONNECT TO SOFT AP */}
                    {step === "CONNECT_AP" && (
                        <motion.div
                            key="connect_ap"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <div className="text-center space-y-2">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mx-auto flex items-center justify-center animate-pulse">
                                    <Wifi className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h2 className="text-xl font-semibold">Connect to Device</h2>
                                <p className="text-sm text-zinc-500">
                                    Go to your Wi-Fi settings and connect to:
                                </p>
                            </div>

                            <Card className="p-4 bg-zinc-100 dark:bg-zinc-900 border-dashed border-2 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Smartphone className="w-5 h-5 text-zinc-400" />
                                    <span className="font-mono font-medium">Pamir-Setup-X829</span>
                                </div>
                                <Button size="sm" variant="secondary" onClick={() => navigator.clipboard.writeText("pamir-setup")}>Copy</Button>
                            </Card>

                            <div className="flex items-center justify-center gap-2 text-xs text-zinc-400">
                                <RefreshCw className="w-3 h-3 animate-spin" />
                                Waiting for connection...
                            </div>

                            {/* Bypass for demo */}
                            <button onClick={() => setStep("WIFI_CONFIG")} className="w-full text-xs text-zinc-300 hover:text-zinc-500 pt-4">
                                (Simulate Connection)
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 3: WIFI CONFIG */}
                    {step === "WIFI_CONFIG" && (
                        <motion.div
                            key="wifi_config"
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-zinc-900 rounded-xl border shadow-lg overflow-hidden"
                        >
                            <div className="p-6 border-b">
                                <h2 className="text-lg font-semibold">Configure Wi-Fi</h2>
                                <p className="text-sm text-zinc-500">Tell the device which network to join.</p>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="space-y-3">
                                    <label className="text-xs font-medium text-zinc-500 uppercase">Select Network</label>
                                    {[
                                        { ssid: "Home_Network_5G", signal: 98 },
                                        { ssid: "Office_Guest", signal: 72 },
                                        { ssid: "Neighbor_WiFi", signal: 45 }
                                    ].map((net) => (
                                        <div
                                            key={net.ssid}
                                            onClick={() => setWifiSSID(net.ssid)}
                                            className={cn(
                                                "flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors",
                                                wifiSSID === net.ssid ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 ring-1 ring-blue-500" : "border-zinc-200 dark:border-zinc-800"
                                            )}
                                        >
                                            <span className="font-medium text-sm">{net.ssid}</span>
                                            <div className="flex items-center gap-2">
                                                {net.ssid.includes("Home") && <Lock className="w-3 h-3 text-zinc-400" />}
                                                <Wifi className="w-4 h-4 text-zinc-400" />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {wifiSSID && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2">
                                        <label className="text-xs font-medium text-zinc-500 uppercase">Password</label>
                                        <Input
                                            type="password"
                                            placeholder="Enter Wi-Fi Password"
                                            value={wifiPassword}
                                            onChange={(e) => setWifiPassword(e.target.value)}
                                        />
                                    </motion.div>
                                )}
                            </div>
                            <div className="p-4 bg-zinc-50 dark:bg-zinc-950/50 flex justify-end">
                                <Button disabled={!wifiSSID || wifiPassword.length < 3} onClick={() => setStep("PROVISIONING")}>
                                    Connect Device
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 4: PROVISIONING */}
                    {step === "PROVISIONING" && (
                        <motion.div
                            key="provisioning"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="text-center space-y-8"
                        >
                            <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="4" className="text-zinc-200 dark:text-zinc-800" fill="none" />
                                    <motion.circle
                                        cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="4" className="text-blue-500" fill="none"
                                        strokeDasharray="377"
                                        strokeDashoffset={377 - (377 * provisionProgress) / 100}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center font-mono text-xl font-bold">
                                    {provisionProgress}%
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium">Configuring Device...</h3>
                                <p className="text-sm text-zinc-500 mt-2">
                                    {provisionProgress < 30 ? "Sending Credentials..." :
                                        provisionProgress < 70 ? "Joining Home_Network_5G..." :
                                            "Verifying Connection..."}
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 5: DISCOVERY & COMPLETE */}
                    {(step === "DISCOVERY" || step === "COMPLETE") && (
                        <motion.div
                            key="discovery"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="text-center space-y-6"
                        >
                            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                                {/* Radar Ripples */}
                                <motion.div
                                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute inset-0 bg-green-500/20 rounded-full"
                                />
                                <motion.div
                                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                                    transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                                    className="absolute inset-0 bg-green-500/20 rounded-full"
                                />

                                <motion.div
                                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                                    className="relative z-10 w-24 h-24 bg-green-500 rounded-full shadow-lg shadow-green-500/30 flex items-center justify-center text-white"
                                >
                                    <Check className="w-10 h-10" />
                                </motion.div>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold">Device Found!</h2>
                                <p className="text-zinc-500">
                                    Successfully connected to <strong>Pamir Node (Raspberry Pi 5)</strong>
                                </p>
                                <div className="flex items-center justify-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 py-1 px-3 rounded-full w-fit mx-auto">
                                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                                    192.168.1.42
                                </div>
                            </div>

                            <Button size="lg" className="w-full bg-green-600 hover:bg-green-700" onClick={onComplete}>
                                Launch Shell
                            </Button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}
