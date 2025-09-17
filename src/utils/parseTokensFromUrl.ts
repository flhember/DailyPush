export function parseTokensFromUrl(url: string) {
  const hash = url.split('#')[1];
  if (!hash) return null;

  const params = new URLSearchParams(hash);
  return {
    access_token: params.get('access_token'),
    refresh_token: params.get('refresh_token'),
    expires_in: params.get('expires_in'),
    token_type: params.get('token_type'),
  };
}
