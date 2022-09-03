import { Component } from './scripts/common/templates/component';
import { Router } from './router/router';

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
