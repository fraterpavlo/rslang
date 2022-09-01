import { PageControl } from '../../common/templates/pageControl';
import { Control } from '../../../common/templates/control';
import { IAnimatingClasses } from '../../common/commonInterfaces';
import { IGameSettings } from '../interfaces';

export class CategoriesPage extends PageControl {
  onHome!: () => void;
  onSelect!: (index: number) => void;

  constructor(
    parentNode: HTMLElement,
    animatingClasses: IAnimatingClasses = { hide: 'hide', show: 'show' }
  ) {
    super(
      parentNode,
      'div',
      ['categories-page', 'categories-page__container'],
      animatingClasses
    );

    const headPanelWrapper = new Control(this.node, 'div', [
      'categories-page__head-panel',
    ]);
    const backButton = new Control(
      headPanelWrapper.node,
      'button',
      ['common-btn', 'categories-page__button_back'],
      'back'
    );
    backButton.node.addEventListener(
      'click',
      () => {
        this.onHome();
      },
      { once: true }
    );

    const fullScreenButton = new Control(
      headPanelWrapper.node,
      'button',
      ['common-btn', 'categories-page__fullscreen-btn'],
      'fullscreen'
    );
    fullScreenButton.node.addEventListener('click', this.toggleFullScreen);

    const mainField = new Control(this.node, 'div', [
      'categories-page__main-field',
      'main-field',
    ]);
    const categoriesContainer = new Control(mainField.node, 'div', [
      'main-field__categories-wrap',
      'categories',
    ]);

    for (let i = 0; i < IGameSettings.levelAmount; i++) {
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
