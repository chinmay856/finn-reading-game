import assert from 'node:assert/strict';
import { derivePassageDisplayLines } from '../../reading-companion/passage-display-lines.js';

export function parseReviewedGoogleDoc(siteId, doc) {
  const sections = [];
  for (const paragraph of doc.paragraphs) {
    if (/^Passage \d+(?: candidate)?:/u.test(paragraph.text)) sections.push([]);
    if (sections.length) sections.at(-1).push(paragraph.text);
  }
  assert.equal(sections.length, siteId === 'faceplace' ? 8 : 9);
  return sections.map((section, index) => {
    const number = index + 1;
    assert.match(section[0], new RegExp(`^Passage ${number}(?: candidate)?:`));
    const reviewedTitle = section[0].replace(/^Passage \d+(?: candidate)?: /u, '');
    // Editorial descriptions remain in provenance, never in the spoken text.
    const title = reviewedTitle.replace(/ — (?!Part \d+$).*$/u, '');
    const start = section.findIndex(text => ['Exact complete spoken passage', 'Exact spoken passage'].includes(text)) + 1;
    const vocabularyStart = section.indexOf('Vocabulary');
    const checkStart = section.indexOf('Quick check');
    assert.ok(start > 0 && vocabularyStart > start && checkStart > vocabularyStart);
    const paragraphs = section.slice(start, vocabularyStart);
    const vocabularyLines = section.slice(vocabularyStart + 1, checkStart).flatMap(text => text.split('\u000b')).filter(text => text.trim());
    const vocabulary = [];
    for (let i = 0; i < vocabularyLines.length;) {
      let word, definition, phrase;
      if (vocabularyLines[i].includes(' Exact playback phrase: ')) {
        const match = vocabularyLines[i].match(/^(.+?) — (?:Definition|Secondary definition): (.+?) Exact playback phrase: (.+)$/u);
        assert.ok(match);
        [, word, definition, phrase] = match;
        i += 1;
      } else if (vocabularyLines[i].includes(' — ')) {
        const split = vocabularyLines[i].indexOf(' — ');
        word = vocabularyLines[i].slice(0, split);
        definition = vocabularyLines[i].slice(split + 3);
        phrase = vocabularyLines[i + 1];
        i += 2;
      } else {
        word = vocabularyLines[i];
        definition = vocabularyLines[i + 1].replace(/^(?:Secondary definition|Definition): /u, '');
        phrase = vocabularyLines[i + 2];
        i += 3;
      }
      phrase = phrase.replace(/^(?:Exact playback phrase|Playback): /u, '').replace(/^“([\s\S]*)”$/u, '$1');
      vocabulary.push({ word, definition, sentence: phrase, playbackPhrase: phrase, properNoun: false });
    }
    assert.equal(vocabulary.length, 3);
    const check = section.slice(checkStart + 1);
    const correctLetter = check.find(text => /^Correct answer: /u.test(text))?.match(/^Correct answer: ([ABC])/u)?.[1];
    const orderedChoices = check.slice(1).flatMap(text => {
      const match = text.match(/^([ABC])( — Correct)?[.:] (.*)$/u);
      return match ? [{ text: match[3], correct: Boolean(match[2]) || match[1] === correctLetter }] : [];
    });
    assert.equal(orderedChoices.length, 3);
    assert.equal(orderedChoices.filter(choice => choice.correct).length, 1);
    const verse = /^(?:Romeo and Juliet|The Fish|Sonnet 29|Ozymandias|We Wear the Mask|Much Madness|I’m Nobody)/u.test(title);
    const displayLines = verse ? [...paragraphs] : [paragraphs[0], ...paragraphs.slice(1).flatMap(paragraph => {
      const lines = derivePassageDisplayLines({ paragraphs: [paragraph] });
      return lines.some(line => /[,;—–]["'’”)]*$/u.test(line)) ? [paragraph] : lines;
    })];
    return {
      id: `${siteId}-${String(number).padStart(2, '0')}`, title, reviewedTitle,
      form: 'human-reviewed reading', paragraphs, displayLines,
      spokenWordCount: paragraphs.join(' ').split(/\s+/u).filter(Boolean).length,
      source: { label: reviewedTitle, url: doc.document_url },
      reviewStatus: 'second-human-approved-2026-09-20',
      sourceDocumentId: doc.documentId, sourceRevisionId: doc.revisionId,
      onScreen: section.find(text => text.startsWith('On screen: '))?.slice(11) ?? '',
      vocabulary,
      comprehension: {
        prompt: check[0].replace(/^Exact question: /u, ''), orderedChoices,
        correct: orderedChoices.find(choice => choice.correct).text,
        distractors: orderedChoices.filter(choice => !choice.correct).map(choice => choice.text),
        correctFeedback: 'Yes. That answer is supported by the passage.',
        tryAgainFeedback: 'Take another look at the passage, then choose again.',
      },
    };
  });
}
