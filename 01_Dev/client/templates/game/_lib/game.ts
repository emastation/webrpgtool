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

      var material = null;
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

        var box = BABYLON.Mesh.CreateBox("mesh", 3, scene);
        box.showBoundingBox = true;

        material = new BABYLON.StandardMaterial("std", scene);
        material.diffuseColor = new BABYLON.Color3(0.5, 0, 0.5);

        box.material = material;

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

    private convertBabylonPlayerPosition(x:number, h:number, y:number) {
      return new BABYLON.Vector3(x - 0.5, h + 0.5, -1 * y + 0.5);
    }

    private runRenderLoop(mapMovement:MapMovement, flatMap:FlatMap, scene:BABYLON.Scene, camera:BABYLON.FreeCamera) {
      var moveDelta = 1.0/60*3;
      mapMovement.move(flatMap, moveDelta);

      camera.position = this.convertBabylonPlayerPosition(mapMovement.playerX, mapMovement.playerH, mapMovement.playerY);
      camera.rotation = new BABYLON.Vector3(0, Math.PI, 0);
      console.debug(""+camera.position.x, camera.position.y, camera.position.z);
      scene.render();
    }
  }

}
