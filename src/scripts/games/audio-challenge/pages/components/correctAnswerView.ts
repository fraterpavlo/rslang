import { Control } from '../../../../common/templates/control';
import { IWordDataWithAnswers } from '../../interfaces';
import { IAnimatingClasses } from '../../../common/commonInterfaces';
import { baseUrl } from '../../../common/gameDataModel';
import { SoundManager } from '../../../common/soundManager';
import { AnimatedControl } from '../../../common/templates/animatedControl';

export class CorrectAnswerView extends AnimatedControl {
  answerImage: Control<HTMLElement>;
  wordInfoWrapper: Control<HTMLElement>;
  audioWord: Control<HTMLElement>;
  textWord: Control<HTMLElement>;
  transcriptionWord: Control<HTMLElement>;
  exampleInfoWrapper: Control<HTMLElement>;
  audioExample: Control<HTMLElement>;
  textExample: Control<HTMLElement>;
  textExampleTranslate: Control<HTMLElement>;

  constructor(
    parentNode: HTMLElement,
    questionData: IWordDataWithAnswers,
    animatingClasses: IAnimatingClasses = {
      hide: 'hide',
      show: 'show',
    }
  ) {
    super(
      parentNode,
      'div',
      ['question-view__correct-answer-wrap', 'correct-answer-view'],
      animatingClasses
    );

    this.answerImage = new Control(this.node, 'img', [
      'correct-answer-view__image',
    ]);
    (
      this.answerImage.node as HTMLImageElement
    ).src = `${baseUrl}/${questionData.image}`;

    this.wordInfoWrapper = new Control(this.node, 'div', [
      'correct-answer-view__word-info-wrap',
      'word-info',
    ]);
    this.audioWord = new Control(
      this.wordInfoWrapper.node,
      'button',
      ['common-btn', 'word-info__audio-btn'],
      'звук'
    );
    this.audioWord.node.onclick = () => {
      SoundManager.playSound(`${baseUrl}/${questionData.audio}`);
    };
    this.textWord = new Control(
      this.wordInfoWrapper.node,
      'span',
      ['word-info__text-word'],
      `${questionData.word}`
    );
    this.transcriptionWord = new Control(
      this.wordInfoWrapper.node,
      'span',
      ['word-info__transcription-word'],
      `${questionData.transcription}`
    );

    this.exampleInfoWrapper = new Control(this.node, 'div', [
      'correct-answer-view__example-info-wrap',
      'example-info',
    ]);
    this.audioExample = new Control(
      this.exampleInfoWrapper.node,
      'button',
      ['common-btn', 'example-info__audio-btn'],
      'звук'
    );
    this.audioExample.node.onclick = () => {
      SoundManager.playSound(`${baseUrl}/${questionData.audioExample}`);
    };

    this.textExample = new Control(this.exampleInfoWrapper.node, 'span', [
      'word-info__text-example',
    ]);
    this.textExample.node.innerHTML = questionData.textExample;

    this.textExampleTranslate = new Control(
      this.exampleInfoWrapper.node,
      'span',
      ['word-info__text-example-translate']
    );
    this.textExampleTranslate.node.innerHTML =
      questionData.textExampleTranslate;
  }
}
