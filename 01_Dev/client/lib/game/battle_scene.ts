declare var MongoCollections:any;


module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック


  export class BattleScene extends Scene {
    private _renderer:any = null;
    constructor() {
      super();

      this.initGLBoost();
    }

    initGLBoost() {
      var glboostCtx = GLBoostContext.getInstance();
      this._renderer = glboostCtx.getRenderer();

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
      enemiesMongo.forEach((enemy)=>{
        enemies.push(new Enemy(enemy));
      });
    }

    sceneLoop() {


    }
  }
}
