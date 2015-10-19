declare var MongoCollections:any;

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

    public init(data:any) {
      var novelPlayer = WrtGame.NovelPlayer.getInstance();
      novelPlayer.init();

      var mapMovement = this.initEvents();
      this.initTmlib(()=>{
        this.initBabylon(data, mapMovement);
        this.initUserFunctions();

        var e = document.createEvent('UIEvents')
        // type, canBubble, cancelable, view, detail
        e.initUIEvent('resize', true, true, window, 0)
        window.dispatchEvent(e);
      });
    }

    private initEvents() {
      // 物理イベントのプロパティ初期化
      var physicalMapMovementEventProperty:any = WrtGame.initMapMovementEventHandler();
      var physicalUiEventProperty:any = WrtGame.initUiEventHandler();

      var gameState = WrtGame.GameState.getInstance();
      // 論理移動コマンドプロパティ初期化
      var logicalMovementCommandProperty:any = gameState.mapPhysicalEventPropertyToLogicalMovementCommandProperty(physicalMapMovementEventProperty);
      // 論理UIコマンドプロパティ初期化
      var logicalUiCommandProperty:any = gameState.mapPhysicalEventPropertyToLogicalUiCommandProperty(physicalUiEventProperty);

      // マップ移動クラスの初期化
      var mapMovement = WrtGame.MapMovement.getInstance();
      mapMovement.init(logicalMovementCommandProperty);

      var uiOperation = WrtGame.UiOperation.getInstance();
      uiOperation.init(logicalUiCommandProperty);

      return mapMovement;
    }

    private initBabylon(data:any, mapMovement:WrtGame.MapMovement) {
      // canvasの取得と、それを引数にしたBabylonエンジン作成
      var canvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("renderCanvas");
      var engine = new BABYLON.Engine(canvas, true);

      var camera:BABYLON.FreeCamera;
      // Babylonのシーン作成関数
      var createScene = function() {
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(0,0,0.2);

        camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0.5, 0.5, 0.5), scene);
//        camera.attachControl(canvas, false);

        var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(1,1,1), scene);
        light.groundColor = new BABYLON.Color3(0.3, 0.3, 0.3);

        return scene;
      };

      // Babylonのシーンの作成と、そのシーンを引数に、flatMapクラスの生成
      var scene = createScene();
      var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(0.5, 0.5, 0.5), scene);
      light.diffuse = new BABYLON.Color3(0.7, 0.7, 0.7);
      light.specular = new BABYLON.Color3(0.3, 0.3, 0.3);
      light.range = 6;
      scene.registerBeforeRender(function () {
        light.position = camera.position;
      });
//      var map = new WrtGame.FlatMap(scene, data.map, data.mapTextures.fetch());
      var map = new WrtGame.PolygonMap(scene, data.map, data.mapTextures);

      var aspect = canvas.width / canvas.height;

      // Windowのリサイズ対応
      window.addEventListener("resize", function(e) {
        var windowAspect = $(e.target).width() / $(e.target).height();

        if (windowAspect > aspect) {
          $(canvas).css('width', $(e.target).height() * aspect);
          $(canvas).css('height', $(e.target).height());
        } else {
          $(canvas).css('width', $(e.target).width());
          $(canvas).css('height', $(e.target).width() * 1/aspect);
        }
        engine.resize();

      });

      // 描画ループ定義
      engine.runRenderLoop(()=> {
        this.runRenderLoop(mapMovement, map, scene, camera);
      });

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

      // main
      tm.main(function() {
        // キャンバスアプリケーションを生成
        var app = tm.display.CanvasApp("#tmlibCanvas");
        app.background = 'rgba(0,0,0,0)';
        // リサイズ
        app.resize(Game.SCREEN_WIDTH, Game.SCREEN_HEIGHT);
        // ウィンドウにフィットさせる
//        app.fitWindow();

        // ローダーで画像を読み込む
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

    /**
     * MapMovementクラスが返すプレーヤー座標を、BabylonJSでの表示仕様を満たす座標に変換する
     * @param x
     * @param h
     * @param y
     * @returns {BABYLON.Vector3}
     */
    private convertBabylonPlayerPosition(x:number, h:number, y:number, angle:number):BABYLON.Vector3 {

      // プレーヤーが0.5後ろに下がって、背中が後ろのマスの壁にひっつくようにするためのオフセット座標
      var rotateMtx = BABYLON.Matrix.RotationY(angle);
      var viewPosOffset = new BABYLON.Vector3(0, 0, -0.5);

      // そのオフセット座標を、プレーヤーの向きに合わせて回転する
      viewPosOffset = BABYLON.Vector3.TransformCoordinates(viewPosOffset, rotateMtx);

      // プレーヤーのBabylonJSにおける位置座標
      var viewPos = new BABYLON.Vector3(x - 0.5, h + 0.5, -1 * y + 0.5);

      // オフセットを考慮するために足す
      return viewPos.add(viewPosOffset);
    }

    private runRenderLoop(mapMovement:MapMovement, map:Map, scene:BABYLON.Scene, camera:BABYLON.FreeCamera) {

      // 平行移動する
      var moveDelta = 1.0/60*3;
      mapMovement.move(map, moveDelta);

      // 水平方向の向きを変える
      mapMovement.rotate(60*0.8);

      // 垂直方向の向きを変える
      mapMovement.faceUpOrLow(1/60*0.5);

      map.movePlatforms();

      // カメラの位置・回転をセット
      camera.position = this.convertBabylonPlayerPosition(mapMovement.playerX, mapMovement.playerH, mapMovement.playerY, mapMovement.playerAngle);
      camera.rotation = new BABYLON.Vector3(-1*mapMovement.playerElevationAngle, mapMovement.playerAngle, 0);

      // シーンをレンダリングする
      scene.render();
    }

    public clear() {
      var novelPlayer = WrtGame.NovelPlayer.getInstance();
      novelPlayer.clear();
    }

  }

}
