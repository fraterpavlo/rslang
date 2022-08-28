import { IAnimatingClasses } from 'src/scripts/audio-challenge/interfaces';
import { Control } from './control';

export class AnimatedControl extends Control {
  private animatingClasses: { hide: string; show: string };

  constructor(
    parentNode: HTMLElement | null,
    tagName = 'div',
    classesArr: string[],
    animatingClasses: IAnimatingClasses = { hide: 'hide', show: 'show' },
    content = ''
  ) {
    super(parentNode, tagName, classesArr, content);
    this.animatingClasses = animatingClasses;
    this.node.classList.add(animatingClasses.show);
    this.animateIn();
  }

  // quickIn() {
  //   this.node.classList.remove(this.classes.hidden);
  //   console.log('quickIn');
  // }

  // quickOut() {
  //   this.node.classList.add(this.classes.hidden);
  //   console.log('quickOut');
  // }

  animateIn(): Promise<void> {
    return new Promise((resolve) => {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (!this.node.classList.contains(this.animatingClasses.show)) {
            resolve();
          }
          this.node.classList.remove(this.animatingClasses.show);
          this.node.ontransitionend = (e) => {
            if (e.target !== this.node) return;
            this.node.ontransitionend = null;
            resolve();
          };
        })
      );
    });
  }

  animateOut(): Promise<void> {
    return new Promise((resolve) => {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (this.node.classList.contains(this.animatingClasses.hide)) {
            resolve();
          }
          this.node.classList.add(this.animatingClasses.hide);
          this.node.ontransitionend = (e) => {
            if (e.target !== this.node) return;
            this.node.ontransitionend = null;
            resolve();
            this.node.classList.remove(this.animatingClasses.hide);
          };
        })
      );
    });
  }

  async destroy(): Promise<void> {
    await this.animateOut();
    super.destroy();
  }
}
