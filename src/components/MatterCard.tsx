import { RARITY_MAP, type RarityLevel } from '../types';
import './MatterCard.css';

interface MatterCardProps {
  name: string;
  rarity: RarityLevel;
  onClick?: () => void;
  selected?: boolean;
  discovered?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function MatterCard({
  name,
  rarity,
  onClick,
  selected = false,
  discovered = true,
  size = 'md',
}: MatterCardProps) {
  const info = RARITY_MAP[rarity];
  const isUltimate = rarity === 10;

  return (
    <div
      className={`matter-card matter-card--${size} ${selected ? 'matter-card--selected' : ''} ${!discovered ? 'matter-card--undiscovered' : ''}`}
      style={{
        '--rarity-color': info.color,
        '--rarity-color-rgb': hexToRgb(info.color),
      } as React.CSSProperties}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {isUltimate && discovered && <div className="matter-card__ultimate-border" />}
      <div className="matter-card__inner">
        <span className="matter-card__name">{discovered ? name : '???'}</span>
        {discovered && <span className="matter-card__rarity">{info.name}</span>}
      </div>
      {discovered && <div className="matter-card__glow" />}
    </div>
  );
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}
