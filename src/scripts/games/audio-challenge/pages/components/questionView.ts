import { Control } from '../../../../common/templates/control';
import { IWordDataWithAnswers } from '../../interfaces';
import { IAnimatingClasses } from '../../../common/commonInterfaces';
import { baseUrl } from '../../../common/gameDataModel';
import { SoundManager } from '../../../common/soundManager';
import { AnimatedControl } from '../../../common/templates/animatedControl';

export class QuestionView extends AnimatedControl {
  questionAudio: HTMLAudioElement;
  questionAudioBtn: Control<HTMLElement>;
  questionDataWrapper: Control<HTMLElement>;
  answersBtnArr: Control<HTMLElement>[];

  constructor(
    parentNode: HTMLElement,
    wordData: IWordDataWithAnswers,
    animatingClasses: IAnimatingClasses = { hide: 'hide', show: 'show' }
  ) {
    super(
      parentNode,
      'div',
      ['main-field__question-container', 'question-view'],
      animatingClasses
    );
    this.questionAudio = SoundManager.playSound(`${baseUrl}/${wordData.audio}`);

    this.questionDataWrapper = new Control(this.node, 'div', [
      'question-view__question-data-wrapper',
      'question-data',
    ]);
    this.questionAudioBtn = new Control(
      this.questionDataWrapper.node,
      'button',
      ['question-data__question-audio-btn']
    );
    this.questionAudioBtn.node.addEventListener(
      'click',
      this.onQuestionAudioBtnListener.bind(this, wordData.audio)
    );

    const answerButtonsWrap = new Control(this.node, 'div', [
      'question-view__answers-buttons-wrap',
    ]);

    this.answersBtnArr = wordData.answers.map((answer) => {
      return new Control(
        answerButtonsWrap.node,
        'button',
        ['common-btn', 'question-view__answer-btn'],
        answer.toString()
      );
    });
  }

  onQuestionAudioBtnListener(audioURL: string) {
    SoundManager.playSound(`${baseUrl}/${audioURL}`);
  }
}
