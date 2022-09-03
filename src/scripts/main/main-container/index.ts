import { Component } from '../../common/templates/component';
import { Games } from '../games/games';
import { Footer } from '../main-footer/footer';
import { AuthPopup } from '../auth-popup/signin-popup';
import './index.scss';

export class AuthContainer extends Component {
    private title: Component;
    private subtitle: Component;
    private about: Component;

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', ['main__container']);

        this.about = new Component(this.element, 'div', ['main__about']);
        this.title = new Component(this.about.element, 'h1', ['main__title']);
        this.subtitle = new Component(this.about.element, 'h3', ['main__subtitle']);
        this.title.element.innerHTML = `RSLang`;
        this.subtitle.element.innerHTML = `Start learning English with RS Lang today!`;
        new Games(this.element);
        new AuthPopup(this.element);
        new Footer(this.element);
    }
}
