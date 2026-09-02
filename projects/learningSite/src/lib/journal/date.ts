/**
 * Today's date as YYYY-MM-DD in the browser's local timezone.
 *
 * `new Date().toISOString()` is UTC, which rolls over at the wrong moment
 * for anyone west of Greenwich — a session logged at 11pm local time would
 * land on tomorrow's date. Journal days are a local-calendar concept, not
 * a UTC one, so this shifts by the timezone offset before slicing.
 */
export function todayDateString(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}
