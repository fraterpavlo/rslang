import { Control } from '../../../common/templates/control';

export class Preloader extends Control {
  isActivated: boolean;
  parentNode: HTMLElement;

  constructor(
    parentNode: HTMLElement,
    tagName = 'div',
    classesArr: string[] = [],
    content = ''
  ) {
    super(null, tagName, classesArr, content);
    this.parentNode = parentNode;
    this.isActivated = false;
  }

  activate() {
    if (this.isActivated) return;
    console.log('preloaderOn');

    this.parentNode.append(this.node);
    this.isActivated = true;
  }

  deactivate() {
    if (!this.isActivated) return;
    console.log('preloaderOff');

    this.destroy();
    this.isActivated = false;
  }
}
