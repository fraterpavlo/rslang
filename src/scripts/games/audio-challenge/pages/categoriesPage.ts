import { PageControl } from '../../common/templates/pageControl';
import { Control } from '../../../common/templates/control';
import { IGameSettings } from '../interfaces';
import { IAnimatingClasses } from '../../common/commonInterfaces';

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
      ['categories-page', 'categories-page__container'],
      animatingClasses
    );

    const headPanelWrapper = new Control(this.node, 'div', [
      'categories-page__head-panel',
    ]);
    const backButton = new Control(headPanelWrapper.node, 'button', [
      'common-btn',
      'categories-page__back-btn',
    ]);
    backButton.node.addEventListener(
      'click',
      () => {
        this.onHome();
      },
      { once: true }
    );
    // backButton.node.onclick = () => {
    //   this.onHome();
    // };

    const fullScreenButton = new Control(headPanelWrapper.node, 'button', [
      'common-btn',
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
      'Аудиовызов'
    );

    const gameDescriptionWrapper = new Control(mainField.node, 'div', [
      'main-field__game-description-wrap',
      'game-description',
    ]);
    gameDescriptionWrapper.node.innerHTML = `
      <p class="game-description__description">
        «Аудиовызов» - это игра, которая улучшает восприятие речи на слух.
        Каждый раунд вам нужно правильно перести слово, которое будет озвучена на английском. Слова разделены на
        категории по возрастанию сложности. Выберите категорию.
      </p>
      <ul class="game-description__instructions-list instructions-list">
        <li class="instructions-list__item">
          Используйте мышь, чтобы выбрать.
        </li>
        <li class="instructions-list__item">
          Используйте цифровые клавиши от 1 до 5 для выбора ответа
        </li>
        <li class="instructions-list__item">
          Используйте пробел для повтроного звучания слова
        </li>
        <li class="instructions-list__item">
          Используйте клавишу Enter для подсказки или для перехода к следующему слову
        </li>
      </ul>
    `;

    const categoriesContainer = new Control(mainField.node, 'div', [
      'main-field__categories-wrap',
      'categories',
    ]);

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
