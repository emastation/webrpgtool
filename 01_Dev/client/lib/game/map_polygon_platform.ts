module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
  export class MapPolygonPlatform extends MapPlatform {
    private minFloorHeight:number = -20; // 床の最低の低さ
    private maxCeilingHeight:number = 20; // 天井の最高の高さ

    // コンストラクタの宣言
    constructor(x:number, y:number, heightMap:any, parameter:string) {
      super(x, y, heightMap, parameter);
    }

    public setupMesh(scene:BABYLON.Scene, mapPlatformTitle:string, floorHeight:number, ceilingHeight:number, imageUrl:string) :void {

      var x = this.x_onMap;
      var y = this.y_onMap;

      /// 床側
      var floorRootMesh = new BABYLON.Mesh("MapFlatPlatform_Floor_RootMesh[" + x + "][" + y +"]", scene);

      var that = this;
      var splitPath = imageUrl.split('/');
      var texModelFileName = splitPath[splitPath.length-1];
      BABYLON.SceneLoader.ImportMesh("", "https://www.emastation.com/wrt/material/tile3d/", texModelFileName, scene, function (newMeshes) {
        for (var i = 0; i < newMeshes.length; i++) {
          var mesh:any = newMeshes[i];
          mesh.isVisible = false;
          var cellMesh = new BABYLON.Mesh("MapFlatPlatform_Floor_Cell_mesh_[" + i + "]:" + x + ":" + y, scene);
          cellMesh.position = new BABYLON.Vector3(y, 0, x);
          cellMesh.parent = floorRootMesh;
          if (i === 0) { // 床
            var newInstance = mesh.createInstance("MapFlatPlatform_Floor_Cristal_mesh_[" + i + "]:" + x + ":" + y);
            newInstance.position = new BABYLON.Vector3(0, 0, 0);
            newInstance.isVisible = true;
            newInstance.parent = cellMesh;
          } else if (i === 1) { // 壁
            // 東の壁
            var wallMeshWEST = new BABYLON.Mesh("MapFlatPlatform_Floor_wall_wrapper_mesh[" + i + "]:" + x + ":" + y, scene);
            wallMeshWEST.parent = cellMesh;
            wallMeshWEST.rotation = new BABYLON.Vector3(0, Math.PI, 0);
            wallMeshWEST.position = new BABYLON.Vector3(1, 0, 0);
            for (var j=that.minFloorHeight; j<0; j++) {
              var newInstanceWEST = mesh.createInstance("MapFlatPlatform_Floor_wall_mesh_[" + i + "][W]:" + x + ":" + y);
              newInstanceWEST.position = new BABYLON.Vector3(0, j, 0);
              newInstanceWEST.isVisible = true;
              newInstanceWEST.parent = wallMeshWEST;
            }

            // 南の壁
            var wallMeshNORTH = new BABYLON.Mesh("MapFlatPlatform_Floor_wall_wrapper_mesh[" + i + "]:" + x + ":" + y, scene);
            wallMeshNORTH.parent = cellMesh;
            wallMeshNORTH.rotation = new BABYLON.Vector3(0, -Math.PI/2, 0);
            wallMeshNORTH.position = new BABYLON.Vector3(1, 0, -1);
            for (var j=that.minFloorHeight; j<0; j++) {
              var newInstanceNORTH = mesh.createInstance("MapFlatPlatform_Floor_wall_mesh_[" + i + "][N]:" + x + ":" + y);
              newInstanceNORTH.position = new BABYLON.Vector3(0, j, 0);
              newInstanceNORTH.isVisible = true;
              newInstanceNORTH.parent = wallMeshNORTH;
            }

            // 西の壁
            var wallMeshEast = new BABYLON.Mesh("MapFlatPlatform_Floor_wall_wrapper_mesh[" + i + "]:" + x + ":" + y, scene);
            wallMeshEast.parent = cellMesh;
            wallMeshEast.position = new BABYLON.Vector3(0, 0, -1);
            for (var j=that.minFloorHeight; j<0; j++) {
              var newInstanceEast = mesh.createInstance("MapFlatPlatform_Floor_wall_mesh_[" + i + "][E]:" + x + ":" + y);
              newInstanceEast.position = new BABYLON.Vector3(0, j, 0);
              newInstanceEast.isVisible = true;
              newInstanceEast.parent = wallMeshEast;
            }

            // 北の壁
            var wallMeshSouth = new BABYLON.Mesh("MapFlatPlatform_Floor_wall_wrapper_mesh[" + i + "]:" + x + ":" + y, scene);
            wallMeshSouth.parent = cellMesh;
            wallMeshSouth.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
            wallMeshSouth.position = new BABYLON.Vector3(0, 0, 0);
            for (var j=that.minFloorHeight; j<0; j++) {
              var newInstanceSouth = mesh.createInstance("MapFlatPlatform_Floor_wall_mesh_[" + i + "][S]:" + x + ":" + y);
              newInstanceSouth.position = new BABYLON.Vector3(0, j, 0);
              newInstanceSouth.isVisible = true;
              newInstanceSouth.parent = wallMeshSouth;
            }

          }
        }
      });

      floorRootMesh.rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
      floorRootMesh.position = new BABYLON.Vector3(0, floorHeight, 1);

      this._floorSprite3D.mesh = floorRootMesh;


      /// 天井側
      var ceilingRootMesh = new BABYLON.Mesh("MapFlatPlatform_Ceiling_RootMesh[" + x + "][" + y +"]", scene);

      var that = this;
      BABYLON.SceneLoader.ImportMesh("", "https://www.emastation.com/wrt/material/tile3d/", texModelFileName, scene, function (newMeshes) {
        for (var i = 0; i < newMeshes.length; i++) {
          var mesh:any = newMeshes[i];
          mesh.isVisible = false;
          var cellMesh = new BABYLON.Mesh("MapFlatPlatform_Ceiling_Cell_mesh_[" + i + "]:" + x + ":" + y, scene);
          cellMesh.position = new BABYLON.Vector3(y, 0, x);
          cellMesh.parent = ceilingRootMesh;
          if (i === 2) { // 天井
            var newInstance = mesh.createInstance("MapFlatPlatform_Ceiling_Cristal_mesh_[" + i + "]:" + x + ":" + y);
            newInstance.position = new BABYLON.Vector3(0, -1, 0); // ポリゴンモデルの時点で床より１ユニット高いため、-1している
            newInstance.isVisible = true;
            newInstance.parent = cellMesh;
          } else if (i === 1) { // 壁
            // 東の壁
            var wallMeshWEST = new BABYLON.Mesh("MapFlatPlatform_Floor_wall_wrapper_mesh[" + i + "]:" + x + ":" + y, scene);
            wallMeshWEST.parent = cellMesh;
            wallMeshWEST.rotation = new BABYLON.Vector3(0, Math.PI, 0);
            wallMeshWEST.position = new BABYLON.Vector3(1, 0, 0);
            for (var j=0; j<that.maxCeilingHeight; j++) {
              var newInstanceWEST = mesh.createInstance("MapFlatPlatform_Floor_wall_mesh_[" + i + "][W]:" + x + ":" + y);
              newInstanceWEST.position = new BABYLON.Vector3(0, j, 0);
              newInstanceWEST.isVisible = true;
              newInstanceWEST.parent = wallMeshWEST;
            }

            // 南の壁
            var wallMeshNORTH = new BABYLON.Mesh("MapFlatPlatform_Floor_wall_wrapper_mesh[" + i + "]:" + x + ":" + y, scene);
            wallMeshNORTH.parent = cellMesh;
            wallMeshNORTH.rotation = new BABYLON.Vector3(0, -Math.PI/2, 0);
            wallMeshNORTH.position = new BABYLON.Vector3(1, 0, -1);
            for (var j=0; j<that.maxCeilingHeight; j++) {
              var newInstanceNORTH = mesh.createInstance("MapFlatPlatform_Floor_wall_mesh_[" + i + "][N]:" + x + ":" + y);
              newInstanceNORTH.position = new BABYLON.Vector3(0, j, 0);
              newInstanceNORTH.isVisible = true;
              newInstanceNORTH.parent = wallMeshNORTH;
            }

            // 西の壁
            var wallMeshEast = new BABYLON.Mesh("MapFlatPlatform_Floor_wall_wrapper_mesh[" + i + "]:" + x + ":" + y, scene);
            wallMeshEast.parent = cellMesh;
            wallMeshEast.position = new BABYLON.Vector3(0, 0, -1);
            for (var j=0; j<that.maxCeilingHeight; j++) {
              var newInstanceEast = mesh.createInstance("MapFlatPlatform_Floor_wall_mesh_[" + i + "][E]:" + x + ":" + y);
              newInstanceEast.position = new BABYLON.Vector3(0, j, 0);
              newInstanceEast.isVisible = true;
              newInstanceEast.parent = wallMeshEast;
            }

            // 北の壁
            var wallMeshSouth = new BABYLON.Mesh("MapFlatPlatform_Floor_wall_wrapper_mesh[" + i + "]:" + x + ":" + y, scene);
            wallMeshSouth.parent = cellMesh;
            wallMeshSouth.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
            wallMeshSouth.position = new BABYLON.Vector3(0, 0, 0);
            for (var j=0; j<that.maxCeilingHeight; j++) {
              var newInstanceSouth = mesh.createInstance("MapFlatPlatform_Floor_wall_mesh_[" + i + "][S]:" + x + ":" + y);
              newInstanceSouth.position = new BABYLON.Vector3(0, j, 0);
              newInstanceSouth.isVisible = true;
              newInstanceSouth.parent = wallMeshSouth;
            }

          }
        }
      });

      ceilingRootMesh.rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
      ceilingRootMesh.position = new BABYLON.Vector3(0, ceilingHeight, 1);

      this._ceilingSprite3D.mesh = ceilingRootMesh;

    }
  }
}
