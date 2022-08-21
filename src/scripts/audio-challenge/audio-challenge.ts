import { Control } from "../common/templates/control";

export class AudioChallengeApp extends Control {

  constructor(
    parentNode: HTMLElement | null,
    tagName = 'div',
    classesArr: string[] = []
  ) {
    super(parentNode, tagName, classesArr);
  }

  render() {
    return this.node;
  }
}
