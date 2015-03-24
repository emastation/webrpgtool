
module WrtGame {
    export class Map {
        constructor()
        {
            console.log("Hello TypeScript!");
        }
    }
}

interface Window {
    WrtGame: any;
}

window.WrtGame = WrtGame;
