import { Control } from '../../../../common/templates/control';
import { IAnswerData } from '../../interfaces';
import { SoundManager } from '../../../common/soundManager';
import { baseUrl } from '../../../common/gameDataModel';

export class resultTableView extends Control {
  constructor(parentNode: HTMLElement, resultsData: IAnswerData[]) {
    super(parentNode, 'div', ['game-over-page__result-table', 'result-table']);

    const correctAnswersAmount = resultsData.filter(
      (answerData: IAnswerData) => !!answerData.answerResult
    ).length;
    new Control(
      this.node,
      'div',
      ['result-table__head-row'],
      `Верных ответов: ${correctAnswersAmount}`
    );

    resultsData.forEach(this.renderTableRow.bind(this));
  }

  renderTableRow(answerData: IAnswerData) {
    const tableRow = new Control(this.node, 'div', [
      'result-table__row',
      'table-row',
    ]);

    const wordSoundButton = new Control(
      tableRow.node,
      'button',
      ['table-row__word-sound-btn'],
      'звук'
    );
    wordSoundButton.node.addEventListener('click', () => {
      SoundManager.playSound(`${baseUrl}/${answerData.wordAudioURL}`);
    });

    new Control(
      tableRow.node,
      'span',
      ['table-row__word'],
      `${answerData.word}`
    );
    new Control(
      tableRow.node,
      'span',
      ['table-row__transcription'],
      `${answerData.wordTranscription}`
    );
    new Control(
      tableRow.node,
      'span',
      ['table-row__translate'],
      `${answerData.wordTranslate}`
    );
    const answerResult = new Control(
      tableRow.node,
      'span',
      ['table-row__result-icon'],
      `${answerData.answerResult ? '+' : '-'}`
    );
    answerData.answerResult
      ? answerResult.node.classList.add('table-row__result-icon_correct')
      : answerResult.node.classList.add('table-row__result-icon_incorrect');
  }
}
