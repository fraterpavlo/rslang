import { Control } from "./control";

export class Timer extends Control{
  onTimeout!: ()=>void;
  timer!: number;
  initialTime!:number;

  constructor(parentNode:HTMLElement){
    super(parentNode);
  }

  start(time:number){
    this.initialTime = time;
    if (this.timer){
      this.stop();
    }
    let currentTime = time;
    const render = (currentTime:number)=>{
      this.node.textContent = `${currentTime} / ${this.initialTime}`;
    }
    render(time);
    this.timer = window.setInterval(()=>{
      currentTime--;
      render(currentTime);
      if (currentTime <=0){
        this.onTimeout();
        this.stop();
      }
    }, 1000);
  }

  stop(){
    window.clearInterval(this.timer);
  }
}
