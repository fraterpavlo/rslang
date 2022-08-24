import { IWordData } from './interfaces';

const baseUrl = 'https://rs-lang-rss-task.herokuapp.com';
const words = `${baseUrl}/words`;
// const users = `${baseUrl}/users`;

export class GameDataModel{

  constructor(){};

  async getWords(group:number, page: number) {
    const response = await fetch(`${words}?page=${page}&group=${group}`);
    const resBody: IWordData[] = await response.json();
    
    return resBody;
  }

  async getSpecifiedWord(page:number, group: number) {
    const response = await fetch(`${words}?page=${page}&group=${group}`);
    const resBody: IWordData[] = await response.json();
    return resBody;
  }
}
