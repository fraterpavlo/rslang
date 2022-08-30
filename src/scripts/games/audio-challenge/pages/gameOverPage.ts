import { Control } from '../../../common/templates/control';
import { IAnimatingClasses, IAnswerData } from '../interfaces';
import { PageControl } from 'src/scripts/common/templates/pageControl';

export class GameOverPage extends PageControl {
  onNext!: () => void;
  onHome!: () => void;

  constructor(
    parentNode: HTMLElement,
    results: IAnswerData[],
    animatingClasses: IAnimatingClasses = { hide: 'hide', show: 'show' }
  ) {
    super(
      parentNode,
      'div',
      ['game-over-page__container', 'game-over-page'],
      animatingClasses
    );

    const fullScreenButton = new Control(
      this.node,
      'button',
      ['common-btn', 'game-over-page__fullscreen-btn'],
      'fullscreen'
    );
    fullScreenButton.node.addEventListener('click', this.toggleFullScreen);

    const resultIndicator = new Control(
      this.node,
      'div',
      ['game-over-page__resultIndicator'],
      ''
    );
    resultIndicator.node.textContent = results
      .map((answerData: IAnswerData) => (answerData.answerResult ? '+' : '-'))
      .join(' ');

    const nextButton = new Control(
      this.node,
      'button',
      ['common-btn', 'game-over-page__next-btn'],
      'next'
    );
    nextButton.node.onclick = () => {
      this.onNext();
    };

    const homeButton = new Control(
      this.node,
      'button',
      ['common-btn', 'game-over-page__home-btn'],
      'home'
    );
    homeButton.node.onclick = () => {
      this.onHome();
    };
  }
}
