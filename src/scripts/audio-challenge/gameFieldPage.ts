import { Control } from "../common/templates/control";
import { Timer } from "../common/templates/timer";
import { getRandomNum } from "../common/utils/utils";
import { IGameOptions, IWordData, IWordDataWithAnswers, IGameSettings } from './interfaces';
import { QuestionView } from "./questionView";


export class GameFieldPage extends Control{
  onBack!: ()=>void;
  onHome!: ()=>void;
  onFinish!: (results:boolean[])=>void;
  // gameOptions: IGameOptions;
  progressIndicator: Control<HTMLElement>;
  results: boolean[];
  answersIndicator: Control<HTMLElement>;
  timer: Timer;

  constructor(
    parentNode:HTMLElement, gameOptions: IGameOptions){
    super(parentNode, 'div', ['game-page', 'page']);
    // this.gameOptions =  gameOptions;
    this.results = [];

    const backButton = new Control(this.node, 'button', ['game-page__back-btn'], 'back');
    backButton.node.onclick = ()=>{
      this.onBack();
    }

    const homeButton = new Control(this.node, 'button', ['game-page__home-btn'], 'home');
    homeButton.node.onclick = ()=>{
      this.onHome();
    }

    this.timer = new Timer(this.node);
    this.progressIndicator = new Control(this.node, 'div', ['progressIndicator'], '');
    this.answersIndicator = new Control(this.node, 'div', ['answersIndicator'], '');

    const wordsDataWithAnswers = this.getWordsDataWithAnswers(gameOptions.wordsData, gameOptions.gameSettings.answersInRoundAmount);
    

    this.questionCycle(wordsDataWithAnswers, gameOptions.gameSettings, 0, ()=>{
      this.onFinish(this.results);
    });
  }

  getWordsDataWithAnswers(wordsData: IWordData[], answersCount: number) {

    const resultWordsData: IWordDataWithAnswers[] = wordsData.map((wordData: IWordData): IWordDataWithAnswers => {
      const answers = [];
      const correctAnswerIndex = getRandomNum(0, answersCount-1);
      const correctAnswer = wordData.wordTranslate;

      for(let j=0; j<answersCount; j++){
        if (correctAnswerIndex == j){
          answers.push(correctAnswer);
        } else {          
          const randomAnswer = wordsData[getRandomNum(0, wordsData.length - 1)].wordTranslate;
          answers.push(randomAnswer);
        }
      }
      
      const resultData = {
        ...wordData,
        answers,
        correctAnswerIndex
      }
      return resultData;
    })

    return resultWordsData;
  }

  questionCycle(wordsData: IWordDataWithAnswers[], gameSettings: IGameSettings, questionIndex:number, onFinish:()=>void){

    if (questionIndex >= wordsData.length){ 
      onFinish();
      return;
    }

    this.progressIndicator.node.textContent = `${questionIndex+1} / ${wordsData.length}`;
    this.answersIndicator.node.textContent = this.results.map((it: boolean)=>it?'+':'-').join(' ');
    if (gameSettings.timeEnable){
      this.timer.start(gameSettings.time);
      this.timer.onTimeout = ()=>{
        questionView.destroy();
        this.results.push(false);
        // SoundManager.fail();
        this.questionCycle(wordsData, gameSettings, questionIndex+1, onFinish);
      }
    }
    const questionView = new QuestionView(this.node, wordsData[questionIndex]);
    questionView.onAnswer = answerIndex=>{
      // questionView.animateOut().then(()=>{

      // })
      questionView.destroy();
      const isCorrectAnswer = answerIndex === wordsData[questionIndex].correctAnswerIndex;
      // if (isCorrectAnswer) {
      //   SoundManager.ok();
      // } else {
      //   SoundManager.fail();
      // }
      this.results.push(isCorrectAnswer);
      this.questionCycle(wordsData, gameSettings, questionIndex+1, onFinish);
    };
  }

  destroy(){
    this.timer.stop();
    super.destroy();
  }
}
