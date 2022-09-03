import { Component } from '../../common/templates/component';
import './signin-popup.scss';

export class AuthPopup extends Component {

    private linkToClose: Component;

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', ['auth']);

        this.linkToClose = new Component(
            this.element,
            'a',
            ['close'],
            'X',
        );

        this.element.setAttribute('id', 'auth')

        this.linkToClose.element.setAttribute('href', '#');

        const title = new Component(this.element, 'div', ['auth__window']);
        // const inp = new Component(title.element, 'div', ['auth__inp']);
        // const labelEmail = new Component(inp.element, 'label', ['label']);
        // labelEmail.element.setAttribute('for', 'inputIdemail');
        // labelEmail.element.innerHTML = 'Email:';
        // const inpEmail = new Component(labelEmail.element, 'input', [])

        title.element.innerHTML = `
        <div class="auth__inp">
            <label for="inputIdemail">Email:</label>
            <input id="inputIdemail" name="email" autocomplete="off" type="text">
        </div>
        <div class="auth__inp">
            <label for="inputIdpassword">Пароль:</label>
            <input id="inputIdpassword" name="password" autocomplete="off" type="password" minlength="8">
        </div>
        <div>Неверный Email или пароль!</div>
        <div class="auth__btns">
            <button class="auth__signin">Войти</button>
            <button class="auth__signup">Регистрация</button>
        </div>`;
    }
}
