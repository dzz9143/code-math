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

    for (let i = 0; i < 100; i++) {
        context.moveTo(Math.random() * width, Math.random() * height);
        context.lineTo(Math.random() * width, Math.random() * height);
        context.stroke();
    }
}

window.onload = function onload(): void {
    main(window, document);
};
