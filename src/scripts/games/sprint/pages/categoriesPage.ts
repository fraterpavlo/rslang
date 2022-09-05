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
    const backButton = new Control(headPanelWrapper.node, 'button', [
      'categories-page__button_back',
    ]);
    backButton.node.addEventListener(
      'click',
      () => {
        this.onHome();
      },
      { once: true }
    );

    const fullScreenButton = new Control(headPanelWrapper.node, 'button', [
      'categories-page__fullscreen-btn',
    ]);
    fullScreenButton.node.addEventListener('click', this.toggleFullScreen);

    const mainField = new Control(this.node, 'div', [
      'categories-page__main-field',
      'main-field',
    ]);

    new Control(
      mainField.node,
      'h1',
      ['game-name-title', 'main-field__game-name-title'],
      'Спринт'
    );

    const gameDescriptionWrapper = new Control(mainField.node, 'div', [
      'main-field__game-description-wrap',
      'game-description',
    ]);
    gameDescriptionWrapper.node.innerHTML = `
      <p class="game-description__description">
        «Спринт» - это игра, для повторения выученных слов.
        Каждый раунд вам нужно ответить, верно ли переведено слово из вопроса. Слова разделены на
        категории по возрастанию сложности. Выберите категорию.
      </p>
      <ul class="game-description__instructions-list instructions-list">
        <li class="instructions-list__item">
          Используйте мышь, чтобы выбрать.
        </li>
        <li class="instructions-list__item">
          Используйте клавиши влево или вправо
        </li>
      </ul>
    `;


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
