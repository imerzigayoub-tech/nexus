import { CyborgPart, PartSlot } from './types';

const B = { strength: 0, agility: 0, defense: 0, tech: 0, energy: 0 };

export const DEFAULT_PARTS: Record<PartSlot, CyborgPart> = {
  [PartSlot.HEAD]: {
    id: 'h_basic_cortex', name: 'Basic Neural Interface', slot: PartSlot.HEAD,
    description: 'Standard-issue cortical implant. Provides basic HUD overlay and comm uplink.',
    stats: { ...B, tech: 10, energy: -5 }, cost: 800, rarity: 'common', category: 'Neural Cortex'
  },
  [PartSlot.CORE]: {
    id: 'c_synth_heart', name: 'Synthetic Heart Mk.I', slot: PartSlot.CORE,
    description: 'Bio-mechanical cardiac pump. Sustains organic tissue and powers low-drain augmentations.',
    stats: { ...B, energy: 50, defense: 10 }, cost: 2400, rarity: 'common', category: 'Bioreactor'
  },
  [PartSlot.LEFT_ARM]: {
    id: 'la_prosthetic', name: 'Standard Prosthetic Arm', slot: PartSlot.LEFT_ARM,
    description: 'Mass-produced cybernetic limb replacement. Matches baseline human strength.',
    stats: { ...B, strength: 20, agility: -5, energy: -10 }, cost: 1200, rarity: 'common', category: 'Prosthetic Limb'
  },
  [PartSlot.RIGHT_ARM]: {
    id: 'ra_prosthetic', name: 'Precision Graft Arm', slot: PartSlot.RIGHT_ARM,
    description: 'Fine-motor cybernetic replacement with microsurgery-grade dexterity.',
    stats: { ...B, tech: 20, agility: 10, energy: -10 }, cost: 1200, rarity: 'common', category: 'Prosthetic Limb'
  },
  [PartSlot.LEGS]: {
    id: 'l_bipedal', name: 'Bipedal Synth Frame', slot: PartSlot.LEGS,
    description: 'Carbon-fiber endoskeletal legs. Factory-calibrated gait matches human locomotion.',
    stats: { ...B, agility: 10, strength: 10, energy: -15 }, cost: 1600, rarity: 'common', category: 'Bipedal Synth'
  }
};

// ═══════════════════════════════════════════════════════════════
//                   FULL IMPLANT CATALOG
//  Prices in Ø (Nexus Credits). Organized by slot + category.
// ═══════════════════════════════════════════════════════════════

