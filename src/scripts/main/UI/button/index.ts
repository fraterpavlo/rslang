import { Component } from "../../../../scripts/common/templates/component";

export class UIButton extends Component {
  onClickButton: () => void = () => {};

  constructor(
    parentNode: HTMLElement,
    styles: string[] = [],
    content: string,
    disabled = false,
  ) {
    super(parentNode, 'button', ['btn'], content);

    this.element.classList.add(...styles);
    this.element.addEventListener('click', () => this.onClickButton());

    if (disabled) {
      this.setDisabled(true);
    }
  }

  setDisabled(type = false): void {
    this.element.toggleAttribute('disabled', type);
  }

  removeDisabled(): void {
    this.element.removeAttribute('disabled');
  }
}
