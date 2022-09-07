import { IRoute } from '../scripts/common/interfaces';
import { Component } from '../scripts/common/templates/component';
import { AuthContainer } from '../scripts/main';
import { AuthPopup } from '../scripts/main/auth-popup/signin-popup';
import { AudioChallengeApp } from '../scripts/games/audio-challenge/audioChallengeApp';
import { SprintApp } from './../scripts/games/sprint/sprintApp';

export class Router {
    private readonly routes: Array<IRoute>;
    private defaultRoute: IRoute;

    mainPage: Component;
    authPage: Component | undefined;

    constructor(private rootElement: HTMLElement) {
        this.mainPage = new Component(this.rootElement);
        const authPage = new AuthContainer(this.rootElement);

        this.routes = [
            {
                name: '',
                component: () => {
                    this.rootElement.append(authPage?.element);
                },
            },
            {
                name: 'auth',
                component: () => {                    
                    const popup = new AuthPopup(this.rootElement);
                    this.rootElement.append(authPage?.element);
                    this.rootElement.append(popup.element);
                },
            },
            {
                name: 'audio-challenge',
                component: () => {
                    new AudioChallengeApp(this.rootElement);
                },
            },
            {
                name: 'sprint',
                component: () => {
                    new SprintApp(this.rootElement);
                },
            }
        ];

        this.defaultRoute = {
            name: 'Default router',
            component: () => {
                this.rootElement.append(authPage?.element);
            },
        };
    }

    updateRouter(): void {
        this.rootElement.innerHTML = '';
        const currentRouteName = window.location.hash.slice(1);
        
        const currentRoute = this.routes.find(
            (page) => page.name === currentRouteName,
        );

        (currentRoute || this.defaultRoute).component();
    }

    initRouter(): void {

        window.onpopstate = () => this.updateRouter();
        this.updateRouter();
    }
}
