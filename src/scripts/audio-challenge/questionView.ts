import { Control } from "../common/templates/control";
import { IWordDataWithAnswers } from './interfaces';

export class QuestionView extends Control {
  onAnswer!: (answerIndex:number)=>void;

  constructor(parentNode: HTMLElement, questionData: IWordDataWithAnswers) {
    super(parentNode, 'div', ['game-page__question-container', 'question-view']);

    // const question = new Control(this.node, 'div', ['question-view__question'], 'тут будет звук');
    new Control(this.node, 'div', ['question-view__question'], 'тут будет звук');

    questionData.answers.map((answer, idx) => {
      const button = new Control(this.node, 'button', ['question-view__answer-btn'], answer.toString());
      button.node.onclick = () => {
        this.onAnswer(idx);
      }
    })
  }
}
