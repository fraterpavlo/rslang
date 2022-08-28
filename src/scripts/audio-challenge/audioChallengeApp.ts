import { Control } from '../common/templates/control';
import { getRandomNum } from '../common/utils/utils';
import { CategoriesPage } from './pages/categoriesPage';
import { GameFieldPage } from './pages/gameFieldPage';
import { GameSettingsModel } from './gameSettingsModel';
import { GameDataModel } from './gameDataModel';
import { IWordData, IGameSettings, ELocalSoundsUrlList } from './interfaces';
import { GameOverPage } from './pages/gameOverPage';
import { SoundManager } from './soundManager';

export class AudioChallengeApp extends Control {
  dataModel: GameDataModel;
  settingsModel: GameSettingsModel;

  constructor(parentNode: HTMLElement | null) {
    super(parentNode, 'main', ['main', 'main__container']);

    const preloader = new Control(
      this.node,
      'div',
      ['preloader'],
      'LOADING...'
    );
    this.settingsModel = new GameSettingsModel();
    this.dataModel = new GameDataModel();

    SoundManager.preload().then(() => {
      preloader.destroy();
      this.categoriesCycle();
    });

    // this.categoriesCycle();
  }

  private categoriesCycle() {
    const gameSettings = this.settingsModel.getData();
    const categories = new CategoriesPage(this.node, gameSettings);

    categories.onHome = async () => {
      await categories.destroy();
      //!to do onHome function
      console.log('to do onHome function');
    };
    categories.onSelect = async (categoryIndex: number) => {
      await categories.destroy();
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

    const gameField: GameFieldPage = new GameFieldPage(
      this.node,
      randomSortedWordsData,
      gameSettings
    );
    gameField.onHome = async () => {
      // gameField.animateOut().then(() => {
      //   gameField.destroy();
      //   //!to do onHome function
      //   console.log('to do onHome function');
      // });
      await gameField.destroy();
      //!to do onHome function
      console.log('to do onHome function');
    };
    gameField.onBack = async () => {
      // gameField.animateOut().then(() => {
      //   gameField.destroy();
      //   this.categoriesCycle();
      // });
      await gameField.destroy();
      this.categoriesCycle();
    };
    gameField.onFinish = async (results) => {
      SoundManager.playSound(ELocalSoundsUrlList.applause);
      // gameField.animateOut().then(() => {
      //   gameField.destroy();
      // });
      await gameField.destroy();
      const gameOverPage = new GameOverPage(this.node, results);
      gameOverPage.onHome = async () => {
        await gameOverPage.destroy();
        //!to do onHome function
        console.log('to do onHome function');
      };
      gameOverPage.onNext = async () => {
        await gameOverPage.destroy();
        this.categoriesCycle();
      };
    };
  }

  render() {
    return this.node;
  }
}
