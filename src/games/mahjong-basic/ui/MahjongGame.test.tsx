import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { testState, testTiles } from '../core/testHelpers';
import { MahjongGame } from './MahjongGame';

describe('MahjongGame UI', () => {
  it('starts directly as East against three computer players', () => {
    render(<MemoryRouter><MahjongGame /></MemoryRouter>);
    expect(screen.getAllByRole('button', { name: /^选择/ })).toHaveLength(14);
    expect(screen.getByText('你的手牌')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /我已接手/ })).not.toBeInTheDocument();
    expect(screen.getByLabelText('南家电脑信息')).toBeInTheDocument();
    expect(screen.getByLabelText('西家电脑信息')).toBeInTheDocument();
    expect(screen.getByLabelText('北家电脑信息')).toBeInTheDocument();
    expect(screen.getByLabelText('东家你信息')).toHaveClass('player-bottom');
    expect(screen.getByLabelText('南家电脑信息')).toHaveClass('player-right');
    expect(screen.getByLabelText('西家电脑信息')).toHaveClass('player-top');
    expect(screen.getByLabelText('北家电脑信息')).toHaveClass('player-left');
  });

  it('selects a tile, discards it, and hands control to the AI automatically', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><MahjongGame /></MemoryRouter>);
    const tile = screen.getAllByRole('button', { name: /^选择/ })[0];
    await user.click(tile);
    expect(tile).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: '出牌' }));
    expect(screen.getByRole('status')).toHaveTextContent(/电脑正在思考/);
    expect(screen.queryByRole('button', { name: /我已接手/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^选择/ })).not.toBeInTheDocument();
    expect(screen.getByText('你的手牌')).toBeInTheDocument();
  });

  it('only shows Kong when legal and renders a concealed Kong as four tile backs', async () => {
    const user = userEvent.setup();
    const state = testState({ wall: testTiles(['north', 'south']) });
    const kong = testTiles(['characters-5', 'characters-5', 'characters-5', 'characters-5']);
    state.players.east.concealedTiles = [...kong, ...testTiles(['east'])];
    render(<MemoryRouter><MahjongGame initialState={state} /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: /杠 · 五万/ }));
    expect(within(screen.getByLabelText('东家你信息')).getAllByLabelText('暗杠牌背')).toHaveLength(4);
    expect(screen.getByRole('button', { name: /^选择南/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /杠 · 五万/ })).not.toBeInTheDocument();
  });

  it('shows Pung and exposed Kong together during a matching discard reaction', () => {
    const discard = { seat: 'south' as const, tile: testTiles(['green-dragon'])[0] };
    const state = testState({ phase: 'awaiting-reaction', lastDiscard: discard });
    state.players.south.discards = [discard.tile];
    state.players.east.concealedTiles = testTiles(['green-dragon', 'green-dragon', 'green-dragon']);
    state.reactionState = { discard, queue: [{ seat: 'east', type: 'exposed-kong' }, { seat: 'east', type: 'pung' }] };
    render(<MemoryRouter><MahjongGame initialState={state} /></MemoryRouter>);
    expect(screen.getByRole('button', { name: '杠' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '碰' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '过' })).toBeInTheDocument();
  });

  it('upgrades a Pung to an added Kong and shows four real tile faces', async () => {
    const user = userEvent.setup();
    const state = testState({ wall: testTiles(['north']) });
    const pung = testTiles(['dots-7', 'dots-7', 'dots-7']);
    const fourth = testTiles(['dots-7'])[0];
    state.players.east.melds = [{ type: 'pung', tiles: pung, fromSeat: 'south', claimedTileId: pung[2].tileId }];
    state.players.east.concealedTiles = [fourth];
    render(<MemoryRouter><MahjongGame initialState={state} /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: /杠 · 七筒/ }));
    const eastPanel = within(screen.getByLabelText('东家你信息'));
    expect(eastPanel.getByText('加杠')).toBeInTheDocument();
    expect(eastPanel.getAllByLabelText('七筒')).toHaveLength(4);
    expect(eastPanel.queryByLabelText('暗杠牌背')).not.toBeInTheDocument();
  });
});
