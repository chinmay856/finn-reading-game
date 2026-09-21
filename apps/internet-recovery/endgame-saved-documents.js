// Runtime text comes from the same saved records shown in campaign Documents.
export function savedEndgameDocuments(fixtures, reflections, useSaved = false) {
  return fixtures.map(fixture => {
    const record = reflections?.[fixture.id];
    return {
      ...fixture,
      savedLesson: record?.lesson || fixture.savedLesson,
      playerExplanation: record?.reflection?.trim() || (useSaved ? `No explanation was saved for ${fixture.name}.` : fixture.playerExplanation),
    };
  });
}

export function savedDocumentRepairStep(step, documents, siteIndex) {
  if (!step || step.key === 'extra-instruction') return step;
  const current = documents[siteIndex];
  const field = step.key === 'auto-lesson' ? 'savedLesson' : 'playerExplanation';
  return { ...step, options: step.options.map(option => {
    const source = option.correct ? current : documents.find(site => option.id.endsWith(`-from-${site.id}`));
    return { ...option, text: source?.[field] ?? option.text };
  }) };
}
