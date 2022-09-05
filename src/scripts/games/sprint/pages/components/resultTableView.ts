import { Control } from '../../../../common/templates/control';
import { IAnswerData } from '../../interfaces';
import { SoundManager } from '../../../common/soundManager';
import { baseUrl } from '../../../common/gameDataModel';

export class resultTableView extends Control {
  constructor(
    parentNode: HTMLElement,
    resultsData: IAnswerData[],
    score: number
  ) {
    super(parentNode, 'div', ['game-over-page__result-table', 'result-table']);

    new Control(
      this.node,
      'div',
      ['result-table__head-row'],
      `Очков набрано: ${score}`
    );

    resultsData.forEach(this.renderTableRow.bind(this));
  }

  renderTableRow(answerData: IAnswerData) {
    const tableRow = new Control(this.node, 'div', [
      'result-table__row',
      'table-row',
    ]);

    const wordSoundButton = new Control(tableRow.node, 'button', [
      'table-row__word-sound-btn',
    ]);
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
      `${answerData.answerResult ? '✔️' : '❌'}`
    );
    answerData.answerResult
      ? answerResult.node.classList.add('table-row__result-icon_correct')
      : answerResult.node.classList.add('table-row__result-icon_incorrect');
  }
}
