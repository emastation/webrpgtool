module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
  export class Game {
    private static _instance:Game;

    public static getInstance():Game
    {
      if(Game._instance == null) {
        Game._instance = new Game();
      }
      return Game._instance;
    }

    public init(data:any) {
      // canvasの取得と、それを引数にしたBabylonエンジン作成
      var canvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("renderCanvas");
      var engine = new BABYLON.Engine(canvas, true);

      var camera:BABYLON.FreeCamera;
      // Babylonのシーン作成関数
      var createScene = function() {
        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(0,0,0.2);

//    var camera = new BABYLON.ArcRotateCamera("Camera", 1.0, 1.0, 12, BABYLON.Vector3.Zero(), scene);
        camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0.5, 0.5, 0.5), scene);

        camera.attachControl(canvas);

        var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(1,1,1), scene);

        light.groundColor = new BABYLON.Color3(1.0, 1.0, 1.0);

        return scene;
      };

      // Babylonのシーンの作成と、そのシーンを引数に、flatMapクラスの生成
      var scene = createScene();
      var flatMap = new WrtGame.FlatMap(scene, data.map, data.mapTextures.fetch());

      // 物理イベントのプロパティ初期化
      var physicalEventProperty:any = WrtGame.initEventHandler();

      // 論理移動コマンドプロパティ初期化
      var gameState = WrtGame.GameState.getInstance();
      var logicalMovementCommandProperty:any = gameState.mapPhysicalEventPropertyToLogicalMovementCommandProperty(physicalEventProperty);

      // マップ移動クラスの初期化
      var mapMovement = WrtGame.MapMovement.getInstance();
      mapMovement.init(logicalMovementCommandProperty);

      // Windowのリサイズ対応
      window.addEventListener("resize", function() {
        engine.resize();
      });

      // 描画ループ定義
      engine.runRenderLoop(()=> {
        this.runRenderLoop(mapMovement, flatMap, scene, camera);
      });

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

    private runRenderLoop(mapMovement:MapMovement, flatMap:FlatMap, scene:BABYLON.Scene, camera:BABYLON.FreeCamera) {

      // 平行移動する
      var moveDelta = 1.0/60*3;
      mapMovement.move(flatMap, moveDelta);

      // 水平方向の向きを変える
      mapMovement.rotate(60*0.8);

      // 垂直方向の向きを変える
      mapMovement.faceUpOrLow(1/60*0.5);

      flatMap.movePlatforms();

      // カメラの位置・回転をセット
      camera.position = this.convertBabylonPlayerPosition(mapMovement.playerX, mapMovement.playerH, mapMovement.playerY, mapMovement.playerAngle);
      camera.rotation = new BABYLON.Vector3(-1*mapMovement.playerElevationAngle, mapMovement.playerAngle, 0);
      
      // シーンをレンダリングする
      scene.render();
    }
  }

}
