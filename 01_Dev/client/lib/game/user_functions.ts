declare var MongoCollections:any;
declare var jailed:any;
declare var application:any;

module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
  /**
   *  マップ上の移動を処理するクラス
   */
  export class UserFunctionsManager {
    private static _instance:UserFunctionsManager;
    public _func:any;
    private _jailedPlugin:any;
    private _acceptableFromUI:boolean = true;

    public static getInstance():UserFunctionsManager
    {
      if(UserFunctionsManager._instance == null) {
        UserFunctionsManager._instance = new UserFunctionsManager();
      }
      return UserFunctionsManager._instance;
    }
/*
    private addScriptToPage(code:string) {
      var head = document.getElementsByTagName('head')[0];
      var script = document.createElement("script");
      script.setAttribute("type", "text/javascript");
      script.textContent = code;
      head.appendChild(script);
    }
*/
    public loadSandboxCode(functionName:string) {
      var code:any = MongoCollections.Codes.findOne({identifier: functionName});

      if (_.isUndefined(code)) {
        return;
      }

      /*
      window.WrtGame.UserFunctions = {};

      var newCode = 'window.WrtGame.UserFunctions.' + code.identifier + ' = ' + code.javascript;
      console.log(newCode);

      this.addScriptToPage(newCode);
      */

      var sandboxCode:any = `
      // WebRPGツールへ公開するAPI
      var api = {
        doSandboxFunc: (value)=> {
          gameLogic(value);
        },
        returnResult:(value)=> {
          this.returnResult(value);
        }
      };
      application.setInterface(api);

      // 非同期処理を同期処理のように書ける仕組み
      function async(genFunc) {
        var gen = genFunc();

        var result = gen.next();
        chain(result);

        function chain(result) {
          if (result.done) {
            return result.value;
          }

          var promise = result.value;
          promise.then(function(val){
            var result = gen.next(val);
            chain(result);
          }).catch(function(e){
            var result = gen.throw(e);
            return chain(result);
          })
        }
      }
      function callEngineMethod(methodName, value) {
        var promise = new Promise((resolve, reject) => {
          application.remote[methodName](value);
          this.returnResult = function(value) {
            resolve(value);
          };
        });

        return promise;
      }

      // ユーザーコード
      var gameLogic = (value)=> {
        async(function*(){
        `;

      sandboxCode += code.javascript;

/*
          var result = yield callEngineMethod('playNovelNext', value);
//          application.remote.alert(result);
//          var result = yield callEngineMethod('doEngineAPIFoo', result);
//          application.remote.alert(result);
*/
      sandboxCode += `
          callEngineMethod('tellPluginCodeFinished', true);
        });
      }
      `;

      var that = this;

      var api = {
        alert: alert,
        playNovelNext:(storyName)=> {
          var novelPlayer = NovelPlayer.getInstance();

          if ( novelPlayer.loadStory(storyName, (void 0)) ) {
            novelPlayer.playNext();
          }

          this._jailedPlugin.remote.returnResult(0);
        },
        changePlayerIsMovable:(value)=> {
          var mapMovement = MapMovement.getInstance();
          mapMovement.playerIsMovable = value;
          this._jailedPlugin.remote.returnResult(value);
        },
        tellPluginCodeFinished:(value)=> {
          that._acceptableFromUI = true;
          this._jailedPlugin.disconnect();
        }
      };

      this._jailedPlugin = new jailed.DynamicPlugin(sandboxCode, api);
    }

    public execute(functionName:string, executor:string) {
      if (!this._acceptableFromUI && executor === 'UI') {
        return;
      }

      var mapMovement = MapMovement.getInstance();
      mapMovement.playerIsMovable = false;
      this.loadSandboxCode(functionName);
      this._jailedPlugin.whenConnected( ()=> {
        this._jailedPlugin.remote.doSandboxFunc(1);
      });
    }

    public set acceptableFromUI(flg) {
      this._acceptableFromUI = flg;
    }
  }

}
