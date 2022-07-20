import { emojis } from './emojis/emoji_dict.js'

export function createMapInfo(mapParams) {
    let mapEnemiesHTML = '';
    let mapCollectableHTML = '';
    let mapDestinationHTML = '';


    // display enemies
    for (const [key, value] of Object.entries(emojis)) {
        for (let i = 0; i < mapParams['enemies'].length; i++) {
            if (mapParams['enemies'][i]['type'] == key) {
                let html = `&#${value['html']}`;
                if (!mapEnemiesHTML.includes(html)) {
                    mapEnemiesHTML = mapEnemiesHTML + html + '';
                }
            }
        }
        document.getElementById('game-baddies').innerHTML = mapEnemiesHTML

    }

    // display collectables
    for (const [key, value] of Object.entries(emojis)) {
        for (let i = 0; i < mapParams['objects'].length; i++) {
            if (mapParams['objects'][i]['type'] == key) {
                let html = `&#${value['html']}`;
                if (!mapCollectableHTML.includes(html)) {
                    mapCollectableHTML = mapCollectableHTML + html + '';
                }
            }
        }
        document.getElementById('game-objects').innerHTML = mapCollectableHTML

    }

    // display destination
    for (const [key, value] of Object.entries(emojis)) {
        if (key == mapParams['destination']['type']) {
            let html = `&#${value['html']}`;
            mapDestinationHTML = mapDestinationHTML + html;
        }
    }

    document.getElementById('game-title').innerHTML = '- ' + mapParams['title'];
    document.getElementById('game-dest').innerHTML = mapDestinationHTML;
}

export function createGameElements(gameMap, mapParams, player) {
    document.documentElement.style.setProperty('--map-columns', gameMap.cols);
    document.documentElement.style.setProperty('--map-rows', gameMap.rows);

    document.documentElement.style.setProperty('--game-foreground', gameMap.template.foreground);
    document.documentElement.style.setProperty('--game-background', gameMap.template.background);

    // Map + Tiles
    const frag = new DocumentFragment();
    frag.append(gameMap.element);

    gameMap.registerPlayer(player);
    frag.append(player.element);

    //Objects + Enemies here
    frag.append(gameMap.objFragment); // Appends the loaded objects elements

    // Update the DOM
    document.getElementById('game-screen').append(frag);
    createMapInfo(mapParams);
}

export function clearGameElements(gameScreen) {
    document.getElementById('game-screen').innerHTML = '';
}

export function showGameDialog(text='Ready Player One?', btnText='Play Emojiman') {
    const dialog = document.getElementById('game-dialog');
    const dialogText = document.getElementById('dialog-text');
    const dialogBtn = document.getElementById('start-game-btn');

    dialogText.innerText = text;
    dialogBtn.innerText = btnText;
    dialog.style.display = 'block';
}

export function hideGameDialog() {
    document.getElementById('game-dialog').style.display = 'none';
}

export function setGameOver() {
    document.getElementById('game-screen').classList.add('paused');
}

export function setGameRunning() {
    document.getElementById('game-screen').classList.remove('paused');
}