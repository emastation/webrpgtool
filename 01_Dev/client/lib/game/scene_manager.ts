module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック


  export class SceneManager {
    private static _instance:SceneManager;
    private _scenes:any = {};
    private _currentSceneName = null;
    public static getInstance():SceneManager
    {
      if(SceneManager._instance == null) {
        SceneManager._instance = new SceneManager();
      }
      return SceneManager._instance;
    }
    constructor() {

    }

    addScene(key:string, scene:Scene, switchScene:boolean = true) {
      this._scenes[key] = scene;
      if (switchScene) {
        this._currentSceneName = key;
      }
    }

    getScene(key:string) {
      return this._scenes[key];
    }

    switchScene(key) {
      this._currentSceneName = key;
    }

    getCurrentScene() {
      return this._scenes[this._currentSceneName];
    }
  }
}
