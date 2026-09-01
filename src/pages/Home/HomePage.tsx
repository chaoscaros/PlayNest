import { ArrowRight, Clock3, LayoutGrid, Puzzle, Sparkles, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGuest } from '../../app/providers/useGuest';
import { EmptyState } from '../../components/common/EmptyState';
import { SectionHeader } from '../../components/common/SectionHeader';
import { GameCard } from '../../components/games/GameCard';
import { gameRegistry } from '../../platform/games/gameRegistry';

const categoryLinks = [
  { id: 'board', label: '棋牌空间', copy: '思考、对弈与面对面的默契', icon: LayoutGrid, tone: 'mint' },
  { id: 'puzzle', label: '益智片刻', copy: '随时开始的一小段脑力漫游', icon: Puzzle, tone: 'amber' },
  { id: 'casual', label: '轻松同乐', copy: '一个人或和身边的人共享', icon: UsersRound, tone: 'coral' },
];

export function HomePage() {
  const { profile, recentGames } = useGuest();
  const featured = gameRegistry.list().filter((game) => game.featured);
  const recent = recentGames.map((item) => gameRegistry.getById(item.gameId)).filter((game) => game !== undefined);

  return (
    <div className="page home-page">
      <section className="hero container">
        <div className="hero-copy">
          <span className="hero-label"><Sparkles size={16} /> 欢迎回来，{profile.displayName}</span>
          <h1>打开浏览器，<br /><em>轻松玩在一起。</em></h1>
          <p>一个为日常留白的中文休闲游戏平台。无需注册，随时看看有什么值得期待。</p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/games">逛逛游戏大厅 <ArrowRight size={18} /></Link>
            <Link className="button button-quiet" to="/about">了解 PlayNest</Link>
          </div>
          <div className="hero-note"><span /><p><strong>第一款游戏已开放</strong>基础麻将支持四人共用设备轮流摸打、吃碰胡。</p></div>
        </div>
        <div className="hero-stage" aria-label="PlayNest 平台内容预览">
          <div className="hero-stage-grid" />
          <div className="floating-card floating-card-primary">
            <span className="mini-label">今日推荐</span><strong>留一点时间<br />给纯粹的快乐</strong>
            <div className="shape-stack"><i /><i /><i /></div>
          </div>
          <div className="floating-card floating-card-small"><Clock3 size={20} /><span><small>随开随玩</small><strong>无需注册</strong></span></div>
          <div className="stage-badge"><span>01</span><small>款已上线游戏</small></div>
        </div>
      </section>

      <section className="container section-block">
        <SectionHeader eyebrow="EXPLORE YOUR WAY" title="找到属于你的轻松方式" action={<Link className="text-link" to="/games">查看全部 <ArrowRight size={16} /></Link>} />
        <div className="category-grid">
          {categoryLinks.map(({ id, label, copy, icon: Icon, tone }, index) => (
            <Link key={id} to={`/games?category=${id}`} className={`category-card category-${tone}`}>
              <span className="category-number">0{index + 1}</span><Icon size={30} strokeWidth={1.5} /><h3>{label}</h3><p>{copy}</p><ArrowRight className="category-arrow" size={20} />
            </Link>
          ))}
        </div>
      </section>

      <section className="section-tint">
        <div className="container section-block">
          <SectionHeader eyebrow="NOW PLAYING" title="从基础麻将开始" action={<span className="section-count">01 款真实游戏</span>} />
          <div className="game-grid game-grid-featured">{featured.map((game) => <GameCard key={game.id} game={game} />)}</div>
        </div>
      </section>

      <section className="container section-block">
        <SectionHeader eyebrow="PICK UP WHERE YOU LEFT" title="最近访问" />
        {recent.length ? <div className="game-grid">{recent.map((game) => <GameCard key={game.id} game={game} compact />)}</div> : <EmptyState title="这里还很安静" description="打开任意游戏详情后，它会出现在这里，方便你下次回来继续了解。" action={<Link className="button button-secondary" to="/games">去大厅看看</Link>} />}
      </section>

      <section className="container manifesto">
        <span className="manifesto-index">PLAY / 01</span>
        <div><h2>游戏不必喧闹，<br />快乐也无需门槛。</h2><p>PlayNest 希望把干净、现代的休闲体验带回浏览器。这里没有金币诱导，没有复杂注册，只有随时可以打开的轻松空间。</p></div>
      </section>
    </div>
  );
}
