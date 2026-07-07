# MatterCard UI & Button Theme Overhaul

## Requirement
1. MatterCard colors are too dim/dark - need to be vivid and prominent with visible glowing border effects for discovered cards
2. All buttons must remove gradient and blue-purple color scheme, use theme-consistent solid colors

## Changes

### 1. Brighten Rarity Colors (`src/types/index.ts`)
Current colors for rarity 1-3 are nearly invisible on dark background. All colors need to be bright enough to produce visible glow effects.

New palette:
| Level | Name | Old | New |
|-------|------|-----|-----|
| 1 | 普通 | #4a5568 | #9ca3af |
| 2 | 稳定 | #2d6a4f | #34d399 |
| 3 | 活性 | #1b4965 | #38bdf8 |
| 4 | 稀有 | #5b21b6 | #a78bfa |
| 5 | 精纯 | #7c3aed | #c084fc |
| 6 | 奇异 | #b45309 | #fb923c |
| 7 | 超凡 | #dc2626 | #f87171 |
| 8 | 传说 | #ca8a04 | #fbbf24 |
| 9 | 神话 | #e879f9 | #f472b6 |
| 10 | 终极 | #06b6d4 | #22d3ee |

### 2. MatterCard Glowing Border (`src/components/MatterCard.css`)
- Discovered cards: add prominent `box-shadow` glow on `__inner` using rarity color (0.6 opacity spread)
- Border color more vivid (0.6-0.8 alpha instead of 0.3)
- Background gradient more saturated (0.25-0.08 instead of 0.15-0.05)
- Text name: brighter white with stronger text-shadow glow
- Rarity label: use rarity color directly (brighter now)
- Glow layer: increase default opacity to 0.7, spread shadow wider

### 3. Global Theme Accent (`src/styles/global.css`)
Change accent from blue-purple to warm gold (alchemical theme):
- `--accent-primary`: #6366f1 → #c9952a (warm gold)
- `--accent-secondary`: #8b5cf6 → #d4a642 (lighter gold)
- `--accent-glow`: rgba(99,102,241,0.4) → rgba(201,149,42,0.4)
- `--border-glow`: rgba(99,102,241,0.3) → rgba(201,149,42,0.3)
- `--rarity-*` variables: match new rarity colors

### 4. Button Styles
All buttons replaced gradient → solid theme color:
- **BasicMode.css**: `--synth` button from `linear-gradient(indigo,purple)` → solid `var(--accent-primary)` background
- **CreativeMode.css**: submit button from `linear-gradient(purple,pink)` → solid `var(--accent-primary)` background
- **Home.css**: title gradient from `cyan,indigo,purple` → `#c9952a, #d4a642, #e0b84e` (warm gold tones); divider from indigo → gold; mode card hover from indigo/purple → gold

### 5. RaritySelect & other focus states
- Focus/hover states using accent-primary will automatically update via CSS variable change

### 6. Ultimate border animation
- Update shimmer gradient from cyan/purple → gold/warm tones

## Affected Files
- `src/types/index.ts` (rarity color values)
- `src/components/MatterCard.css` (glow, border, brightness)
- `src/components/MatterCard.tsx` (no change needed)
- `src/styles/global.css` (accent variables)
- `src/pages/BasicMode.css` (button gradient → solid)
- `src/pages/CreativeMode.css` (button gradient → solid)
- `src/pages/Home.css` (title gradient, hover effects)
