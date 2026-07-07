import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home">
      <div className="home__particles">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="home__particle"
            style={{
              '--delay': `${Math.random() * 8}s`,
              '--duration': `${6 + Math.random() * 8}s`,
              '--x': `${Math.random() * 100}%`,
              '--size': `${2 + Math.random() * 4}px`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="home__content">
        <div className="home__title-group">
          <h1 className="home__title">ULTIMATTER</h1>
          <p className="home__subtitle">终质合成</p>
          <div className="home__divider" />
          <p className="home__desc">探索物质的终极奥秘，从元素到宇宙</p>
        </div>

        <div className="home__modes">
          <Link to="/basic" className="home__mode-card">
            <div className="home__mode-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
              </svg>
            </div>
            <h2 className="home__mode-title">基础合成</h2>
            <p className="home__mode-desc">沿着合成树探索已知物质，发现全新的组合</p>
          </Link>

          <Link to="/creative" className="home__mode-card home__mode-card--accent">
            <div className="home__mode-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h2 className="home__mode-title">创意模式</h2>
            <p className="home__mode-desc">发明新物质，定义合成规则，拓展物质宇宙</p>
          </Link>

          <Link to="/codex" className="home__mode-card">
            <div className="home__mode-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40">
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
              </svg>
            </div>
            <h2 className="home__mode-title">物质图鉴</h2>
            <p className="home__mode-desc">浏览所有已知物质，查看稀有度与合成路径</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
