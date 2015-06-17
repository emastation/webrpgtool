/// <reference path="game__map.ts"/>

module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
  export class PolygonMap extends Map {
    private textureImageUrls:any;
    private _platforms:Array<MapPlatform> = new Array();

    constructor(private _scene:BABYLON.Scene, map:any, textures:any) {
      super(true);
      this.map = map;
      this.setupMesh(this.heightMapData, this.width, this.height, textures);
    }

    public setupMesh(heightMapData:any, mapWidth:number, mapHeight:number, imageUrls:any):void {
      this.textureImageUrls = imageUrls;
      var texMapData = this._texMapData;
      var typeMapData = this._typeMapData;
      var heightMapData = this._heightMapData;

      var sprite:any = {};
      sprite.buffer = {positions:[], normals:[], texcoords:[], indices:[]};
      sprite.FaceN = 0;

      var rootMesh = new BABYLON.Mesh("rootMesh", this._scene);

      var that = this;
      BABYLON.SceneLoader.ImportMesh("", "http://www.emastation.net/uploadspace/WebRPGTool/material/tile3d/", "Cristal.babylon", this._scene, function (newMeshes) {
        for (var i=0; i<newMeshes.length; i++) {
          var mesh:any = newMeshes[i];
          mesh.isVisible = false;
          for (var y = 1; y < mapHeight + 1; y++) {
            for (var x = 1; x < mapWidth + 1; x++) {
              var cellMesh = new BABYLON.Mesh("Cell_mesh_[" + i + "]:" + x + ":" + y, that._scene);
              cellMesh.position = new BABYLON.Vector3(y, 0, x);
              cellMesh.parent = rootMesh;
              if (i !== 1) {
                if (!doesThisTypeExist(typeMapData[y][x], 'P') && !doesThisTypeExist(typeMapData[y][x], 'W')) {
                  var newInstance = mesh.createInstance("Cristal_mesh_[" + i + "]:" + x + ":" + y);
                  newInstance.isVisible = true;
                  newInstance.parent = cellMesh;
                }
              } else {
                if (doesThisTypeExist(typeMapData[y][x + 1], 'W')) {
                  var wallMeshEast = new BABYLON.Mesh("wall_wrapper_mesh[" + i + "]:" + x + ":" + y, that._scene);
                  wallMeshEast.parent = cellMesh;
                  var newInstanceEast = mesh.createInstance("wall_mesh_[" + i + "][E]:" + x + ":" + y);
                  newInstanceEast.isVisible = true;
                  newInstanceEast.parent = wallMeshEast;
                }

                if (doesThisTypeExist(typeMapData[y + 1][x], 'W')) {
                  var wallMeshSouth = new BABYLON.Mesh("wall_wrapper_mesh[" + i + "]:" + x + ":" + y, that._scene);
                  wallMeshSouth.parent = cellMesh;
                  wallMeshSouth.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
                  wallMeshSouth.position = new BABYLON.Vector3(1, 0, 0);
                  var newInstanceSouth = mesh.createInstance("wall_mesh_[" + i + "][S]:" + x + ":" + y);
                  newInstanceSouth.isVisible = true;
                  newInstanceSouth.parent = wallMeshSouth;
                }

                if (doesThisTypeExist(typeMapData[y][x - 1], 'W')) {
                  var wallMeshWEST = new BABYLON.Mesh("wall_wrapper_mesh[" + i + "]:" + x + ":" + y, that._scene);
                  wallMeshWEST.parent = cellMesh;
                  wallMeshWEST.rotation = new BABYLON.Vector3(0, Math.PI, 0);
                  wallMeshWEST.position = new BABYLON.Vector3(1, 0, -1);
                  var newInstanceWEST = mesh.createInstance("wall_mesh_[" + i + "][W]:" + x + ":" + y);
                  newInstanceWEST.isVisible = true;
                  newInstanceWEST.parent = wallMeshWEST;
                }

                if (doesThisTypeExist(typeMapData[y-1][x], 'W')) {
                  var wallMeshNORTH = new BABYLON.Mesh("wall_wrapper_mesh[" + i + "]:" + x + ":" + y, that._scene);
                  wallMeshNORTH.parent = cellMesh;
                  wallMeshNORTH.rotation = new BABYLON.Vector3(0, -Math.PI/2, 0);
                  wallMeshNORTH.position = new BABYLON.Vector3(0, 0, -1);
                  var newInstanceNORTH = mesh.createInstance("wall_mesh_[" + i + "][N]:" + x + ":" + y);
                  newInstanceNORTH.isVisible = true;
                  newInstanceNORTH.parent = wallMeshNORTH;

                }
              }
            }
          }
        }
      });

      for (var y = 0; y < mapHeight + 2; y++) {
        for (var x = 0; x < mapWidth + 2; x++) {
          if(doesThisTypeExist(typeMapData[y][x], 'P')) {
            var platform = new MapPlatform(x, y, heightMapData, getTypeParameter(typeMapData[y][x], 'P'));
            platform.setupMesh(this._scene, this._map.title + "_platform["+x+"]["+y+"]", heightMapData[y][x][0], heightMapData[y][x][1], this.textureImageUrls[texMapData[y][x]-1].gametex_url);
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

