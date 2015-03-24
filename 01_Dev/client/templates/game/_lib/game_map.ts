
module WrtGame {
  export class Map {
    private map:any;
    constructor()
    {
      console.log("Hello TypeScript!");
    }

    public setMap(map:any)
    {
      this.map = map;
    }
  }
}

interface Window {
    WrtGame: any;
}

window.WrtGame = WrtGame;
