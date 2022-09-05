import { App } from './scripts/app/app';
import './style.scss';

window.addEventListener('DOMContentLoaded', () => {
    const rootElement = document.body;
    const app = new App(rootElement);

    app.init();
});
