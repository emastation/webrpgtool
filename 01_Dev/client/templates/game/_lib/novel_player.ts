declare var WRT:any;
declare var tm:any;
declare var _:any;
declare var $:any;

module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック

  export class NovelPlayer {
    private static _instance:NovelPlayer;
    public static getInstance():NovelPlayer
    {
      if(NovelPlayer._instance == null) {
        NovelPlayer._instance = new NovelPlayer();
      }
      return NovelPlayer._instance;
    }

    public init() {

      var that = this;
      // シーンを定義
      tm.define("MainScene", {
        superClass: "tm.app.Scene",

        init: function () {
          var this_:any = this;
          this_.superInit();

          // assets で指定したキーを指定することで画像を表示
          this.player = tm.display.Sprite("player").addChildTo(this);
          this.player.setPosition(400, 400).setScale(2, 2);
        },

        update: function (app) {
        }
      });
    }
  }
}