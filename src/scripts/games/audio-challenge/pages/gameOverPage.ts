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

    const fullScreenButton = new Control(
      headPanelWrapper.node,
      'button',
      ['common-btn', 'game-over-page__fullscreen-btn'],
      'fullscreen'
    );
    fullScreenButton.node.addEventListener('click', this.toggleFullScreen);

    // const resultIndicator = new Control(
    //   this.node,
    //   'div',
    //   ['game-over-page__resultIndicator'],
    //   ''
    // );
    // resultIndicator.node.textContent = results
    //   .map((answerData: IAnswerData) => (answerData.answerResult ? '+' : '-'))
    //   .join(' ');

    const mainField = new Control(this.node, 'div', [
      'game-over-page__main-field',
      'main-field',
    ]);

    new resultTableView(mainField.node, resultsData);

    const exitButtonsWrapper = new Control(mainField.node, 'div', [
      'game-over-page__exit-buttons-wrapper',
    ]);

    const nextButton = new Control(
      exitButtonsWrapper.node,
      'button',
      ['common-btn', 'game-over-page__next-btn'],
      'next'
    );
    nextButton.node.onclick = () => {
      this.onNext();
    };

    const homeButton = new Control(
      exitButtonsWrapper.node,
      'button',
      ['common-btn', 'game-over-page__home-btn'],
      'home'
    );
    homeButton.node.onclick = () => {
      this.onHome();
    };
  }
}
