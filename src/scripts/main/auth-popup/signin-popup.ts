import { Component } from '../../common/templates/component';
import { UIInput } from '../UI/input';
import { UIButton } from '../UI/button';
import { ISigninUser, ICreateUser } from '../common/interfaces';
import { createUser, signin, deleteUser } from '../common/api/api';
import './signin-popup.scss';


export class AuthPopup extends Component {
    // createUser: (state: ISigninUser) => void = () => {};
    // signupUser: (state: ISignupUser) => void = () => {};
    private linkToClose: Component;
    private inputEmail: UIInput;
    private labelEmail: Component;
    private inputName: UIInput;
    private labelName: Component;
    private inputPass: UIInput;
    private labelPass: Component;
    private signin: UIButton;
    private signup: UIButton;
    private logout: UIButton;    

    state = {
        name: '',
        email: '',
        password: '',
    };

    constructor(parentNode: HTMLElement) {
        super(parentNode, 'div', ['auth']);

        this.element.setAttribute('id', 'auth');

        this.linkToClose = new Component(
            this.element,
            'a',
            ['close'],
            'X',
        );

        this.linkToClose.element.setAttribute('href', '#');

        const title = new Component(this.element, 'div', ['auth__window']);

        const inputNameContainer = new Component(title.element, 'div', ['auth__inp']);
        this.labelName = new Component(inputNameContainer.element, 'label', ['labelName'], 'Имя:');
        this.labelName.element.setAttribute('for', 'inputName');

        this.inputName = new UIInput(inputNameContainer.element, 'text', ['inputName']);
        this.inputName.element.setAttribute('id', 'inputName');
        this.inputName.getInputValue = (event) => this.updateState('name', event);

        const inputEmailContainer = new Component(title.element, 'div', ['auth__inp']);

        this.labelEmail = new Component(inputEmailContainer.element, 'label', ['labelEmail'], 'Email:');
        this.labelEmail.element.setAttribute('for', 'inputIdemail');

        this.inputEmail = new UIInput(inputEmailContainer.element, 'text', ['inputEmail']);
        this.inputEmail.element.setAttribute('id', 'inputIdemail');
        this.inputEmail.getInputValue = (event) => this.updateState('email', event);

        const inputPassContainer = new Component(title.element, 'div', ['auth__inp']);

        this.labelPass = new Component(inputPassContainer.element, 'label', ['labelEmail'], 'Пароль:');
        this.labelPass.element.setAttribute('for', 'inputIdemail');

        this.inputPass = new UIInput(inputPassContainer.element, 'text', ['inputEmail']);
        this.inputPass.element.setAttribute('id', 'inputIdemail');
        this.inputPass.getInputValue = (event) => this.updateState('password', event);

        const btnContainer = new Component(title.element, 'div', ['auth__btns']);

        this.signin = new UIButton(btnContainer.element, ['auth__signin'], 'Войти');
        this.signup = new UIButton(btnContainer.element, ['auth__signup'], 'Регистрация');
        this.logout = new UIButton(btnContainer.element, ['auth__logout'], 'Выйти');

        this.signin.onClickButton = async () => {
            await signin({email: this.state.email, password: this.state.password});
        };

        this.signup.onClickButton = async () => {
            await createUser(this.state);
        }

        this.logout.onClickButton = async () => {
            const userId = JSON.parse(localStorage.user).userId;            
            await deleteUser(userId)
        }
    }

    updateState(key: keyof ISigninUser | keyof ICreateUser, event: Event): void {
        const input = event.target as HTMLInputElement;
        this.state[key] = input.value;
    }
}
