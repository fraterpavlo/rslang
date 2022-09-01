import { PageControl } from '../../common/templates/pageControl';
import { Control } from '../../../common/templates/control';
import { Timer } from '../../common/templates/timer';
import { getRandomNum } from '../../../common/utils/utils';
import { SoundManager } from '../../common/soundManager';
import { IWordData } from '../../common/commonInterfaces';
import {
  IAnswerData,
  IWordDataWithAnswers,
  ELocalSoundsUrlList,
  IGameSettings,
} from '../interfaces';
import { IAnimatingClasses } from '../../common/commonInterfaces';
import { QuestionView } from './components/questionView';

export class GameFieldPage extends PageControl {
  onBack!: () => void;
  onHome!: () => void;
  onFinish!: (results: IAnswerData[]) => void;
  currentQuestionIndex: number;
  private results: IAnswerData[];
  private wordsData: IWordDataWithAnswers[];
  private answersIndicator: Control<HTMLElement>;
  private timer!: Timer;
  private questionView!: QuestionView;
  // bindedWithThisKeyboardListener: (event: KeyboardEvent) => void;
  // bindedWithThisQuestionAudioEndedListener!: () => void;
  mainFieldWrapper: Control<HTMLElement>;
  questionWrapper: Control<HTMLElement>;

  constructor(
    parentNode: HTMLElement,
    wordsData: IWordData[],
    animatingClasses: IAnimatingClasses = { hide: 'hide', show: 'show' }
  ) {
    super(
      parentNode,
      'div',
      ['game-page', 'game-page__container'],
      animatingClasses
    );
    this.currentQuestionIndex = 0;
    this.results = [];
    this.wordsData = this.getWordsDataWithAnswers(wordsData);

    const headPanelWrapper = new Control(this.node, 'div', [
      'game-page__head-panel',
    ]);
    const exitButtonsWrapper = new Control(headPanelWrapper.node, 'div', [
      'game-page__exit-buttons-wrapper',
    ]);

    const backButton = new Control(
      exitButtonsWrapper.node,
      'button',
      ['common-btn', 'game-page__back-btn'],
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
      exitButtonsWrapper.node,
      'button',
      ['common-btn', 'game-page__home-btn'],
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
      headPanelWrapper.node,
      'button',
      ['common-btn', 'game-page__fullscreen-btn'],
      'fullscreen'
    );
    fullScreenButton.node.addEventListener('click', this.toggleFullScreen);

    this.mainFieldWrapper = new Control(this.node, 'div', [
      'game-page__main-field',
      'main-field',
    ]);

    this.timer = new Timer(this.mainFieldWrapper.node, 'div', [
      'game-page__timer',
    ]);

    this.answersIndicator = new Control(this.mainFieldWrapper.node, 'div', [
      'answersIndicator',
    ]);

    this.questionWrapper = new Control(this.mainFieldWrapper.node, 'div', [
      'game-page__question-wrapper',
    ]);

    this.questionCycle();

    this.timer.start(IGameSettings.time);
    this.timer.onTimeout = () => {
      this.onFinish(this.results);
    };

    const positiveAnswerBtn = new Control(
      this.mainFieldWrapper.node,
      'button',
      ['common-btn', 'question-view__answer-btn'],
      'верно'
    );
    positiveAnswerBtn.node.addEventListener(
      'click',
      this.onAnswer.bind(this, true)
    );

    const negativeAnswerBtn = new Control(
      this.mainFieldWrapper.node,
      'button',
      ['common-btn', 'question-view__answer-btn'],
      'неверно'
    );
    negativeAnswerBtn.node.addEventListener(
      'click',
      this.onAnswer.bind(this, false)
    );

    // this.bindedWithThisKeyboardListener = this.keyboardListener.bind(this);
    // window.addEventListener('keydown', this.bindedWithThisKeyboardListener);
  }

