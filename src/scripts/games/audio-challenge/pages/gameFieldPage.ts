import { PageControl } from 'src/scripts/common/templates/pageControl';
import { Control } from '../../../common/templates/control';
import { Timer } from '../../../common/templates/timer';
import { getRandomNum } from '../../../common/utils/utils';
import { SoundManager } from '../../common/soundManager';
import {
  IWordData,
  IWordDataWithAnswers,
  IGameSettings,
  IAnswerData,
  IAnimatingClasses,
  ELocalSoundsUrlList,
} from '../interfaces';
import { CorrectAnswerView } from './components/correctAnswerView';
import { QuestionView } from './components/questionView';

export class GameFieldPage extends PageControl {
  onBack!: () => void;
  onHome!: () => void;
  onFinish!: (results: IAnswerData[]) => void;
  answerShown: boolean;
  currentQuestionIndex: number;
  private results: IAnswerData[];
  private gameSettings: IGameSettings;
  private wordsData: IWordDataWithAnswers[];
  private progressIndicator: Control<HTMLElement>;
  private answersIndicator: Control<HTMLElement>;
  private timer!: Timer;
  private questionView!: QuestionView;
  private seeAnswerButton!: Control<HTMLElement>;
  private nextQuestionButton!: Control<HTMLElement>;
  bindedWithThisKeyboardListener: (event: KeyboardEvent) => void;
  bindedWithThisQuestionAudioEndedListener!: () => void;

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
    this.answerShown = false;
    this.currentQuestionIndex = 0;
    this.results = [];
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

    const backButton = new Control(
      this.node,
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
      this.node,
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
      this.node,
      'button',
      ['common-btn', 'game-page__fullscreen-btn'],
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

    this.questionCycle();

    this.bindedWithThisKeyboardListener = this.keyboardListener.bind(this);
    window.addEventListener('keydown', this.bindedWithThisKeyboardListener);
  }

  getWordsDataWithAnswers(wordsData: IWordData[], answersAmount: number) {
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
        const correctAnswerIndex = getRandomNum(0, answersAmount - 1);
        const correctAnswer = wordData.wordTranslate;

        for (let j = 0; j < answersAmount; j++) {
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

  questionCycle() {
    this.progressIndicator.node.textContent = `${
      this.currentQuestionIndex + 1
    } / ${this.gameSettings.questionsInGameAmount}`;
    this.answersIndicator.node.textContent = this.results
      .map((answerData: IAnswerData) => (answerData.answerResult ? '+' : '-'))
      .join(' ');

    this.questionView = new QuestionView(
      this.node,
      this.wordsData[this.currentQuestionIndex]
    );
    this.questionView.answersBtnArr.forEach(
      (answerButton: Control<HTMLElement>, answerIndex: number) => {
        answerButton.node.addEventListener('click', () => {
          this.onAnswer(answerIndex);
        });
      }
    );

    this.seeAnswerButton = new Control(
      this.node,
      'button',
      ['common-btn', 'game-page__see-answer-btn'],
      '***показать ответ***'
    );

    this.seeAnswerButton.node.addEventListener(
      'click',
      this.onSeeAnswerButton.bind(this)
    );

    if (this.gameSettings.timeEnable) {
      this.bindedWithThisQuestionAudioEndedListener =
        this.questionAudioEndedListener.bind(this);
      this.questionView.questionAudio.addEventListener(
        'ended',
        this.bindedWithThisQuestionAudioEndedListener,
        { once: true }
      );
    }
  }

  onAnswer(answerIndex: number | null, answered: boolean = true) {
    if (this.answerShown) return;
    this.timer.stop();
    this.answerShown = true;
    const currentQuestionWordData = this.wordsData[this.currentQuestionIndex];
    const indexOfCorrectAnswer = currentQuestionWordData.correctAnswerIndex;
    const isCorrectAnswer = answerIndex === indexOfCorrectAnswer;
    isCorrectAnswer
      ? SoundManager.playSound(ELocalSoundsUrlList.success)
      : SoundManager.playSound(ELocalSoundsUrlList.fail);

    const correctAnswerBtn =
      this.questionView.answersBtnArr[indexOfCorrectAnswer];
    correctAnswerBtn.node.classList.add('correct-answer');
    if (answered && !isCorrectAnswer) {
      const clickedWrongAnswerBtn =
        this.questionView.answersBtnArr[answerIndex!];
      clickedWrongAnswerBtn.node.classList.add('incorrect-answer');
    }

    this.questionView.questionAudioBtn.destroy();
    new CorrectAnswerView(
      this.questionView.questionDataWrapper.node,
      currentQuestionWordData
    );

    const answerData = {
      wordId: currentQuestionWordData.id,
      word: currentQuestionWordData.word,
      wordTranscription: currentQuestionWordData.transcription,
      wordTranslate: currentQuestionWordData.wordTranslate,
      wordAudioURL: currentQuestionWordData.audio,
      answerResult: isCorrectAnswer,
    };

    this.results.push(answerData);
    this.seeAnswerButton.destroy();

    this.nextQuestionButton = new Control(
      this.node,
      'button',
      ['common-btn', 'game-page__next-question-btn'],
      '->-->--->'
    );
    this.nextQuestionButton.node.addEventListener(
      'click',
      this.onNextQuestionButton.bind(this)
    );
  }

  onSeeAnswerButton() {
    this.onAnswer(null, false);
  }

  async onNextQuestionButton() {
    if (
      this.currentQuestionIndex + 1 >=
      this.gameSettings.questionsInGameAmount
    ) {
      this.onFinish(this.results);
      return;
    }
    this.currentQuestionIndex++;
    this.answerShown = false;
    this.nextQuestionButton.destroy();
    await this.questionView.destroy();
    this.questionCycle();
  }

  questionAudioEndedListener() {
    this.timer.start(this.gameSettings.time);
    this.timer.onTimeout = () => {
      this.onAnswer(null, false);
    };
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
        this.answerShown
          ? this.nextQuestionButton.node.click()
          : this.seeAnswerButton.node.click();
        break;
      default:
        console.log(`unusable key ${clickedKeyCode}`);
        return;
    }
  }

  async destroy(): Promise<void> {
    if (!this.questionView.questionAudio.ended) {
      this.questionView.questionAudio.removeEventListener(
        'ended',
        this.bindedWithThisQuestionAudioEndedListener
      );
    }
    window.removeEventListener('keydown', this.bindedWithThisKeyboardListener);
    this.timer.stop();
    await super.destroy();
  }
}
