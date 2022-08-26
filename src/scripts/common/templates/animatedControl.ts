// import { Control } from "./control";

// export class AnimatedControl extends Control{
//   private animatedClasses: { show: string; hide: string; };

//   constructor(parentNode: HTMLElement | null, tagName = 'div', classesArr: string[] = [], content = '', animatedClasses = {show: 'to-right', hide: 'to-left',}) {
//     super(parentNode, tagName, classesArr, content);
//     this.animatedClasses = animatedClasses;
//     this.node.classList.add(animatedClasses.show);
//     this.node.classList.remove(animatedClasses.hide);
//   }

//   quickIn(){
//     this.node.classList.remove(this.styles.hidden);
//     console.log('quickIn');
    
//   }

//   quickOut(){
//     this.node.classList.add(this.styles.hidden);
//     console.log('quickOut');
    
//   }

//   animateIn():Promise<void>{
//     console.log('animateIn');
    
//     return new Promise((resolve)=>{
//       requestAnimationFrame(()=>requestAnimationFrame(()=>{
//         if (!this.node.classList.contains(this.styles.hidden)){
//           resolve(null);
//         }
//         this.node.classList.remove(this.styles.hidden);
//         this.node.ontransitionend = (e)=>{
//           if (e.target !==this.node) return;
//           this.node.ontransitionend = null;
//           resolve(null);
//         }
//       }));
//     })
//   }

//   animateOut(): Promise<void>{
//     console.log('animateOut');
//     return new Promise((resolve)=>{
//       requestAnimationFrame(()=>requestAnimationFrame(()=>{
//         if (this.node.classList.contains(this.styles.hidden)){
//           resolve(null);
//           console.log(11111111);
          
//         }
//         this.node.classList.add(this.styles.hidden);
//         this.node.ontransitionend = (e)=>{
//           if (e.target !==this.node) return;
//           this.node.ontransitionend = null;
//           resolve(null);
//           console.log(2222222222);
          
//         }
//       }));
//     })
//   }
// }
