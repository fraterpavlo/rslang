import { Component } from '../../common/templates/component';
import './footer.scss';

export class Footer extends Component {
    private linkToRegister: Component;
    private linkToTextbook: Component;
    private linkToAboutInfo: Component;
    private linkToSchool: Component;
    private points: Component;
    private info: Component;

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', ['main__footer', 'footer']);

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

        this.info = new Component(this.element, 'div', ['footer__info']);
        const spanYear = new Component(this.info.element, 'span', ['year']);
        spanYear.element.innerHTML = '2022';

        this.linkToSchool = new Component(
            this.info.element,
            'a',
            ['school'],
            'RS School',
        );

        this.linkToSchool.element.setAttribute('href', 'https://rs.school/');
    }
}
