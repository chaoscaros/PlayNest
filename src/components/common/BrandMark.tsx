export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand-mark" aria-label="PlayNest">
      <span className="brand-symbol" aria-hidden="true"><i /><i /><i /></span>
      {!compact && <span>PlayNest</span>}
    </span>
  );
}
