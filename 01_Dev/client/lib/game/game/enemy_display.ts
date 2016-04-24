
module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック

  export class EnemyDisplay {
    private _mesh:any;
    private _geometry:any;
    private _material:any;
    private _texture:any;
    constructor() {
    }

    public init(imageUrl:string) {
      this._material = new GLBoost.ClassicMaterial();
      this._texture = new GLBoost.Texture(imageUrl);
      this._material.diffuseTexture = this._texture;
      this._geometry = new GLBoost.Plane(1, 1, 1, 1, null);
      this._mesh = new GLBoost.Mesh(this._geometry, this._material);
      this._mesh.rotate = new GLBoost.Vector3(-90, 0, 0);
    }

    public getMesh() {
      return this._mesh;
    }

    public adjustAspectRatio() {
      var width = this._texture.width;
      var height = this._texture.height;

      //var ratio = height / width;

      var ratio = width / height;

      this._mesh.scale = new GLBoost.Vector3(ratio, 1, 1);

    }

  }
}
