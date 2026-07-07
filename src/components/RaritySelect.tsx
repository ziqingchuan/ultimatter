import { useState, useRef, useEffect } from 'react';
import './RaritySelect.css';

export interface SelectOption {
  value: string;
  label: string;
  color?: string;
}

interface RaritySelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RaritySelect({ options, value, onChange, placeholder = '请选择' }: RaritySelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="rarity-select" ref={ref}>
      <button
        className={`rarity-select__trigger ${open ? 'rarity-select__trigger--open' : ''}`}
        onClick={() => setOpen(!open)}
        type="button"
      >
        {selected?.color && (
          <span className="rarity-select__dot" style={{ background: selected.color }} />
        )}
        <span className="rarity-select__label">
          {selected ? selected.label : placeholder}
        </span>
        <svg
          className={`rarity-select__arrow ${open ? 'rarity-select__arrow--up' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          width="14"
          height="14"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="rarity-select__dropdown">
          {options.map((opt) => (
            <button
              key={opt.value}
              className={`rarity-select__option ${opt.value === value ? 'rarity-select__option--active' : ''}`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              type="button"
            >
              {opt.color && (
                <span className="rarity-select__dot" style={{ background: opt.color }} />
              )}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