export const PART_LIBRARY: CyborgPart[] = [

  // ╔══════════════════════════════════════════╗
  // ║          CRANIUM / HEAD UNITS            ║
  // ╚══════════════════════════════════════════╝

  // — Neural Cortex —
  DEFAULT_PARTS[PartSlot.HEAD],
  {
    id: 'h_synapse_crown', name: 'Synapse Crown', slot: PartSlot.HEAD,
    description: 'Neural-lace headband accelerating cognition to post-human levels. Risk of ego-death on overload.',
    stats: { ...B, tech: 45, agility: 20, energy: -30 }, cost: 7200, rarity: 'rare', category: 'Neural Cortex'
  },
  {
    id: 'h_hivemind', name: 'Hivemind Cortex', slot: PartSlot.HEAD,
    description: 'Mesh-networked AI co-processor. Links consciousness with allied cyborg units for swarm tactics.',
    stats: { ...B, tech: 50, defense: 15, strength: 10, energy: -25 }, cost: 14400, rarity: 'legendary', category: 'Neural Cortex'
  },
  {
    id: 'h_ghost_protocol', name: 'Ghost Protocol Core', slot: PartSlot.HEAD,
    description: 'Classified black-site sentient AI implant. Overwrites personality in emergencies. Banned in 47 nations.',
    stats: { ...B, tech: 80, energy: -50, defense: -20 }, cost: 32000, rarity: 'prototype', category: 'Neural Cortex'
  },
  {
    id: 'h_precog_lobe', name: 'Precognition Lobe', slot: PartSlot.HEAD,
    description: 'Quantum-entangled temporal processor. Predicts enemy actions 0.3 seconds before they occur.',
    stats: { ...B, tech: 60, agility: 30, energy: -40 }, cost: 22000, rarity: 'prototype', category: 'Neural Cortex'
  },

  // — Sensory Array —
  {
    id: 'h_chrome_visor', name: 'Chrome Reflex Visor', slot: PartSlot.HEAD,
    description: 'Polished titanium faceplate with thermal/UV optics. Split-second threat assessment.',
    stats: { ...B, agility: 15, tech: 15, defense: -5, energy: -5 }, cost: 2000, rarity: 'common', category: 'Sensory Array'
  },
  {
    id: 'h_sniper_optic', name: 'Hawkeye Targeting Implant', slot: PartSlot.HEAD,
    description: 'Retinal implant: 40x zoom, ballistic trajectory overlay, facial recognition database.',
    stats: { ...B, tech: 35, agility: 5, energy: -15 }, cost: 5200, rarity: 'rare', category: 'Sensory Array'
  },
  {
    id: 'h_compound_lens', name: 'Compound Optics Array', slot: PartSlot.HEAD,
    description: 'Multi-spectrum visual cortex with 360° peripheral awareness. Inspired by insect biology.',
    stats: { ...B, agility: 25, tech: 20, energy: -10 }, cost: 4400, rarity: 'rare', category: 'Sensory Array'
  },
  {
    id: 'h_sonar_suite', name: 'Echolocation Suite', slot: PartSlot.HEAD,
    description: 'Ultrasonic pulse emitters in the jaw. See through walls, darkness, and smoke in 3D wireframe.',
    stats: { ...B, tech: 25, agility: 15, energy: -12 }, cost: 3600, rarity: 'rare', category: 'Sensory Array'
  },
  {
    id: 'h_infrared_dome', name: 'Thermal Dome Mk.III', slot: PartSlot.HEAD,
    description: 'Full-spectrum infrared scanner. Detects body heat through 2m of concrete.',
    stats: { ...B, tech: 20, agility: 10, energy: -8 }, cost: 2800, rarity: 'common', category: 'Sensory Array'
  },

  // — Synthetic Skull —
  {
    id: 'h_armored_skull', name: 'Reinforced Cranial Shell', slot: PartSlot.HEAD,
    description: 'Tungsten-carbide skull replacement. Near-indestructible but adds significant weight.',
    stats: { ...B, defense: 40, agility: -10, strength: 5, energy: -10 }, cost: 3200, rarity: 'common', category: 'Synthetic Skull'
  },
  {
    id: 'h_ceramic_plate', name: 'Ceramic Ballistic Plate', slot: PartSlot.HEAD,
    description: 'Lightweight boron-carbide cranial armor. Stops rifle rounds. Shatters after heavy impact.',
    stats: { ...B, defense: 30, agility: -3, energy: -5 }, cost: 2400, rarity: 'common', category: 'Synthetic Skull'
  },
  {
    id: 'h_adamantine', name: 'Adamantine Skull Cap', slot: PartSlot.HEAD,
    description: 'Lab-grown metamaterial cranium. Absorbs kinetic energy and converts it to heat dissipation.',
    stats: { ...B, defense: 55, strength: 10, agility: -15, energy: -15 }, cost: 18000, rarity: 'legendary', category: 'Synthetic Skull'
  },

  // ╔══════════════════════════════════════════╗
  // ║           THORAX / CORE UNITS            ║
  // ╚══════════════════════════════════════════╝

  // — Bioreactor —
  DEFAULT_PARTS[PartSlot.CORE],
  {
    id: 'c_combustion', name: 'Internal Combustion Reactor', slot: PartSlot.CORE,
    description: 'Crude methane-fueled power cell. Burns hot, runs loud, never quits.',
    stats: { ...B, strength: 30, energy: 20, tech: -10, agility: -5 }, cost: 1200, rarity: 'common', category: 'Bioreactor'
  },
  {
    id: 'c_ion_cell', name: 'Ion Cell Battery Array', slot: PartSlot.CORE,
    description: 'High-density energy clusters woven through the ribcage. Silent, volatile if breached.',
    stats: { ...B, energy: 40, agility: 5, defense: -5 }, cost: 2000, rarity: 'common', category: 'Bioreactor'
  },
  {
    id: 'c_antimatter', name: 'Antimatter Siphon Core', slot: PartSlot.CORE,
    description: 'Harvests vacuum energy through micro-singularity containment. Meltdown risk: non-trivial.',
    stats: { ...B, energy: 100, strength: 10, tech: 30, defense: -10 }, cost: 28000, rarity: 'prototype', category: 'Bioreactor'
  },
  {
    id: 'c_solar_spine', name: 'Solar Spine Array', slot: PartSlot.CORE,
    description: 'Photovoltaic cells embedded along the spine. Free energy in daylight, useless at night.',
    stats: { ...B, energy: 35, tech: 5, defense: -3 }, cost: 1600, rarity: 'common', category: 'Bioreactor'
  },
  {
    id: 'c_thermoelectric', name: 'Thermoelectric Converter', slot: PartSlot.CORE,
    description: 'Harvests body heat differential for low-grade sustained power. Never runs dry.',
    stats: { ...B, energy: 25, defense: 5 }, cost: 1800, rarity: 'common', category: 'Bioreactor'
  },

  // — Synthetic Heart —
  {
    id: 'c_plasma_heart', name: 'Plasma Heart', slot: PartSlot.CORE,
    description: 'Genetically grown bio-fusion organ. Self-healing tissue regeneration and immense stamina.',
    stats: { ...B, strength: 25, agility: 15, energy: 30, defense: 10 }, cost: 9600, rarity: 'rare', category: 'Synthetic Heart'
  },
  {
    id: 'c_nanite_weave', name: 'Nanite-Weave Subframe', slot: PartSlot.CORE,
    description: 'Active nanobot colony inhabiting the dermal layer. Self-repairs surface damage in real-time.',
    stats: { ...B, defense: 40, tech: 20, energy: 10 }, cost: 16000, rarity: 'legendary', category: 'Synthetic Heart'
  },
  {
    id: 'c_venom_pump', name: 'Venom Pump System', slot: PartSlot.CORE,
    description: 'Bioengineered toxin glands integrated into the circulatory system. Touch becomes lethal.',
    stats: { ...B, strength: 20, tech: 15, agility: 10, energy: -10 }, cost: 8000, rarity: 'rare', category: 'Synthetic Heart'
  },
  {
    id: 'c_adrenaline', name: 'Adrenaline Surge Regulator', slot: PartSlot.CORE,
    description: 'Neural-linked hormone injector. Triggers controlled berserker state for 90 seconds.',
    stats: { ...B, strength: 35, agility: 25, defense: -15, energy: -20 }, cost: 6400, rarity: 'rare', category: 'Synthetic Heart'
  },

  // — Endoskeleton —
  {
    id: 'c_titanium_endo', name: 'Titanium Endoskeleton', slot: PartSlot.CORE,
    description: 'Full torso exo-frame replacement. Walking fortress of alloy.',
    stats: { ...B, defense: 50, strength: 15, agility: -20, energy: -15 }, cost: 6400, rarity: 'rare', category: 'Endoskeleton'
  },
  {
    id: 'c_ghost_shell', name: 'Ghost Shell Chassis', slot: PartSlot.CORE,
    description: 'Meta-material ribcage that bends visible light. Full optical camouflage.',
    stats: { ...B, agility: 30, tech: 40, defense: -10, energy: -20 }, cost: 14400, rarity: 'legendary', category: 'Endoskeleton'
  },
  {
    id: 'c_carbon_ribcage', name: 'Carbon-Fiber Ribcage', slot: PartSlot.CORE,
    description: 'Lightweight structural replacement. 60% weight reduction with no loss in structural integrity.',
    stats: { ...B, agility: 20, defense: 20, energy: -5 }, cost: 4000, rarity: 'common', category: 'Endoskeleton'
  },
  {
    id: 'c_berserker_frame', name: 'Berserker Assault Frame', slot: PartSlot.CORE,
    description: 'Over-engineered combat chassis. Hydraulic muscle amplifiers across every joint.',
    stats: { ...B, strength: 45, defense: 25, agility: -10, energy: -25 }, cost: 20000, rarity: 'legendary', category: 'Endoskeleton'
  },

  // ╔══════════════════════════════════════════╗
  // ║        LEFT ARM / AUGMENT UNITS          ║
  // ╚══════════════════════════════════════════╝

  // — Prosthetic Limb —
  DEFAULT_PARTS[PartSlot.LEFT_ARM],
  {
    id: 'la_reflex_arm', name: 'Neural Reflex Arm', slot: PartSlot.LEFT_ARM,
    description: 'Servo-enhanced limb with 5ms reaction time. Catches bullets. Literally.',
    stats: { ...B, agility: 30, strength: 10, energy: -15 }, cost: 4000, rarity: 'rare', category: 'Prosthetic Limb'
  },
  {
    id: 'la_titan_arm', name: 'Titan-Class Heavy Arm', slot: PartSlot.LEFT_ARM,
    description: 'Oversized industrial arm rated for 2-ton lifting capacity. Not subtle.',
    stats: { ...B, strength: 50, defense: 15, agility: -20, energy: -20 }, cost: 5600, rarity: 'rare', category: 'Prosthetic Limb'
  },
  {
    id: 'la_skeletal_graft', name: 'Skeletal Wire Graft', slot: PartSlot.LEFT_ARM,
    description: 'Minimalist wire-frame prosthetic. Extremely lightweight, poor durability.',
    stats: { ...B, agility: 20, energy: -3, defense: -10 }, cost: 600, rarity: 'common', category: 'Prosthetic Limb'
  },

  // — Combat Augment —
  {
    id: 'la_absorb_shield', name: 'Kinetic Absorber Shield', slot: PartSlot.LEFT_ARM,
    description: 'Forearm-mounted force-field. Converts incoming kinetic energy into stored charge.',
    stats: { ...B, defense: 45, strength: 10, agility: -15, energy: -10 }, cost: 3200, rarity: 'common', category: 'Combat Augment'
  },
  {
    id: 'la_plasma_projector', name: 'Integrated Plasma Projector', slot: PartSlot.LEFT_ARM,
    description: 'Palm-mounted plasma emitter concealed beneath synthetic skin. Melts armored plating.',
    stats: { ...B, strength: 15, tech: 25, energy: -40 }, cost: 12000, rarity: 'legendary', category: 'Combat Augment'
  },
  {
    id: 'la_micro_rockets', name: 'Micro-Rocket Launcher Arm', slot: PartSlot.LEFT_ARM,
    description: 'Forearm housing with retractable micro-munition swarm. Six shots, auto-tracking.',
    stats: { ...B, strength: 30, tech: 10, energy: -20 }, cost: 6000, rarity: 'rare', category: 'Combat Augment'
  },
  {
    id: 'la_emp_gauntlet', name: 'EMP Discharge Gauntlet', slot: PartSlot.LEFT_ARM,
    description: 'Electromagnetic pulse emitter. Disables electronics in a 5m radius. Fries your own implants too.',
    stats: { ...B, tech: 40, energy: -35, defense: -5 }, cost: 8800, rarity: 'rare', category: 'Combat Augment'
  },
  {
    id: 'la_cryo_fist', name: 'Cryo-Thermal Fist', slot: PartSlot.LEFT_ARM,
    description: 'Flash-freezes anything on contact to -80°C. Shatters frozen targets with follow-up strike.',
    stats: { ...B, strength: 25, tech: 15, energy: -25, agility: -5 }, cost: 7200, rarity: 'rare', category: 'Combat Augment'
  },

  // — Utility Graft —
  {
    id: 'la_industrial_graft', name: 'Industrial Power Graft', slot: PartSlot.LEFT_ARM,
    description: 'Heavy-duty construction arm with diamond-tipped implements. Not combat-designed.',
    stats: { ...B, strength: 40, defense: 10, agility: -10, tech: -5 }, cost: 4000, rarity: 'common', category: 'Utility Graft'
  },
  {
    id: 'la_med_arm', name: 'Field Surgery Arm', slot: PartSlot.LEFT_ARM,
    description: 'Integrated scalpels, cauterizer, and nano-suture dispenser. Performs surgery mid-combat.',
    stats: { ...B, tech: 30, agility: 15, energy: -10 }, cost: 5200, rarity: 'rare', category: 'Utility Graft'
  },
  {
    id: 'la_holo_projector', name: 'Holographic Projector Arm', slot: PartSlot.LEFT_ARM,
    description: 'Projects hard-light decoys from the forearm. Maximum 3 simultaneous copies.',
    stats: { ...B, tech: 35, agility: 10, energy: -20 }, cost: 8000, rarity: 'legendary', category: 'Utility Graft'
  },

  // — Bio-Synth —
  {
    id: 'la_morpho_arm', name: 'Liquid Metal Morpho-Arm', slot: PartSlot.LEFT_ARM,
    description: 'Shape-memory alloy limb that restructures on command. Blade, whip, or grappling hook.',
    stats: { ...B, agility: 35, strength: 10, tech: 10 }, cost: 14000, rarity: 'prototype', category: 'Bio-Synth'
  },
  {
    id: 'la_organic_tendril', name: 'Bio-Organic Tendril', slot: PartSlot.LEFT_ARM,
    description: 'Lab-grown prehensile appendage. 3m extensible reach. Regenerates if severed.',
    stats: { ...B, agility: 25, strength: 15, defense: -5 }, cost: 9600, rarity: 'legendary', category: 'Bio-Synth'
  },

  // ╔══════════════════════════════════════════╗
  // ║       RIGHT ARM / AUGMENT UNITS          ║
  // ╚══════════════════════════════════════════╝

  // — Prosthetic Limb —
  DEFAULT_PARTS[PartSlot.RIGHT_ARM],
  {
    id: 'ra_reinforced', name: 'Reinforced Alloy Arm', slot: PartSlot.RIGHT_ARM,
    description: 'Military-spec titanium arm with shock absorbers in every joint.',
    stats: { ...B, strength: 25, defense: 15, energy: -10 }, cost: 2800, rarity: 'common', category: 'Prosthetic Limb'
  },
  {
    id: 'ra_stealth_limb', name: 'Stealth Composite Limb', slot: PartSlot.RIGHT_ARM,
    description: 'Radar-absorbent polymer skin over carbon-fiber bones. Invisible to scanners.',
    stats: { ...B, agility: 25, tech: 10, energy: -8 }, cost: 3600, rarity: 'rare', category: 'Prosthetic Limb'
  },

  // — Combat Augment —
  {
    id: 'ra_mono_blade', name: 'Mono-Edge Retractable Blade', slot: PartSlot.RIGHT_ARM,
    description: 'Forearm-concealed monomolecular blade. Extends through the wrist at thought-speed.',
    stats: { ...B, strength: 40, agility: 20, energy: -5 }, cost: 5600, rarity: 'rare', category: 'Combat Augment'
  },
  {
    id: 'ra_ballistic', name: 'Ballistic Coil Arm', slot: PartSlot.RIGHT_ARM,
    description: 'Electromagnetic accelerator in the forearm. Fires synthetic bone-spike projectiles.',
    stats: { ...B, strength: 25, agility: -5, energy: -10, tech: 5 }, cost: 4800, rarity: 'rare', category: 'Combat Augment'
  },
  {
    id: 'ra_piston_fist', name: 'Pneumatic Piston Gauntlet', slot: PartSlot.RIGHT_ARM,
    description: 'Hydraulic ram fist. 2,000 PSI concussive force per strike. Shatters concrete.',
    stats: { ...B, strength: 60, defense: 10, agility: -10, energy: -20 }, cost: 9600, rarity: 'legendary', category: 'Combat Augment'
  },
  {
    id: 'ra_railgun_arm', name: 'Railgun Implant Arm', slot: PartSlot.RIGHT_ARM,
    description: 'Full-arm magnetic accelerator cannon. Infinite range. Catastrophic recoil.',
    stats: { ...B, strength: 50, tech: 30, energy: -50, agility: -15 }, cost: 26000, rarity: 'prototype', category: 'Combat Augment'
  },
  {
    id: 'ra_chain_whip', name: 'Nanowire Chain Whip', slot: PartSlot.RIGHT_ARM,
    description: 'Retractable 4m monofilament whip stored in the forearm. Cuts through steel girders.',
    stats: { ...B, strength: 35, agility: 15, energy: -8 }, cost: 6400, rarity: 'rare', category: 'Combat Augment'
  },
  {
    id: 'ra_sonic_cannon', name: 'Sonic Disruptor Arm', slot: PartSlot.RIGHT_ARM,
    description: 'Focused infrasound projector. Liquefies internal organs at close range.',
    stats: { ...B, strength: 30, tech: 20, energy: -30, defense: -5 }, cost: 11200, rarity: 'legendary', category: 'Combat Augment'
  },

  // — Utility Graft —
  {
    id: 'ra_hacker_jack', name: 'Neural Jack Interface', slot: PartSlot.RIGHT_ARM,
    description: 'Direct-connect hacking probe. Bypasses firewalls through physical neural injection.',
    stats: { ...B, tech: 50, energy: -15, strength: -5 }, cost: 6800, rarity: 'rare', category: 'Utility Graft'
  },
  {
    id: 'ra_fabricator', name: 'Nano-Fabricator Arm', slot: PartSlot.RIGHT_ARM,
    description: 'Builds small objects from raw materials stored in internal reservoirs. Tools, lockpicks, keys.',
    stats: { ...B, tech: 40, agility: 5, energy: -15 }, cost: 8800, rarity: 'legendary', category: 'Utility Graft'
  },
  {
    id: 'ra_grapple', name: 'Grapple-Launcher Prosthetic', slot: PartSlot.RIGHT_ARM,
    description: 'Pneumatic grappling hook with 50m synthetic-silk tether. Recoil-winch rated for 300kg.',
    stats: { ...B, agility: 30, strength: 10, energy: -5 }, cost: 2400, rarity: 'common', category: 'Utility Graft'
  },

  // ╔══════════════════════════════════════════╗
  // ║       LOWER FRAME / LEG UNITS            ║
  // ╚══════════════════════════════════════════╝

  // — Bipedal Synth —
  DEFAULT_PARTS[PartSlot.LEGS],
  {
    id: 'l_spring_carbon', name: 'Spring-Loaded Carbon Legs', slot: PartSlot.LEGS,
    description: 'Reverse-joint digitigrade legs. Explosive jumps and 80km/h sprinting.',
    stats: { ...B, agility: 40, strength: 5, defense: -5, energy: -10 }, cost: 4000, rarity: 'common', category: 'Bipedal Synth'
  },
  {
    id: 'l_silent_walker', name: 'Silent Walker Mk.IV', slot: PartSlot.LEGS,
    description: 'Noise-dampened prosthetic legs. Footfalls produce zero decibels. Assassin-grade.',
    stats: { ...B, agility: 30, tech: 10, energy: -8 }, cost: 3200, rarity: 'rare', category: 'Bipedal Synth'
  },
  {
    id: 'l_shock_absorber', name: 'Shock Absorber Struts', slot: PartSlot.LEGS,
    description: 'Piston-dampened legs. Survive falls from any height. Walk through explosions.',
    stats: { ...B, defense: 25, strength: 15, agility: 5, energy: -10 }, cost: 2800, rarity: 'common', category: 'Bipedal Synth'
  },
  {
    id: 'l_marathon', name: 'Marathon Endurance Frame', slot: PartSlot.LEGS,
    description: 'Ultra-efficient locomotion system. Run for 72 hours straight without power cell drain.',
    stats: { ...B, agility: 20, energy: 15, strength: 5 }, cost: 2000, rarity: 'common', category: 'Bipedal Synth'
  },

  // — Exo-Frame —
  {
    id: 'l_tank_treads', name: 'Tracked Assault Platform', slot: PartSlot.LEGS,
    description: 'Full lower-body replacement with armored tank treads. Cannot be knocked down.',
    stats: { ...B, defense: 30, strength: 20, agility: -30, energy: -20 }, cost: 4800, rarity: 'rare', category: 'Exo-Frame'
  },
  {
    id: 'l_mag_lev', name: 'Magnetic Levitation Frame', slot: PartSlot.LEGS,
    description: 'Anti-gravity propulsion. Floats 30cm above any ferrous surface. Silent movement.',
    stats: { ...B, agility: 50, tech: 10, energy: -40, defense: -10 }, cost: 18000, rarity: 'legendary', category: 'Exo-Frame'
  },
  {
    id: 'l_serpentine', name: 'Serpentine Tail Frame', slot: PartSlot.LEGS,
    description: 'Lower body replaced with armored serpentine tail. Crushes obstacles. Coils for ambush.',
    stats: { ...B, defense: 35, strength: 20, agility: -10 }, cost: 12000, rarity: 'legendary', category: 'Exo-Frame'
  },
  {
    id: 'l_mecha_centaur', name: 'Centaur Quadruped Frame', slot: PartSlot.LEGS,
    description: 'Four-legged heavy platform. Stable weapons platform. Terrifying to behold.',
    stats: { ...B, strength: 30, defense: 25, agility: -15, energy: -20 }, cost: 16000, rarity: 'legendary', category: 'Exo-Frame'
  },

  // — Augmented Limb —
  {
    id: 'l_spider_graft', name: 'Spider-Graft Quadrupod', slot: PartSlot.LEGS,
    description: 'Four articulated carbon-fiber legs. Wall-crawling and 360° directional movement.',
    stats: { ...B, agility: 30, defense: 10, strength: 10, tech: 10 }, cost: 7200, rarity: 'rare', category: 'Augmented Limb'
  },
  {
    id: 'l_gyro_wheels', name: 'Gyroscopic Inline System', slot: PartSlot.LEGS,
    description: 'Internal roller wheels in the calves. Toggle between walking and high-speed skating.',
    stats: { ...B, agility: 35, energy: -5, defense: -5 }, cost: 2800, rarity: 'common', category: 'Augmented Limb'
  },
  {
    id: 'l_hydraulic_jump', name: 'Hydraulic Leap Pistons', slot: PartSlot.LEGS,
    description: 'Dual-piston calves enabling 15m vertical jumps. Devastating drop-kicks.',
    stats: { ...B, agility: 35, strength: 20, defense: -10, energy: -15 }, cost: 5600, rarity: 'rare', category: 'Augmented Limb'
  },
  {
    id: 'l_aquatic', name: 'Aquatic Propulsion Legs', slot: PartSlot.LEGS,
    description: 'Retractable fins and hydro-jets in the calves. Swim at 40 knots. Walk on land normally.',
    stats: { ...B, agility: 25, tech: 10, energy: -12 }, cost: 4000, rarity: 'rare', category: 'Augmented Limb'
  },
  {
    id: 'l_rocket_boots', name: 'Thruster Jump-Jets', slot: PartSlot.LEGS,
    description: 'Micro-thrust engines in the soles. Short burst flight. 8 seconds of hover time.',
    stats: { ...B, agility: 45, tech: 15, energy: -35, defense: -10 }, cost: 22000, rarity: 'prototype', category: 'Augmented Limb'
  },
];

// Credit system constant
export const STARTING_CREDITS = 50000;