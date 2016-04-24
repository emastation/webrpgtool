
module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック

  declare var TWEEN:any;
  declare var tm:any;
  declare var SoundManager:any;
  /**
   * BGM再生のためのクラス
   */
  export class BgmPlayer {
    private static _instance:BgmPlayer;

    constructor() {

    }


    public static getInstance():BgmPlayer
    {
      if(BgmPlayer._instance == null) {
          BgmPlayer._instance = new BgmPlayer();
      }
      return BgmPlayer._instance;
    }

    public setup() {
    }


    public play(bgmName:string, volume:number = 1.0, crossfadeTime:number = 3000) {

      SoundManager.playMusic(bgmName, crossfadeTime);


    }

    public stop() {

    }

  }
}
