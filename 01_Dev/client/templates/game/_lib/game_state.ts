module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック


  export var KEY_CODE_W = 87;
  export var KEY_CODE_A = 65;
  export var KEY_CODE_S = 83;
  export var KEY_CODE_D = 68;
  export var KEY_CODE_Q = 81;
  export var KEY_CODE_E = 69;
  export var KEY_CODE_X = 88;

  export var KEY_INFO_W = [KEY_CODE_W, "KEY_W"];
  export var KEY_INFO_A = [KEY_CODE_A, "KEY_A"];
  export var KEY_INFO_S = [KEY_CODE_S, "KEY_S"];
  export var KEY_INFO_D = [KEY_CODE_D, "KEY_D"];
  export var KEY_INFO_Q = [KEY_CODE_Q, "KEY_Q"];
  export var KEY_INFO_E = [KEY_CODE_E, "KEY_E"];
  export var KEY_INFO_X = [KEY_CODE_X, "KEY_X"];

  export var L_NO_MOVE = "L_NO_MOVE";
  export var L_MOVE_FORWARD = "L_MOVE_FORWARD";
  export var L_TURN_LEFT = "L_TURN_LEFT";
  export var L_TURN_BACK = "L_TURN_BACK";
  export var L_TURN_RIGHT = "L_TURN_RIGHT";
  export var L_MOVE_LEFT = "L_MOVE_LEFT";
  export var L_MOVE_RIGHT = "L_MOVE_RIGHT";
  export var L_MOVE_BACKWARD = "L_MOVE_BACKWARD";

  /**
   *  ゲームの状態を保持するクラス
   */
  export class GameState {
    private static _instance:GameState;
    private _logicalMovementState:any;
    private _allowedStateKeyCode:Array<Number>;
    private _allowedStateKeyInfo:Array<any> = [KEY_INFO_W, KEY_INFO_A, KEY_INFO_S, KEY_INFO_D, KEY_INFO_Q, KEY_INFO_E, KEY_INFO_X];
    private _logicalMovementCommand:Array<any> = [L_MOVE_FORWARD, L_TURN_LEFT, L_TURN_BACK, L_TURN_RIGHT, L_MOVE_LEFT, L_MOVE_RIGHT, L_MOVE_BACKWARD];

    constructor() {
      this._allowedStateKeyCode = this.createAllowedStateKeyCodes();
    }

    public static getInstance():GameState
    {
      if(GameState._instance == null) {
        GameState._instance = new GameState();
      }
      return GameState._instance;
    }

    private createAllowedStateKeyCodes():Array<Number> {
      var allowedStateKeyCodes = [];
      this._allowedStateKeyInfo.forEach(function(element, index, array){
        allowedStateKeyCodes.push(element[0]);
      });

      return allowedStateKeyCodes;
    }

    /**
     * 連打できない扱いのキー（例：前進キーなど）のリストを返す。
     * @returns {string}
     */
    get allowedStateKeyCodes():Array<Number> {
      return this._allowedStateKeyCode;
    }

    public getFunctionLogicalMovementCommand() {
      return function(value) {
        var index = this.getIndexOfKeyState(value);
        if (value[1] === KEY_UP) {
          return L_NO_MOVE;
        } else {
          return this._logicalMovementCommand[index];
        }
      }.bind(this);
    }

    public getIndexOfKeyState(value:any) {
      var allowedStateKeyCodes = this._allowedStateKeyCode;
      var index = this.allowedStateKeyCodes.indexOf(value[0]);

      // Debug output
      var keyName = this._allowedStateKeyInfo[index][1];
      console.debug("KeyStateChanged: " + keyName + " is " + value[1]);

      return index;
    }

    public registerLogicalMovementState(value) {
      this._logicalMovementState = value;
      console.debug("LogicalMovementState: " + value);
    }
  }
}
