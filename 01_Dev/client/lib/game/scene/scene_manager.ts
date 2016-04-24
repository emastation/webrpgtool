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
        this.switchScene(key);
      }
    }

    getScene(key:string) {
      return this._scenes[key];
    }

    switchScene(key) {
      if (this._currentSceneName) {
        this._scenes[this._currentSceneName].tearDown();
      }
      this._currentSceneName = key;
      this._scenes[this._currentSceneName].setUp();
    }

    getCurrentScene() {
      return this._scenes[this._currentSceneName];
    }
  }

}
