import { Control } from './control';

export class Timer extends Control {
  onTimeout!: () => void;
  timerId!: number;
  initialTime!: number;

  constructor(
    parentNode: HTMLElement,
    tagName = 'div',
    classesArr: string[] = []
  ) {
    super(parentNode, tagName, classesArr);
  }

  start(time: number) {
    this.initialTime = time;
    if (this.timerId) {
      this.stop();
    }
    let currentTime = time;
    const render = (currentTime: number) => {
      this.node.textContent = `${currentTime} / ${this.initialTime}`;
    };
    render(time);

    this.timerId = window.setInterval(() => {
      currentTime--;
      render(currentTime);
      if (currentTime <= 0) {
        this.onTimeout();
        this.stop();
      }
    }, 1000);
  }

  stop() {
    window.clearInterval(this.timerId);
  }
}
