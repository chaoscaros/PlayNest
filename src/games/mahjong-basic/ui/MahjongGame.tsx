import { ArrowLeft, CircleHelp, RotateCcw, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AI_SEATS, chooseMahjongAiAction, getMahjongActingSeat, HUMAN_SEAT } from '../ai/mahjongAi';
import {
  applyMahjongAction,
  createMahjongGame,
  getLegalActions,
  getVisibleStateForSeat,
  seatLabels,
  sortMahjongTiles,
  tileLabels,
  type MahjongAction,
  type MahjongLegalAction,
  type MahjongSeat,
} from '../core';
import { MahjongPlayerPanel, type MahjongTablePosition } from './MahjongPlayerPanel';
import { MahjongTile } from './MahjongTile';
import './mahjong.css';

function actionLabel(action: MahjongLegalAction): string {
  if (action.type === 'declare-hu') return '胡';
  if (action.type === 'claim-pung') return '碰';
  if (action.type === 'pass-reaction') return '过';
  return action.type === 'claim-chi' ? '吃' : '出牌';
}

const tablePositionBySeat = {
  east: 'bottom',
  south: 'right',
  west: 'top',
  north: 'left',
} satisfies Record<MahjongSeat, MahjongTablePosition>;

export function MahjongGame() {
  const [state, setState] = useState(() => createMahjongGame());
  const [selectedTileId, setSelectedTileId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [showRules, setShowRules] = useState(false);
  const activeSeat = getMahjongActingSeat(state);
  const humanTurn = activeSeat === HUMAN_SEAT;
  const aiTurn = state.status === 'playing' && AI_SEATS.includes(activeSeat);
  const visibleState = useMemo(() => getVisibleStateForSeat(state, HUMAN_SEAT), [state]);
  const legalActions = getLegalActions(state, HUMAN_SEAT);
  const concealedTiles = sortMahjongTiles(visibleState.players[HUMAN_SEAT].concealedTiles ?? []);

  useEffect(() => {
    if (!aiTurn) return;
    const action = chooseMahjongAiAction(state, activeSeat);
    if (!action) return;
    const timer = window.setTimeout(() => {
      setState((current) => current.actionCount === state.actionCount ? applyMahjongAction(current, action) : current);
    }, 420);
    return () => window.clearTimeout(timer);
  }, [activeSeat, aiTurn, state]);

  const restart = () => {
    setState(createMahjongGame());
    setSelectedTileId(null);
    setError('');
  };

  const dispatch = (action: MahjongAction) => {
    try {
      const next = applyMahjongAction(state, action);
      setState(next);
      setSelectedTileId(null);
      setError('');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '操作未完成，请重试。');
    }
  };

  const reactionActions = humanTurn ? legalActions.filter((action) => action.type !== 'discard-tile') : [];
  const chiActions = reactionActions.filter((action): action is Extract<MahjongLegalAction, { type: 'claim-chi' }> => action.type === 'claim-chi');

  return (
    <div className="mahjong-game-page">
      <header className="mahjong-game-header">
        <Link to="/games/mahjong-basic"><ArrowLeft size={18} /> 返回详情</Link>
        <div><span>PLAYNEST / 01</span><strong>基础麻将</strong><small>单人对战 · 三家电脑</small></div>
        <button onClick={() => setShowRules((current) => !current)}><CircleHelp size={18} /> 规则</button>
      </header>

      <main className="mahjong-table-shell">
        <div className="mahjong-table">
          {(['north', 'west', 'east', 'south'] as const).map((seat) => <MahjongPlayerPanel key={seat} player={state.players[seat]} active={activeSeat === seat} position={tablePositionBySeat[seat]} computer={seat !== HUMAN_SEAT} />)}
          <section className="mahjong-center">
            <span className="wall-counter"><small>牌墙</small><strong>{state.wall.length}</strong></span>
            <div className="table-mark"><i>巢</i><span>{state.status !== 'playing' ? '本局结束' : aiTurn ? `${seatLabels[activeSeat]}电脑思考中…` : state.phase === 'awaiting-reaction' ? '轮到你响应' : '轮到你出牌'}</span></div>
            {state.lastDiscard && <div className="last-discard"><small>{seatLabels[state.lastDiscard.seat]}打出</small><MahjongTile tile={state.lastDiscard.tile} /></div>}
          </section>
        </div>

        <section className="mahjong-hand-dock" aria-label="当前玩家手牌">
          <div className="hand-dock-heading"><span><small>YOUR HAND / 东家</small><strong>你的手牌</strong></span><p>{aiTurn ? `${seatLabels[activeSeat]}电脑正在操作` : state.phase === 'awaiting-reaction' ? '请选择响应，或点击“过”' : '点击选择一张牌，再点击“出牌”'}</p></div>
          <div className={`mahjong-hand ${aiTurn ? 'waiting-ai' : ''}`}>{concealedTiles.map((tile) => <MahjongTile key={tile.tileId} tile={tile} selected={selectedTileId === tile.tileId} onClick={humanTurn && state.phase === 'awaiting-discard' ? () => setSelectedTileId(tile.tileId) : undefined} />)}</div>
          <div className="mahjong-actions">
            {humanTurn && state.phase === 'awaiting-discard' && <>
              {legalActions.some((action) => action.type === 'declare-hu') && <button className="action-hu" onClick={() => dispatch({ type: 'declare-hu', seat: activeSeat })}><Sparkles size={17} /> 胡</button>}
              <button className="action-discard" disabled={selectedTileId === null} onClick={() => selectedTileId !== null && dispatch({ type: 'discard-tile', seat: activeSeat, tileId: selectedTileId })}>出牌</button>
            </>}
            {humanTurn && state.phase === 'awaiting-reaction' && reactionActions.filter((action) => action.type !== 'claim-chi').map((action) => <button key={action.type} className={`action-${action.type}`} onClick={() => dispatch(action.type === 'declare-hu' ? { type: 'declare-hu', seat: HUMAN_SEAT } : action.type === 'claim-pung' ? { type: 'claim-pung', seat: HUMAN_SEAT } : { type: 'pass-reaction', seat: HUMAN_SEAT })}>{actionLabel(action)}</button>)}
            {humanTurn && chiActions.map((action) => <button key={action.tileIds.join('-')} className="action-claim-chi" onClick={() => dispatch({ type: 'claim-chi', seat: HUMAN_SEAT, tileIds: action.tileIds })}>吃 · {action.tileIds.map((id) => tileLabels[state.players[HUMAN_SEAT].concealedTiles.find((tile) => tile.tileId === id)!.tileType]).join(' ')}</button>)}
            {aiTurn && <span className="ai-thinking" role="status"><i /><span>{seatLabels[activeSeat]}电脑正在思考</span></span>}
          </div>
          {error && <p className="mahjong-error" role="alert">{error}</p>}
        </section>
      </main>

      {state.status !== 'playing' && <div className="mahjong-result" role="dialog" aria-modal="true"><div><small>ROUND COMPLETE</small><h2>{state.status === 'won' ? state.winner === HUMAN_SEAT ? '你胡牌' : `${seatLabels[state.winner!]}电脑胡牌` : '本局流局'}</h2><p>{state.status === 'won' ? `${state.winType === 'self-draw' ? '自摸' : '点胡'}，本局不计算番数与积分。` : '牌墙已耗尽，本局流局。'}</p><button className="mahjong-primary-action" onClick={restart}><RotateCcw size={18} /> 再来一局</button><Link to="/games">返回游戏大厅</Link></div></div>}
      {showRules && <aside className="mahjong-rules-panel"><button onClick={() => setShowRules(false)}>关闭</button><small>PLAYNEST BASIC RULES</small><h2>这一局怎么玩</h2><ul><li>你固定坐东家，对战南、西、北三名电脑</li><li>4 人、136 张牌，东家先出牌</li><li>支持摸牌、出牌、吃、碰、胡、过</li><li>胡牌结构为四组面子加一对将</li><li>响应优先级：胡 ＞ 碰 ＞ 吃</li><li>无花牌、无杠、无番、无特殊胡型</li></ul></aside>}
    </div>
  );
}
