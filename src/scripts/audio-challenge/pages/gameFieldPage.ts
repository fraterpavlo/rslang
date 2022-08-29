import { AnimatedControl } from '../../common/templates/animatedControl';
import { Control } from '../../common/templates/control';
import { Timer } from '../../common/templates/timer';
import { getRandomNum } from '../../common/utils/utils';
import {
  IWordData,
  IWordDataWithAnswers,
  IGameSettings,
  IAnswerData,
  IAnimatingClasses,
} from '../interfaces';
import { QuestionView } from './components/questionView';

export class GameFieldPage extends AnimatedControl {
  onBack!: () => void;
  onHome!: () => void;
  onFinish!: (results: IAnswerData[]) => void;
  private gameSettings: IGameSettings;
  private wordsData: IWordDataWithAnswers[];
  private results: IAnswerData[];
  private progressIndicator: Control<HTMLElement>;
  private answersIndicator: Control<HTMLElement>;
  private timer!: Timer;
  private questionView!: QuestionView;
  private nextQuestionButton!: Control<HTMLElement>;
  private seeAnswerButton!: Control<HTMLElement>;
  bindedWithThisKeyboardListener: (event: KeyboardEvent) => void;
  // bindedWithThisQuestionAudioEndedListener!: (currentQuestionIndex: number) => void;

  constructor(
    parentNode: HTMLElement,
    wordsData: IWordData[],
    gameSettings: IGameSettings,
    animatingClasses: IAnimatingClasses = { hide: 'hide', show: 'show' }
  ) {
    super(
      parentNode,
      'div',
      ['game-page', 'game-page__container'],
      animatingClasses
    );
    gameSettings.questionsInGameAmount = Math.min(
      wordsData.length,
      gameSettings.questionsInGameAmount
    );
    const wordsDataWithAnswers = this.getWordsDataWithAnswers(
      wordsData,
      gameSettings.answersInRoundAmount
    );
    this.wordsData = wordsDataWithAnswers;
    this.gameSettings = gameSettings;
    this.results = [];

    const backButton = new Control(
      this.node,
      'button',
      ['game-page__back-btn'],
      'back'
    );
    backButton.node.addEventListener(
      'click',
      () => {
        this.onBack();
      },
      { once: true }
    );

    const homeButton = new Control(
      this.node,
      'button',
      ['game-page__home-btn'],
      'home'
    );
    homeButton.node.addEventListener(
      'click',
      () => {
        this.onHome();
      },
      { once: true }
    );

    const fullScreenButton = new Control(
      this.node,
      'button',
      ['game-page__fullscreen-btn'],
      'fullscreen'
    );
    fullScreenButton.node.addEventListener('click', this.toggleFullScreen);

    this.progressIndicator = new Control(
      this.node,
      'div',
      ['progressIndicator'],
      ''
    );

    this.timer = new Timer(this.node, 'div', ['game-page__timer']);

    this.answersIndicator = new Control(
      this.node,
      'div',
      ['answersIndicator'],
      ''
    );

    this.questionCycle(0, () => {
      this.onFinish(this.results);
    });

    this.bindedWithThisKeyboardListener = this.keyboardListener.bind(this);
    window.addEventListener('keydown', this.bindedWithThisKeyboardListener);
  }

  getWordsDataWithAnswers(wordsData: IWordData[], answersCount: number) {
    const resultWordsData: IWordDataWithAnswers[] = wordsData.map(
      (wordData: IWordData): IWordDataWithAnswers => {
        const getRandomAnswer = (correctAnswer: string): string => {
          const randomAnswer =
            wordsData[getRandomNum(0, wordsData.length - 1)].wordTranslate;
          const isExist = answers.includes(randomAnswer);
          const isCorrectAnswer = randomAnswer === correctAnswer;

          if (isExist || isCorrectAnswer) return getRandomAnswer(correctAnswer);
          return randomAnswer;
        };

        const answers: string[] = [];
        const correctAnswerIndex = getRandomNum(0, answersCount - 1);
        const correctAnswer = wordData.wordTranslate;

        for (let j = 0; j < answersCount; j++) {
          correctAnswerIndex === j
            ? answers.push(correctAnswer)
            : answers.push(getRandomAnswer(correctAnswer));
        }

        const resultData = {
          ...wordData,
          answers,
          correctAnswerIndex,
        };
        return resultData;
      }
    );

    return resultWordsData;
  }

