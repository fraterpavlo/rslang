import { Component } from '../../common/templates/component';
import { gitImage } from './user-git';
import './footer.scss';

export class Footer extends Component {
    private linkToSchool: Component;
    private info: Component;
    private git: Component;

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', ['main__footer', 'footer']);

        this.info = new Component(this.element, 'div', ['footer__info']);

        this.linkToSchool = new Component(
            this.info.element,
            'a',
            ['school'],
            '',
        );

        this.linkToSchool.element.setAttribute('href', 'https://rs.school/');
        
        const rsImg = new Component(this.linkToSchool.element, 'img', ['rs-img']);
        rsImg.element.setAttribute('src', 'https://rs.school/images/rs_school_js.svg');

        const spanYear = new Component(this.info.element, 'span', ['year']);
        spanYear.element.innerHTML = '2022';

        this.git = new Component(this.info.element, 'div', ['footer__git']);
        const hrefToUser = new Component(this.git.element, 'a', ['footer__git--user'], ``);
        hrefToUser.element.innerHTML += gitImage('Пaша');
        hrefToUser.element.setAttribute('href', 'https://github.com/fraterpavlo/');
    }
}
