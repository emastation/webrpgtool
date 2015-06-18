declare var Codes:any;

module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
  /**
   *  マップ上の移動を処理するクラス
   */
  export class UserFunctionsManager {
    private static _instance:UserFunctionsManager;

    public static getInstance():UserFunctionsManager
    {
      if(UserFunctionsManager._instance == null) {
        UserFunctionsManager._instance = new UserFunctionsManager();
      }
      return UserFunctionsManager._instance;
    }

    private addScriptToPage(code:string) {
      var head = document.getElementsByTagName('head')[0];
      var script = document.createElement("script");
      script.setAttribute("type", "text/javascript");
      script.textContent = code;
      head.appendChild(script);
    }

    public init() {
      var code:any = Codes.findOne();

      if (_.isUndefined(code)) {
        return;
      }

      window.WrtGame.UserFunctions = {};

      var newCode = 'window.WrtGame.UserFunctions.' + code.identifier + ' = ' + code.javascript;
      console.log(newCode);

      this.addScriptToPage(newCode);
    }
  }
}