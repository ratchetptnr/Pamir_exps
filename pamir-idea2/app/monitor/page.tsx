"use client";

import { Activity, Cpu, HardDrive, Wifi } from "lucide-react";

export default function MonitorPage() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 font-mono text-zinc-800 dark:text-zinc-200">
            <header className="mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Distiller // Monitor</h1>
                        <p className="text-xs text-zinc-500 mt-1">localhost:8000 • v0.9.2-alpha</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs uppercase tracking-wider text-green-600 dark:text-green-400">Online</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-2 gap-4">
                {/* CPU Card */}
                <div className="col-span-2 p-4 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 text-zinc-500">
                        <Cpu className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wider">CPU Usage</span>
                    </div>
                    <div className="flex items-end gap-2 mb-2">
                        <span className="text-3xl font-bold">12%</span>
                        <span className="text-xs text-zinc-500 mb-1">ARM Cortex-A53</span>
                    </div>
                    {/* Visual Bar Graph simulation */}
                    <div className="h-16 flex items-end gap-1">
                        {[10, 15, 8, 12, 20, 15, 12, 8, 5, 12, 18, 14, 10, 8, 12].map((h, i) => (
                            <div key={i} style={{ height: `${h * 3}%` }} className="flex-1 bg-zinc-900 dark:bg-zinc-100 opacity-20 hover:opacity-100 rounded-sm transition-all" />
                        ))}
                    </div>
                </div>

                {/* Memory */}
                <div className="p-4 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 text-zinc-500">
                        <Activity className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wider">Memory</span>
                    </div>
                    <div className="text-2xl font-bold mb-1">1.2 GB</div>
                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full w-[30%]" />
                    </div>
                    <div className="text-xs text-zinc-400 mt-2">Total: 4 GB LPDDR4</div>
                </div>

                {/* Storage */}
                <div className="p-4 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 text-zinc-500">
                        <HardDrive className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wider">Storage</span>
                    </div>
                    <div className="text-2xl font-bold mb-1">14 GB</div>
                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full w-[45%]" />
                    </div>
                    <div className="text-xs text-zinc-400 mt-2">Target: /dev/mmcblk0</div>
                </div>

                {/* Network */}
                <div className="col-span-2 p-4 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-md">
                            <Wifi className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                        </div>
                        <div>
                            <div className="text-sm font-bold">pamir-guest-5g</div>
                            <div className="text-xs text-zinc-500">192.168.1.42</div>
                        </div>
                    </div>
                    <div className="text-xs font-mono px-2 py-1 bg-green-500/10 text-green-600 rounded">
                        Connected
                    </div>
                </div>

            </div>
        </div>
    );
}
