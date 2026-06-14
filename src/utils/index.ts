export const formatPrice = (price: number): string => `$${price.toFixed(2)}`;

export const formatRating = (rating: number): string => rating.toFixed(1);

export const truncate = (str: string, max: number): string =>
  str.length > max ? `${str.slice(0, max)}...` : str;

export const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export const sleep = (ms: number): Promise<void> =>
  new Promise((r) => setTimeout(r, ms));

export const isValidAvatar = (uri?: string): boolean =>
  !!uri && (uri.startsWith("http") || uri.startsWith("file"));
