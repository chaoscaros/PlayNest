import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
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
});
