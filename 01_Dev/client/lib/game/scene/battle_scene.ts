declare var MongoCollections:any;


module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック


  export class BattleScene extends Scene {
    private _renderer:any = null;
    private _scene:any = null;
    private _camera:any = null;
    constructor() {
      super();

      this._initGLBoost();
    }

    private _initGLBoost() {
      var glboostCtx = GLBoostContext.getInstance();
      this._renderer = glboostCtx.getRenderer();
      this._scene = new GLBoost.Scene();
      this._camera = new GLBoost.Camera(
        {
          eye: new GLBoost.Vector3(0.0, 0, 4.0),
          center: new GLBoost.Vector3(0.0, 0.0, 0.0),
          up: new GLBoost.Vector3(0.0, 1.0, 0.0)
        },
        {
          fovy: 45.0,
          aspect: 1.0,
          zNear: 0.1,
          zFar: 300.0
        }
      );
      this._scene.add( this._camera );








      var characters:any = MongoCollections.Objects.find({schema_identifier:'wrt_game_character'}).fetch();
      var enemiesMongo = _.filter(characters, (character:any)=>{
        var result = false;
        for (var i=0; i<character.attributes.length; i++) {
          if (character.attributes[i].identifier === 'situation' && character.attributes[i].value === 'enemy') {
            result = true;
          }
        }
        return result;
      });

      console.log(enemiesMongo);

      let enemies:Array<Enemy> = new Array<Enemy>();
      enemiesMongo.forEach((enemyMongo)=>{
        var enemy = new Enemy(enemyMongo);
        enemy.initDisplay();
        enemies.push(enemy);
      });

      let resourceManager:ResourceManager = ResourceManager.getInstance();
      resourceManager.setEnemies(enemies);
    }

    public sceneLoop() {
      this._renderer.clearCanvas();
      this._renderer.draw(this._scene);
    }

    public setUp() {
      let resourceManager:ResourceManager = ResourceManager.getInstance();
      var enemies = resourceManager.getEnemies();

      enemies.forEach((enemy)=>{
        this._scene.add(enemy.getMesh());
      });

      this._scene.prepareForRender();
    }

    public tearDown(){}
  }
}
