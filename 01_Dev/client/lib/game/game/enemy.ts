
module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック

  export class Enemy extends Character {
    private _data:any = {};
    private _typeIdentifier:string;
    private _displayObj:EnemyDisplay = new EnemyDisplay();

    constructor(enemyData:any) {
      super();
      this._typeIdentifier = enemyData.identifier;

      for (var i=0; i<enemyData.attributes.length; i++) {
        this._data[enemyData.attributes[i].identifier] = enemyData.attributes[i].value;
      }
    }

    public initDisplay() {
      this._displayObj.init(this._data['battleEnemyImageUrl']);
    }

    public getMesh() {
      return this._displayObj.getMesh();
    }

    public adjustAspectRatio() {
      this._displayObj.adjustAspectRatio();
    }
  }
}
