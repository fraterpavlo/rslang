import { Control } from '../../../../common/templates/control';
import { IWordDataWithAnswers } from '../../interfaces';

export class QuestionView extends Control {
  questionWord: Control<HTMLElement>;
  questionTranslate: Control<HTMLElement>;

  constructor(
    parentNode: HTMLElement,
    wordDataWithAnswers: IWordDataWithAnswers
  ) {
    super(parentNode, 'div', [
      'main-field__question-container',
      'question-view',
    ]);

    this.questionWord = new Control(
      this.node,
      'span',
      ['question-view__question-word'],
      `${wordDataWithAnswers.word}`
    );
    this.questionTranslate = new Control(
      this.node,
      'span',
      ['question-view__question-translate'],
      `${wordDataWithAnswers.likelyTranslate}`
    );
  }
}
