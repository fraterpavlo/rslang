import { Control } from '../../../common/templates/control';
import { IAnimatingClasses } from '../../common/commonInterfaces';
import { PageControl } from '../../common/templates/pageControl';
import { IAnswerData } from '../interfaces';
import { resultTableView } from './components/resultTableView';

export class GameOverPage extends PageControl {
  onNext!: () => void;
  onHome!: () => void;

  constructor(
    parentNode: HTMLElement,
    resultsData: IAnswerData[],
    score: number,
    animatingClasses: IAnimatingClasses = { hide: 'hide', show: 'show' }
  ) {
    super(
      parentNode,
      'div',
      ['game-over-page__container', 'game-over-page'],
      animatingClasses
    );

    const headPanelWrapper = new Control(this.node, 'div', [
      'game-over-page__head-panel',
    ]);

    const fullScreenButton = new Control(headPanelWrapper.node, 'button', [
      'common-btn',
      'game-over-page__fullscreen-btn',
    ]);
    fullScreenButton.node.addEventListener('click', this.toggleFullScreen);

    const mainField = new Control(this.node, 'div', [
      'game-over-page__main-field',
      'main-field',
    ]);

    new resultTableView(mainField.node, resultsData, score);

    const exitButtonsWrapper = new Control(mainField.node, 'div', [
      'game-over-page__exit-buttons-wrapper',
    ]);

    const nextButton = new Control(exitButtonsWrapper.node, 'button', [
      'common-btn',
      'game-over-page__next-btn',
    ]);
    nextButton.node.onclick = () => {
      this.onNext();
    };

    const homeButton = new Control(exitButtonsWrapper.node, 'button', [
      'common-btn',
      'game-over-page__home-btn',
    ]);
    homeButton.node.onclick = () => {
      this.onHome();
    };
  }
}
