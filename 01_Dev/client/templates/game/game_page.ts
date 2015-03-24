
Template.gamePage.rendered = function() {
  var canvas = document.getElementById("renderCanvas");
  var engine = new BABYLON.Engine(canvas, true);

  var createScene = function() {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0,0,0.2);

    var camera = new BABYLON.ArcRotateCamera("Camera", 1.0, 1.0, 12, BABYLON.Vector3.Zero(), scene);

    camera.attachControl(canvas, false);

    var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0,1,0), scene);

    light.groundColor = new BABYLON.Color3(0.5, 0, 0.5);

    var box = BABYLON.Mesh.CreateBox("mesh", 3, scene);
    box.showBoundingBox = true;

    var material = new BABYLON.StandardMaterial("std", scene);
    material.diffuseColor = new BABYLON.Color3(0.5, 0, 0.5);

    box.material = material;

    return scene;
  };

  var scene = createScene();

  engine.runRenderLoop(function() {
    scene.render();
  });

  window.addEventListener("resize", function() {
    engine.resize();
  });
};