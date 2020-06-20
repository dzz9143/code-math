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
import {
    mapMouseMove,
    clampTheBall,
    lineToCenter,
    nearToGrid,
    bellCurve,
    pointsInSpace,
    circularExplosion,
} from './utilDemo';
import {
    pointWithCircle,
    circleWithCircle,
    pointWithRect,
    rectWithRect,
} from './collisionDetection';

import gameApplication from './applications/game/main';
import {
    simpleSpring,
    simpleMoveSpring,
    moveSpringWithLength,
    ballConnectWithSpring,
} from './spring';
import { springsTest1, springsTest2, gravitationTest } from './testParticle2';
import { quadBezierCurve1, quadBezierCurve2, bezierCurveTo } from './bezierCurve';
import {
    rectInSpace,
    lineInSpace,
    carouselRect,
    spiralDots,
    insideSpiralDots,
    weirdSpiralMesh,
    moveCube,
} from './3d';
import { easingMoveBall, chasingMouse } from './easing';

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
    // simpleSpring(context, width, height, win);
    // simpleMoveSpring(context, width, height, win, doc);
    // moveSpringWithLength(context, width, height, win, doc);
    // ballConnectWithSpring(context, width, height, win, doc);
    // springsTest1(context, width, height, win, doc);
    // springsTest2(context, width, height, win, doc);
    // gravitationTest(context, width, height, win, doc);
    // nearToGrid(context, width, height, win, doc);
    // bellCurve(context, width, height, win, doc);
    // pointsInSpace(context, width, height, win, doc);
    // quadBezierCurve1(context, width, height, win, doc);
    // quadBezierCurve2(context, width, height, win, doc);
    // circularExplosion(context, width, height, win, doc);
    // bezierCurveTo(context, width, height, win, doc);
    // rectInSpace(context, width, height, win, doc);
    // lineInSpace(context, width, height, win, doc);
    // carouselRect(context, width, height, win, doc);
    // spiralDots(context, width, height, win, doc);
    // insideSpiralDots(context, width, height, win, doc);
    // weirdSpiralMesh(context, width, height, win, doc);
    // moveCube(context, width, height, win, doc);
    // easingMoveBall(context, width, height, win, doc);
    chasingMouse(context, width, height, win, doc);

    // for applications
    // gameApplication(context, width, height, win, doc);
}

window.onload = function onload(): void {
    main(window, document);
};
