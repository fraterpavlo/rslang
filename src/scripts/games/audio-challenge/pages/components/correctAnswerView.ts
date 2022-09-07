import { Control } from '../../../../common/templates/control';
import { IWordDataWithAnswers } from '../../interfaces';
import { IAnimatingClasses } from '../../../common/commonInterfaces';
import { baseUrl } from '../../../common/gameDataModel';
import { SoundManager } from '../../../common/soundManager';
import { AnimatedControl } from '../../../common/templates/animatedControl';

export class CorrectAnswerView extends AnimatedControl {
  answerImage: Control<HTMLElement>;
  audioWord: Control<HTMLElement>;
  textWord: Control<HTMLElement>;
  transcriptionWord: Control<HTMLElement>;
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

    const answerImageWrapper = new Control(this.node, 'div', [
      'correct-answer-view__image-wrap',
    ]);
    this.answerImage = new Control(answerImageWrapper.node, 'img', [
      'correct-answer-view__image',
    ]);
    (
      this.answerImage.node as HTMLImageElement
    ).src = `${baseUrl}/${questionData.image}`;

    const textContentWrapper = new Control(this.node, 'div', [
      'correct-answer-view__text-content-wrap',
    ]);
    const wordInfoWrapper = new Control(textContentWrapper.node, 'div', [
      'correct-answer-view__word-info-wrap',
      'word-info',
    ]);

    this.audioWord = new Control(wordInfoWrapper.node, 'button', [
      'word-info__audio-btn',
    ]);
    this.audioWord.node.onclick = () => {
      SoundManager.playSound(`${baseUrl}/${questionData.audio}`);
    };
    this.textWord = new Control(
      wordInfoWrapper.node,
      'span',
      ['word-info__text-word'],
      `${questionData.word}`
    );
    this.transcriptionWord = new Control(
      wordInfoWrapper.node,
      'span',
      ['word-info__transcription-word'],
      `${questionData.transcription}`
    );

    const exampleInfoWrapper = new Control(textContentWrapper.node, 'div', [
      'correct-answer-view__example-info-wrap',
      'example-info',
    ]);
    const engTextExampleWrap = new Control(exampleInfoWrapper.node, 'div', [
      'example-info__text-example-wrap',
    ]);
    this.audioExample = new Control(engTextExampleWrap.node, 'button', [
      'example-info__text-example-audio-btn',
    ]);
    this.audioExample.node.onclick = () => {
      SoundManager.playSound(`${baseUrl}/${questionData.audioExample}`);
    };

    this.textExample = new Control(engTextExampleWrap.node, 'span', [
      'example-info__text-example',
    ]);
    this.textExample.node.innerHTML = questionData.textExample;

    this.textExampleTranslate = new Control(exampleInfoWrapper.node, 'span', [
      'example-info__text-example-translate',
    ]);
    this.textExampleTranslate.node.innerHTML =
      questionData.textExampleTranslate;
  }
}
