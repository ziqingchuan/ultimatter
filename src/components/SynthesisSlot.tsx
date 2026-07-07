import type { Matter } from '../types';
import MatterCard from './MatterCard';
import './SynthesisSlot.css';

interface SynthesisSlotProps {
  matter: Matter | null;
  label: string;
  onClear: () => void;
  onClick?: () => void;
}

export default function SynthesisSlot({ matter, label, onClear, onClick }: SynthesisSlotProps) {
  return (
    <div className={`synthesis-slot ${matter ? 'synthesis-slot--filled' : 'synthesis-slot--empty'}`}>
      <span className="synthesis-slot__label">{label}</span>
      <div className="synthesis-slot__content" onClick={onClick}>
        {matter ? (
          <>
            <MatterCard name={matter.name} rarity={matter.rarity} size="lg" selected />
            <button className="synthesis-slot__clear" onClick={(e) => { e.stopPropagation(); onClear(); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </>
        ) : (
          <div className="synthesis-slot__placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            <span>选择物质</span>
          </div>
        )}
      </div>
    </div>
  );
}
