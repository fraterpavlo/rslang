import { Control } from '../../../../common/templates/control';
// import { IWordData } from '../../../common/commonInterfaces';
import { IWordDataWithAnswers } from '../../interfaces';

export class QuestionView extends Control {
  questionDataWrapper: Control<HTMLElement>;
  questionWord: Control<HTMLElement>;
  questionTranslate: Control<HTMLElement>;

  constructor(
    parentNode: HTMLElement,
    wordDataWithAnswers: IWordDataWithAnswers
  ) {
    super(parentNode, 'div', [
      'game-page__question-container',
      'question-view',
    ]);

    this.questionDataWrapper = new Control(this.node, 'div', [
      'question-view__question-data-wrapper',
      'question-data',
    ]);
    this.questionWord = new Control(
      this.questionDataWrapper.node,
      'span',
      ['question-data__question-word'],
      `${wordDataWithAnswers.word}`
    );
    this.questionTranslate = new Control(
      this.questionDataWrapper.node,
      'span',
      ['question-data__question-translate'],
      `${wordDataWithAnswers.likelyTranslate}`
    );
  }
}