  getWordsDataWithAnswers(wordsData: IWordData[]) {
    return wordsData.map((wordData: IWordData): IWordDataWithAnswers => {
      const getRandomIncorrectTranslate = (
        correctTranslate: string
      ): string => {
        const randomTranslate =
          wordsData[getRandomNum(0, wordsData.length - 1)].wordTranslate;
        const isCorrectAnswer = randomTranslate === correctTranslate;

        if (isCorrectAnswer)
          return getRandomIncorrectTranslate(correctTranslate);
        return randomTranslate;
      };

      const correctTranslate = wordData.wordTranslate;
      const answer = !!Math.round(Math.random());
      let likelyTranslate: string;

      answer
        ? (likelyTranslate = correctTranslate)
        : (likelyTranslate = getRandomIncorrectTranslate(correctTranslate));

      const resultData = {
        ...wordData,
        likelyTranslate,
        answer,
      };
      return resultData;
    });
  }

  questionCycle() {
    this.answersIndicator.node.textContent = this.results
      .map((answerData: IAnswerData) => (answerData.answerResult ? '+' : '-'))
      .join(' ');

    this.questionView = new QuestionView(
      this.questionWrapper.node,
      this.wordsData[this.currentQuestionIndex]
    );
  }

  onAnswer(answer: boolean) {
    const currentQuestionWordData = this.wordsData[this.currentQuestionIndex];
    const isCorrectAnswer = answer === currentQuestionWordData.answer;
    isCorrectAnswer
      ? SoundManager.playSound(ELocalSoundsUrlList.success)
      : SoundManager.playSound(ELocalSoundsUrlList.fail);

    const answerData = {
      wordId: currentQuestionWordData.id,
      word: currentQuestionWordData.word,
      wordTranscription: currentQuestionWordData.transcription,
      wordTranslate: currentQuestionWordData.wordTranslate,
      wordAudioURL: currentQuestionWordData.audio,
      answerResult: isCorrectAnswer,
    };

    this.results.push(answerData);

    this.currentQuestionIndex++;
    this.questionView.destroy();
    this.questionCycle();
  }

  // onSeeAnswerButton() {
  //   this.onAnswer(null, false);
  // }

  // async onNextQuestionButton() {
  //   if (
  //     this.currentQuestionIndex + 1 >=
  //     this.gameSettings.questionsInGameAmount
  //   ) {
  //     this.onFinish(this.results);
  //     return;
  //   }
  //   this.currentQuestionIndex++;
  //   this.answerShown = false;
  //   this.nextQuestionButton.destroy();
  //   await this.questionView.destroy();
  //   this.questionCycle();
  // }

  // questionAudioEndedListener() {
  //   this.timer.start(this.gameSettings.time);
  //   this.timer.onTimeout = () => {
  //     this.onAnswer(null, false);
  //   };
  // }

  // keyboardListener(event: KeyboardEvent) {
  //   event.preventDefault();
  //   if (event.repeat) return;
  //   const clickedKeyCode = event.code;

  //   switch (clickedKeyCode) {
  //     case 'Escape':
  //       this.onHome();
  //       break;
  //     case 'Backspace':
  //       this.onBack();
  //       break;
  //     case 'Space':
  //       this.questionView.questionAudioBtn.node.click();
  //       break;
  //     case 'Digit1':
  //       this.questionView.answersBtnArr[0].node.click();
  //       break;
  //     case 'Digit2':
  //       this.questionView.answersBtnArr[1].node.click();
  //       break;
  //     case 'Digit3':
  //       this.questionView.answersBtnArr[2].node.click();
  //       break;
  //     case 'Digit4':
  //       this.questionView.answersBtnArr[3].node.click();
  //       break;
  //     case 'Digit5':
  //       this.questionView.answersBtnArr[4].node.click();
  //       break;
  //     case 'Enter':
  //       this.answerShown
  //         ? this.nextQuestionButton.node.click()
  //         : this.seeAnswerButton.node.click();
  //       break;
  //     default:
  //       console.log(`unusable key ${clickedKeyCode}`);
  //       return;
  //   }
  // }

  async destroy(): Promise<void> {
    // window.removeEventListener('keydown', this.bindedWithThisKeyboardListener);
    this.timer.stop();
    await super.destroy();
  }
}
