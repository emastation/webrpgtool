module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
  /**
   *  マップ上の移動を処理するクラス
   */
  export class MapMovement {
    private static _instance:MapMovement;
    private _logicalMovementCommandProperty:any; // 論理移動命令のBaconJSプロパティ
    private _player_direction:string = L_SOUTH; // プレーヤーが向いている方角

    private _player_x_int = 1; // プレーヤーの位置座標（整数）。セルの移動を開始するとすぐに値がインクリメント・デクリメントされる。
    private _player_y_int = 1; // プレーヤーの位置座標（整数）。セルの移動を開始するとすぐに値がインクリメント・デクリメントされる。
    private _player_h_int = 0; // プレーヤーの高さ座標（整数）。セルの移動を開始するとすぐに値がインクリメント・デクリメントされる。
    private _player_x = 1; // プレーヤーの位置座標x（浮動小数点値）
    private _player_y = 1; // プレーヤーの位置座標y（浮動小数点値）
    private _player_h = 0; // プレーヤーの高さ座標（浮動小数点値）
    private _player_x_center_int = 1; // プレーヤーの位置座標（整数）。セルの移動を開始して、隣のセルの中央にまで来ると値がインクリメント・デクリメントされる。
    private _player_y_center_int = 1; // プレーヤーの位置座標（整数）。セルの移動を開始して、隣のセルの中央にまで来ると値がインクリメント・デクリメントされる。
    private _player_h_center_int = 0; // プレーヤーの高さ座標（整数）。セルの移動を開始して、隣のセルの中央にまで来ると値がインクリメント・デクリメントされる。

    private _player_angle = Math.PI; // プレーヤーの現在の向きの角度（ラジアン）
    private _player_angle_to_change = 0; // プレーヤーの回転処理で、何度回転すればよいかの角度
    private _player_remained_changing_angle = 0; // プレーヤーの回転処理中、あと何度回転すればよいかの角度残量

    private _elevationAngle = 0; // プレーヤーの迎角（見上げる、または見下ろす角度）

    private _directionToMove:string = null; // プレーヤーが動くべき方向（プレーヤーの向きではないことに注意）
    private _player_moving_f = false; // falseならプレーヤーの位置移動中でない。trueなら位置移動中。

    private _maxElevationAngle = Math.PI/4.1;
    private _onPlatformNow = false;

    private converterJson = {
      L_TURN_LEFT: {
        L_NORTH: [L_WEST, -Math.PI/2],
        L_EAST: [L_NORTH, -Math.PI/2],
        L_SOUTH: [L_EAST, -Math.PI/2],
        L_WEST: [L_SOUTH,  -Math.PI/2]
      },
      L_TURN_BACK: {
        L_NORTH: [L_SOUTH, -Math.PI],
        L_EAST: [L_WEST, -Math.PI],
        L_SOUTH: [L_NORTH, -Math.PI],
        L_WEST: [L_EAST, -Math.PI]
      },
      L_TURN_RIGHT: {
        L_NORTH: [L_EAST, Math.PI/2],
        L_EAST: [L_SOUTH, Math.PI/2],
        L_SOUTH: [L_WEST, Math.PI/2],
        L_WEST: [L_NORTH, Math.PI/2]
      }
    };

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
     * プレーヤーが向いている方向を示すBaconJSプロパティを返す
     * @param logicalMovementCommandProperty
     */
    private mapLogicalMovementCommandToPlayerDirectionProperty(logicalMovementCommandProperty:any):any {

      var filterFunc = (moveCommand:string) => {
        return _.contains([L_TURN_LEFT, L_TURN_BACK, L_TURN_RIGHT], moveCommand);
      };

      var func = (moveCommand:string) => {
        return this.converterJson[moveCommand][this._player_direction];
      };

      return logicalMovementCommandProperty.filter(filterFunc).flatMap(func);

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
          currentResult = L_UPPER;
        } else if (moveCommand === L_MOVE_LOWER) {
          currentResult = L_LOWER;
        }

        return currentResult;
      };

      return logicalMovementCommandProperty.flatMap(func);
    }

    public init(logicalMovementCommandProperty:any) {
      var moveDirectionProperty = this.mapLogicalMovementCommandToMoveDirectionProperty(logicalMovementCommandProperty);
      moveDirectionProperty.onValue((value)=> {
        this._directionToMove = value;
        console.debug("LogicalMovementDirection: " + value);
      });

      var playerDirectionProperty = this.mapLogicalMovementCommandToPlayerDirectionProperty(logicalMovementCommandProperty);
      playerDirectionProperty.onValue((value)=> {
        if (!this._player_moving_f && Math.abs(this._player_remained_changing_angle) === 0) {
          this._player_remained_changing_angle = value[1];
          this._player_angle_to_change = value[1];
          this._player_direction = value[0];
        }
        console.debug("Player's Direction was changed to : " + value[0] + " rotatoion:" + value[1]);
      });
    }

    /**
     * プレーヤーの向きを回転して変更する。毎フレーム呼ばれ、各フレームで少しずつ回転する。
     * @param moveDelta
     */
    public rotate(rotationUnit:number) {
      var gameState = WrtGame.GameState.getInstance();

      if (this._player_remained_changing_angle === 0) {
        return;
      }

      var unitAngleDelta = this._player_angle_to_change / rotationUnit;
      this._player_angle += unitAngleDelta;
      this._player_remained_changing_angle -= unitAngleDelta;

      if (Math.abs(this._player_remained_changing_angle) < Math.abs(unitAngleDelta)) {
        this._player_angle += this._player_remained_changing_angle;
        this._player_remained_changing_angle = 0;

        // 回転が終わってもまだ、回転キーが押されている場合は、ひきつづき回転させる
        if (_.contains([L_TURN_LEFT, L_TURN_BACK, L_TURN_RIGHT], gameState.logicalMovementState)) {
          var value:any = this.converterJson[gameState.logicalMovementState][this._player_direction];
          this._player_remained_changing_angle = value[1];
          this._player_angle_to_change = value[1];
          this._player_direction = value[0];
        }
      }
    }

    /**
     * マップのセルを移動する。毎フレーム呼ばれ、各フレームで少しずつ移動する。
     * @param map マップデータ
     * @param moveDelta 移動する際の、この関数の１回実行分の座標移動値（非常に小さい浮動小数）
     */
    public move(map:any, moveDelta:number) {
      if (this._player_remained_changing_angle !== 0) {
        return;
      }

      var gameState = WrtGame.GameState.getInstance();

      // 移動キー（回転キーは除く）を押していた場合
      if(this._directionToMove !== null &&
          _.contains([L_MOVE_FORWARD, L_MOVE_BACKWARD, L_MOVE_LEFT, L_MOVE_RIGHT, L_MOVE_UPPER, L_MOVE_LOWER],
              gameState.logicalMovementState)) {
        switch ( this._directionToMove ){ // 向いている方角によって、目的の座標を適切に求める
          case L_NORTH:
            this._player_y -= moveDelta; // 座標を変位させる
            this._player_y_int = Math.floor(this._player_y)+1; // 現在位置の整数を求める
            //if (mapData[this._player_y_int-1][this._player_x_int] === 0) { // もし、次の移動先が壁だったら
            if (!map.isCouldPassAt(this._player_y_int-1, this._player_x_int, this._player_h_int, this._player_h)) { // もし、次の移動先が壁だったら
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
            if (!map.isCouldPassAt(this._player_y_int, this._player_x_int+1, this._player_h_int, this._player_h)) {
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
            if (!map.isCouldPassAt(this._player_y_int+1, this._player_x_int, this._player_h_int, this._player_h)) {
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
            if (!map.isCouldPassAt(this._player_y_int, this._player_x_int-1, this._player_h_int, this._player_h)) {
              this._player_x = this._player_x_int;
              this._player_moving_f = false;
            } else {
              this._player_moving_f = true;
            }
            break;
          case L_UPPER:
            this._player_h += moveDelta;
            this._player_h_int = Math.ceil(this._player_h)-1;
            if (!map.isCouldPassAt(this._player_y_int, this._player_x_int, this._player_h_int+1, null)) {
              this._player_h = this._player_h_int;
              this._player_moving_f = false;
            } else {
              this._player_moving_f = true;
            }
            break;
          case L_LOWER:
            this._player_h -= moveDelta;
            this._player_h_int = Math.floor(this._player_h)+1;
            if (!map.isCouldPassAt(this._player_y_int, this._player_x_int, this._player_h_int-1, null)) {
              if (!map.isMovingPlatform(this._player_y_int, this._player_x_int)) {
                this._player_h = this._player_h_int; // ここをコメントアウトすることで、空中浮遊モードの場合に、稼働中のプラットフォームの床に自然に接触できる
              }
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
          case L_UPPER:
            dest = Math.ceil(this._player_h);
            this._player_h_int = dest;
            this._player_h += moveDelta;
            if(this._player_h > dest) {
              this._player_h = dest;
              this._player_moving_f = false;
            }
            break;
          case L_LOWER:
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

    /**
     * 見上げるか見下ろす
     * @param angleDelta
     */
    public faceUpOrLow(angleDelta:number) {
      var gameState = WrtGame.GameState.getInstance();
      if (gameState.logicalMovementState === L_FACE_UP) {
        this._elevationAngle += angleDelta;
        if (this._elevationAngle > this._maxElevationAngle) {
          this._elevationAngle = this._maxElevationAngle;
        }
      } else if (gameState.logicalMovementState === L_FACE_LOW) {
        this._elevationAngle -= angleDelta;
        if (this._elevationAngle < -1 * this._maxElevationAngle) {
          this._elevationAngle = -1 * this._maxElevationAngle;
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
    public set playerH(height:number) {
      this._player_h = height;
      var floatingValue = height - Math.floor(height);
      if (floatingValue === 0) {
        this._player_h_int = height;
      }
    }
    public get playerAngle():number {
      return this._player_angle;
    }
    public get playerElevationAngle():number {
      return this._elevationAngle;
    }
    public get playerXInteger():number {
      return this._player_x_int;
    }
    public get playerYInteger():number {
      return this._player_y_int;
    }
    public get onPlatformNow():boolean {
      return this._onPlatformNow;
    }
    public set onPlatformNow(flg:boolean) {
      this._onPlatformNow = flg;
    }
  }
}
