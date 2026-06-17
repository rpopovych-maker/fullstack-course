export function truncateText(text: string, maxLen?: number): string;
export function truncateText(text: null | undefined, maxLen?: number): null;
export function truncateText(
  text: string | null | undefined,
  maxLen = 300
): string | null {
  if (!text) {
    return text ?? null;
  }

  if (text.length <= maxLen) {
    return text;
  }

  const slice = text.slice(0, maxLen);
  const lastWhitespace = slice.search(/\s\S*$/);
  const cutAt = lastWhitespace > 0 ? lastWhitespace : maxLen;

  return slice.slice(0, cutAt) + '…';
}
