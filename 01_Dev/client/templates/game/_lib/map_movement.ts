module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
  /**
   *  マップ上の移動を処理するクラス
   */
  export class MapMovement {
    private static _instance:MapMovement;
    private player_direction:string = L_EAST; // プレイヤーが向いている方角

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
     * 押した移動キーと現在プレイヤーが向いている方角に基づき、移動すべき方角を返す
     * @param keyCode プレーヤーが押した移動キーのキーコード
     * @param player_direction 現在のプレーヤーの向き
     * @returns {string} 移動すべき方角
     */
    public getMoveDirection(keyCode:string, player_direction:string):string {
      if (keyCode === L_MOVE_FORWARD) {
        return player_direction;
      } else if (keyCode === L_MOVE_LEFT) {
        switch (player_direction) { // 向いている方角によって、目的の座標を適切に求める
          case L_NORTH: return L_WEST;
          case L_EAST: return L_NORTH;
          case L_SOUTH: return L_EAST;
          case L_WEST: return L_SOUTH;
        }
      } else if (keyCode === L_MOVE_RIGHT) {
        switch (player_direction) { // 向いている方角によって、目的の座標を適切に求める
          case L_NORTH: return L_EAST;
          case L_EAST: return L_SOUTH;
          case L_SOUTH: return L_WEST;
          case L_WEST: return L_NORTH;
        }
      } else if (keyCode === L_MOVE_BACKWARD) {
        switch (player_direction) { // 向いている方角によって、目的の座標を適切に求める
          case L_NORTH: return L_SOUTH;
          case L_EAST: return L_WEST;
          case L_SOUTH: return L_NORTH;
          case L_WEST: return L_EAST;
        }
      } else if (keyCode === L_MOVE_UPPER) {
        return L_MOVE_UPPER;
      } else if (keyCode === L_MOVE_LOWER) {
        return L_MOVE_LOWER;
      }
    }

  }
}
