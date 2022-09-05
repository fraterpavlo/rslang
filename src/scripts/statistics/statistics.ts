import { Iwords } from '../common/interfaces/statistic';
import {
  getUserId,
  getUserStatistics,
} from '../common/utils/api';
import { outNum } from '../common/utils/counter';

export class Statistics {
  private statisticSection: HTMLElement = document.createElement('section');
  private titleBrowser: HTMLTitleElement = <HTMLTitleElement>document.querySelector("title");
  private containerBody: HTMLElement = document.body;

  public statistics() {
    this.getStats();
  }

  constructor() {
    this.statisticSection.setAttribute('id', 'statistic');
    this.titleBrowser.innerHTML = 'Статистика'
  }

  public getStats() {
    getUserStatistics(getUserId())
    .then((data: Iwords[]): void => {
      this.createStatistic(data);
      this.createStatisticPercent();
      this.sprintStatistics();
    });
  }

  public createStatistic(data: Iwords[]): void {
    const numbers: number[] = [];
    const startScore: number = 1;
    const score: number[] | 0 = data ? numbers : 0
    
    if (data) {
      for (let nums in data) {
        if (Number(data[nums]) >= startScore) {
          numbers.push(Number(data[nums]));
        }
      }
    }
    const html = `<div class="statistic-main">
    <div class="statistic-main__title">
    <span>Статистика за сегодня:</span>
    </div>
    <div class="statistic-words" id="stat-blocks">
    <div class="statistic-words__learn-now" id="stats">
    <div class="statistic-words__block">
    <p class="statistic-words__text">Количество выученных слов за сегодня:</p>
    <p class="statistic-words__numbers" id="nums">${data ? outNum(Number(score), 'nums') : 0}</p>
    </div>
    </div></div>`;

    this.statisticSection.insertAdjacentHTML('beforeend', html);
    this.containerBody.append(this.statisticSection);
  }

  public createStatisticPercent() {
    const statistic: HTMLElement = <HTMLElement>(
      document.getElementById('stats')
    );
    const html = `
    <div class="statistic-words__block">
    <p class="statistic-words__text">Правильных ответов:</p>
    <p class="statistic-words__numbers" id="percent">${outNum(50 / 2, 'percent')}</p>
    </div>`;

    statistic.insertAdjacentHTML('beforeend', html);
  }

  public sprintStatistics() {
    const statContainer: HTMLElement = <HTMLElement>(
      document.getElementById('stat-blocks')
    );

    const html = `
    <div class="statistic-main">
    <div class="statistic-main__title">
    <span>Статистика по играм:</span>
    </div>
    <div class="statistic-words__learn-now">
    <div class="statistic-words__block">
    <p class="statistic-words__text">Спринт:</p>
    <div class="statistic-words__span">Изученных слов: 0</div>
    <div class="statistic-words__span">Правильных ответов: 0</div>
    <div class="statistic-words__span">Длинная серия: 0</div>
    </div>
    <div class="statistic-words__block">
    <p class="statistic-words__text">Аудиовызов:</p>
    <div class="statistic-words__span">Изученных слов: 0</div>
    <div class="statistic-words__span">Правильных ответов: 0</div>
    <div class="statistic-words__span">Длинная серия: 0</div>
    </div>
    </div>`;

    statContainer.insertAdjacentHTML('beforeend', html);
  }
}
