module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック


  export class ResourceManager {
    private static _instance:ResourceManager;
    private _enemies:Array<Enemy> = new Array<Enemy>();
    public static getInstance():ResourceManager
    {
      if(ResourceManager._instance == null) {
        ResourceManager._instance = new ResourceManager();
      }
      return ResourceManager._instance;
    }
    constructor() {

    }

    setEnemies(enemies:Array<Enemy>) {
      this._enemies = enemies;
    }
  }
}
