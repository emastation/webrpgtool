
module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック

  export class EnemyDisplay {
    private _mesh:any;
    private _geometry:any;
    private _material:any;
    private _texture:any;
    constructor() {
    }

    init(imageUrl:string) {
      this._material = new GLBoost.ClassicMaterial();
      this._texture = new GLBoost.Texture(imageUrl);
      this._material.diffuseTexture = this._texture;
      this._geometry = new GLBoost.Plane(10, 10, 1, 1, null);
      this._mesh = new GLBoost.Mesh(this._geometry, this._material);
    }
  }
}
