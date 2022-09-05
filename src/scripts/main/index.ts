import { Component } from '../common/templates/component';
import { Games } from './games-btn/games';
import { Footer } from './footer/footer';
import { AuthPopup } from './auth-popup/signin-popup';
import { Navigation } from './navigation/navigation';
import { Title } from './title/title';
import './index.scss';

export class AuthContainer extends Component {
    private container: Component;

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', ['main__container']);

        new Title(this.element);
        new Games(this.element);
        new AuthPopup(this.element);

        this.container = new Component(this.element, 'div', ['main__cont']); 
        new Navigation(this.container.element);
        new Footer(this.container.element);
    }
}
