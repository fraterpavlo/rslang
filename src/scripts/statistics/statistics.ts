import { getStatisticRequest, getUserId } from '../common/utils/api';

export class Statistics {
  private statisticSection: HTMLElement = document.createElement('section');

  private containerBody: HTMLElement = document.body;

  public statistics() {
    this.generateStatistic();
    
  }

  constructor() {
    this.statisticSection.setAttribute('id', 'statistic');
  }

  public async generateStatistic() {
    getStatisticRequest(getUserId())
    .then((data) => {
      console.log(data)
      this.createStatistic(data);
      this.createStatisticPercent()
      this.sprintStatistics()
    })
  }

  private createStatistic(data: any) {
    const words = data.map((item: string) => { return item })
    const html = `<div class="statistic-main">
    <div class="statistic-main__title">
    <span>Статистика за сегодня:</span>
    </div>
    <div class="statistic-words" id="stat-blocks">
    <div class="statistic-words__learn-now" id="stats">
    <div class="statistic-words__block">
    <p class="statistic-words__text">Количество выученных слов за сегодня:</p>
    <p class="statistic-words__numbers">${words.length}</p>
    </div>
    </div></div>`

    this.statisticSection.insertAdjacentHTML('beforeend', html)
    this.containerBody.append(this.statisticSection);
  }

  public createStatisticPercent() {
    const statistic: HTMLElement = <HTMLElement>document.getElementById('stats')
    const html = `
    <div class="statistic-words__block">
    <p class="statistic-words__text">Правильных ответов:</p>
    <p class="statistic-words__numbers">0%</p>
    </div>`

    statistic.insertAdjacentHTML('beforeend', html)
  }

  public sprintStatistics() {
    const statContainer: HTMLElement = <HTMLElement>document.getElementById('stat-blocks')

    const html = `
    <div class="statistic-main">
    <div class="statistic-main__title">
    <span>Статистика по играм:</span>
    </div>
    <div class="statistic-words__learn-now">
    <div class="statistic-words__block">
    <p class="statistic-words__text">Спринт:</p>
    <div class="statistic-words__span">Изученных слов:</div>
    <div class="statistic-words__span">Правильных ответов:</div>
    <div class="statistic-words__span">Длинная серия:</div>
    </div>
    <div class="statistic-words__block">
    <p class="statistic-words__text">Аудиовызов:</p>
    <div class="statistic-words__span">Изученных слов:</div>
    <div class="statistic-words__span">Правильных ответов:</div>
    <div class="statistic-words__span">Длинная серия:</div>
    </div>
    </div>`

    statContainer.insertAdjacentHTML('beforeend', html)
  }
}
