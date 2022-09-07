import { Component } from "../../../../scripts/common/templates/component";

export class UIInput extends Component {
  getInputValue: (event: Event) => void = () => {};

  constructor(
    parentNode: HTMLElement,
    type: string,
    styles: string[] = [],

    initValue?: string,
  ) {
    super(parentNode, 'input', ['ui-input']);
    this.element.setAttribute('type', type);
    this.element.classList.add(...styles);

    if (initValue) {
      this.element.setAttribute('value', initValue);
    }

    this.element.addEventListener('input', (event) =>
      this.getInputValue(event),
    );
  }
}
