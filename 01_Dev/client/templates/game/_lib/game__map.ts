
module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
  export class Map {
    protected map:any;
    constructor(isCalledFromChild:boolean) {
      if(!isCalledFromChild) {
        throw new Error("This class is a abstract class.");
      }
    }

    public setMap(map:any)
    {
      this.map = map;
      console.log("map set!")
    }
  }
}

