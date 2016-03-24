
module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック

  export class Enemy extends Character {
    private _data:any = {};
    private _typeIdentifier:string;

    constructor(enemyData:any) {
      this._typeIdentifier = enemyData.identifier;

      for (var i=0; i<enemyData.attributes.length; i++) {
        this._data[enemyData.attributes[i].identifier] = enemyData.attributes[i].value;
      }
    }
  }
}
