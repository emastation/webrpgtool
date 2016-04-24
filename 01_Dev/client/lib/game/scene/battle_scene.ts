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
      var canvas:any = glboostCtx.getCanvas();
      var aspect = canvas.width / canvas.height;
      this._scene = new GLBoost.Scene();
      this._camera = new GLBoost.Camera(
        {
          eye: new GLBoost.Vector3(0.0, 0, 6.0),
          center: new GLBoost.Vector3(0.0, 0.0, 0.0),
          up: new GLBoost.Vector3(0.0, 1.0, 0.0)
        },
        {
          fovy: 45.0,
          aspect: aspect,
          zNear: 0.1,
          zFar: 300.0
        }
      );

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
      const bgmPlayer = BgmPlayer.getInstance();
      bgmPlayer.play('hitokiri_b5');

      let resourceManager:ResourceManager = ResourceManager.getInstance();
      var enemies = resourceManager.getEnemies();

      var enemiesDisplayed = [];
      enemies.forEach((enemy)=>{
        if (Math.random() < 0.5) {
          this._scene.add(enemy.getMesh());
          enemiesDisplayed.push(enemy.getMesh());
          enemy.adjustAspectRatio();
        }
      });

      for (let i=0; i<enemiesDisplayed.length; i++) {
        enemiesDisplayed[i].translate = new GLBoost.Vector3((1.25 * (i+0.5 - enemiesDisplayed.length/2.0)), 0, 0);
      }

      this._scene.add( this._camera );

      this._scene.prepareForRender();
    }

    public tearDown(){
      this._scene.removeAll();
    }
  }
}
