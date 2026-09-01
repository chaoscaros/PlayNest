import { ArrowLeft, CircleHelp, RotateCcw, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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
  type MahjongState,
} from '../core';
import { MahjongHandoff } from './MahjongHandoff';
import { MahjongPlayerPanel } from './MahjongPlayerPanel';
import { MahjongTile } from './MahjongTile';
import './mahjong.css';

function getActiveSeat(state: MahjongState): MahjongSeat {
  return state.phase === 'awaiting-reaction' ? state.reactionState?.queue[0]?.seat ?? state.currentSeat : state.currentSeat;
}

function actionLabel(action: MahjongLegalAction): string {
  if (action.type === 'declare-hu') return '胡';
  if (action.type === 'claim-pung') return '碰';
  if (action.type === 'pass-reaction') return '过';
  return action.type === 'claim-chi' ? '吃' : '出牌';
}

export function MahjongGame() {
  const [state, setState] = useState(() => createMahjongGame());
  const [revealedSeat, setRevealedSeat] = useState<MahjongSeat | null>(null);
  const [selectedTileId, setSelectedTileId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [showRules, setShowRules] = useState(false);
  const activeSeat = getActiveSeat(state);
  const visibleState = useMemo(() => getVisibleStateForSeat(state, activeSeat), [state, activeSeat]);
  const legalActions = getLegalActions(state, activeSeat);
  const concealedTiles = revealedSeat === activeSeat ? sortMahjongTiles(visibleState.players[activeSeat].concealedTiles ?? []) : [];

  const restart = () => {
    setState(createMahjongGame());
    setRevealedSeat(null);
    setSelectedTileId(null);
    setError('');
  };

  const dispatch = (action: MahjongAction) => {
    try {
      const next = applyMahjongAction(state, action);
      const nextActiveSeat = getActiveSeat(next);
      const keepVisible = (action.type === 'claim-chi' || action.type === 'claim-pung') && nextActiveSeat === activeSeat;
      setState(next);
      setRevealedSeat(keepVisible ? activeSeat : null);
      setSelectedTileId(null);
      setError('');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '操作未完成，请重试。');
    }
  };

  const reactionActions = legalActions.filter((action) => action.type !== 'discard-tile');
  const chiActions = reactionActions.filter((action): action is Extract<MahjongLegalAction, { type: 'claim-chi' }> => action.type === 'claim-chi');

  return (
    <div className="mahjong-game-page">
      <header className="mahjong-game-header">
        <Link to="/games/mahjong-basic"><ArrowLeft size={18} /> 返回详情</Link>
        <div><span>PLAYNEST / 01</span><strong>基础麻将</strong><small>简化推倒胡 · 四人本地</small></div>
        <button onClick={() => setShowRules((current) => !current)}><CircleHelp size={18} /> 规则</button>
      </header>

      <main className="mahjong-table-shell">
        <div className="mahjong-table">
          {(['north', 'west', 'east', 'south'] as const).map((seat) => <MahjongPlayerPanel key={seat} player={state.players[seat]} active={activeSeat === seat} position={seat} />)}
          <section className="mahjong-center">
            <span className="wall-counter"><small>牌墙</small><strong>{state.wall.length}</strong></span>
            <div className="table-mark"><i>巢</i><span>{state.phase === 'awaiting-reaction' ? `${seatLabels[activeSeat]}可以响应` : state.status === 'playing' ? `轮到${seatLabels[activeSeat]}出牌` : '本局结束'}</span></div>
            {state.lastDiscard && <div className="last-discard"><small>{seatLabels[state.lastDiscard.seat]}打出</small><MahjongTile tile={state.lastDiscard.tile} /></div>}
          </section>
        </div>

        <section className="mahjong-hand-dock" aria-label="当前玩家手牌">
          <div className="hand-dock-heading"><span><small>CURRENT HAND</small><strong>{seatLabels[activeSeat]}的手牌</strong></span><p>{state.phase === 'awaiting-reaction' ? '请选择响应，或点击“过”' : '点击选择一张牌，再点击“出牌”'}</p></div>
          {revealedSeat === activeSeat ? <div className="mahjong-hand">{concealedTiles.map((tile) => <MahjongTile key={tile.tileId} tile={tile} selected={selectedTileId === tile.tileId} onClick={() => setSelectedTileId(tile.tileId)} />)}</div> : <div className="concealed-placeholder"><span /><span /><span /><p>手牌已遮挡，等待玩家接手</p></div>}
          {revealedSeat === activeSeat && <div className="mahjong-actions">
            {state.phase === 'awaiting-discard' && <>
              {legalActions.some((action) => action.type === 'declare-hu') && <button className="action-hu" onClick={() => dispatch({ type: 'declare-hu', seat: activeSeat })}><Sparkles size={17} /> 胡</button>}
              <button className="action-discard" disabled={selectedTileId === null} onClick={() => selectedTileId !== null && dispatch({ type: 'discard-tile', seat: activeSeat, tileId: selectedTileId })}>出牌</button>
            </>}
            {state.phase === 'awaiting-reaction' && reactionActions.filter((action) => action.type !== 'claim-chi').map((action) => <button key={action.type} className={`action-${action.type}`} onClick={() => dispatch(action.type === 'declare-hu' ? { type: 'declare-hu', seat: activeSeat } : action.type === 'claim-pung' ? { type: 'claim-pung', seat: activeSeat } : { type: 'pass-reaction', seat: activeSeat })}>{actionLabel(action)}</button>)}
            {chiActions.map((action) => <button key={action.tileIds.join('-')} className="action-claim-chi" onClick={() => dispatch({ type: 'claim-chi', seat: activeSeat, tileIds: action.tileIds })}>吃 · {action.tileIds.map((id) => tileLabels[state.players[activeSeat].concealedTiles.find((tile) => tile.tileId === id)!.tileType]).join(' ')}</button>)}
          </div>}
          {error && <p className="mahjong-error" role="alert">{error}</p>}
        </section>
      </main>

      {state.status === 'playing' && revealedSeat !== activeSeat && <MahjongHandoff seat={activeSeat} reaction={state.phase === 'awaiting-reaction'} onAccept={() => setRevealedSeat(activeSeat)} />}
      {state.status !== 'playing' && <div className="mahjong-result" role="dialog" aria-modal="true"><div><small>ROUND COMPLETE</small><h2>{state.status === 'won' ? `${seatLabels[state.winner!]}胡牌` : '本局流局'}</h2><p>{state.status === 'won' ? `${state.winType === 'self-draw' ? '自摸' : '点胡'}，本局不计算番数与积分。` : '牌墙已耗尽，本局流局。'}</p><button className="mahjong-primary-action" onClick={restart}><RotateCcw size={18} /> 再来一局</button><Link to="/games">返回游戏大厅</Link></div></div>}
      {showRules && <aside className="mahjong-rules-panel"><button onClick={() => setShowRules(false)}>关闭</button><small>PLAYNEST BASIC RULES</small><h2>这一局怎么玩</h2><ul><li>4 人、136 张牌，固定东家先出牌</li><li>支持摸牌、出牌、吃、碰、胡、过</li><li>胡牌结构为四组面子加一对将</li><li>响应优先级：胡 ＞ 碰 ＞ 吃</li><li>无花牌、无杠、无番、无特殊胡型</li></ul></aside>}
    </div>
  );
}
