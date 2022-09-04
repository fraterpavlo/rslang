export interface IUser {
  password: string;
  email: string;
  name?: string;
}

export interface AppModel {
  init(): void;
}

export enum Game {
  challenge,
  sprint,
}

export interface IStatistic {
  rightWords: number;
  wrongWords: number;
  totalCount: number;
  longestSeries: number;
  newWordsOfDay: number;
  game: Game;
}


export interface Iwords {
  id: string;
  difficulty: string;
  userId: string
}

export interface IGameResponse {
  optional: { [key: string]: IStatistic };
}

export const LOCAL = {
  TOKEN: 'access_token',
  REFRESH_TOKEN: 'access_refresh_token',
  ID: 'user_id',
};