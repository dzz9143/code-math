import { trig1 } from './trig';
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

    trig1(context, width, height);
}

window.onload = function onload(): void {
    main(window, document);
};
