"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Wifi, Battery, Mic, Camera, Volume2, Cpu } from "lucide-react";

interface DeviceSimulatorProps {
    content?: React.ReactNode;
    ledColor?: string; // e.g. "bg-green-500", "bg-red-500"
    isCameraActive?: boolean;
    isMicActive?: boolean;
}

export function DeviceSimulator({
    content,
    ledColor = "bg-zinc-800",
    isCameraActive = false,
    isMicActive = false
}: DeviceSimulatorProps) {
    return (
        <div className="flex flex-col items-center justify-center h-full p-8 bg-zinc-100/50 dark:bg-zinc-900/50">
            {/* Device Chassis - Modeled after "Distiller Alpha" Sketch */}
            <div className="relative w-[320px] bg-zinc-200 dark:bg-zinc-800 rounded-[2rem] shadow-2xl border-4 border-zinc-300 dark:border-zinc-700 overflow-hidden flex flex-col p-6 gap-6 relative">

                {/* Top: RGB Status Strip */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1.5 rounded-b-lg bg-zinc-900/10 overflow-hidden">
                    <div className={cn("w-full h-full transition-colors duration-500 shadow-[0_0_10px_rgba(0,0,0,0.5)]", ledColor)} />
                </div>

                {/* Main Section: Screen */}
                <div className="relative z-10 flex flex-col gap-2">
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">Distiller Alpha</span>
                        <div className="flex gap-1.5">
                            <Wifi className="w-3 h-3 text-zinc-400" />
                            <Battery className="w-3 h-3 text-zinc-400" />
                        </div>
                    </div>

                    {/* 2.1" E-ink Display Container (~4:3 Aspect Ratio) */}
                    <div className="aspect-[4/3] w-full bg-[#EBEBEB] border-4 border-zinc-300 dark:border-zinc-600 rounded-xl shadow-inner overflow-hidden relative">
                        {/* Screen Content (The "App") */}
                        <div className="w-full h-full p-4 overflow-hidden text-zinc-900 selection:bg-zinc-300 font-mono flex flex-col">
                            {content || (
                                <div className="flex flex-col items-center justify-center h-full text-zinc-400/50 space-y-2">
                                    <Cpu className="w-8 h-8 opacity-20" />
                                    <span className="text-xs">No Signal</span>
                                </div>
                            )}
                        </div>

                        {/* Screen Glare Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
                    </div>
                </div>

                {/* Bottom Section: Aesthetic Grid (Simulator specific aesthetic) */}
                <div className="grid grid-cols-6 gap-2 px-2 opacity-50">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="w-2 h-2 rounded-full bg-zinc-400/30 dark:bg-zinc-950/30 mx-auto" />
                    ))}
                </div>

                {/* Peripheral Indicators (Simulated visual feedback) */}
                <div className="flex justify-between items-center px-4 pt-2 border-t border-zinc-300 dark:border-zinc-700/50">
                    <div className={cn("flex items-center gap-1.5 transition-opacity duration-300", isCameraActive ? "opacity-100 text-red-500" : "opacity-20 text-zinc-500")}>
                        <Camera className="w-4 h-4" />
                    </div>
                    <div className={cn("flex items-center gap-1.5 transition-opacity duration-300", isMicActive ? "opacity-100 text-amber-500" : "opacity-20 text-zinc-500")}>
                        <Mic className="w-4 h-4" />
                    </div>
                    <div className="opacity-20 text-zinc-500">
                        <Volume2 className="w-4 h-4" />
                    </div>
                </div>

            </div>

            {/* Shadow/Reflection beneath device */}
            <div className="w-[280px] h-4 bg-black/20 blur-xl rounded-[100%] mt-4" />
        </div>
    );
}
