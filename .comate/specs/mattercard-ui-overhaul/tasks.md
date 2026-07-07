# MatterCard UI & Button Theme Overhaul

- [x] Task 1: Update rarity colors in types/index.ts
    - 1.1: Replace all 10 rarity color values with brighter, more vivid colors

- [x] Task 2: Overhaul MatterCard.css for glowing border effect
    - 2.1: Increase border alpha, background gradient saturation, text-shadow strength
    - 2.2: Boost glow layer opacity and spread radius
    - 2.3: Update ultimate border shimmer to gold tones

- [x] Task 3: Update global theme accent to warm gold
    - 3.1: Change --accent-primary/secondary/glow from blue-purple to warm gold
    - 3.2: Update --rarity-* CSS variables to match new colors
    - 3.3: Update glowPulse keyframe to use gold

- [x] Task 4: Fix all button styles - remove gradients and blue-purple
    - 4.1: BasicMode.css synth button → solid accent color
    - 4.2: CreativeMode.css submit button → solid accent color
    - 4.3: Home.css title gradient, divider, mode card hover → gold theme
