const time = 1000;
const step = 1;

export function outNum(num: number, elems: string) {
  setTimeout(() => {
    const elem: HTMLElement = <HTMLElement>document.getElementById(`${elems}`);
    let n = 0;
    const t = Math.round(time / (num / step));
    const interval = setInterval(() => {
      n = n + step;
      if (n === num) {
        clearInterval(interval);
      }
      elem.innerHTML = String(n);
    }, t);
  }, 0);
}

