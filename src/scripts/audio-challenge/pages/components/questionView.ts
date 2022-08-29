import { Control } from '../../../common/templates/control';
import {
  ELocalSoundsUrlList,
  IAnimatingClasses,
  IAnswerData,
  IWordDataWithAnswers,
} from '../../interfaces';
import { baseUrl } from '../../gameDataModel';
import { SoundManager } from '../../soundManager';
import { CorrectAnswerView } from './correctAnswerView';
import { AnimatedControl } from '../../../common/templates/animatedControl';

export class QuestionView extends AnimatedControl {
  // onAnswer!: (answerIndex:number | null, wordData: IWordDataWithAnswers, answered?: boolean)=>void;
  sumUpQuestion!: (answerData: IAnswerData) => void;
  questionAudio: HTMLAudioElement;
  questionAudioBtn: Control<HTMLElement>;
  questionDataWrapper: Control<HTMLElement>;
  answersBtnArr: Control<HTMLElement>[];
  answerShown: boolean;

  constructor(
    parentNode: HTMLElement,
    wordData: IWordDataWithAnswers,
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
}
