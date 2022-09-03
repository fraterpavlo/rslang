export enum IGameSettings {
  levelAmount = 6,
  time = 60,
  defaultNumberOfPointsForCorrectAnswer = 20,
  increasingNumberOfPointsForCorrectAnswer = 20,
  maximumNumberOfPointsForCorrectAnswer = 80,
}

//GameFieldPage
export type TCorrectAnswersCombinationData = [boolean, boolean, boolean];

export interface IWordDataWithAnswers {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  textExampleTranslate: string;
  textMeaningTranslate: string;
  wordTranslate: string;
  likelyTranslate: string;
  answer: boolean;
}

//AudioChallengeSettingsModel
// export interface IGameSettings {
//   levelAmount: number;
//   questionsInGameAmount: number;
//   answersInRoundAmount: number;
//   time: number;
//   timeEnable: boolean;
// }

//SoundManagerClass
export enum ELocalSoundsUrlList {
  applause = '../../assets/audio/applause.mp3',
  success = '../../assets/audio/success.mp3',
  fail = '../../assets/audio/fail.mp3',
}

//GameFieldPage
export interface IAnswerData {
  wordId: string;
  word: string;
  wordTranscription: string;
  wordTranslate: string;
  wordAudioURL: string;
  answerResult: boolean;
}
