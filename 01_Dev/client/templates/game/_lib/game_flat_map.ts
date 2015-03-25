/// <reference path="game__map.ts"/>

module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
  export class FlatMap extends Map {
    constructor()
    {
      super(true);
    }
  }
}

//window.WrtGame = WrtGame;

