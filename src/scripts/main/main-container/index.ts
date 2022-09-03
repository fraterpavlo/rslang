// import { ICar } from '../../interfaces';
import { Component } from '../../common/templates/component';
import { Games } from '../games/games';
import { Footer } from '../main-footer/footer';
import { AuthPopup } from '../auth-popup/signin-popup';
import './index.scss';

export class AuthContainer extends Component {
    private title: Component;
    private subtitle: Component;
    private about: Component;
    private games: Component;
    private auth: Component;
    private footer: Component;

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', ['main__container']);

        this.about = new Component(this.element, 'div', ['main__about']);
        this.title = new Component(this.about.element, 'h1', ['main__title']);
        this.subtitle = new Component(this.about.element, 'h3', ['main__subtitle']);
        this.title.element.innerHTML = `RSLang`;
        this.subtitle.element.innerHTML = `Start learning English with RS Lang today!`;
        this.games = new Games(this.element);
        this.games.element;
        this.auth = new AuthPopup(this.element);
        this.auth.element;
        this.footer = new Footer(this.element);
        this.footer.element;
    }
}
