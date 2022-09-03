import { Component } from '../../common/templates/component';
import './games.scss';

export class Games extends Component {
    private navItems: Component[] = [];
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

        this.navItems = [this.linkToFirstGame, this.linkToSecondGame];

        window.addEventListener('hashchange', () =>
            this.updateActive(this.navItems),
        );
        window.addEventListener('load', () => this.updateActive(this.navItems));
    }

    private updateActive(navItems: Component[]): void {
        this.navItems = navItems.map((item) => {
            item.element.classList.remove('main__game--active');
            if (item.element.getAttribute('href') === window.location.hash) {
                item.element.classList.add('main__game--active');
            }

            return item;
        });
    }
}
