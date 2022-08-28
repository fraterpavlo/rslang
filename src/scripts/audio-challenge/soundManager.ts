class SoundManagerClass {
  private localSoundsBaseURL = '../../assets/audio';
  private cache = new Map<string, Blob>();
  private localSoundsNamesList: Array<string> = ['applause', 'success', 'fail'];
  currentAudio: HTMLAudioElement | null;

  constructor() {
    this.currentAudio = null;
  }

  async preload() {
    Promise.all(
      this.localSoundsNamesList.map((name) =>
        this.loadFile(`${this.localSoundsBaseURL}/${name}.mp3`)
      )
    );
  }

  private async loadFile(url: string) {
    // return fetch(url).then(res=>res.blob());
    const res = await fetch(url);
    const resBlob = await res.blob();
    this.cache.set(url, resBlob);
    return resBlob;
  }

  playSound(url: string) {
    const cached = this.cache.get(url);

    let audio: HTMLAudioElement;
    if (cached) {
      audio = new Audio(URL.createObjectURL(cached));
    } else {
      audio = new Audio(url);
      this.loadFile(url);
    }

    audio.addEventListener(
      'ended',
      () => {
        this.currentAudio = null;
      },
      { once: true }
    );

    if (this.currentAudio) {
      this.currentAudio.addEventListener(
        'ended',
        () => {
          this.currentAudio = audio;
          audio.play();
        },
        { once: true }
      );
    } else {
      this.currentAudio = audio;
      audio.play();
    }

    return audio;
  }

  // ok(){
  //   this.playSound('ok');
  // }

  // fail(){
  //   this.playSound('fail');
  // }

  // playSound(name:string){
  //   const isCached = this.cache.get(name);
  //   if (isCached){
  //     const audio = new Audio(URL.createObjectURL(isCached));
  //   //  audio.play();
  //   } else {
  //     const audio = new Audio(`${this.localSoundsURL}${name}.mp3`);
  //    // audio.play();
  //   }
  // }
}

export const SoundManager = new SoundManagerClass();
