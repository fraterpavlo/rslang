import { Control } from '../../common/templates/control';
import { getRandomNum } from '../../common/utils/utils';
import { CategoriesPage } from './pages/categoriesPage';
import { GameFieldPage } from './pages/gameFieldPage';
import { GameDataModel } from '../common/gameDataModel';
import { IWordData } from '../common/commonInterfaces';
import { ELocalSoundsUrlList } from './interfaces';
import { GameOverPage } from './pages/gameOverPage';
import { SoundManager } from '../common/soundManager';
import { Preloader } from '../common/templates/preloader';

import '../../../styles/games/sprint-game.scss';

export class SprintApp extends Control {
  dataModel: GameDataModel;
  preloader: Preloader;

  constructor(parentNode: HTMLElement | null) {
    super(parentNode, 'main', ['sprint-game', 'sprint-game__container']);
    this.preloader = new Preloader(
      this.node,
      'div',
      ['preloader'],
      'LOADING...'
    );
    this.preloader.activate();
    this.dataModel = new GameDataModel();

    SoundManager.preload().then(() => {
      this.categoriesCycle();
    });
  }

  private categoriesCycle() {
    this.preloader.deactivate();
    const categories = new CategoriesPage(this.node);

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
    const allPromisesArr: Array<Promise<IWordData[]>> = [];
    for (let i = 0; i < 10; i++) {
      allPromisesArr.push(
        this.dataModel.getWords(categoryIndex, getRandomNum(0, 29))
      );
    }
    const questionsData: IWordData[] = (
      await Promise.all(allPromisesArr)
    ).flat();
    const randomSortedWordsData = questionsData.sort(() => getRandomNum(-1, 1));
    this.preloader.deactivate();
    const gameField: GameFieldPage = new GameFieldPage(
      this.node,
      randomSortedWordsData
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
    gameField.onFinish = async (results, score) => {
      SoundManager.playSound(ELocalSoundsUrlList.applause);
      await gameField.destroy();
      const gameOverPage = new GameOverPage(this.node, results, score);
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
