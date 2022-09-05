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
  mainFieldWrapper: Control<HTMLElement>;
  currentQuestionIndex: number;
  private results: IAnswerData[];
  private wordsData: IWordDataWithAnswers[];
  private timer!: Timer;
  currentScore: number;
  scoreIndicator: Control<HTMLElement>;
  pointsForCorrectAnswer: number;
  pointsForCorrectAnswerIndicator: Control<HTMLElement>;
  correctAnswersCombinationData: TCorrectAnswersCombinationData;
  private answersCombinationIndicatorsArr: Control<HTMLElement>[];
  questionArea: Control<HTMLElement>;
  private questionView!: QuestionView;
  bindedWithThisKeyboardListener: (event: KeyboardEvent) => void;
  bindedWithThisQuestionAudioEndedListener!: () => void;

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

    const backButton = new Control(exitButtonsWrapper.node, 'button', [
      'game-page__back-btn',
    ]);
    backButton.node.addEventListener(
      'click',
      () => {
        this.onBack();
      },
      { once: true }
    );

    const homeButton = new Control(exitButtonsWrapper.node, 'button', [
      'game-page__home-btn',
    ]);
    homeButton.node.addEventListener(
      'click',
      () => {
        this.onHome();
      },
      { once: true }
    );

    const fullScreenButton = new Control(headPanelWrapper.node, 'button', [
      'game-page__fullscreen-btn',
    ]);
    fullScreenButton.node.addEventListener('click', this.toggleFullScreen);

    this.mainFieldWrapper = new Control(this.node, 'div', [
      'game-page__main-field',
      'main-field',
    ]);

    this.timer = new Timer(this.mainFieldWrapper.node, 'div', [
      'main-field__timer',
    ]);

    this.scoreIndicator = new Control(
      this.mainFieldWrapper.node,
      'span',
      ['main-field__score-indicator'],
      `Текущий результат: 0`
    );

    this.pointsForCorrectAnswerIndicator = new Control(
      this.mainFieldWrapper.node,
      'div',
      ['main-field__points-for-answer-indicator'],
      `Очков за слово +${this.pointsForCorrectAnswer}`
    );

    this.answersCombinationIndicatorsArr = [];
    const answersCombinationIndicatorsWrapper = new Control(
      this.mainFieldWrapper.node,
      'div',
      [
        'main-field__answers-combination-indicator-wrap',
        'answers-combination-indicator',
      ]
    );
    for (let i = 0; i < 3; i++) {
      this.answersCombinationIndicatorsArr.push(
        new Control(answersCombinationIndicatorsWrapper.node, 'div', [
          'answers-combination-indicator__item',
        ])
      );
    }

    this.questionArea = new Control(this.mainFieldWrapper.node, 'div', [
      'main-field__question-area',
    ]);

    this.questionCycle();

    this.timer.start(IGameSettings.time);
    this.timer.onTimeout = () => {
      this.onFinish(this.results, this.currentScore);
    };

    const answersButtonsWrapper = new Control(
      this.mainFieldWrapper.node,
      'div',
      ['main-field__answers-buttons-wrap']
    );

    const positiveAnswerBtn = new Control(
      answersButtonsWrapper.node,
      'button',
      ['common-btn', 'main-field__correct-answer-btn'],
      'верно'
    );
    positiveAnswerBtn.node.addEventListener(
      'click',
      this.onAnswer.bind(this, true)
    );

    const negativeAnswerBtn = new Control(
      answersButtonsWrapper.node,
      'button',
      ['common-btn', 'main-field__incorrect-answer-btn'],
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
      this.questionArea.node,
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
    const renderAnswersCombinationIndicators = () => {
      this.answersCombinationIndicatorsArr.forEach(
        (indicatorItem: Control<HTMLElement>, idx: number) => {
          this.correctAnswersCombinationData[idx]
            ? indicatorItem.node.classList.add('correct-answer')
            : indicatorItem.node.classList.remove('correct-answer');
        }
      );
    };

    if (!isCorrectCurrentAnswer) {
      this.correctAnswersCombinationData = [false, false, false];
      this.pointsForCorrectAnswer =
        IGameSettings.defaultNumberOfPointsForCorrectAnswer;
      this.pointsForCorrectAnswerIndicator.node.textContent = `Очков за слово +${this.pointsForCorrectAnswer}`;
      renderAnswersCombinationIndicators();
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

    renderAnswersCombinationIndicators();
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
        return;
    }
  }

  async destroy(): Promise<void> {
    window.removeEventListener('keydown', this.bindedWithThisKeyboardListener);
    this.timer.stop();
    await super.destroy();
  }
}
