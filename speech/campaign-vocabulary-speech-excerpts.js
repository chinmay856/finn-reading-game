const SPEECH_EXCERPTS = Object.freeze({
  "wikiwhy-03/diligence": "Some few are to be read wholly, and with diligence and attention.",
  "wikiwhy-05/abstractions": "These things are mere abstractions.",
  "wikiwhy-05/misconception": "The geometry they taught you at school is founded on a misconception.",
  "wikiwhy-08/servile": "The law of England, on the subject of the press, is as servile to this day as it was in the time of the Tudors.",
  "wikiwhy-08/propriety": "During some temporary panic, fear of insurrection drives ministers and judges from their propriety.",
  "threadit-08/responsibility": "Twenty-three of the fathers acted upon the question under their official responsibility and their oaths.",
  "faceplace-04/weariness": "I feel the deep weariness of heart and limb as ten, eight, six miles stretch relentlessly ahead.",
  "mycorner-01/placard": "He chanced to come to a placard near the captain's office, offering a reward for the capture of a mysterious impostor.",
  "mycorner-01/impostor": "The placard offered a reward for the capture of a mysterious impostor, supposed to have recently arrived from the East.",
  "mycorner-02/humdrum": "You share my love of all that is bizarre and outside the conventions and humdrum routine of everyday life.",
  "mycorner-02/embellish": "You have shown your enthusiasm by choosing to chronicle, and sometimes embellish, many of my own little adventures.",
  "mycorner-09/distinguished": "The biggest Mice were chosen as leaders and, to be distinguished from the rank and file, wore helmets with large plumes of straw.",
  "mycorner-09/movements": "We have no generals to plan our battles and direct our movements in the field.",
  "yahuh-04/revelations": "We do not ask you to go there for the purpose of making sensational revelations.",
  "yahuh-09/overheard": "Don't speak so loud, or you will be overheard, and I should be ruined.",
  "viewtube-07/revivify": "Distinct pulses of effort can revivify the topic for a moment.",
  "amaze-on-01/servitude": "What would you think of a government that forbade you to dress like a gentleman or gentlewoman, on pain of imprisonment or servitude?",
  "amaze-on-02/manufacture": "The trade of a pin-maker is a very trifling manufacture in which the division of labour has often been noticed.",
  "amaze-on-02/operations": "The important business of making a pin is divided into about eighteen distinct operations.",
  "amaze-on-03/architecture": "Neither architecture nor any other noble work of man can be good unless it be imperfect.",
  "amaze-on-11/abject": "It brought two children: wretched, abject, frightful, hideous, miserable.",
  "searchish-05/introspective": "He picked it up and gazed at it in the peculiar introspective fashion which was characteristic of him.",
  "searchish-04/confute": "Read not to contradict and confute.",
  "searchish-10/syllogism": "That train of reasoning is what logicians call a syllogism.",
  "spotty-fi-01/carols": "I hear America singing, the varied carols I hear.",
  "spotty-fi-01/mechanics": "I hear the songs of mechanics, each one singing his as it should be blithe and strong.",
  "spotty-fi-05/transmitting": "He has the possibility of transmitting his own feelings to others.",
  "spotty-fi-05/assimilated": "He can hand on the thoughts he has assimilated from others, as well as those which have arisen within himself.",
});

export function vocabularySpeechExcerpt(passageId, word, fallbackSentence) {
  return SPEECH_EXCERPTS[`${passageId}/${String(word ?? "").toLowerCase()}`] ?? fallbackSentence;
}

export const CAMPAIGN_VOCABULARY_SPEECH_EXCERPTS = SPEECH_EXCERPTS;
