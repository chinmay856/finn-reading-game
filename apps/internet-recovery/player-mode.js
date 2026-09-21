// Mode belongs to the URL, never browser storage: a player link always stays clean.
export function isPlaytester(search = '') {
  return new URLSearchParams(search).get('playtest') === '1';
}

export function gameUrl(path, playtester = false) {
  const url = new URL(path, 'https://game.invalid');
  if (playtester) url.searchParams.set('playtest', '1');
  else url.searchParams.delete('playtest');
  return url.pathname + url.search + url.hash;
}
