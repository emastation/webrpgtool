declare var CharacterImages:any;

interface Window {
  MainScene: any;
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

      var mapMovement = this.initEvents();
      this.initBabylon(data, mapMovement);
      this.initTmlib();

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
      var map = new WrtGame.PolygonMap(scene, data.map, data.mapTextures.fetch());

      // Windowのリサイズ対応
      window.addEventListener("resize", function() {
        engine.resize();
      });

      // 描画ループ定義
      engine.runRenderLoop(()=> {
        this.runRenderLoop(mapMovement, map, scene, camera);
      });
    }

    private initTmlib() {

      var ASSETS = {
      };

      var characterImages = CharacterImages.find({useForNovel:true}).fetch();
      for(var key in characterImages) {
        if ("" !== characterImages[key].portraitImageUrl) {
          ASSETS[characterImages[key].portraitImageUrl] = characterImages[key].portraitImageUrl;
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
        };
        // ローディングシーンに入れ替える
        app.replaceScene(loading);

        // 実行
        app.run();
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


  }

}
