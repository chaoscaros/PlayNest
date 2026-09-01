import { EyeOff, Hand } from 'lucide-react';
import type { MahjongSeat } from '../core';
import { seatLabels } from '../core';

export function MahjongHandoff({ seat, reaction, onAccept }: { seat: MahjongSeat; reaction: boolean; onAccept: () => void }) {
  return (
    <div className="mahjong-handoff" role="dialog" aria-modal="true" aria-labelledby="handoff-title">
      <div className="handoff-card">
        <span className="handoff-icon"><EyeOff size={30} /></span>
        <small>{reaction ? 'REACTION / 响应机会' : 'YOUR TURN / 轮到你了'}</small>
        <h2 id="handoff-title">请将设备交给<br /><em>{seatLabels[seat]}</em></h2>
        <p>其他玩家请移开视线。确认接手后，才会显示这一家的完整手牌与可用操作。</p>
        <button className="mahjong-primary-action" onClick={onAccept}><Hand size={19} /> 我已接手</button>
      </div>
    </div>
  );
}
