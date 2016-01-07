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
    }

    sceneLoop() {

    }
  }
}
