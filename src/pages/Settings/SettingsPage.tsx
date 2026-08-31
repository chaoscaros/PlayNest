import { MonitorSmartphone, RotateCcw, ShieldCheck, UserRound } from 'lucide-react';
import { useState } from 'react';
import { useGuest } from '../../app/providers/useGuest';
import type { ThemePreference } from '../../platform/storage/types';

const themeOptions: { id: ThemePreference; label: string; copy: string }[] = [
  { id: 'system', label: '跟随系统', copy: '自动匹配设备外观' },
  { id: 'light', label: '浅色', copy: '明亮轻快的浏览体验' },
  { id: 'dark', label: '深色', copy: '适合夜间与低光环境' },
];

export function SettingsPage() {
  const { profile, settings, updateTheme, resetLocalData } = useGuest();
  const [confirming, setConfirming] = useState(false);
  const reset = () => { resetLocalData(); setConfirming(false); };

  return (
    <div className="page container inner-page settings-page">
      <header className="page-heading"><div><span className="eyebrow">MAKE IT YOURS</span><h1>设置</h1><p>调整真实可用的平台选项。声音与动画开关会在对应能力上线后再提供。</p></div></header>
      <div className="settings-layout">
        <aside className="settings-nav"><a href="#appearance"><MonitorSmartphone size={18} />界面外观</a><a href="#guest-data"><UserRound size={18} />游客资料</a><a href="#privacy"><ShieldCheck size={18} />本地数据</a></aside>
        <div className="settings-content">
          <section className="settings-section" id="appearance"><div className="settings-section-title"><MonitorSmartphone size={22} /><div><h2>界面外观</h2><p>选择你更舒适的显示方式。</p></div></div><div className="theme-options">{themeOptions.map((option) => <button key={option.id} className={settings.theme === option.id ? 'active' : ''} onClick={() => updateTheme(option.id)}><span className={`theme-preview theme-${option.id}`}><i /><i /></span><strong>{option.label}</strong><small>{option.copy}</small><span className="radio-mark" /></button>)}</div></section>
          <section className="settings-section" id="guest-data"><div className="settings-section-title"><UserRound size={22} /><div><h2>游客资料</h2><p>当前身份仅属于这台设备上的浏览器。</p></div></div><div className="data-row"><span><small>当前昵称</small><strong>{profile.displayName}</strong></span><span><small>Guest ID</small><strong className="mono">{profile.guestId.slice(0, 13)}…</strong></span></div></section>
          <section className="settings-section danger-section" id="privacy"><div className="settings-section-title"><RotateCcw size={22} /><div><h2>重置本地数据</h2><p>清除游客身份、最近访问和设置，并立即生成一个新游客。</p></div></div>{confirming ? <div className="confirm-reset"><p>确定要重置吗？原 Guest ID 无法恢复。</p><div><button className="button button-quiet" onClick={() => setConfirming(false)}>取消</button><button className="button button-danger" onClick={reset}>确认重置</button></div></div> : <button className="button button-danger-outline" onClick={() => setConfirming(true)}>重置本地数据</button>}</section>
        </div>
      </div>
    </div>
  );
}
