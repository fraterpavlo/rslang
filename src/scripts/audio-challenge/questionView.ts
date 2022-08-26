import { Control } from "../common/templates/control";
import { ELocalSoundsUrlList, IAnswerData, IWordDataWithAnswers } from './interfaces';
import { baseUrl } from "./gameDataModel";
import { SoundManager } from "./soundManager";
import { CorrectAnswerView } from "./correctAnswerView";

export class QuestionView extends Control {
  // onAnswer!: (answerIndex:number | null, wordData: IWordDataWithAnswers, answered?: boolean)=>void;
  sumUpQuestion!: (answerData: IAnswerData)=>void;
  questionAudio: HTMLAudioElement;
  questionAudioBtn: Control<HTMLElement>;
  questionInfoWrapper: Control<HTMLElement>;
  answersBtnArr: Control<HTMLElement>[];

  constructor(parentNode: HTMLElement, wordData: IWordDataWithAnswers) {
    super(parentNode, 'div', ['game-page__question-container', 'question-view']);
    this.questionAudio = SoundManager.playSound(`${baseUrl}/${wordData.audio}`);

    this.questionInfoWrapper = new Control(this.node, 'div', ['question-view__question-info-wrapper', 'question-info']);
    this.questionAudioBtn = new Control(this.questionInfoWrapper.node, 'button', ['question-info__question-audio-btn'], 'кнопка звука');
    this.questionAudioBtn.node.onclick = () => {
      if (SoundManager.currentAudio) return;
      SoundManager.playSound(`${baseUrl}/${wordData.audio}`);
    }

    this.answersBtnArr = wordData.answers.map((answer, answerIndex) => {
      const button = new Control(this.node, 'button', ['question-view__answer-btn'], answer.toString());

      button.node.onclick = () => {
        this.onAnswerListener(answerIndex, wordData);
        // this.sumUpQuestion();
      }

      return button;
    })
  }

  onAnswerListener(answerIndex: number | null, wordData: IWordDataWithAnswers, answered: boolean = true) {
    const isCorrectAnswer = (answerIndex === wordData.correctAnswerIndex);
    isCorrectAnswer 
      ? SoundManager.playSound(ELocalSoundsUrlList.success)
      : SoundManager.playSound(ELocalSoundsUrlList.fail);

    const correctAnswerBtn = this.answersBtnArr[wordData.correctAnswerIndex].node;
    correctAnswerBtn.style.backgroundColor = "green";
    if (answered && !isCorrectAnswer) {
      if (answerIndex === null) return console.error(`invalid answerIndex for mark currentWrongAnswerBtn`);
      const currentWrongAnswerBtn = this.answersBtnArr[answerIndex!].node;
      currentWrongAnswerBtn.style.backgroundColor = "red";
    }

    this.questionAudioBtn.destroy();
    new CorrectAnswerView(this.questionInfoWrapper.node, wordData);

    const answerData = {
      wordId: wordData.id,
      word: wordData.word,
      wordTranscription: wordData.transcription,
      wordTranslate: wordData.wordTranslate,
      wordAudioURL: wordData.audio,
      answerResult: isCorrectAnswer
    }

    this.sumUpQuestion(answerData);
  }
}
