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

      BABYLON.SceneLoader.ImportMesh("", "http://www.emastation.net/uploadspace/WebRPGTool/material/tile3d/", "Cristal_floor.babylon", this._scene, function (newMeshes) {
        var mesh:any = newMeshes[0];
        mesh.isVisible = false;

        for (var y = 0; y < mapHeight + 2; y++) {
          for (var x = 0; x < mapWidth + 2; x++) {
            if (doesThisTypeExist(typeMapData[y][x], 'N')) { //
              var newInstance = mesh.createInstance("floor_mesh_" + x + ":" + y);
              newInstance.position = new BABYLON.Vector3(y, 0, x);
              newInstance.isVisible = true;
              newInstance.parent = rootMesh;
            }

            rootMesh.rotation = new BABYLON.Vector3(0, Math.PI/2, 0);
            rootMesh.position = new BABYLON.Vector3(0, 0, 1);

            if(doesThisTypeExist(typeMapData[y][x], 'P')) {
              var platform = new MapPlatform(x, y, heightMapData, getTypeParameter(typeMapData[y][x], 'P'));
              platform.setupMesh(this._scene, this._map.title + "_platform["+x+"]["+y+"]", heightMapData[y][x][0], heightMapData[y][x][1], this.textureImageUrls[texMapData[y][x]-1].gametex_url);
              this._platforms.push(platform);
            }
          }
        }
      });

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

