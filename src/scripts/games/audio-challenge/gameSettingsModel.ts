import { ELocalStorageKeys } from '../../common/data/localstorageKeys';
import { IGameSettings } from './interfaces';

const defaultSettings: IGameSettings = {
  levelAmount: 6,
  questionsInGameAmount: 20,
  answersInRoundAmount: 5,
  time: 10,
  timeEnable: true,
};
export class GameSettingsModel {
  private settings: IGameSettings;

  constructor() {
    this.settings = defaultSettings;
    this.loadFromStorage();
  }

  loadFromStorage() {
    const storageData = localStorage.getItem(
      ELocalStorageKeys.AudioChallengeGameSettings
    );
    const checkStorageData = (data: string | null) => {
      return !!data;
    };
    if (!checkStorageData(storageData)) {
      this.settings = defaultSettings;
    } else {
      const data: IGameSettings = JSON.parse(storageData!);
      this.settings = data;
    }
  }

  getData() {
    return JSON.parse(JSON.stringify(this.settings));
  }

  setData(data: IGameSettings) {
    this.settings = data;
    this.saveToStorage();
  }

  saveToStorage() {
    localStorage.setItem(
      ELocalStorageKeys.AudioChallengeGameSettings,
      JSON.stringify(this.settings)
    );
  }
}
