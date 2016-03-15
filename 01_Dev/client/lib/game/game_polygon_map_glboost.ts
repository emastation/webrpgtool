declare var lodash:any;

module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
  export class PolygonMapGLBoost extends Map {
    private textures:any;
    private _platforms:Array<MapPlatform> = new Array();

    constructor(private _scene:any, map:any, textures:any, canvasId:string) {
      super(true);
      this.map = map;
      this.setupMesh(this.heightMapData, this.width, this.height, textures, canvasId);
    }

    public setupMesh(heightMapData_:any, mapWidth:number, mapHeight:number, textures:any, canvasId:string):void {
      this.textures = textures;
      var texMapData = this._texMapData;
      var typeMapData = this._typeMapData;

      function arrayClone( arr ) {
        if( _.isArray( arr ) ) {
          return _.map( arr, arrayClone );
        } else if( typeof arr === 'object' ) {
          throw 'Cannot clone array containing an object!';
        } else {
          return arr;
        }
      }

      var objLoader = GLBoost.ObjLoader.getInstance();

      var heightMapData = arrayClone(heightMapData_);
      var defers_floor = new Array(this.textures.length);
      var defers_ceiling = new Array(this.textures.length);
      var defers_wall = new Array(this.textures.length);

      var basePath = 'https://www.emastation.com/wrt/material/tile3d/';

      var rootGroup = new GLBoost.Group();
      rootGroup.translate = new GLBoost.Vector3(-1, 0, -1);
      this.textures.forEach((texture:any, texIndex)=> {
        defers_floor[texIndex] = $.Deferred();
        defers_ceiling[texIndex] = $.Deferred();
        defers_wall[texIndex] = $.Deferred();

        var texGroup = new GLBoost.Group();
        rootGroup.addChild(texGroup);
        var texName = texture.game_model_url.split('/').last.split('.').first;

        // Floor
        var promise = objLoader.loadObj(basePath + texName + '/' + texName + '_floor.obj');
        promise.then(((deferIndex)=>{
          return (mesh)=> {
            console.log(mesh);
            var mergedMesh = new GLBoost.Mesh(mesh.geometry, null);
            mergedMesh.translate = new GLBoost.Vector3(0,-1000, 0);
            var meshes = [];
            for (let y = 1; y < mapHeight + 1; y++) {
              for (let x = 1; x < mapWidth + 1; x++) {
                if (texMapData[y][x] === texIndex + 1) {

                  var cellGroup = new GLBoost.Group();
                  cellGroup.translate = new GLBoost.Vector3(x, 0, y);
                  //texGroup.addChild(cellGroup);

                  if (!doesThisTypeExist(typeMapData[y][x], 'P') && !doesThisTypeExist(typeMapData[y][x], 'W')) {
                    let geom = lodash.cloneDeep(mesh.geometry);
                    geom._instanceName + '_' + y + '_' + x;
                    var newInstance = new GLBoost.Mesh(geom, null, canvasId);
                    newInstance.translate = new GLBoost.Vector3(0, heightMapData[y][x][0], 0);
                    cellGroup.addChild(newInstance);
                    meshes.push(newInstance);
                  }
                }
              }
            }

            mergedMesh.mergeHarder(meshes);
            texGroup.addChild(mergedMesh);
//          self.prepareForRender();
            defers_floor[deferIndex].resolve();

        }})(texIndex));

        // Ceiling
        var promise = objLoader.loadObj(basePath + texName + '/' + texName + '_ceiling.obj');
        promise.then(((deferIndex)=>{
          return (mesh)=> {
            console.log(mesh);

            var mergedMesh = new GLBoost.Mesh(mesh.geometry, null);
            mergedMesh.translate = new GLBoost.Vector3(0,-1000, 0);
            var meshes = [];
            for (let y = 1; y < mapHeight + 1; y++) {
              for (let x = 1; x < mapWidth + 1; x++) {
                if (texMapData[y][x] === texIndex + 1) {

                  var cellGroup = new GLBoost.Group();
                  cellGroup.translate = new GLBoost.Vector3(x, 0, y);
                  //texGroup.addChild(cellGroup);

                  if (!doesThisTypeExist(typeMapData[y][x], 'P') && !doesThisTypeExist(typeMapData[y][x], 'W')) {
                    let geom = lodash.cloneDeep(mesh.geometry);
                    geom._instanceName + '_' + y + '_' + x;
                    var newInstance = new GLBoost.Mesh(geom, null, canvasId);
                    newInstance.translate = new GLBoost.Vector3(0, heightMapData[y][x][1]-1, 0); // ポリゴンモデルの時点で床より１ユニット高いため、-1している
                    cellGroup.addChild(newInstance);
                    meshes.push(newInstance);
                  }
                }
              }
            }
            mergedMesh.mergeHarder(meshes);
            texGroup.addChild(mergedMesh);

//          self.prepareForRender();
            defers_ceiling[deferIndex].resolve();

          }})(texIndex));

        // Wall
        var promise = objLoader.loadObj(basePath + texName + '/' + texName + '_wall.obj');
        promise.then(((deferIndex)=>{
          return (mesh)=> {
            console.log(mesh);

            // if there is zero normal (0,0,0), overwrite with (1,0,0).
            for (let i=0; i<mesh.geometry._vertices.normal.length; i++) {
              let vec = mesh.geometry._vertices.normal[i];
              if (vec.x === 0 && vec.y === 0 && vec.z === 0) {
                mesh.geometry._vertices.normal[i] = new GLBoost.Vector3(1, 0, 0);
              }
            }

            var mergedMesh = new GLBoost.Mesh(mesh.geometry, null);
            mergedMesh.translate = new GLBoost.Vector3(0,-1000, 0);
            var meshes = [];
            for (let y = 1; y < mapHeight + 1; y++) {
              for (let x = 1; x < mapWidth + 1; x++) {
                if (texMapData[y][x] === texIndex + 1) {

                  var cellGroup = new GLBoost.Group();
                  cellGroup.translate = new GLBoost.Vector3(x, 0, y);
                  //texGroup.addChild(cellGroup);

                  // 東の壁
                  var wallGroupEast = new GLBoost.Group();
                  wallGroupEast.rotate = new GLBoost.Vector3(0, GLBoost.MathUtil.radianToDegree(-Math.PI / 2), 0);
                  wallGroupEast.translate = new GLBoost.Vector3(1, 0, 0);
                  cellGroup.addChild(wallGroupEast);
                  for (var j=heightMapData[y][x][0]; j<heightMapData[y][x][1]; j++) {
                    if (!doesThisTypeExist(typeMapData[y][x + 1], 'W')) {
                      if (doesThisTypeExist(typeMapData[y][x + 1], 'P') || heightMapData[y][x + 1][0] <= j && j < (heightMapData[y][x + 1][1])) {
                        continue;
                      }
                    }
                    let geom = lodash.cloneDeep(mesh.geometry);
                    geom._instanceName + '_' + y + '_' + x + 'East';
                    //var newInstanceEast = new GLBoost.Mesh(mesh.geometry, null, canvasId);
                    var newInstanceEast = new GLBoost.Mesh(geom, null, canvasId);
                    newInstanceEast.translate = new GLBoost.Vector3(0, j, 0);
                    wallGroupEast.addChild(newInstanceEast);
                    meshes.push(newInstanceEast);

                  }

                  // 南の壁
                  var wallGroupSouth = new GLBoost.Group();
                  cellGroup.addChild(wallGroupSouth);
                  wallGroupSouth.rotate = new GLBoost.Vector3(0, GLBoost.MathUtil.radianToDegree(Math.PI), 0);
                  wallGroupSouth.translate = new GLBoost.Vector3(1, 0, 1);
                  for (var j=heightMapData[y][x][0]; j<heightMapData[y][x][1]; j++) {
                    if (!doesThisTypeExist(typeMapData[y + 1][x], 'W')) {
                      if (doesThisTypeExist(typeMapData[y + 1][x], 'P') || heightMapData[y + 1][x][0] <= j && j < (heightMapData[y + 1][x][1])) {
                        continue;
                      }
                    }
                    let geom = lodash.cloneDeep(mesh.geometry);
                    geom._instanceName + '_' + y + '_' + x + 'South';
                    //var newInstanceSouth = new GLBoost.Mesh(mesh.geometry, null, canvasId);
                    var newInstanceSouth = new GLBoost.Mesh(geom, null, canvasId);
                    newInstanceSouth.translate = new GLBoost.Vector3(0, j, 0);
                    wallGroupSouth.addChild(newInstanceSouth);
                    meshes.push(newInstanceSouth);
                  }

                  // 西の壁
                  var wallGroupWest = new GLBoost.Group();
                  cellGroup.addChild(wallGroupWest);
                  wallGroupWest.rotate = new GLBoost.Vector3(0, GLBoost.MathUtil.radianToDegree(Math.PI / 2), 0);
                  wallGroupWest.translate = new GLBoost.Vector3(0, 0, 1);
                  for (var j=heightMapData[y][x][0]; j<heightMapData[y][x][1]; j++) {
                    if (!doesThisTypeExist(typeMapData[y][x - 1], 'W')) {
                      if (doesThisTypeExist(typeMapData[y][x - 1], 'P') || heightMapData[y][x - 1][0] <= j && j < (heightMapData[y][x - 1][1])) {
                        continue;
                      }
                    }
                    let geom = lodash.cloneDeep(mesh.geometry);
                    geom._instanceName + '_' + y + '_' + x + 'West';
                    //var newInstanceWEST = new GLBoost.Mesh(mesh.geometry, null, canvasId);
                    var newInstanceWEST = new GLBoost.Mesh(geom, null, canvasId);
                    newInstanceWEST.translate = new GLBoost.Vector3(0, j, 0);
                    wallGroupWest.addChild(newInstanceWEST);
                    meshes.push(newInstanceWEST);
                  }

                  // 北の壁
                  var wallGroupNorth = new GLBoost.Group();
                  cellGroup.addChild(wallGroupNorth);
                  for (var j=heightMapData[y][x][0]; j<heightMapData[y][x][1]; j++) {
                    if (!doesThisTypeExist(typeMapData[y - 1][x], 'W')) {
                      if (doesThisTypeExist(typeMapData[y - 1][x], 'P') || heightMapData[y - 1][x][0] <= j && j < (heightMapData[y - 1][x][1])) {
                        continue;
                      }
                    }
                    let geom = lodash.cloneDeep(mesh.geometry);
                    geom._instanceName + '_' + y + '_' + x + 'North';
                    //var newInstanceNORTH = new GLBoost.Mesh(mesh.geometry, null, canvasId);
                    var newInstanceNORTH = new GLBoost.Mesh(geom, null, canvasId);
                    newInstanceNORTH.translate = new GLBoost.Vector3(0, j, 0);
                    wallGroupNorth.addChild(newInstanceNORTH);
                    meshes.push(newInstanceNORTH);
                  }

                }
              }
            }

            mergedMesh.mergeHarder(meshes);
            texGroup.addChild(mergedMesh);

//          self.prepareForRender();
            defers_wall[deferIndex].resolve();

          }})(texIndex));
      });

      var deferPromises = [];
      defers_floor.forEach(function(defer){
        deferPromises.push(defer.promise());
      });
      defers_ceiling.forEach(function(defer){
        deferPromises.push(defer.promise());
      });
      defers_wall.forEach(function(defer){
        deferPromises.push(defer.promise());
      });



      for (var y = 0; y < mapHeight + 2; y++) {
        for (var x = 0; x < mapWidth + 2; x++) {
          if(doesThisTypeExist(typeMapData[y][x], 'P')) {
            var platform = new MapPolygonPlatformGLBoost(x, y, heightMapData_, getTypeParameter(typeMapData[y][x], 'P'));
            let dp = platform.setupMesh(this._scene, basePath, heightMapData[y][x][0], heightMapData[y][x][1], this.textures[texMapData[y][x]-1].game_model_url, typeMapData, canvasId);
            this._platforms.push(platform);

            deferPromises.concat(dp);
          }
        }
      }


      $.when.apply($.when, deferPromises).done(()=> {
        this._scene.add(rootGroup);
        this._scene.prepareForRender();
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
