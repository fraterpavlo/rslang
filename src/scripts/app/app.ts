import { AppModel } from "../common/interfaces/statistic";
import { Statistics } from "../statistics/statistics";

export class App implements AppModel {
  public statistic: Statistics;

  constructor() {
    this.statistic = new Statistics();
  }

  public async init(): Promise<void> {
    this.statistic.statistics();

  }
}