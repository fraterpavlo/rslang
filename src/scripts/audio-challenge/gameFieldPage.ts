import { Control } from "../common/templates/control";
import { Timer } from "../common/templates/timer";
import { getRandomNum } from "../common/utils/utils";
import { IGameOptions, IWordData, IWordDataWithAnswers, IGameSettings, IAnswerData } from './interfaces';
import { QuestionView } from "./questionView";

export class GameFieldPage extends Control{
  onBack!: ()=>void;
  onHome!: ()=>void;
  onFinish!: (results:IAnswerData[])=>void;
  // gameOptions: IGameOptions;
  progressIndicator: Control<HTMLElement>;
  results: IAnswerData[];
  answersIndicator: Control<HTMLElement>;
  timer: Timer;

  constructor(
    parentNode:HTMLElement, gameOptions: IGameOptions) {
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

      const getRandomAnswer = (correctAnswer: string): string => {
        const randomAnswer = wordsData[getRandomNum(0, wordsData.length - 1)].wordTranslate;
        const isExist = answers.includes(randomAnswer);
        const isCorrectAnswer = randomAnswer === correctAnswer
  
        if (isExist || isCorrectAnswer) return getRandomAnswer(correctAnswer);
        return randomAnswer;
      }

      const answers: string[] = [];
      const correctAnswerIndex = getRandomNum(0, answersCount-1);
      const correctAnswer = wordData.wordTranslate;

      for(let j=0; j<answersCount; j++){
        correctAnswerIndex === j
          ? answers.push(correctAnswer)
          : answers.push(getRandomAnswer(correctAnswer))
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

  questionCycle(wordsData: IWordDataWithAnswers[], gameSettings: IGameSettings, questionIndex:number, onFinish:()=>void) {

    if (questionIndex >= wordsData.length){ 
      onFinish();
      return;
    }

    this.progressIndicator.node.textContent = `${questionIndex+1} / ${wordsData.length}`;
    this.answersIndicator.node.textContent = this.results.map((answerData: IAnswerData)=>answerData.answerResult?'+':'-').join(' ');

    const questionView = new QuestionView(this.node, wordsData[questionIndex]);
    questionView.sumUpQuestion = (answerData: IAnswerData) => {
      this.timer.stop();
      this.results.push(answerData);
      seeAnswerButton.destroy();

      const nextQuestionButton = new Control(this.node, 'button', ['game-page__next-question-btn'], '->-->--->');
      nextQuestionButton.node.onclick = ()=>{
          questionView.destroy();
          nextQuestionButton.destroy();
          this.questionCycle(wordsData, gameSettings, questionIndex+1, onFinish);
      }
    };

    const seeAnswerButton = new Control(this.node, 'button', ['game-page__see-answer-btn'], '***показать ответ***');
    seeAnswerButton.node.onclick = ()=>{
      questionView.onAnswerListener(null, wordsData[questionIndex], false);
    }

    if (gameSettings.timeEnable){
      questionView.questionAudio.addEventListener('ended', () => {
        this.timer.start(gameSettings.time);
        this.timer.onTimeout = ()=>{
          questionView.onAnswerListener(null, wordsData[questionIndex], false);
          // questionView.destroy();
          // this.results.push(false);
          // SoundManager.playSound(ELocalSoundsUrlList.fail);
          // this.questionCycle(wordsData, gameSettings, questionIndex+1, onFinish);
        }
      }, {once: true})
    }
    // questionView.onAnswer = (answerIndex: number | null, wordData: IWordDataWithAnswers, answered: boolean = true) => {
    //   this.timer.stop();
    //   const isCorrectAnswer = (answerIndex === wordData.correctAnswerIndex);
    //   isCorrectAnswer 
    //   ? SoundManager.playSound(ELocalSoundsUrlList.success)
    //   : SoundManager.playSound(ELocalSoundsUrlList.fail);

    //   const correctAnswerBtn = questionView.answersBtnArr[wordData.correctAnswerIndex].node;
    //   correctAnswerBtn.style.backgroundColor = "green";
    //   if (answered && !isCorrectAnswer) {
    //     if (answerIndex === null) return console.error(`invalid answerIndex for mark currentWrongAnswerBtn`);
    //     const currentWrongAnswerBtn = questionView.answersBtnArr[answerIndex!].node;
    //     currentWrongAnswerBtn.style.backgroundColor = "red";
    //   }

    //   const answerData = {
    //     wordId: wordData.id,
    //     word: wordData.word,
    //     wordTranscription: wordData.transcription,
    //     wordTranslate: wordData.wordTranslate,
    //     wordAudioURL: wordData.audio,
    //     answerResult: isCorrectAnswer
    //   }
    //   this.results.push(answerData);
  
    //   questionView.questionAudioBtn.destroy();
    //   new CorrectAnswerView(questionView.questionInfoWrapper.node, wordData);

    //   this.questionCycle(wordsData, gameSettings, questionIndex+1, onFinish);
    // };
  }

  destroy(){
    this.timer.stop();
    super.destroy();
  }
}
