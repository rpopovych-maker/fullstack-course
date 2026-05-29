export function isExpired(date: string) {
  const time = new Date(date).getTime();

  return Number.isNaN(time) || time < Date.now();
}