import { Search, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EmptyState } from '../../components/common/EmptyState';
import { GameCard } from '../../components/games/GameCard';
import { gameRegistry } from '../../platform/games/gameRegistry';
import { categoryLabels, type GameCategory } from '../../platform/games/types';

type CategoryFilter = 'all' | GameCategory;
const filters: { id: CategoryFilter; label: string }[] = [{ id: 'all', label: '全部' }, ...Object.entries(categoryLabels).map(([id, label]) => ({ id: id as GameCategory, label }))];

export function GamesPage() {
  const [params, setParams] = useSearchParams();
  const initialCategory = params.get('category');
  const [category, setCategory] = useState<CategoryFilter>(filters.some((filter) => filter.id === initialCategory) ? initialCategory as CategoryFilter : 'all');
  const [query, setQuery] = useState('');

  const games = useMemo(() => gameRegistry.list().filter((game) => {
    const matchesCategory = category === 'all' || game.category === category;
    const keyword = query.trim().toLocaleLowerCase('zh-CN');
    return matchesCategory && (!keyword || `${game.name}${game.shortDescription}`.toLocaleLowerCase('zh-CN').includes(keyword));
  }), [category, query]);

  const chooseCategory = (next: CategoryFilter) => {
    setCategory(next);
    if (next === 'all') setParams({}); else setParams({ category: next });
  };

  return (
    <div className="page container inner-page">
      <header className="page-heading games-heading"><div><span className="eyebrow">GAME LIBRARY</span><h1>游戏大厅</h1><p>第一款游戏已经落座。和身边的人共享设备，体验 PlayNest 基础麻将。</p></div><span className="large-counter">{gameRegistry.list().length.toString().padStart(2, '0')}</span></header>
      <div className="catalog-toolbar">
        <label className="search-field"><Search size={20} /><span className="sr-only">搜索游戏</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索名称或关键词" /></label>
        <div className="filter-group" aria-label="游戏分类"><SlidersHorizontal size={18} />{filters.map((filter) => <button className={category === filter.id ? 'active' : ''} key={filter.id} onClick={() => chooseCategory(filter.id)}>{filter.label}</button>)}</div>
      </div>
      <div className="catalog-meta"><span>找到 {games.length} 个游戏条目</span><span>基础麻将已开放 · 其他内容仍待确认</span></div>
      {games.length ? <div className="game-grid catalog-grid">{games.map((game) => <GameCard key={game.id} game={game} />)}</div> : <EmptyState title="没有找到匹配内容" description="试试更短的关键词，或者切换到其他分类。" />}
    </div>
  );
}
