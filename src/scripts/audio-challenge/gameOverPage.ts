import { Control } from "../common/templates/control";

export class GameOverPage extends Control{
  onNext!: ()=>void;
  onHome!: ()=>void;

  constructor(parentNode:HTMLElement, results:boolean[]){
    super(parentNode, 'div', ['page', 'game-over-page']);

    const resultIndicator = new Control(this.node, 'div', ['game-over-page__resultIndicator'], '');
    resultIndicator.node.textContent = results.map((it:boolean)=>it?'+':'-').join(' ');

    const nextButton = new Control(this.node, 'button', ['game-over-page__next-btn'], 'next');
    nextButton.node.onclick = ()=>{
      this.onNext();
    }

    const homeButton = new Control(this.node, 'button', ['game-over-page__home-btn'], 'home');
    homeButton.node.onclick = ()=>{
      this.onHome();
    }
  }
}
