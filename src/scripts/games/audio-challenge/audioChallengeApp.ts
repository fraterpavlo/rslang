import { Control } from '../../common/templates/control';
import { getRandomNum } from '../../common/utils/utils';
import { CategoriesPage } from './pages/categoriesPage';
import { GameFieldPage } from './pages/gameFieldPage';
import { GameSettingsModel } from './gameSettingsModel';
import { GameDataModel } from '../common/gameDataModel';
import { IWordData } from '../common/commonInterfaces';
import { IGameSettings, ELocalSoundsUrlList } from './interfaces';
import { GameOverPage } from './pages/gameOverPage';
import { SoundManager } from '../common/soundManager';
import { Preloader } from '../common/templates/preloader';

import '../../../styles/games/audio-challenge-game.scss';

export class AudioChallengeApp extends Control {
  dataModel: GameDataModel;
  settingsModel: GameSettingsModel;
  preloader: Preloader;

  constructor(parentNode: HTMLElement | null) {
    super(parentNode, 'main', [
      'audio-challenge-game',
      'audio-challenge-game__container',
    ]);
    this.preloader = new Preloader(
      this.node,
      'div',
      ['preloader'],
      'LOADING...'
    );
    this.preloader.activate();
    this.settingsModel = new GameSettingsModel();
    this.dataModel = new GameDataModel();

    SoundManager.preload().then(() => {
      this.categoriesCycle();
    });
  }

  private categoriesCycle() {
    const gameSettings = this.settingsModel.getData();
    this.preloader.deactivate();
    const categories = new CategoriesPage(this.node, gameSettings);

    categories.onHome = async () => {
      await categories.destroy();
      //!to do onHome function
      console.log('to do onHome function');
    };
    categories.onSelect = async (categoryIndex: number) => {
      await categories.destroy();
      this.preloader.activate();
      this.gameCycle(categoryIndex);
    };
  }

  private async gameCycle(categoryIndex: number) {
    const randomPageInCategory = getRandomNum(0, 29);
    const questionsData: IWordData[] = await this.dataModel.getWords(
      categoryIndex,
      randomPageInCategory
    );
    const randomSortedWordsData = questionsData.sort(() => getRandomNum(-1, 1));
    const gameSettings: IGameSettings = this.settingsModel.getData();
    this.preloader.deactivate();
    const gameField: GameFieldPage = new GameFieldPage(
      this.node,
      randomSortedWordsData,
      gameSettings
    );
    gameField.onHome = async () => {
      await gameField.destroy();
      //!to do onHome function
      console.log('to do onHome function');
    };
    gameField.onBack = async () => {
      await gameField.destroy();
      this.preloader.activate();
      this.categoriesCycle();
    };
    gameField.onFinish = async (results) => {
      SoundManager.playSound(ELocalSoundsUrlList.applause);
      await gameField.destroy();
      const gameOverPage = new GameOverPage(this.node, results);
      gameOverPage.onHome = async () => {
        await gameOverPage.destroy();
        //!to do onHome function
        console.log('to do onHome function');
      };
      gameOverPage.onNext = async () => {
        await gameOverPage.destroy();
        this.preloader.activate();
        this.categoriesCycle();
      };
    };
  }

  render() {
    return this.node;
  }
}
