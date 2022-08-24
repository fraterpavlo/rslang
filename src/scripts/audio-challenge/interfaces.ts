//AudioChallengeApp
export interface IGameOptions {
  // categoryIndex: number;
  wordsData: IWordData[];
  gameSettings: IGameSettings,
}

//GameDataModel

export interface IWordData {
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
}

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
  answers: string[];
  correctAnswerIndex: number;
}

//AudioChallengeSettingsModel

export interface IGameSettings{
  levelAmount:number,
  questionsInGameAmount:number,
  answersInRoundAmount:number,
  time:number;
  timeEnable:boolean;
}
