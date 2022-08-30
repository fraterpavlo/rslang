import { IWordData } from '../audio-challenge/interfaces';

export const baseUrl = 'https://rs-lang-rss-task.herokuapp.com';
export const wordsUrl = `${baseUrl}/words`;
// const users = `${baseUrl}/users`;

export class GameDataModel {
  constructor() {}

  async getWords(group: number, page: number) {
    const response = await fetch(`${wordsUrl}?page=${page}&group=${group}`);
    const resBody: IWordData[] = await response.json();

    return resBody;
  }

  async getSpecifiedWord(page: number, group: number) {
    const response = await fetch(`${wordsUrl}?page=${page}&group=${group}`);
    const resBody: IWordData[] = await response.json();
    return resBody;
  }
}
