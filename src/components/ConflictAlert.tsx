import type { ConflictCheckResult } from '../types';
import './ConflictAlert.css';

interface ConflictAlertProps {
  conflicts: ConflictCheckResult[];
}

export default function ConflictAlert({ conflicts }: ConflictAlertProps) {
  if (conflicts.length === 0) return null;

  return (
    <div className="conflict-alert">
      {conflicts.map((c, i) => (
        <div key={i} className="conflict-alert__item">
          <svg className="conflict-alert__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <span className="conflict-alert__text">{c.message}</span>
        </div>
      ))}
    </div>
  );
}