  questionCycle(
    currentQuestionIndex: number,
    onFinish: (results: IAnswerData[]) => void
  ) {
    this.progressIndicator.node.textContent = `${currentQuestionIndex + 1} / ${
      this.gameSettings.questionsInGameAmount
    }`;
    this.answersIndicator.node.textContent = this.results
      .map((answerData: IAnswerData) => (answerData.answerResult ? '+' : '-'))
      .join(' ');

    this.questionView = new QuestionView(
      this.node,
      this.wordsData[currentQuestionIndex]
    );
    this.questionView.sumUpQuestion = (answerData: IAnswerData) => {
      this.timer.stop();
      this.results.push(answerData);
      this.seeAnswerButton.destroy();

      this.nextQuestionButton = new Control(
        this.node,
        'button',
        ['game-page__next-question-btn'],
        '->-->--->'
      );
      this.nextQuestionButton.node.addEventListener(
        'click',
        this.onNextQuestionButton.bind(this, currentQuestionIndex, onFinish)
      );
    };

    this.seeAnswerButton = new Control(
      this.node,
      'button',
      ['game-page__see-answer-btn'],
      '***показать ответ***'
    );
    this.seeAnswerButton.node.addEventListener(
      'click',
      this.onSeeAnswerButton.bind(this, this.wordsData[currentQuestionIndex])
    );

    if (this.gameSettings.timeEnable) {
      // this.bindedWithThisQuestionAudioEndedListener = this.questionAudioEndedListener.bind(this, currentQuestionIndex);
      // this.questionView.questionAudio.addEventListener('ended',  this.bindedWithThisQuestionAudioEndedListener, {once: true});
      this.questionView.questionAudio.onended = () => {
        this.timer.start(this.gameSettings.time);
        this.timer.onTimeout = () => {
          this.questionView.onAnswerListener(
            null,
            this.wordsData[currentQuestionIndex],
            false
          );
        };
        this.questionView.questionAudio.onended = null;
      };
    }
  }

  onSeeAnswerButton(wordData: IWordDataWithAnswers) {
    this.questionView.onAnswerListener(null, wordData, false);
  }

  async onNextQuestionButton(
    currentQuestionIndex: number,
    onFinish: (results: IAnswerData[]) => void
  ) {
    if (currentQuestionIndex + 1 >= this.gameSettings.questionsInGameAmount) {
      onFinish(this.results);
      return;
    }
    this.nextQuestionButton.destroy();
    await this.questionView.destroy();
    this.questionCycle(currentQuestionIndex + 1, onFinish);
  }

  // questionAudioEndedListener(currentQuestionIndex: number) {
  //   this.timer.start(this.gameSettings.time);
  //   this.timer.onTimeout = () => {
  //     this.questionView.onAnswerListener(
  //       null,
  //       this.wordsData[currentQuestionIndex],
  //       false
  //     );
  //   };
  // }

  keyboardListener(event: KeyboardEvent) {
    event.preventDefault();
    if (event.repeat) return;
    const clickedKeyCode = event.code;

    switch (clickedKeyCode) {
      case 'Escape':
        this.onHome();
        break;
      case 'Backspace':
        this.onBack();
        break;
      case 'Space':
        this.questionView.questionAudioBtn.node.click();
        break;
      case 'Digit1':
        this.questionView.answersBtnArr[0].node.click();
        break;
      case 'Digit2':
        this.questionView.answersBtnArr[1].node.click();
        break;
      case 'Digit3':
        this.questionView.answersBtnArr[2].node.click();
        break;
      case 'Digit4':
        this.questionView.answersBtnArr[3].node.click();
        break;
      case 'Digit5':
        this.questionView.answersBtnArr[4].node.click();
        break;
      case 'Enter':
        this.questionView.answerShown
          ? this.nextQuestionButton.node.click()
          : this.seeAnswerButton.node.click();
        break;
      default:
        console.log(`unusable key ${clickedKeyCode}`);
        return;
    }
  }

  toggleFullScreen() {
    document.fullscreenElement
      ? document.exitFullscreen()
      : document.documentElement.requestFullscreen();
    // if (!document.fullscreenElement) {
    //   document.documentElement.requestFullscreen();
    // } else {
    //   if (document.exitFullscreen) {
    //     document.exitFullscreen();
    //   }
    // }
  }

  async destroy(): Promise<void> {
    if (!this.questionView.questionAudio.ended)
      this.questionView.questionAudio.onended = null;
    window.removeEventListener('keydown', this.bindedWithThisKeyboardListener);
    this.timer.stop();
    await super.destroy();
  }
}
