export function Brand() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-9 w-9 rounded-2xl border border-neutral-200 bg-neutral-50 flex items-center justify-center">
        <span className="text-lg">🌱</span>
      </div>
      <div className="leading-tight">
        <div className="font-semibold">Sprout</div>
        <div className="text-xs text-neutral-500">eco • vegan • private-first</div>
      </div>
    </div>
  );
}
