module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
  export class GameLogic {
    private static _instance:GameLogic;
    private _logicalEvent = [];
    public static getInstance():GameLogic
    {
      if(GameLogic._instance == null) {
        GameLogic._instance = new GameLogic();
      }
      return GameLogic._instance;
    }

    public onMoveOnMapCallback() {
      // TODO: Use Bacon.js. add an 'Encount' Logical event to the EventStream.
      if(Math.random()<0.10) {
      //        if(Math.random()<1) {
          console.log("エンカウント！！" + LG_ENCOUNTER);
      //            if ($("#checkbox_encounter").attr("checked") === "checked") {
        this._logicalEvent.push(LG_ENCOUNTER);

        return true;
      } else {
        return false;
      }

    }

    getGameLogicalEvent() {
      return this._logicalEvent.shift();
    }
  }
}
