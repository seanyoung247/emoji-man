
(()=>{
    const can = document.getElementById('game-screen');
    const ctx = can.getContext('2d');

    // Defines the properties of the user controlled box
    const box = {
        // Current pixel position
        x: 100, y: 100,
        // size in pixels
        w: 50, h: 50,
        // Movement direction
        vX: 0, vY: 0,
        // Movement speed in pixels per second
        speed: 500,

        // Moves the box based on the value of the movement direction and speed
        move(timeDelta) {
            this.x += this.vX * (this.speed * timeDelta);
            this.y += this.vY * (this.speed * timeDelta);
            // Ensure the box doesn't leave the screen
            if (this.x < 0) this.x = 0;
            if (this.x + this.w > can.width) this.x = can.width - this.w;
            if (this.y < 0) this.y = 0;
            if (this.y + this.h > can.height) this.y = can.height - this.h;
        }
    };

    /*
     * User interaction code.
     */
    // Commands the player can give the box
    const actions = {
        left: () => {box.vX = -1, box.vY = 0},
        right: () => {box.vX = 1, box.vY = 0},
        up: () => {box.vX = 0, box.vY = -1},
        down: () => {box.vX = 0, box.vY = 1},
    }

    // Maps keyboard keys to actions. Splitting things like this allows us to remap keys 
    // to actions and also have different keys and events perform the same action.
    const keyMap = new Map();
    keyMap.set('ArrowLeft', 'left');
    keyMap.set('ArrowRight', 'right');
    keyMap.set('ArrowUp', 'up');
    keyMap.set('ArrowDown', 'down');

    // React to user input
    document.addEventListener('keydown', (e) => {
        const key = keyMap.get(e.code);
        // Is the current key one we recognise?
        if (key) {
            // Perform the action associated with this key.
            actions[key]();
        }
    });

    // This starts the game running by calling frame() for the first time:
    window.requestAnimationFrame(frame);

     /**
      * Called each frame. 
      * This is where all the game logic and drawing code should be called from.
      * This is what is called 'the game loop' and how it is implemented in 
      * web browser Javascript.
      */
    function frame(time) {
        /* The canvas is currently set up to fill the whole browser window. 
            But the canvas sets it's pixel size independently, so we need to ensure the
            Pixel size and screen size match at the start of each frame, in case the
            browser window has been resized. */
        ctx.canvas.width = can.clientWidth;
        ctx.canvas.height = can.clientHeight;

        /* How much time has passed since the last frame? We need to know this so we can
            do frame independent animation. We want movement speed and animations to be dependent
            on how much time has passed, not how many frames. Otherwise at 60fps things would be
            twice as fast as at 30fps. */
        const timeDelta = (time - (this.lastFrameTime || time)) / 1000;

        // Move the box so it can react to player commands
        box.move(timeDelta);
        // Now draw the box to the screen. 
        // We're just drawing a rectangle here, but you can also draw images with similar functions.
        ctx.fillStyle = 'black';
        ctx.fillRect(box.x, box.y, box.w, box.h);

        this.lastFrameTime = time;
        // Tells the browser to call this function again for the next frame update
        window.requestAnimationFrame(frame);
    }
})();