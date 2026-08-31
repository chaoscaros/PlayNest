import { useContext } from 'react';
import { GuestContext, type GuestContextValue } from './guestContext';

export function useGuest(): GuestContextValue {
  const context = useContext(GuestContext);
  if (!context) throw new Error('useGuest must be used inside GuestProvider.');
  return context;
}
