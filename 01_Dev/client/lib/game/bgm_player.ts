
module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック

  declare var TWEEN:any;
  declare var tm:any;

  /**
   * BGM再生のためのクラス
   */
  export class BgmPlayer {
    private static _instance:BgmPlayer;

    constructor() {

    }

    private bgm_1_src:string;
    private bgm_2_src:string;
    private crossfadeTime:number;
    private currentBGM:string;

    private fadeoutTween:any = null;
    private fadeinTween:any = null;
    private fadeoutTween_as_stop:any = null;

    private lastTimeOfBGM1:any = null;
    private lastTimeOfBGM2:any = null;
    private countInteval = 0;
    private volume = 1;


    public static getInstance():BgmPlayer
    {
      if(BgmPlayer._instance == null) {
          BgmPlayer._instance = new BgmPlayer();
      }
      return BgmPlayer._instance;
    }

    public setup() {
    }

    public preloadBGMs(firstBgm:string, secondBgm:string, crossfadeTime:number = 3000) {
      this.bgm_1_src = firstBgm;
      this.bgm_2_src = secondBgm;
      this.crossfadeTime = crossfadeTime;

/*
      for (var bgmName in bgmObj) {
          tm.sound.SoundManager.add(bgmName, bgmObj[bgmName], 1);
      }
*/
      var that = this;

      this.fadeoutTween = new TWEEN.Tween( { volume: 1.0 } );
      this.fadeoutTween.bgmurl = this.bgm_1_src;
      this.fadeoutTween
          .to( { volume: 0 }, that.crossfadeTime )
          .easing( TWEEN.Easing.Linear.None )
          .onUpdate( function () {
              tm.asset.Manager.get(that.fadeoutTween.bgmurl).volume = this.volume;
          });

      this.fadeinTween = new TWEEN.Tween( { volume: 0.0 } );
      this.fadeinTween.bgmurl = this.bgm_2_src;
      this.fadeinTween
          .to( { volume: 1 }, that.crossfadeTime )
          .easing( TWEEN.Easing.Linear.None )
          .onUpdate( function () {
              tm.asset.Manager.get(that.fadeinTween.bgmurl).volume = this.volume;
          });

      this.fadeoutTween.setFlag("CrossFadeToBGM1");
      this.fadeinTween.setFlag("CrossFadeToBGM1");

//            setInterval(TWEEN.update.bind(TWEEN), 0.37);
    }

    private playAtFirst() {

      var bgm1 = tm.asset.Manager.get(this.bgm_1_src);
      bgm1.loop = true;
      bgm1.volume = this.volume;
      bgm1.play();

      if (this.bgm_2_src) {
        var bgm2 = tm.asset.Manager.get(this.bgm_2_src);
        bgm2.loop = true;
        bgm2.volume = 0.0;
        bgm2.play();
      }

      this.currentBGM = "bgm_1";
    }

    public play(bgmName:string, volume:number = 1.0, crossfadeTime:number = 3000) {
      this.volume = volume;
      this.crossfadeTime = crossfadeTime;

      this.fadeoutTween.to( { volume: 0 }, this.crossfadeTime );
      this.fadeinTween.to( { volume: this.volume }, this.crossfadeTime )

      var that = this;
      var timer = setInterval(function() {
        if (true) {
          if (typeof that.currentBGM === 'undefined') {
            that.bgm_1_src = bgmName;
            that.fadeoutTween.bgmurl = that.bgm_1_src;
            that.playAtFirst();
          } else if (that.currentBGM === "bgm_1") {
            if (that.bgm_2_src) {
              tm.asset.Manager.get(that.bgm_2_src).stop();
            }
            that.bgm_2_src = bgmName;
            that.switchToBGM_2();
          } else { // bgm_2のときは
            tm.asset.Manager.get(that.bgm_1_src).stop();
            that.bgm_1_src = bgmName;
            that.switchToBGM_1();
          }
          clearInterval(timer);
        }
      }, 100);

    }
    private switchToBGM_2(){

      this.fadeoutTween.setFlag("CrossFadeToBGM2");
      this.fadeinTween.setFlag("CrossFadeToBGM2");

      if (this.fadeoutTween.isFlagChanged() === true) {
        this.fadeoutTween.swapProperties(this.fadeinTween);

//                this.ejsCore.assets[this.bgm_2_src].play();
        var bgm2 = tm.asset.Manager.get(this.bgm_2_src);
        bgm2.loop = true;
        bgm2.play();

        this.fadeoutTween.bgmurl = this.bgm_1_src;
        this.fadeinTween.bgmurl = this.bgm_2_src;
        this.fadeoutTween.start();
        this.fadeinTween.start();

        this.currentBGM = "bgm_2";
        console.log("BGM2に切り替えた！");
      }

    }

    private switchToBGM_1(){

      this.fadeoutTween.setFlag("CrossFadeToBGM1");
      this.fadeinTween.setFlag("CrossFadeToBGM1");
      if (this.fadeoutTween.isFlagChanged() === true) {
        this.fadeoutTween.swapProperties(this.fadeinTween);

//                this.ejsCore.assets[this.bgm_1_src].play();
        var bgm1 = tm.asset.Manager.get(this.bgm_1_src);
        bgm1.loop = true;
        bgm1.play();

        this.fadeoutTween.bgmurl = this.bgm_2_src;
        this.fadeinTween.bgmurl = this.bgm_1_src;
        this.fadeoutTween.start();
        this.fadeinTween.start();

        this.currentBGM = "bgm_1";
        console.log("BGM1に切り替えた！");
      }

    }

    public stop() {
      if (typeof this.currentBGM === 'undefined') {
        return;
      } else if (this.currentBGM === "bgm_1") {
        var volume = this.volume;
        var crossfadeTime = 1500;
        var bgm_1_src = this.bgm_1_src;
        this.fadeoutTween_as_stop = new TWEEN.Tween( { volume: volume } );
        this.fadeoutTween_as_stop
            .to( { volume: 0 }, crossfadeTime )
            .easing( TWEEN.Easing.Linear.None )
            .onUpdate( function () {
                tm.asset.Manager.get(bgm_1_src).volume = this.volume;
            }).onComplete(function (){
              tm.asset.Manager.get(bgm_1_src).stop();
            })
            .start();

      } else { // bgm_2のときは
        var volume = this.volume;
        var crossfadeTime = 1500;
        var bgm_2_src = this.bgm_2_src;
        this.fadeoutTween_as_stop = new TWEEN.Tween( { volume: volume } );
        this.fadeoutTween_as_stop
            .to( { volume: 0 }, crossfadeTime )
            .easing( TWEEN.Easing.Linear.None )
            .onUpdate( function () {
                tm.asset.Manager.get(bgm_2_src).volume = this.volume;
            }).onComplete(function (){
              tm.asset.Manager.get(bgm_2_src).stop();
            }).start();
      }
    }

    public loop(){
      TWEEN.update();

    }
  }
}
