import { PageControl } from 'src/scripts/common/templates/pageControl';
import { Control } from '../../../common/templates/control';
import { IAnimatingClasses, IGameSettings } from '../interfaces';

export class CategoriesPage extends PageControl {
  onHome!: () => void;
  onSelect!: (index: number) => void;

  constructor(
    parentNode: HTMLElement,
    gameSettings: IGameSettings,
    animatingClasses: IAnimatingClasses = { hide: 'hide', show: 'show' }
  ) {
    super(
      parentNode,
      'div',
      ['page', 'categories-page', 'main__container'],
      animatingClasses
    );

    const headerWrapper = new Control(this.node, 'div', ['head_panel']);
    const backButton = new Control(
      headerWrapper.node,
      'button',
      ['common-btn', 'button_back'],
      'back'
    );
    backButton.node.onclick = () => {
      this.onHome();
    };

    const fullScreenButton = new Control(
      this.node,
      'button',
      ['common-btn', 'categories-page__fullscreen-btn'],
      'fullscreen'
    );
    fullScreenButton.node.addEventListener('click', this.toggleFullScreen);

    const categoriesContainer = new Control(this.node, 'div', ['categories']);

    for (let i = 0; i < gameSettings.levelAmount; i++) {
      const categoryButton = new Control(
        categoriesContainer.node,
        'button',
        ['common-btn', 'categories__button'],
        `Level ${i + 1}`
      );
      categoryButton.node.addEventListener('click', () => {
        this.onSelect(i);
      });
    }
  }
}
