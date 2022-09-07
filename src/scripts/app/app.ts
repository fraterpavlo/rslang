import { Router } from './../../router/router';
import { Component } from '../common/templates/component';

export class App {
    private main;
    private router;

    constructor(private rootElement: HTMLElement) {
        this.main = new Component(this.rootElement, 'main', ['main']);
        this.router = new Router(this.main.element);
    }

    init(): void {
        this.router.initRouter();
    }
}
