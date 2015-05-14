
declare var Template:any;
declare var _:any;
declare var $:any;

Template.gamePage.rendered = function() {


  var canvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("renderCanvas");
  var engine = new BABYLON.Engine(canvas, true);

  var material = null;
  var createScene = function() {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0,0,0.2);

//    var camera = new BABYLON.ArcRotateCamera("Camera", 1.0, 1.0, 12, BABYLON.Vector3.Zero(), scene);
    var camera = new BABYLON.Camera("Camera", new BABYLON.Vector3(0.5, 0.5, 0.5), scene);

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

  var scene = createScene();
  var flatMap = new WrtGame.FlatMap(scene, this.data.map, this.data.mapTextures.fetch());
//  flatMap.setMesh();

  // イベントハンドラ初期化
  var physicalEventProperty:any = WrtGame.initEventHandler();
  var gameState = WrtGame.GameState.getInstance();
  var logicalMovementCommandProperty:any = gameState.mapPhysicalEventPropertyToLogicalMovementCommandProperty(physicalEventProperty);
  var mapMovement = WrtGame.MapMovement.getInstance();
  mapMovement.logicalMovementCommandProperty = logicalMovementCommandProperty;
  mapMovement.init();

  engine.runRenderLoop(function() {
    var moveDelta = 1.0/60*3;
    mapMovement.move(flatMap, moveDelta);

    scene.render();
  });

  window.addEventListener("resize", function() {
    engine.resize();
  });

};
