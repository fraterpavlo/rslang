import { IAnimatingClasses } from 'src/scripts/games/audio-challenge/interfaces';
import { AnimatedControl } from './animatedControl';

export class PageControl extends AnimatedControl {
  constructor(
    parentNode: HTMLElement | null,
    tagName = 'div',
    classesArr: string[],
    animatingClasses: IAnimatingClasses = { hide: 'hide', show: 'show' },
    content = ''
  ) {
    super(parentNode, tagName, classesArr, animatingClasses, content);
  }

  toggleFullScreen() {
    document.fullscreenElement
      ? document.exitFullscreen()
      : document.documentElement.requestFullscreen();
  }
}
