declare var GLBoost:any;

module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック

  export class GLBoostContext {
    private static _instance:GLBoostContext;
    private _renderer:any = null;
    private _canvas:HTMLCanvasElement = null;
    private _canvasId:string = null;

    public static getInstance():GLBoostContext
    {
      if(GLBoostContext._instance == null) {
        GLBoostContext._instance = new GLBoostContext();
      }
      return GLBoostContext._instance;
    }
    constructor() {
    }

    init(canvasId:string) {
      this._canvasId = canvasId;
      this._canvas = <HTMLCanvasElement>document.querySelector(canvasId);

      this._renderer = new GLBoost.Renderer({ canvas: this._canvas, clearColor: {red:0.0, green:0.0, blue:0.0, alpha:1}});
    }

    getRenderer() {
      return this._renderer;
    }

    getCanvas():HTMLCanvasElement {
      return this._canvas;
    }

    getCanvasId():string {
      return this._canvasId;
    }
  }
}
