import React, { useState, useMemo } from 'react';
import { PART_LIBRARY } from '../constants';
import { CyborgPart, PartSlot, Stats } from '../types';
import { Shield, Zap, Crosshair, ChevronRight, TrendingUp, TrendingDown, Minus, Syringe, Tag, ChevronDown, ChevronUp } from 'lucide-react';

interface PartSelectorProps {
    selectedSlot: PartSlot;
    currentPart: CyborgPart;
    onSelect: (part: CyborgPart) => void;
}

const PartSelector: React.FC<PartSelectorProps> = ({ selectedSlot, currentPart, onSelect }) => {
    const [hoveredPart, setHoveredPart] = useState<CyborgPart | null>(null);
    const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

    const availableParts = useMemo(() => {
        return PART_LIBRARY.filter(p => {
            if (selectedSlot === PartSlot.HEAD) return p.slot === PartSlot.HEAD;
            if (selectedSlot === PartSlot.CORE) return p.slot === PartSlot.CORE;
            if (selectedSlot === PartSlot.LEGS) return p.slot === PartSlot.LEGS;
            if (selectedSlot === PartSlot.LEFT_ARM || selectedSlot === PartSlot.RIGHT_ARM) {
                return p.slot === PartSlot.LEFT_ARM || p.slot === PartSlot.RIGHT_ARM;
            }
            return false;
        });
    }, [selectedSlot]);

    // Group by category
    const groupedParts = useMemo(() => {
        const groups: Record<string, CyborgPart[]> = {};
        availableParts.forEach(part => {
            if (!groups[part.category]) groups[part.category] = [];
            groups[part.category].push(part);
        });
        return groups;
    }, [availableParts]);

    const toggleCategory = (cat: string) => {
        setCollapsedCategories(prev => {
            const next = new Set(prev);
            if (next.has(cat)) next.delete(cat);
            else next.add(cat);
            return next;
        });
    };

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'prototype': return 'border-amber-500 text-amber-400 bg-amber-950/20';
            case 'legendary': return 'border-fuchsia-500 text-fuchsia-400 bg-fuchsia-950/20';
            case 'rare': return 'border-cyan-400 text-cyan-400 bg-cyan-950/20';
            default: return 'border-slate-600 text-slate-400 bg-slate-900/40';
        }
    };

    const getRarityLabel = (rarity: string) => {
        switch (rarity) {
            case 'prototype': return 'ILLEGAL';
            case 'legendary': return 'BLACK MKT';
            case 'rare': return 'MIL-GRADE';
            default: return 'STANDARD';
        }
    };

    const getRarityBorderClass = (rarity: string) => {
        switch (rarity) {
            case 'prototype': return 'border-amber-500/40';
            case 'legendary': return 'border-fuchsia-500/30';
            case 'rare': return 'border-cyan-500/30';
            default: return 'border-slate-700';
        }
    };

    const getCategoryIcon = (cat: string) => {
        if (cat.includes('Combat') || cat.includes('Weapon')) return '⚔';
        if (cat.includes('Neural') || cat.includes('Sensory')) return '🧠';
        if (cat.includes('Skull') || cat.includes('Armor')) return '🛡';
        if (cat.includes('Bio') || cat.includes('Heart') || cat.includes('Synth')) return '🧬';
        if (cat.includes('Reactor') || cat.includes('Power')) return '⚡';
        if (cat.includes('Endo') || cat.includes('Frame') || cat.includes('Exo')) return '🦴';
        if (cat.includes('Prosthetic') || cat.includes('Limb') || cat.includes('Augmented')) return '🦾';
        if (cat.includes('Utility') || cat.includes('Graft')) return '🔧';
        return '◈';
    };

    const StatCompare = ({ label, val, currentVal }: { label: string, val: number, currentVal: number }) => {
        if (val === 0) return null;
        const diff = val - currentVal;
        let color = "text-slate-500";
        let Icon = Minus;
        if (diff > 0) { color = "text-green-400"; Icon = TrendingUp; }
        if (diff < 0) { color = "text-red-400"; Icon = TrendingDown; }
        return (
            <div className="flex justify-between items-center text-[10px] w-full">
                <span className="text-slate-500 w-8">{label}</span>
                <span className="font-mono-tech">{val > 0 ? '+' : ''}{val}</span>
                <Icon size={10} className={color} />
            </div>
        )
    };

    const slotLabel = () => {
        switch (selectedSlot) {
            case PartSlot.HEAD: return 'CRANIUM';
            case PartSlot.CORE: return 'THORAX';
            case PartSlot.LEFT_ARM: return 'LEFT AUGMENT';
            case PartSlot.RIGHT_ARM: return 'RIGHT AUGMENT';
            case PartSlot.LEGS: return 'LOWER FRAME';
        }
    };

    const formatCredits = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

    return (
        <div className="flex flex-col h-full bg-[#050608] border-l border-cyan-900/30 relative">
            {/* Header */}
            <div className="p-4 border-b border-fuchsia-900/30 bg-black/40 backdrop-blur">
                <h2 className="font-display text-lg text-cyan-100 flex items-center gap-2">
                    <Syringe size={16} className="text-fuchsia-400" /> IMPLANT CATALOG
                </h2>
                <div className="text-[10px] font-mono-tech text-fuchsia-600/60 mt-1 uppercase tracking-widest">
                    SELECT AUGMENTATION // {slotLabel()}
                </div>
                <div className="text-[9px] font-mono-tech text-slate-600 mt-1">
                    {availableParts.length} IMPLANTS AVAILABLE • {Object.keys(groupedParts).length} CATEGORIES
                </div>
            </div>

            {/* Grid Area — Grouped by Category */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {(Object.entries(groupedParts) as [string, CyborgPart[]][]).map(([category, parts]) => {
                    const isCollapsed = collapsedCategories.has(category);
                    return (
                        <div key={category} className="mb-4">
                            {/* Category Header */}
                            <button
                                onClick={() => toggleCategory(category)}
                                className="w-full flex items-center justify-between px-2 py-1.5 mb-2 bg-slate-900/60 border border-slate-800/50 hover:border-fuchsia-800/40 transition-colors rounded-sm group"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">{getCategoryIcon(category)}</span>
                                    <span className="font-display text-[11px] tracking-widest text-slate-400 group-hover:text-fuchsia-300 uppercase">{category}</span>
                                    <span className="text-[9px] font-mono-tech text-slate-600">({parts.length})</span>
                                </div>
                                {isCollapsed ? <ChevronDown size={12} className="text-slate-600" /> : <ChevronUp size={12} className="text-slate-600" />}
                            </button>

                            {/* Parts within Category */}
                            {!isCollapsed && (
                                <div className="grid grid-cols-1 gap-2 ml-1">
                                    {parts.map(part => {
                                        const isSelected = currentPart.id === part.id;
                                        return (
                                            <button
                                                key={part.id}
                                                onClick={() => onSelect(part)}
                                                onMouseEnter={() => setHoveredPart(part)}
                                                onMouseLeave={() => setHoveredPart(null)}
                                                className={`
                                                relative group/item flex flex-col items-start text-left p-3 border-l-2 transition-all duration-200
                                                ${isSelected
                                                        ? 'border border-cyan-400 bg-cyan-950/40 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                                                        : `border ${getRarityBorderClass(part.rarity)} hover:border-fuchsia-500/60 hover:bg-slate-900/80`
                                                    }
                                            `}
                                            >
                                                {/* Rarity Tag */}
                                                <div className={`absolute top-0 right-0 px-2 py-0.5 text-[8px] font-mono-tech uppercase font-bold ${getRarityColor(part.rarity)}`}>
                                                    {getRarityLabel(part.rarity)}
                                                </div>

                                                <div className="font-display text-sm font-bold text-slate-200 mb-0.5 pr-16 group-hover/item:text-fuchsia-300 transition-colors">
                                                    {part.name}
                                                </div>

                                                {/* Price Tag */}
                                                <div className="flex items-center gap-1 mb-1.5">
                                                    <Tag size={9} className="text-yellow-500/70" />
                                                    <span className="text-[10px] font-mono-tech text-yellow-500/90">Ø {part.cost.toLocaleString()}</span>
                                                </div>

                                                <div className="w-full grid grid-cols-2 gap-x-4 gap-y-0.5 p-1.5 bg-black/40 rounded border border-slate-800/50">
                                                    <StatCompare label="STR" val={part.stats.strength} currentVal={isSelected ? part.stats.strength : currentPart.stats.strength} />
                                                    <StatCompare label="AGI" val={part.stats.agility} currentVal={isSelected ? part.stats.agility : currentPart.stats.agility} />
                                                    <StatCompare label="DEF" val={part.stats.defense} currentVal={isSelected ? part.stats.defense : currentPart.stats.defense} />
                                                    <StatCompare label="TEC" val={part.stats.tech} currentVal={isSelected ? part.stats.tech : currentPart.stats.tech} />
                                                </div>

                                                {/* Corners */}
                                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-current opacity-30" />
                                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-current opacity-30" />
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Hover Detail Panel */}
            <div className="h-36 border-t border-fuchsia-900/30 bg-[#020305] p-3 flex flex-col justify-between shrink-0">
                {hoveredPart ? (
                    <>
                        <div className="font-display text-fuchsia-400 text-[10px] tracking-widest mb-1">IMPLANT DOSSIER</div>
                        <div className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">{hoveredPart.description}</div>
                        <div className="mt-auto flex items-center gap-3 pt-1">
                            <div className="text-[10px] px-2 py-0.5 rounded border border-yellow-800/50 text-yellow-400 bg-yellow-950/20 font-mono-tech">
                                Ø {hoveredPart.cost.toLocaleString()} CREDITS
                            </div>
                            {hoveredPart.stats.energy !== 0 && (
                                <div className={`text-[10px] px-2 py-0.5 rounded border font-mono-tech ${hoveredPart.stats.energy > 0 ? 'border-green-800 text-green-400 bg-green-900/20' : 'border-orange-800 text-orange-400 bg-orange-900/20'}`}>
                                    PWR {hoveredPart.stats.energy > 0 ? '+' : ''}{hoveredPart.stats.energy}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-fuchsia-900/50 text-xs font-mono-tech animate-pulse">
                        HOVER TO INSPECT // SELECT TO IMPLANT
                    </div>
                )}
            </div>
        </div>
    );
};

export default PartSelector;