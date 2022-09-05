import { Component } from '../../common/templates/component';
import './games.scss';

export class Games extends Component {
    private linkToFirstGame: Component;
    private linkToSecondGame: Component;

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', ['main__games']);

        this.linkToFirstGame = new Component(
            this.element,
            'a',
            ['main__game'],
            'Игра 1',
        );

        this.linkToSecondGame = new Component(
            this.element,
            'a',
            ['main__game'],
            'Игра 2',
        );

        this.linkToFirstGame.element.setAttribute('href', '#audio-challenge');
        this.linkToSecondGame.element.setAttribute('href', '#secondgame');
    }
}
