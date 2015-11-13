module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
  export class GameLogic {
    private static _instance:GameLogic;
    public static getInstance():GameLogic
    {
      if(GameLogic._instance == null) {
        GameLogic._instance = new GameLogic();
      }
      return GameLogic._instance;
    }

    public onMoveOnMapCallback() {
      if(Math.random()<0.50) {
      //        if(Math.random()<1) {
          console.log("エンカウント！！");
      //            if ($("#checkbox_encounter").attr("checked") === "checked") {
          if (true) {
      //                alert("エンカウント！");
              return true;
          }
      }

      return false;
    }
  }
}
