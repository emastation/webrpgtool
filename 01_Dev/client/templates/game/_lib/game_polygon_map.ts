
module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
  export class PolygonMap extends Map {
    private textures:any;
    private _platforms:Array<MapPlatform> = new Array();

    constructor(private _scene:BABYLON.Scene, map:any, textures:any) {
      super(true);
      this.map = map;
      this.setupMesh(this.heightMapData, this.width, this.height, textures);
    }

    public setupMesh(heightMapData:any, mapWidth:number, mapHeight:number, textures:any):void {
      this.textures = textures;
      var texMapData = this._texMapData;
      var typeMapData = this._typeMapData;
      var heightMapData = this._heightMapData;

      var sprite:any = {};
      sprite.buffer = {positions:[], normals:[], texcoords:[], indices:[]};
      sprite.FaceN = 0;


      var rootMesh = new BABYLON.Mesh("PolygonMap_RootMesh", this._scene);
      var that = this;
      this.textures.forEach(function(texture, texIndex){
        var texMesh = new BABYLON.Mesh("PolygonMap_Mesh_"+texture.game_model_url.split('/').last, that._scene);
        texMesh.parent = rootMesh;
        BABYLON.SceneLoader.ImportMesh("", "http://www.emastation.net/uploadspace/WebRPGTool/material/tile3d/", texture.game_model_url.split('/').last, that._scene, function (newMeshes) {
          for (var i=0; i<newMeshes.length; i++) {
            var mesh:any = newMeshes[i];
            mesh.isVisible = false;
            for (var y = 1; y < mapHeight + 1; y++) {
              for (var x = 1; x < mapWidth + 1; x++) {

                if (texMapData[y][x] === texIndex+1) {

                  var cellMesh = new BABYLON.Mesh("Cell_mesh_[" + i + "]:" + x + ":" + y, that._scene);
                  cellMesh.position = new BABYLON.Vector3(y, 0, x);
                  cellMesh.parent = texMesh;
                  if (i == 0) { // 床
                    if (!doesThisTypeExist(typeMapData[y][x], 'P') && !doesThisTypeExist(typeMapData[y][x], 'W')) {
                      var newInstance = mesh.createInstance("Cristal_mesh_[" + i + "]:" + x + ":" + y);
                      newInstance.position = new BABYLON.Vector3(0, heightMapData[y][x][0], 0);
                      newInstance.isVisible = true;
                      newInstance.parent = cellMesh;
                    }
                  } else if (i == 2) { // 天井
                    if (!doesThisTypeExist(typeMapData[y][x], 'P') && !doesThisTypeExist(typeMapData[y][x], 'W')) {
                      var newInstance = mesh.createInstance("Cristal_mesh_[" + i + "]:" + x + ":" + y);
                      newInstance.position = new BABYLON.Vector3(0, heightMapData[y][x][1]-1, 0); // ポリゴンモデルの時点で床より１ユニット高いため、-1している
                      newInstance.isVisible = true;
                      newInstance.parent = cellMesh;
                    }
                  } else { // 壁

                    // 東の壁
                    var wallMeshEast = new BABYLON.Mesh("wall_wrapper_mesh[" + i + "]:" + x + ":" + y, that._scene);
                    wallMeshEast.parent = cellMesh;
                    for (var j=heightMapData[y][x][0]; j<heightMapData[y][x][1]; j++) {
                      if (!doesThisTypeExist(typeMapData[y][x + 1], 'W')) {
                        if (doesThisTypeExist(typeMapData[y][x + 1], 'P') || heightMapData[y][x + 1][0] <= j && j < (heightMapData[y][x + 1][1])) {
                          continue;
                        }
                      }
                      var newInstanceEast = mesh.createInstance("wall_mesh_[" + i + "][E]:" + x + ":" + y);
                      newInstanceEast.position = new BABYLON.Vector3(0, j, 0);
                      newInstanceEast.isVisible = true;
                      newInstanceEast.parent = wallMeshEast;
                    }

                    // 南の壁
                    var wallMeshSouth = new BABYLON.Mesh("wall_wrapper_mesh[" + i + "]:" + x + ":" + y, that._scene);
                    wallMeshSouth.parent = cellMesh;
                    wallMeshSouth.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
                    wallMeshSouth.position = new BABYLON.Vector3(1, 0, 0);
                    for (var j=heightMapData[y][x][0]; j<heightMapData[y][x][1]; j++) {
                      if (!doesThisTypeExist(typeMapData[y + 1][x], 'W')) {
                        if (doesThisTypeExist(typeMapData[y + 1][x], 'P') || heightMapData[y + 1][x][0] <= j && j < (heightMapData[y + 1][x][1])) {
                          continue;
                        }
                      }
                      var newInstanceSouth = mesh.createInstance("wall_mesh_[" + i + "][S]:" + x + ":" + y);
                      newInstanceSouth.position = new BABYLON.Vector3(0, j, 0);
                      newInstanceSouth.isVisible = true;
                      newInstanceSouth.parent = wallMeshSouth;
                    }

                    // 西の壁
                    var wallMeshWEST = new BABYLON.Mesh("wall_wrapper_mesh[" + i + "]:" + x + ":" + y, that._scene);
                    wallMeshWEST.parent = cellMesh;
                    wallMeshWEST.rotation = new BABYLON.Vector3(0, Math.PI, 0);
                    wallMeshWEST.position = new BABYLON.Vector3(1, 0, -1);
                    for (var j=heightMapData[y][x][0]; j<heightMapData[y][x][1]; j++) {
                      if (!doesThisTypeExist(typeMapData[y][x - 1], 'W')) {
                        if (doesThisTypeExist(typeMapData[y][x - 1], 'P') || heightMapData[y][x - 1][0] <= j && j < (heightMapData[y][x - 1][1])) {
                          continue;
                        }
                      }
                      var newInstanceWEST = mesh.createInstance("wall_mesh_[" + i + "][W]:" + x + ":" + y);
                      newInstanceWEST.position = new BABYLON.Vector3(0, j, 0);
                      newInstanceWEST.isVisible = true;
                      newInstanceWEST.parent = wallMeshWEST;
                    }

                    // 北の壁
                    var wallMeshNORTH = new BABYLON.Mesh("wall_wrapper_mesh[" + i + "]:" + x + ":" + y, that._scene);
                    wallMeshNORTH.parent = cellMesh;
                    wallMeshNORTH.rotation = new BABYLON.Vector3(0, -Math.PI/2, 0);
                    wallMeshNORTH.position = new BABYLON.Vector3(0, 0, -1);
                    for (var j=heightMapData[y][x][0]; j<heightMapData[y][x][1]; j++) {
                      if (!doesThisTypeExist(typeMapData[y - 1][x], 'W')) {
                        if (doesThisTypeExist(typeMapData[y - 1][x], 'P') || heightMapData[y - 1][x][0] <= j && j < (heightMapData[y - 1][x][1])) {
                          continue;
                        }
                      }
                      var newInstanceNORTH = mesh.createInstance("wall_mesh_[" + i + "][N]:" + x + ":" + y);
                      newInstanceNORTH.position = new BABYLON.Vector3(0, j, 0);
                      newInstanceNORTH.isVisible = true;
                      newInstanceNORTH.parent = wallMeshNORTH;
                    }

                  }
                }
              }
            }
          }
        });
      });

      for (var y = 0; y < mapHeight + 2; y++) {
        for (var x = 0; x < mapWidth + 2; x++) {
          if(doesThisTypeExist(typeMapData[y][x], 'P')) {
            var platform = new MapPolygonPlatform(x, y, heightMapData, getTypeParameter(typeMapData[y][x], 'P'));
            platform.setupMesh(this._scene, this._map.title + "_platform["+x+"]["+y+"]", heightMapData[y][x][0], heightMapData[y][x][1], this.textures[texMapData[y][x]-1].game_model_url);
            this._platforms.push(platform);
          }
        }
      }

      rootMesh.rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
      rootMesh.position = new BABYLON.Vector3(0, 0, 1);

    }

    public movePlatforms() {
      var isPlayerOnAnyPlatform = false;
      for (var i=0; i<this._platforms.length; i++) {
        this._platforms[i].move();
        isPlayerOnAnyPlatform = isPlayerOnAnyPlatform || this._platforms[i].isPlayerOnThisPlatform();
      }

      var mapMovement = MapMovement.getInstance();
      if (isPlayerOnAnyPlatform) {
        mapMovement.onPlatformNow = true;
      } else {
        mapMovement.onPlatformNow = false;
      }
    }
  }
}

//window.WrtGame = WrtGame;

