// Runtime text comes from the same saved records shown in campaign Documents.
export function savedEndgameDocuments(fixtures, reflections, useSaved = false) {
  return fixtures.map(fixture => {
    const record = reflections?.[fixture.id];
    return {
      ...fixture,
      savedLesson: record?.lesson || fixture.savedLesson,
      extraInstruction: record?.extraInstruction || fixture.boundaryOptions.find(option => option.correct).text,
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

// Only retain instructions the player has actually recovered. Safe for older saves.
export function retainRecoveredInstructions(reflections, fixtures, completedStepIds) {
  const next = { ...reflections };
  for (const site of fixtures) {
    if (!next[site.id] || !completedStepIds.includes(`${site.id}:extra-instruction`)) continue;
    next[site.id] = { ...next[site.id], extraInstruction: next[site.id].extraInstruction
      || site.boundaryOptions.find(option => option.correct).text };
  }
  return next;
}
