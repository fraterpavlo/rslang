import { Control } from "../common/templates/control";
import { getRandomNum } from "../common/utils/utils";
import { CategoriesPage } from "./categoriesPage";
import { GameFieldPage } from "./gameFieldPage";
import { GameSettingsModel } from './gameSettingsModel';
import { GameDataModel } from "./gameDataModel";
import { IWordData, IGameSettings } from './interfaces';
import { GameOverPage } from "./gameOverPage";

export class AudioChallengeApp extends Control {
  dataModel: GameDataModel;
  settingsModel: GameSettingsModel;

  constructor(parentNode: HTMLElement | null) {
    super(parentNode, 'div', ['main-wrapper']);

    this.settingsModel = new GameSettingsModel();
    this.dataModel = new GameDataModel();

    this.categoriesCycle();
  }

  private categoriesCycle(){
    const gameSettings = this.settingsModel.getData();
    const categories = new CategoriesPage(this.node, gameSettings);

      categories.onHome=()=>{
        categories.destroy();
        //!to do onHome function
        console.log('to do onHome function');
      }
      categories.onSelect=(categoryIndex: number)=>{
        categories.destroy();
        this.gameCycle(categoryIndex);
      }
  }

  private async gameCycle(categoryIndex: number){
    const randomPageInCategory = getRandomNum(0, 29);
    const questionsData: IWordData[] = await this.dataModel.getWords(categoryIndex, randomPageInCategory);
    const randomSortedWordsData = questionsData.sort(() => getRandomNum(-1, 1));
    const gameSettings: IGameSettings = this.settingsModel.getData();
    const gameOptions = {
      // categoryIndex,
      wordsData: randomSortedWordsData,
      gameSettings,
    }

    const gameField: GameFieldPage = new GameFieldPage(this.node, gameOptions);
    gameField.onHome = ()=>{
      gameField.destroy();
      //!to do onHome function
      console.log('to do onHome function');
    }
    gameField.onBack = ()=>{
      gameField.destroy();
      this.categoriesCycle();
    }
    gameField.onFinish = (results)=>{
      gameField.destroy();
      const gameOverPage = new GameOverPage(this.node, results);
      gameOverPage.onHome = ()=>{
        gameOverPage.destroy();
        this.categoriesCycle();
      }
      gameOverPage.onNext = ()=>{
        gameOverPage.destroy();
        this.categoriesCycle();
      }
    }
  }

  render() {
    return this.node;
  }
}
