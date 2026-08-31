import { CalendarDays, Fingerprint, PencilLine, Save, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGuest } from '../../app/providers/useGuest';
import { EmptyState } from '../../components/common/EmptyState';
import { GameCard } from '../../components/games/GameCard';
import { gameRegistry } from '../../platform/games/gameRegistry';

export function ProfilePage() {
  const { profile, recentGames, updateDisplayName } = useGuest();
  const [name, setName] = useState(profile.displayName);
  const [editing, setEditing] = useState(false);
  const recent = recentGames.map((item) => gameRegistry.getById(item.gameId)).filter((game) => game !== undefined);

  const saveName = () => {
    if (name.trim()) updateDisplayName(name);
    setEditing(false);
  };

  return (
    <div className="page container inner-page profile-page">
      <header className="profile-hero">
        <div className="profile-avatar"><UserRound size={42} strokeWidth={1.4} /><span /></div>
        <div className="profile-title"><span className="eyebrow">LOCAL GUEST PROFILE</span>{editing ? <div className="name-editor"><label className="sr-only" htmlFor="display-name">游客昵称</label><input id="display-name" value={name} maxLength={16} onChange={(event) => setName(event.target.value)} autoFocus /><button className="icon-button solid" onClick={saveName} aria-label="保存昵称"><Save size={19} /></button></div> : <div className="profile-name"><h1>{profile.displayName}</h1><button className="icon-button" onClick={() => setEditing(true)} aria-label="修改昵称"><PencilLine size={18} /></button></div>}<p>你的进度目前只保存在这个浏览器中。</p></div>
      </header>
      <div className="profile-facts">
        <div><Fingerprint size={22} /><span><small>Guest ID</small><strong>{profile.guestId.slice(0, 8)} ··· {profile.guestId.slice(-4)}</strong></span></div>
        <div><CalendarDays size={22} /><span><small>加入 PlayNest</small><strong>{new Intl.DateTimeFormat('zh-CN', { dateStyle: 'long' }).format(new Date(profile.createdAt))}</strong></span></div>
      </div>
      <section className="section-block profile-recent"><span className="eyebrow">RECENTLY VIEWED</span><h2>最近访问</h2>{recent.length ? <div className="game-grid">{recent.map((game) => <GameCard key={game.id} game={game} compact />)}</div> : <EmptyState title="还没有访问记录" description="逛逛游戏大厅，打开感兴趣的详情后会自动记录在这里。" action={<Link className="button button-secondary" to="/games">浏览游戏大厅</Link>} />}</section>
    </div>
  );
}
