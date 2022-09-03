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
  TCorrectAnswersCombinationData,
} from '../interfaces';
import { IAnimatingClasses } from '../../common/commonInterfaces';
import { QuestionView } from './components/questionView';

export class GameFieldPage extends PageControl {
  onBack!: () => void;
  onHome!: () => void;
  onFinish!: (results: IAnswerData[], score: number) => void;
  currentQuestionIndex: number;
  private results: IAnswerData[];
  private wordsData: IWordDataWithAnswers[];
  private timer!: Timer;
  currentScore: number;
  scoreIndicator: Control<HTMLElement>;
  pointsForCorrectAnswer: number;
  pointsForCorrectAnswerIndicator: Control<HTMLElement>;
  correctAnswersCombinationData: TCorrectAnswersCombinationData;
  private correctAnswersCombinationIndicator: Control<HTMLElement>;
  private questionView!: QuestionView;
  bindedWithThisKeyboardListener: (event: KeyboardEvent) => void;
  bindedWithThisQuestionAudioEndedListener!: () => void;
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
    this.currentScore = 0;
    this.results = [];
    this.correctAnswersCombinationData = [false, false, false];
    this.pointsForCorrectAnswer =
      IGameSettings.defaultNumberOfPointsForCorrectAnswer;
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

    this.scoreIndicator = new Control(
      this.mainFieldWrapper.node,
      'span',
      ['scoreIndicator'],
      `Текущий результат: 0`
    );

    this.pointsForCorrectAnswerIndicator = new Control(
      this.mainFieldWrapper.node,
      'div',
      ['pointsForCorrectAnswerIndicator'],
      `Очков за слово +${this.pointsForCorrectAnswer}`
    );

    this.correctAnswersCombinationIndicator = new Control(
      this.mainFieldWrapper.node,
      'div',
      ['correctAnswersCombinationIndicator']
    );

    this.questionWrapper = new Control(this.mainFieldWrapper.node, 'div', [
      'game-page__question-wrapper',
    ]);

    this.questionCycle();

    this.timer.start(IGameSettings.time);
    this.timer.onTimeout = () => {
      this.onFinish(this.results, this.currentScore);
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

    this.bindedWithThisKeyboardListener = this.keyboardListener.bind(this);
    window.addEventListener('keydown', this.bindedWithThisKeyboardListener);
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

    if (isCorrectAnswer) {
      this.currentScore += this.pointsForCorrectAnswer;
      this.scoreIndicator.node.textContent = `Текущий результат: ${this.currentScore}`;
    }

    const answerData = {
      wordId: currentQuestionWordData.id,
      word: currentQuestionWordData.word,
      wordTranscription: currentQuestionWordData.transcription,
      wordTranslate: currentQuestionWordData.wordTranslate,
      wordAudioURL: currentQuestionWordData.audio,
      answerResult: isCorrectAnswer,
    };

    this.results.push(answerData);

    this.uploadCorrectAnswersCombination(isCorrectAnswer);
    this.currentQuestionIndex++;
    this.questionView.destroy();
    this.questionCycle();
  }

  uploadCorrectAnswersCombination(isCorrectCurrentAnswer: boolean) {
    if (!isCorrectCurrentAnswer) {
      this.correctAnswersCombinationData = [false, false, false];
      this.pointsForCorrectAnswer =
        IGameSettings.defaultNumberOfPointsForCorrectAnswer;
      this.pointsForCorrectAnswerIndicator.node.textContent = `Очков за слово +${this.pointsForCorrectAnswer}`;
      return;
    }

    const indexOfFirstFalseItem =
      this.correctAnswersCombinationData.indexOf(false);

    if (indexOfFirstFalseItem === -1) {
      this.correctAnswersCombinationData = [false, false, false];
      if (
        this.pointsForCorrectAnswer <
        IGameSettings.maximumNumberOfPointsForCorrectAnswer
      )
        this.pointsForCorrectAnswer +=
          IGameSettings.increasingNumberOfPointsForCorrectAnswer;
      this.pointsForCorrectAnswerIndicator.node.textContent = `Очков за слово +${this.pointsForCorrectAnswer}`;
    } else {
      this.correctAnswersCombinationData[indexOfFirstFalseItem] = true;
    }

    this.correctAnswersCombinationIndicator.node.textContent =
      this.correctAnswersCombinationData
        .map((combinationItem: boolean) => (combinationItem ? '+' : '-'))
        .join(' ');
  }

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
      case 'ArrowRight':
        this.onAnswer.bind(this, false);
        break;
      case 'ArrowLeft':
        this.onAnswer.bind(this, true);
        break;
      default:
        console.log(`unusable key ${clickedKeyCode}`);
        return;
    }
  }

  async destroy(): Promise<void> {
    window.removeEventListener('keydown', this.bindedWithThisKeyboardListener);
    this.timer.stop();
    await super.destroy();
  }
}
