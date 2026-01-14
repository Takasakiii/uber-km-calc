export function getNumberFromForm(value: unknown, isMoney: boolean = false): number {
  const v = Number(value);
  return isNaN(v) ? 0 : isMoney ? v / 100 : v;
}
