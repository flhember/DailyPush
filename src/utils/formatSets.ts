export function formatSets(sets: (number | 'max')[]) {
  return sets.map((s) => (typeof s === 'number' ? s : 'max')).join(' • ');
}
