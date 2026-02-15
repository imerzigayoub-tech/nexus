import React, { useState, useMemo } from 'react';
import { CyborgConfiguration, PartSlot, Stats, CyborgPart, AnalysisResult } from './types';
import { DEFAULT_PARTS, STARTING_CREDITS } from './constants';
import { analyzeCyborg, visualizeCyborg } from './services/geminiService';
import PartSelector from './components/PartSelector';
import Blueprint from './components/Blueprint';
import StatsRadar from './components/StatsRadar';
import { Terminal, RefreshCw, Zap, Activity, Cpu, Shield, Layers, Download, ChevronRight, AlertCircle, Scan, Dna } from 'lucide-react';

const App: React.FC = () => {
    const [config, setConfig] = useState<CyborgConfiguration>(DEFAULT_PARTS);
    const [activeSlot, setActiveSlot] = useState<PartSlot>(PartSlot.HEAD);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);

    // Stats Calculation
    const totalStats: Stats = useMemo(() => {
        const parts = Object.values(config) as CyborgPart[];
        return parts.reduce(
            (acc, part) => ({
                strength: acc.strength + part.stats.strength,
                agility: acc.agility + part.stats.agility,
                defense: acc.defense + part.stats.defense,
                tech: acc.tech + part.stats.tech,
                energy: acc.energy + part.stats.energy,
            }),
            { strength: 0, agility: 0, defense: 0, tech: 0, energy: 0 }
        );
    }, [config]);

    const totalCost = useMemo(() => (Object.values(config) as CyborgPart[]).reduce((a, b) => a + b.cost, 0), [config]);
    const remainingCredits = STARTING_CREDITS - totalCost;
    const budgetPercent = Math.min(100, (totalCost / STARTING_CREDITS) * 100);

    const handleRunBioscan = async () => {
        setIsAnalyzing(true);
        setAnalysis(null);
        try {
            const result = await analyzeCyborg(config);
            setAnalysis(result);
        } catch (e) {
            console.error("Bioscan error:", e);
        }
        setIsAnalyzing(false);
    };

    const handleGenerateVisual = async () => {
        setIsGeneratingImage(true);
        try {
            const url = await visualizeCyborg(config, "Cyberpunk");
            if (url) {
                setGeneratedImage(url);
            } else {
                console.warn("Concept art generation failed or returned no URL.");
            }
        } catch (e) {
            console.error("Visualization error:", e);
        }
        setIsGeneratingImage(false);
    };

    // --- SUB-COMPONENTS FOR LAYOUT ---

    const SlotButton = ({ slot, label, icon }: { slot: PartSlot, label: string, icon: string }) => {
        const isActive = activeSlot === slot;
        const part = config[slot];

        return (
            <button
                onClick={() => setActiveSlot(slot)}
                className={`w-full text-left p-3 mb-2 relative transition-all duration-300 clip-corner-2 border-l-2 group
                ${isActive ? 'bg-gradient-to-r from-cyan-900/30 to-fuchsia-900/10 border-cyan-400' : 'bg-[#0b0d14] border-slate-800 hover:border-fuchsia-500/50 hover:bg-[#11141d]'}
            `}
            >
                <div className="flex justify-between items-center mb-1">
                    <span className={`font-display text-xs tracking-widest ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-fuchsia-300'}`}>
                        {icon} {label}
                    </span>
                    {isActive && <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_5px_#22d3ee]" />}
                </div>
                <div className={`font-mono-tech text-[10px] truncate ${isActive ? 'text-white' : 'text-slate-400'}`}>
                    {part.name}
                </div>

                {/* Decorative Lines */}
                <div className={`absolute bottom-0 right-0 w-6 h-[1px] ${isActive ? 'bg-cyan-400' : 'bg-slate-800'}`} />
            </button>
        );
    };

    return (
        <div className="flex h-screen w-full bg-[#020202] text-cyan-50 bg-grid-pattern relative overflow-hidden">

            {/* --- COLUMN 1: NAVIGATION & STATUS (300px) --- */}
            <aside className="w-[300px] flex flex-col border-r border-cyan-900/30 bg-[#030406]/95 backdrop-blur z-20">
                {/* HEADER */}
                <div className="h-16 flex items-center px-6 border-b border-cyan-900/30">
                    <Dna className="text-fuchsia-400 mr-3 animate-pulse" size={24} />
                    <div>
                        <h1 className="font-display text-xl tracking-wider text-white">NEXUS</h1>
                        <div className="text-[9px] text-fuchsia-500/80 font-mono-tech tracking-[0.3em]">CYBERNETICS LAB v4.2</div>
                    </div>
                </div>

                {/* SLOT SELECTION */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    <div className="text-[10px] text-cyan-600 font-mono-tech mb-4 flex items-center gap-2">
                        <Layers size={10} /> AUGMENTATION_CONFIG
                    </div>

                    <SlotButton slot={PartSlot.HEAD} label="CRANIUM" icon="⬡" />
                    <SlotButton slot={PartSlot.CORE} label="THORAX" icon="◈" />
                    <SlotButton slot={PartSlot.LEFT_ARM} label="AUGMENT // L" icon="◧" />
                    <SlotButton slot={PartSlot.RIGHT_ARM} label="AUGMENT // R" icon="◨" />
                    <SlotButton slot={PartSlot.LEGS} label="LOWER FRAME" icon="⬢" />

                    {/* CREDITS BUDGET */}
                    <div className="mt-6 p-3 bg-yellow-950/5 border border-yellow-900/20 clip-corner-1">
                        <div className="text-[10px] text-yellow-600/80 font-mono-tech mb-2 flex items-center gap-1">Ø NEXUS CREDITS</div>
                        <div className="flex justify-between items-baseline mb-1">
                            <span className="font-display text-lg text-yellow-400">Ø {remainingCredits.toLocaleString()}</span>
                            <span className="text-[9px] font-mono-tech text-slate-600">of {STARTING_CREDITS.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mb-1">
                            <div
                                className={`h-full transition-all duration-500 rounded-full ${budgetPercent > 100 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : budgetPercent > 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                style={{ width: `${Math.min(budgetPercent, 100)}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-[9px] font-mono-tech">
                            <span className="text-slate-600">BUILD COST: Ø {totalCost.toLocaleString()}</span>
                            <span className={remainingCredits >= 0 ? 'text-green-600' : 'text-red-500'}>{remainingCredits >= 0 ? 'WITHIN BUDGET' : 'OVER BUDGET'}</span>
                        </div>
                    </div>

                    {/* TOTAL STATS WIDGET */}
                    <div className="mt-4 p-4 bg-cyan-950/10 border border-cyan-900/30 clip-corner-1">
                        <div className="text-[10px] text-fuchsia-500/70 font-mono-tech mb-2">BIOMETRIC_MATRIX</div>
                        <div className="h-40">
                            <StatsRadar stats={totalStats} />
                        </div>
                        <div className="flex justify-between mt-3 text-[10px] font-mono-tech text-slate-400 border-t border-cyan-900/30 pt-2">
                            <div className="flex items-center gap-1"><Zap size={10} className={totalStats.energy >= 0 ? 'text-green-500' : 'text-red-500'} /> POWER: <span className={totalStats.energy >= 0 ? 'text-green-500' : 'text-red-500'}>{totalStats.energy}</span></div>
                        </div>
                    </div>
                </div>

                {/* SYSTEM ACTIONS */}
                <div className="p-4 border-t border-cyan-900/30 bg-[#020202]">
                    <button
                        onClick={handleRunBioscan}
                        disabled={isAnalyzing}
                        className="w-full py-3 bg-cyan-900/20 border border-cyan-500/50 text-cyan-400 font-display text-xs tracking-widest hover:bg-cyan-500 hover:text-black transition-all clip-slant-right flex items-center justify-center gap-2 mb-2"
                    >
                        {isAnalyzing ? <RefreshCw className="animate-spin" size={14} /> : <Scan size={14} />}
                        {isAnalyzing ? 'SCANNING...' : 'RUN BIOSCAN'}
                    </button>
                    <button
                        onClick={handleGenerateVisual}
                        disabled={isGeneratingImage}
                        className="w-full py-2 bg-fuchsia-950/20 border border-fuchsia-700/30 text-fuchsia-300/70 font-mono-tech text-[10px] hover:text-white hover:border-fuchsia-500 transition-all flex items-center justify-center gap-2"
                    >
                        {isGeneratingImage ? <RefreshCw className="animate-spin" size={12} /> : <Download size={12} />}
                        RENDER CONCEPT ART
                    </button>
                </div>
            </aside>


            {/* --- COLUMN 2: MAIN VIEWPORT (Flex Grow) --- */}
            <main className="flex-1 relative bg-black flex flex-col">
                {/* Top Info Bar */}
                <div className="absolute top-0 left-0 right-0 h-10 flex items-center justify-between px-6 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none">
                    <div className="text-[10px] font-mono-tech text-cyan-700">NEURAL_FEED_01 [LIVE]</div>
                    <div className="flex gap-4">
                        <div className="text-[10px] font-mono-tech text-red-500 flex items-center gap-1"><div className="w-1 h-1 bg-red-500 rounded-full animate-ping" /> REC</div>
                    </div>
                </div>

                {/* MAIN CANVAS */}
                <div className="flex-1 relative overflow-hidden bg-[#050505]">
                    {generatedImage && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center p-10 animate-in fade-in zoom-in duration-500 bg-black">
                            <div className="relative border-2 border-fuchsia-500/20 p-2 shadow-[0_0_100px_rgba(192,38,211,0.1)] bg-black">
                                <img src={generatedImage} className="max-h-[80vh] object-contain" alt="Render" />
                                <button onClick={() => setGeneratedImage(null)} className="absolute top-4 right-4 bg-black/80 text-white p-2 border border-white/20 hover:bg-red-900/50 transition-colors"><RefreshCw size={16} /></button>
                            </div>
                        </div>
                    )}
                    <Blueprint config={config} activeSlot={activeSlot} onSlotClick={setActiveSlot} />
                </div>

                {/* Bottom Analysis Drawer (Conditional) */}
                {analysis && (
                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-[#030406]/95 backdrop-blur border-t border-fuchsia-500/30 animate-in slide-in-from-bottom duration-300 z-30 flex flex-col shadow-[0_-10px_50px_rgba(0,0,0,0.8)]">
                        <div className="flex justify-between items-center p-3 border-b border-cyan-900/30 bg-fuchsia-950/10">
                            <div className="flex items-center gap-2 text-fuchsia-400 font-display text-sm">
                                <Dna size={16} /> BIOSCAN REPORT: <span className="text-white">{analysis.codename}</span>
                            </div>
                            <button onClick={() => setAnalysis(null)} className="text-xs text-slate-500 hover:text-white">[CLOSE]</button>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8 font-mono-tech text-xs">
                            <div className="space-y-4">
                                <div>
                                    <div className="text-fuchsia-600 mb-1">COMBAT DESIGNATION</div>
                                    <div className="text-lg text-white font-display">{analysis.combatRole}</div>
                                </div>
                                <div>
                                    <div className="text-cyan-600 mb-1">THREAT ASSESSMENT</div>
                                    <div className="text-slate-300 leading-relaxed">{analysis.tacticalAnalysis}</div>
                                </div>
                            </div>
                            <div className="border-l border-cyan-900/30 pl-8 flex flex-col justify-center">
                                <div className="p-4 border border-red-900/50 bg-red-950/10 rounded">
                                    <div className="text-red-500 mb-1 animate-pulse">⚠ VULNERABILITY DETECTED</div>
                                    <div className="text-red-200">{analysis.weakness}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>


            {/* --- COLUMN 3: ARMORY (350px) --- */}
            <aside className="w-[350px] bg-[#050608] z-20 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
                <PartSelector
                    selectedSlot={activeSlot}
                    currentPart={config[activeSlot]}
                    onSelect={(part) => {
                        setConfig(prev => ({ ...prev, [activeSlot]: part }));
                        setAnalysis(null);
                        setGeneratedImage(null);
                    }}
                />
            </aside>

        </div>
    );
};

export default App;