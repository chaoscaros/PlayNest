import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { MahjongGame } from './MahjongGame';

describe('MahjongGame UI', () => {
  it('starts behind an East handoff screen and reveals only East after acceptance', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><MahjongGame /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: /请将设备交给.*东家/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^选择/ })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /我已接手/ }));
    expect(screen.getAllByRole('button', { name: /^选择/ })).toHaveLength(14);
    expect(screen.getByText('东家的手牌')).toBeInTheDocument();
  });

  it('selects a tile, discards it, and returns to a privacy handoff', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><MahjongGame /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: /我已接手/ }));
    const tile = screen.getAllByRole('button', { name: /^选择/ })[0];
    await user.click(tile);
    expect(tile).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: '出牌' }));
    expect(screen.getByRole('button', { name: /我已接手/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^选择/ })).not.toBeInTheDocument();
  });
});
