export type Token = {
  tokenType: string;
  accessToken: string;
  expires: number;
  refreshToken: string;
};

const isSession = (value: unknown): value is Token => {
  if (typeof value !== 'object' || value === null) return false;
  return (
    'accessToken' in value &&
    typeof value.accessToken === 'string' &&
    'refreshToken' in value &&
    typeof value.refreshToken === 'string' &&
    'expires' in value &&
    typeof value.expires === 'number' &&
    'tokenType' in value &&
    value.tokenType === 'Bearer'
  );
};

export const getAuthentication = (): Token | null => {
  const session =
    sessionStorage.getItem('TOKEN') ?? localStorage.getItem('TOKEN') ?? null;
  if (!session) return null;
  const sessionParsed = JSON.parse(session);
  if (!isSession(sessionParsed)) {
    console.warn(`Not a valid session`, sessionParsed);
    return null;
  }
  return sessionParsed;
};

export const setAuthentication = () => {};
