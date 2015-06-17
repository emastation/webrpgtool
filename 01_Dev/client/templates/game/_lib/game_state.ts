module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック


  export var KEY_CODE_W = 87;
  export var KEY_CODE_A = 65;
  export var KEY_CODE_S = 83;
  export var KEY_CODE_D = 68;
  export var KEY_CODE_Q = 81;
  export var KEY_CODE_E = 69;
  export var KEY_CODE_X = 88;
  export var KEY_CODE_T = 84;
  export var KEY_CODE_G = 71;
  export var KEY_CODE_R = 82;
  export var KEY_CODE_F = 70;
  export var KEY_CODE_ARROW_LEFT = 37;
  export var KEY_CODE_ARROW_UP = 38;
  export var KEY_CODE_ARROW_RIGHT = 39;
  export var KEY_CODE_ARROW_DOWN = 40;

  export var KEY_INFO_W = [KEY_CODE_W, "KEY_W"];
  export var KEY_INFO_A = [KEY_CODE_A, "KEY_A"];
  export var KEY_INFO_S = [KEY_CODE_S, "KEY_S"];
  export var KEY_INFO_D = [KEY_CODE_D, "KEY_D"];
  export var KEY_INFO_Q = [KEY_CODE_Q, "KEY_Q"];
  export var KEY_INFO_E = [KEY_CODE_E, "KEY_E"];
  export var KEY_INFO_X = [KEY_CODE_X, "KEY_X"];
  export var KEY_INFO_T = [KEY_CODE_T, "KEY_T"];
  export var KEY_INFO_G = [KEY_CODE_G, "KEY_G"];
  export var KEY_INFO_R = [KEY_CODE_R, "KEY_R"];
  export var KEY_INFO_F = [KEY_CODE_F, "KEY_F"];

  export var KEY_INFO_ARROW_LEFT = [KEY_CODE_ARROW_LEFT, "KEY_ARROW_LEFT"];
  export var KEY_INFO_ARROW_UP = [KEY_CODE_ARROW_UP, "KEY_ARROW_UP"];
  export var KEY_INFO_ARROW_RIGHT = [KEY_CODE_ARROW_RIGHT, "KEY_ARROW_RIGHT"];
  export var KEY_INFO_ARROW_DOWN = [KEY_CODE_ARROW_DOWN, "KEY_ARROW_DOWN"];

  export var L_NO_MOVE = "L_NO_MOVE";
  export var L_MOVE_FORWARD = "L_MOVE_FORWARD";
  export var L_TURN_LEFT = "L_TURN_LEFT";
  export var L_TURN_BACK = "L_TURN_BACK";
  export var L_TURN_RIGHT = "L_TURN_RIGHT";
  export var L_MOVE_LEFT = "L_MOVE_LEFT";
  export var L_MOVE_RIGHT = "L_MOVE_RIGHT";
  export var L_MOVE_BACKWARD = "L_MOVE_BACKWARD";
  export var L_MOVE_UPPER = "L_MOVE_UPPER";
  export var L_MOVE_LOWER = "L_MOVE_LOWER";
  export var L_FACE_UP = "L_FACE_UP";
  export var L_FACE_LOW = "L_FACE_LOW";

  export var L_UI_NO_MOVE = "L_UI_NO_MOVE";
  export var L_UI_MOVE_LEFT = "L_UI_MOVE_LEFT";
  export var L_UI_MOVE_UPPER = "L_UI_MOVE_UPPER";
  export var L_UI_MOVE_RIGHT = "L_UI_MOVE_RIGHT";
  export var L_UI_MOVE_LOWER = "L_UI_MOVE_LOWER";

  export var L_NORTH = "L_NORTH";
  export var L_WEST = "L_WEST";
  export var L_EAST = "L_EAST";
  export var L_SOUTH = "L_SOUTH";
  export var L_UPPER = "L_UPPER";
  export var L_LOWER = "L_LOWER";

  export var flyMode_f = true;

  /**
   *  ゲームの状態を保持するクラス
   */
  export class GameState {
    private static _instance:GameState;
    private _logicalMovementState:string;
    private _logicalUiOperationState:string;
    private _allowedStateKeyCodes:Array<Number>;
    private _allowedStateKeyInfo:Array<any> =
        [KEY_INFO_W, KEY_INFO_A, KEY_INFO_S, KEY_INFO_D, KEY_INFO_Q, KEY_INFO_E, KEY_INFO_X, KEY_INFO_T, KEY_INFO_G, KEY_INFO_R, KEY_INFO_F];
    private _logicalMovementCommand:Array<any> =
        [L_MOVE_FORWARD, L_TURN_LEFT, L_TURN_BACK, L_TURN_RIGHT, L_MOVE_LEFT, L_MOVE_RIGHT, L_MOVE_BACKWARD, L_MOVE_UPPER, L_MOVE_LOWER, L_FACE_UP, L_FACE_LOW];
    private _allowedUiKeyCodes:Array<Number>;
    private _allowedUiKeyInfo:Array<any> = [KEY_INFO_ARROW_LEFT, KEY_INFO_ARROW_UP, KEY_INFO_ARROW_RIGHT, KEY_INFO_ARROW_DOWN];
    private _logicalUiCommand:Array<any> =
        [L_UI_MOVE_LEFT, L_UI_MOVE_UPPER, L_UI_MOVE_RIGHT, L_UI_MOVE_LOWER];

    constructor() {
      this._allowedStateKeyCodes = this.createKeyCodesFromKeyInfo(this._allowedStateKeyInfo);
      this._allowedUiKeyCodes = this.createKeyCodesFromKeyInfo(this._allowedUiKeyInfo);
    }

    public static getInstance():GameState
    {
      if(GameState._instance == null) {
        GameState._instance = new GameState();
      }
      return GameState._instance;
    }

    /**
     * 物理イベントのBaconJSプロパティから移動命令を生成するBaconJSプロパティに変換する
     * @param property
     */
    public mapPhysicalEventPropertyToLogicalMovementCommandProperty(phisicalEventProperty:any) :any {
      var logicalMovementCommandProperty:any = phisicalEventProperty.flatMap(this.getFunctionLogicalMovementCommand());
      logicalMovementCommandProperty.onValue((value)=> {
        this.registerLogicalMovementState(value);
      });

      return logicalMovementCommandProperty;
    }

    /**
     * 物理イベントのBaconJSプロパティからUI命令を生成するBaconJSプロパティに変換する
     * @param property
     */
    public mapPhysicalEventPropertyToLogicalUiCommandProperty(phisicalEventProperty:any) :any {
      var logicalUiCommandProperty:any = phisicalEventProperty.flatMap(this.getFunctionLogicalUiCommand());
      logicalUiCommandProperty.onValue((value)=> {
        this.registerLogicalUiOperationState(value);
      });

      return logicalUiCommandProperty;
    }


    /**
     * KEY_INFO_* の配列から KEY_CODE_* の配列を作る
     * @returns {Array}
     */
    private createKeyCodesFromKeyInfo(infoArray:Array<any>):Array<Number> {
      var allowedStateKeyCodes = [];
      infoArray.forEach(function(element, index, array){
        allowedStateKeyCodes.push(element[0]);
      });

      return allowedStateKeyCodes;
    }

    /**
     * 連打できない扱いの移動操作キー（例：前進キーなど）のリストを返す。
     * @returns {string}
     */
    get allowedStateKeyCodes():Array<Number> {
      return this._allowedStateKeyCodes;
    }

    /**
     * 連打できない扱いのUiキー（例：←など）のリストを返す。
     * @returns {string}
     */
    get allowedUiKeyCodes():Array<Number> {
      return this._allowedUiKeyCodes;
    }

    /**
     * Bacon.jsのキーイベントプロパティのflatMapに渡す関数を返す（移動操作キー用）
     * @returns {any}
     */
    private getFunctionLogicalMovementCommand() {
      return function(value) {
        var index = this.getIndexOfKeyState(value);
        if (value[1] === KEY_UP) {
          return L_NO_MOVE;
        } else {
          return this._logicalMovementCommand[index];
        }
      }.bind(this);
    }

    /**
     * Bacon.jsのキーイベントプロパティのflatMapに渡す関数を返す（UI操作キー用）
     * @returns {any}
     */
    private getFunctionLogicalUiCommand() {
      return function(value) {
        var index = this.getIndexOfUiKey(value);
        if (value[1] === KEY_UP) {
          return L_UI_NO_MOVE;
        } else {
          return this._logicalUiCommand[index];
        }
      }.bind(this);
    }

    /**
     * キーコード配列のインデックスを返す（移動操作キー用）
     * @param value
     * @returns {number}
     */
    public getIndexOfKeyState(value:any) {
      var index = this.allowedStateKeyCodes.indexOf(value[0]);

      // Debug output
      var keyName = this._allowedStateKeyInfo[index][1];
      console.debug("KeyStateChanged: " + keyName + " is " + value[1]);

      return index;
    }

    /**
     * キーコード配列のインデックスを返す（Ui操作キー用）
     * @param value
     * @returns {number}
     */
    public getIndexOfUiKey(value:any) {
      var index = this._allowedUiKeyCodes.indexOf(value[0]);

      // Debug output
      var keyName = this._allowedUiKeyInfo[index][1];
      console.debug("UiKeyChanged: " + keyName + " is " + value[1]);

      return index;
    }

    /**
     * 論理移動命令ステートを記憶する
     * @param value
     */
    private registerLogicalMovementState(value:string) {
      this._logicalMovementState = value;
      console.debug("LogicalMovementState: " + value);
    }

    public get logicalMovementState():string {
      return this._logicalMovementState;
    }

    /**
     * 論理移動命令ステートを記憶する
     * @param value
     */
    private registerLogicalUiOperationState(value:string) {
      this._logicalUiOperationState = value;
      console.debug("LogicalUiOperationState: " + value);
    }

    public get logicalUiOperationState():string {
      return this._logicalUiOperationState;
    }

  }
}
