import { Control } from "../common/templates/control";
import { IGameSettings } from "./interfaces";

export class CategoriesPage extends Control{
  onHome!: ()=>void;
  onSelect!: (index:number)=> void;

  constructor(parentNode:HTMLElement, gameSettings: IGameSettings) {
    super(parentNode, 'div', ['pag', 'categories-page']);

    const headerWrapper = new Control(this.node, 'div', ["head_panel"]);
    const backButton = new Control(headerWrapper.node, 'button', ["button_back"], 'back');
    backButton.node.onclick = ()=>{
      this.onHome();
    }
    
    const categoriesContainer = new Control(this.node, 'div', ["categories"]);

      for (let i=0; i < gameSettings.levelAmount; i++) {
        const categoryButton = new Control(categoriesContainer.node, 'button', ["categories__button"], `Level ${i+1}`);
        categoryButton.node.addEventListener('click', () => {
          this.onSelect(i);
        })
      }
    };
  }
