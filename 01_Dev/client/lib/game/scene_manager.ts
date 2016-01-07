module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック


  export class SceneManager {
    private static _instance:SceneManager;
    private _scenes:any = {};
    public static getInstance():SceneManager
    {
      if(SceneManager._instance == null) {
        SceneManager._instance = new SceneManager();
      }
      return SceneManager._instance;
    }
    constructor() {

    }

    addScene(key:string, scene:Scene) {
      this._scenes[key] = scene;
    }

    getScene(key:string) {
      return this._scenes[key];
    }
  }
}
