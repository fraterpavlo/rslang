import { Component } from '../../common/templates/component';
import './navigation.scss';

export class Navigation extends Component {
    private linkToRegister: Component;
    private linkToTextbook: Component;
    private linkToAboutInfo: Component;
    private points: Component;

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', ['main__navigation', 'navigation']);

        this.points = new Component(this.element, 'div', ['main__points', 'points']);

        this.linkToRegister = new Component(
            this.points.element,
            'a',
            ['points__register'],
            'Регистрация',
        );
        this.linkToTextbook = new Component(
            this.points.element,
            'a',
            ['points__textbook'],
            'Учебник',
        );
        this.linkToAboutInfo = new Component(
            this.points.element,
            'a',
            ['points__about'],
            'О нас',
        );

        this.linkToRegister.element.setAttribute('href', '#auth');
        this.linkToTextbook.element.setAttribute('href', '#textbook');
        this.linkToAboutInfo.element.setAttribute('href', '#about');
    }
}
