import { Control } from '../../../common/templates/control';
import {
  ELocalSoundsUrlList,
  IAnimatingClasses,
  IAnswerData,
  IWordDataWithAnswers /*, IGameSettings*/,
} from '../../interfaces';
import { baseUrl } from '../../gameDataModel';
import { SoundManager } from '../../soundManager';
import { CorrectAnswerView } from './correctAnswerView';
import { AnimatedControl } from '../../../common/templates/animatedControl';
// import { Timer } from "../common/templates/timer";

export class QuestionView extends AnimatedControl {
  // onAnswer!: (answerIndex:number | null, wordData: IWordDataWithAnswers, answered?: boolean)=>void;
  sumUpQuestion!: (answerData: IAnswerData) => void;
  //! узнать, лучше делать одну большую функцию в родительском классе или разделить на две, написав часть функции прямо тут
  // private timer!: Timer;
  //! решить, где лучше делать таймер - в классе вопроса или в странице игры. через .onended или через addEventListener
  questionAudio: HTMLAudioElement;
  questionAudioBtn: Control<HTMLElement>;
  questionDataWrapper: Control<HTMLElement>;
  answersBtnArr: Control<HTMLElement>[];
  answerShown: boolean;
  // bindedWithThisInitTimer!: () => void;

  constructor(
    parentNode: HTMLElement,
    wordData: IWordDataWithAnswers /*gameSettings: IGameSettings,*/,
    animatingClasses: IAnimatingClasses = { hide: 'hide', show: 'show' }
  ) {
    super(
      parentNode,
      'div',
      ['game-page__question-container', 'question-view'],
      animatingClasses
    );
    this.answerShown = false;
    this.questionAudio = SoundManager.playSound(`${baseUrl}/${wordData.audio}`);
    // if (gameSettings.timeEnable){
    //   this.bindedWithThisInitTimer = this.initTimer.bind(this, gameSettings.time, wordData);
    //   this.questionAudio.addEventListener('ended', this.bindedWithThisInitTimer, {once: true});
    // }

    this.questionDataWrapper = new Control(this.node, 'div', [
      'question-view__question-data-wrapper',
      'question-data',
    ]);
    this.questionAudioBtn = new Control(
      this.questionDataWrapper.node,
      'button',
      ['question-data__question-audio-btn'],
      'кнопка звука'
    );
    // this.questionAudioBtn.node.onclick = () => {
    //   if (SoundManager.currentAudio) return;
    //   SoundManager.playSound(`${baseUrl}/${wordData.audio}`);
    // }
    this.questionAudioBtn.node.addEventListener(
      'click',
      this.onQuestionAudioBtnListener.bind(this, wordData.audio)
    );

    this.answersBtnArr = wordData.answers.map((answer, answerIndex) => {
      const button = new Control(
        this.node,
        'button',
        ['question-view__answer-btn'],
        answer.toString()
      );

      button.node.onclick = () => {
        this.onAnswerListener(answerIndex, wordData);
      };

      return button;
    });
  }

  // private initTimer(time: number, wordData: IWordDataWithAnswers) {
  //   this.timer = new Timer(this.node, 'div', ['question-view__timer']);
  //   this.timer.start(time);
  //   this.timer.onTimeout = ()=>{
  //     this.onAnswerListener(null, wordData, false);
  //   }
  // }

  onQuestionAudioBtnListener(audioURL: string) {
    SoundManager.playSound(`${baseUrl}/${audioURL}`);
  }

  onAnswerListener(
    answerIndex: number | null,
    wordData: IWordDataWithAnswers,
    answered: boolean = true
  ) {
    if (this.answerShown) return;
    this.answerShown = true;
    // this.timer.stop();
    const isCorrectAnswer = answerIndex === wordData.correctAnswerIndex;
    isCorrectAnswer
      ? SoundManager.playSound(ELocalSoundsUrlList.success)
      : SoundManager.playSound(ELocalSoundsUrlList.fail);

    const correctAnswerBtn =
      this.answersBtnArr[wordData.correctAnswerIndex].node;
    correctAnswerBtn.style.backgroundColor = 'green';
    if (answered && !isCorrectAnswer) {
      if (answerIndex === null)
        return console.error(
          `invalid answerIndex for mark currentWrongAnswerBtn`
        );
      const currentWrongAnswerBtn = this.answersBtnArr[answerIndex!].node;
      currentWrongAnswerBtn.style.backgroundColor = 'red';
    }

    this.questionAudioBtn.destroy();
    new CorrectAnswerView(this.questionDataWrapper.node, wordData);

    const answerData = {
      wordId: wordData.id,
      word: wordData.word,
      wordTranscription: wordData.transcription,
      wordTranslate: wordData.wordTranslate,
      wordAudioURL: wordData.audio,
      answerResult: isCorrectAnswer,
    };

    this.sumUpQuestion(answerData);
  }

  // destroy() {
  //   if (!this.questionAudio.ended) this.questionAudio.removeEventListener('ended', this.bindedWithThisInitTimer);
  //   super.destroy();
  // }
}
