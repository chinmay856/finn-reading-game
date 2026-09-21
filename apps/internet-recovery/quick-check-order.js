// Shuffle a copy; the correct answer stays attached to its original text/id.
export function shuffleQuickCheckChoices(choices, random = Math.random) {
  const shuffled = [...choices];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const other = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
  }
  return shuffled;
}
