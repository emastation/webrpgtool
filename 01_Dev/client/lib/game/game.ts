declare var MongoCollections:any;
declare var GLBoost:any;
declare var TWEEN:any;

interface Window {
  MainScene: any;
  height: any;
  createEvent:any;
  fireEvent:any;
}

interface Document {
  width: number;
  height: number;
}

interface Event {
  initUIEvent: any;
}

module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
  export class Game {
    private static _instance:Game;
    public static SCREEN_WIDTH = 1200;
    public static SCREEN_HEIGHT = 800;
    public static getInstance():Game
    {
      if(Game._instance == null) {
        Game._instance = new Game();
      }
      return Game._instance;
    }

    public init(data:any, onlyNovel = false, callbackWhenOnlyNovel:Function = null) {
      var novelPlayer = WrtGame.NovelPlayer.getInstance();
      novelPlayer.init();

      if (onlyNovel) {
        this.initTmlib(callbackWhenOnlyNovel);
      } else {
        this.initTmlib(()=>{
          this.initEvents();

          let glboostCtx = GLBoostContext.getInstance();
          glboostCtx.init('#renderCanvas');

          let sm:SceneManager = SceneManager.getInstance();
          sm.addScene('battle', new BattleScene());
          sm.addScene('dungeon', new DungeonScene(data));

          this.initUserFunctions();

          this._gameLoop();

          var e = document.createEvent('UIEvents');
          // type, canBubble, cancelable, view, detail
          e.initUIEvent('resize', true, true, window, 0);
          window.dispatchEvent(e);
        });
      }

    }

    private _handleGameLogicalEvent(event) {
      if (typeof event === 'undefined') {
        return;
      }

      if (event === LG_ENCOUNTER) {
        var mapMovement = MapMovement.getInstance();
        mapMovement.playerIsMovable = false;
        let sm:SceneManager = SceneManager.getInstance();
        var dungeonScene = sm.getScene('dungeon');
        dungeonScene.fadeOut(()=>{
          sm.switchScene('battle');
        });
      }
    }

    private _gameLoop() {

      var gameLogic:GameLogic = GameLogic.getInstance();
      var event = gameLogic.getGameLogicalEvent();
      this._handleGameLogicalEvent(event);

      var sm:SceneManager = SceneManager.getInstance();
      var scene:Scene = sm.getCurrentScene();


      scene.sceneLoop();

      requestAnimationFrame(()=>{
        this._gameLoop();
      });
    }

    private initEvents() {
      // 物理イベントのプロパティ初期化
      var physicalUiEventProperty:any = WrtGame.initUiEventHandler();

      var gameState = WrtGame.GameState.getInstance();

      // 論理UIコマンドプロパティ初期化
      var logicalUiCommandProperty:any = gameState.mapPhysicalEventPropertyToLogicalUiCommandProperty(physicalUiEventProperty);

      // UiOperation初期化
      var uiOperation = WrtGame.UiOperation.getInstance();
      uiOperation.init(logicalUiCommandProperty);

    }

    private initTmlib(callback:Function) {

      var ASSETS = {
      };

      var characterImages = MongoCollections.CharacterImages.find({useForNovel:true}).fetch();
      var backgroundImages = MongoCollections.BackgroundImages.find().fetch();
      for(var key in characterImages) {
        if ("" !== characterImages[key].portraitImageUrl) {
          ASSETS[characterImages[key].portraitImageUrl] = characterImages[key].portraitImageUrl;
        }
      }
      for(var key in backgroundImages) {
        if ("" !== backgroundImages[key].imageUrl) {
          ASSETS[backgroundImages[key].imageUrl] = backgroundImages[key].imageUrl;
        }
      }
      var bgmAudios = MongoCollections.BgmAudios.find().fetch();
      bgmAudios.forEach((bgmAudio)=>{
        if (bgmAudio.identifier === 'none') {
          return;
        }
        ASSETS[bgmAudio.identifier] = bgmAudio.audioUrl;
      });
      var soundEffectAudios = MongoCollections.SoundEffectAudios.find().fetch();
      soundEffectAudios.forEach((soundEffectAudio)=>{
        if (soundEffectAudio.identifier === 'none') {
          return;
        }
        ASSETS[soundEffectAudio.identifier] = soundEffectAudio.audioUrl;
      });
      // main
      tm.main(function() {
        // キャンバスアプリケーションを生成
        var app = tm.display.CanvasApp("#tmlibCanvas");
        app.background = 'rgba(0,0,0,0)';
        // リサイズ
        app.resize(Game.SCREEN_WIDTH, Game.SCREEN_HEIGHT);
        // ウィンドウにフィットさせる
//        app.fitWindow();

        // ローダーでアセットを読み込む
        var loading = tm.game.LoadingScene({
          assets: ASSETS,
          width: Game.SCREEN_WIDTH,
          height: Game.SCREEN_HEIGHT,
        });

        // 読み込み完了後に呼ばれるメソッドを登録
        loading.onload = function() {
          // メインシーンに入れ替える
          var scene = window.MainScene();
          app.replaceScene(scene);
          callback();
        };
        // ローディングシーンに入れ替える
        app.replaceScene(loading);

        // 実行
        app.run();

        var aspect = Game.SCREEN_WIDTH / Game.SCREEN_HEIGHT;

        window.addEventListener("resize", function(e) {
          var windowAspect = $(e.target).width() / $(e.target).height();

          if (windowAspect > aspect) {
            var newWidth:number = $(e.target).height() * aspect;
            var newHeight:number = <number>$(e.target).height();
          } else {
            var newWidth:number = <number>$(e.target).width();
            var newHeight:number = $(e.target).width() * 1/aspect;
          }

          var scale = newWidth / Game.SCREEN_WIDTH;

          var translateX = Game.SCREEN_WIDTH * (1-scale) / 2;

          var translateY = Game.SCREEN_HEIGHT * (1-scale) / 2;

          var value =
              'translateX(' + -translateX + 'px) ' +
              'translateY(' + -translateY + 'px)' +
              'scale(' + scale + ', ' + scale + ') ';
          $('#tmlibCanvas').css('transform', value);
          $('#game-ui-body').css('transform', value);

        });
      });



      if (document.readyState == "complete") {
        if (!document.createEvent) {
          window.fireEvent('onload');
        } else {
          var event = document.createEvent('HTMLEvents');
          event.initEvent ("load", false, true)
          window.dispatchEvent(event);
        }
      }

    }

    private initUserFunctions() {
      var userFunctionManager = WrtGame.UserFunctionsManager.getInstance();
    }

    public clear() {
      var novelPlayer = WrtGame.NovelPlayer.getInstance();
      novelPlayer.clear();
    }

  }

}
