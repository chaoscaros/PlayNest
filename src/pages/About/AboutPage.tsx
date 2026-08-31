import { ArrowRight, Cloud, Gamepad2, HeartHandshake, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AboutPage() {
  return (
    <div className="page about-page">
      <section className="container about-hero"><span className="eyebrow">ABOUT PLAYNEST</span><h1>给每一段空闲，<br /><em>一个舒服的去处。</em></h1><p>PlayNest 是一个无需注册即可浏览和游玩的现代中文休闲游戏平台。现在，我们先把平台本身做好。</p></section>
      <section className="container values-grid">
        <article><span>01</span><HeartHandshake size={28} /><h2>游客优先</h2><p>第一次打开就获得稳定身份，不用先交出邮箱或手机号。</p></article>
        <article><span>02</span><Gamepad2 size={28} /><h2>游戏独立</h2><p>平台管理发现与入口，具体规则留在各自清晰的游戏模块中。</p></article>
        <article><span>03</span><ShieldCheck size={28} /><h2>纯粹休闲</h2><p>没有真钱、下注、金币诱导，也不把赌场式视觉包装成游戏。</p></article>
        <article><span>04</span><Cloud size={28} /><h2>为联机留白</h2><p>未来可以连接权威游戏服务器，但当前不制造没有需要的复杂度。</p></article>
      </section>
      <section className="container about-cta"><div><span className="eyebrow">CURRENT STATUS</span><h2>巢已经搭好，游戏仍在路上。</h2><p>当前可以体验完整平台、游客资料、浏览筛选和本地记录。0 款实际游戏，是这个阶段的正确答案。</p></div><Link className="button button-primary" to="/games">查看平台内容 <ArrowRight size={18} /></Link></section>
    </div>
  );
}
