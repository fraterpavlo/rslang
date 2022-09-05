export interface IUser {
  password: string;
  email: string;
  name?: string;
}

export interface AppModel {
  init(): void;
}

export enum TwoGames {
  challenge,
  sprint,
}

export interface IStatistic {
  right: number;
  wrong: number;
  total: number;
  longSeries: number;
  newWords: number;
  game: TwoGames;
}


export interface Iwords {
  id: string;
  learnedWords: number
}

export interface IGameResponse {
  optional: { [key: string]: IStatistic };
}

export const LOCAL = {
  TOKEN: 'access_token',
  REFRESH_TOKEN: 'access_refresh_token',
  ID: 'user_id',
};