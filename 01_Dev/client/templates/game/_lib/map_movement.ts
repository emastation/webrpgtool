module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
  /**
   *  マップ上の移動を処理するクラス
   */
  export class MapMovement {
    private static _instance:MapMovement;
    private _logicalMovementCommandProperty:any; // 論理移動命令のBaconJSプロパティ
    private _player_direction:string = L_EAST; // プレイヤーが向いている方角

    private _player_x_int = 1; // プレイヤーの位置座標（整数）。セルの移動を開始するとすぐに値がインクリメント・デクリメントされる。
    private _player_y_int = 1; // プレイヤーの位置座標（整数）。セルの移動を開始するとすぐに値がインクリメント・デクリメントされる。
    private _player_h_int = 0; // プレイヤーの高さ座標（整数）。セルの移動を開始するとすぐに値がインクリメント・デクリメントされる。
    private _player_x = 1; // プレーヤーの位置座標x（浮動小数点値）
    private _player_y = 1; // プレーヤーの位置座標y（浮動小数点値）
    private _player_h = 0; // プレーヤーの高さ座標（浮動小数点値）
    private _player_x_center_int = 1; // プレイヤーの位置座標（整数）。セルの移動を開始して、隣のセルの中央にまで来ると値がインクリメント・デクリメントされる。
    private _player_y_center_int = 1; // プレイヤーの位置座標（整数）。セルの移動を開始して、隣のセルの中央にまで来ると値がインクリメント・デクリメントされる。
    private _player_h_center_int = 0; // プレイヤーの高さ座標（整数）。セルの移動を開始して、隣のセルの中央にまで来ると値がインクリメント・デクリメントされる。

    private _directionToMove:string = null; // プレーヤーが動くべき方向（プレーヤーの向きではないことに注意）
    private _player_moving_f = false; // falseならプレーヤーの位置移動中でない。trueなら位置移動中。

    constructor() {
    }

    public static getInstance():MapMovement
    {
      if(MapMovement._instance == null) {
        MapMovement._instance = new MapMovement();
      }
      return MapMovement._instance;
    }

    /**
     * 移動すべき方向を示すBaconJSプロパティを返す
     * @returns {any}
     */
    private mapLogicalMovementCommandToMoveDirectionProperty(logicalMovementCommandProperty:any):any {

      /**
       * 押した移動キーと現在プレイヤーが向いている方角に基づき、移動すべき方角を返す
       * @param moveCommand プレーヤーが押した移動キーのキーコード
       * @returns {string} 移動すべき方角
       */
      var currentResult:string = null;
      var func = (moveCommand:string) => {
        if (moveCommand === L_MOVE_FORWARD) {
          currentResult = this._player_direction;
        } else if (moveCommand === L_MOVE_LEFT) {
          switch (this._player_direction) { // 向いている方角によって、目的の座標を適切に求める
            case L_NORTH: currentResult = L_WEST; break;
            case L_EAST: currentResult = L_NORTH; break;
            case L_SOUTH: currentResult = L_EAST; break;
            case L_WEST: currentResult = L_SOUTH; break;
          }
        } else if (moveCommand === L_MOVE_RIGHT) {
          switch (this._player_direction) { // 向いている方角によって、目的の座標を適切に求める
            case L_NORTH: currentResult = L_EAST; break;
            case L_EAST: currentResult = L_SOUTH; break;
            case L_SOUTH: currentResult = L_WEST; break;
            case L_WEST: currentResult = L_NORTH; break;
          }
        } else if (moveCommand === L_MOVE_BACKWARD) {
          switch (this._player_direction) { // 向いている方角によって、目的の座標を適切に求める
            case L_NORTH: currentResult = L_SOUTH; break;
            case L_EAST: currentResult = L_WEST; break;
            case L_SOUTH: currentResult = L_NORTH; break;
            case L_WEST: currentResult = L_EAST; break;
          }
        } else if (moveCommand === L_MOVE_UPPER) {
          currentResult = L_MOVE_UPPER;
        } else if (moveCommand === L_MOVE_LOWER) {
          currentResult = L_MOVE_LOWER;
        }

        return currentResult;
      };

      return logicalMovementCommandProperty.flatMap(func);
    }

    public init(logicalMovementCommandProperty:any) {
      var property = this.mapLogicalMovementCommandToMoveDirectionProperty(logicalMovementCommandProperty);
      property.onValue((value)=> {
        this._directionToMove = value;
        console.debug("LogicalMovementDirection: " + value);
      });
    }

    /**
     * セルを移動する。毎フレーム呼ばれ、各フレームで少しずつ移動する。
     * @param map マップデータ
     * @param moveDelta 移動する際の、この関数の１回実行分の座標移動値（非常に小さい浮動小数）
     */
    public move(map:any, moveDelta:number) {
      var gameState = WrtGame.GameState.getInstance();

      // 移動キー（回転キーは覗く）を押していた場合
      if(this._directionToMove !== null && gameState.logicalMovementState !== L_NO_MOVE) {
        switch ( this._directionToMove ){ // 向いている方角によって、目的の座標を適切に求める
          case L_NORTH:
            this._player_y -= moveDelta; // 座標を変位させる
            this._player_y_int = Math.floor(this._player_y)+1; // 現在位置の整数を求める
            //if (mapData[this._player_y_int-1][this._player_x_int] === 0) { // もし、次の移動先が壁だったら
            if (!map.isCouldPassAt(this._player_y_int-1, this._player_x_int, this._player_h_int)) { // もし、次の移動先が壁だったら
              this._player_y = this._player_y_int; // 座標値を整数値にする（止まる）
              this._player_moving_f = false; // 止まる
            } else {
              this._player_moving_f = true; // 動いたまま
            }
            break;
          case L_EAST:
            this._player_x += moveDelta;
            this._player_x_int = Math.ceil(this._player_x)-1;
            //if (mapData[this._player_y_int][this._player_x_int+1] === 0) {
            if (!map.isCouldPassAt(this._player_y_int, this._player_x_int+1, this._player_h_int)) {
              this._player_x = this._player_x_int;
              this._player_moving_f = false;
            } else {
              this._player_moving_f = true;
            }
            break;
          case L_SOUTH:
            this._player_y += moveDelta;
            this._player_y_int = Math.ceil(this._player_y)-1;
            //if (mapData[this._player_y_int+1][this._player_x_int] === 0) {
            if (!map.isCouldPassAt(this._player_y_int+1, this._player_x_int, this._player_h_int)) {
              this._player_y = this._player_y_int;
              this._player_moving_f = false;
            } else {
              this._player_moving_f = true;
            }
            break;
          case L_WEST:
            this._player_x -= moveDelta;
            this._player_x_int = Math.floor(this._player_x)+1;
            //if (mapData[this._player_y_int][this._player_x_int-1] === 0) {
            if (!map.isCouldPassAt(this._player_y_int, this._player_x_int-1, this._player_h_int)) {
              this._player_x = this._player_x_int;
              this._player_moving_f = false;
            } else {
              this._player_moving_f = true;
            }
            break;
          case L_MOVE_UPPER:
            this._player_h += moveDelta;
            this._player_h_int = Math.ceil(this._player_h)-1;
            if (!map.isCouldPassAt(this._player_y_int, this._player_x_int, this._player_h_int+1)) {
              this._player_h = this._player_h_int;
              this._player_moving_f = false;
            } else {
              this._player_moving_f = true;
            }
            break;
          case L_MOVE_LOWER:
            this._player_h -= moveDelta;
            this._player_h_int = Math.floor(this._player_h)+1;
            if (!map.isCouldPassAt(this._player_y_int, this._player_x_int, this._player_h_int-1)) {
//                            this._player_h = this._player_h_int; // ここをコメントアウトすることで、空中浮遊モードの場合に、稼働中のプラットフォームの床に自然に接触できる
              this._player_moving_f = false;
            } else {
              this._player_moving_f = true;
            }
            break;
        }
        // キーが押されていなかった場合
      } else {
        var dest = 0;
        switch ( this._directionToMove ){ // キーを離した時のプレーヤーの位置が中途半端だったら、整数の値の位置まで移動する
          case L_NORTH:
            dest = Math.floor(this._player_y);
            this._player_y_int = dest;
            this._player_y -= moveDelta;
            if(this._player_y < dest) {
              this._player_y = dest;
              this._player_moving_f = false;
            }
            break;
          case L_EAST:
            dest = Math.ceil(this._player_x);
            this._player_x_int = dest;
            this._player_x += moveDelta;
            if(this._player_x > dest) {
              this._player_x = dest;
              this._player_moving_f = false;
            }
            break;
          case L_SOUTH:
            dest = Math.ceil(this._player_y);
            this._player_y_int = dest;
            this._player_y += moveDelta;
            if(this._player_y > dest) {
              this._player_y = dest;
              this._player_moving_f = false;
            }
            break;
          case L_WEST:
            dest = Math.floor(this._player_x);
            this._player_x_int = dest;
            this._player_x -= moveDelta;
            if(this._player_x < dest) {
              this._player_x = dest;
              this._player_moving_f = false;
            }
            break;
          case L_MOVE_UPPER:
            dest = Math.ceil(this._player_h);
            this._player_h_int = dest;
            this._player_h += moveDelta;
            if(this._player_h > dest) {
              this._player_h = dest;
              this._player_moving_f = false;
            }
            break;
          case L_MOVE_LOWER:
            dest = Math.floor(this._player_h);
            this._player_h_int = dest;
            this._player_h -= moveDelta;
            if(this._player_h < dest) {
              this._player_h = dest;
              this._player_moving_f = false;
            }
            break;
        }
      }
    }

    public get playerX():number {
      return this._player_x;
    }
    public get playerY():number {
      return this._player_y;
    }
    public get playerH():number {
      return this._player_h;
    }
  }
}
