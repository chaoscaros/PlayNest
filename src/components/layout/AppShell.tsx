import { Gamepad2, Home, Info, Library, Settings, UserRound } from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useGuest } from '../../app/providers/useGuest';
import { BrandMark } from '../common/BrandMark';

const navigation = [
  { to: '/', label: '首页', icon: Home, end: true },
  { to: '/games', label: '游戏大厅', icon: Library },
  { to: '/about', label: '关于', icon: Info },
];

export function AppShell() {
  const { profile, settings } = useGuest();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme;
  }, [settings.theme]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="header-inner">
          <NavLink to="/" className="brand-link"><BrandMark /></NavLink>
          <nav className="desktop-nav" aria-label="主要导航">
            {navigation.map(({ to, label, end }) => <NavLink key={to} to={to} end={end}>{label}</NavLink>)}
          </nav>
          <div className="header-actions">
            <NavLink to="/settings" className="icon-button" aria-label="设置"><Settings size={19} /></NavLink>
            <NavLink to="/profile" className="guest-chip">
              <span className="guest-avatar"><UserRound size={18} /></span>
              <span><small>正在以游客身份探索</small><strong>{profile.displayName}</strong></span>
            </NavLink>
          </div>
        </div>
      </header>
      <main><Outlet /></main>
      <footer className="site-footer">
        <BrandMark />
        <p>给日常留一点轻松。没有下注，只有好玩的可能。</p>
        <span>© 2026 PlayNest · 平台预览版</span>
      </footer>
      <nav className="mobile-nav" aria-label="移动端导航">
        {navigation.slice(0, 2).map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end}><Icon size={20} /><span>{label}</span></NavLink>)}
        <NavLink to="/" className="mobile-brand" aria-label="PlayNest 首页"><Gamepad2 size={22} /></NavLink>
        <NavLink to="/profile"><UserRound size={20} /><span>我的</span></NavLink>
        <NavLink to="/settings"><Settings size={20} /><span>设置</span></NavLink>
      </nav>
    </div>
  );
}
