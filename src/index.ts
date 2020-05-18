import {
    trig1,
    trig2,
    circle,
    ellipse,
    lissajousCurve,
    chaosCircles,
    arrow,
} from './trig';

import { fireWork, movePlane, galaxy } from './physics';

import { soomthWrapping, bouncingParticle, droppingBall, fountain } from './edgeHandle';
import { mapMouseMove, clampTheBall, lineToCenter } from './utilDemo';
import {
    pointWithCircle,
    circleWithCircle,
    pointWithRect,
    rectWithRect,
} from './collisionDetection';

import gameApplication from './applications/game/main';

function main(win: Window, doc: Document): void {
    // hello
    console.log('hello code math');

    const canvas = doc.getElementById('canvas') as HTMLCanvasElement;
    canvas.width = win.innerWidth;
    canvas.height = win.innerHeight;
    const width = win.innerWidth;
    const height = win.innerHeight;

    console.log('init canvas with w:', width, 'h:', height);

    const context = canvas.getContext('2d');

    // trig1(context, width, height);
    // trig2(context, width, height, win);
    // circle(context, width, height, win);
    // ellipse(context, width, height, win);
    // lissajousCurve(context, width, height, win);
    // chaosCircles(context, width, height, win);
    // arrow(context, width, height, win, doc);
    // fireWork(context, width, height, win);
    // movePlane(context, width, height, win, doc);
    // galaxy(context, width, height, win);
    // soomthWrapping(context, width, height, win);
    // bouncingParticle(context, width, height, win);
    // droppingBall(context, width, height, win);
    // fountain(context, width, height, win);
    // mapMouseMove(context, width, height, win, doc);
    // clampTheBall(context, width, height, win, doc);
    // lineToCenter(context, width, height, win, doc);
    // pointWithCircle(context, width, height, win, doc);
    // circleWithCircle(context, width, height, win, doc);
    // pointWithRect(context, width, height, win, doc);
    // rectWithRect(context, width, height, win, doc);

    // for applications
    gameApplication(context, width, height, win, doc);
}

window.onload = function onload(): void {
    main(window, document);
};
