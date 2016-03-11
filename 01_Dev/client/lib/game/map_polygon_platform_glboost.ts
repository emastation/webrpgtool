module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
  export class MapPolygonPlatformGLBoost extends MapPlatform {
    private minFloorHeight:number = -20; // 床の最低の低さ
    private maxCeilingHeight:number = 20; // 天井の最高の高さ

    // コンストラクタの宣言
    constructor(x:number, y:number, heightMap:any, parameter:string) {
      super(x, y, heightMap, parameter);
    }

    public setupMesh(scene:any, basePath:string, floorHeight:number, ceilingHeight:number, imageUrl:string, canvasId:string) :any {

      var x = this.x_onMap;
      var y = this.y_onMap;

      var objLoader = GLBoost.ObjLoader.getInstance();
      var splitPath:any = imageUrl.split('/');
      var texName = splitPath.last.split('.').first;

      /// 床
      var defers_floor = $.Deferred();
      var floorRootGroup = new GLBoost.Group();
      var promise = objLoader.loadObj(basePath + texName + '/' + texName + '_floor.obj');
      promise.then((mesh)=>{
        var cellGroup = new GLBoost.Group();
        cellGroup.translate = new BABYLON.Vector3(x, 0, y);
        floorRootGroup.addChild(cellGroup);

        var newInstance = new GLBoost.Mesh(mesh.geometry, null, canvasId);
        cellGroup.addChild(newInstance);

        defers_floor.resolve();
      });

      floorRootGroup.translate = new GLBoost.Vector3(-1, floorHeight, -1);
      this._floorSprite3D.mesh = floorRootGroup;
      scene.add(floorRootGroup);



      /// 天井
      var defers_ceiling = $.Deferred();
      var ceilingRootGroup = new GLBoost.Group();
      var promise = objLoader.loadObj(basePath + texName + '/' + texName + '_ceiling.obj');
      promise.then((mesh)=>{
        var cellGroup = new GLBoost.Group();
        cellGroup.translate = new BABYLON.Vector3(x, 0, y);
        ceilingRootGroup.addChild(cellGroup);

        var newInstance = new GLBoost.Mesh(mesh.geometry, null, canvasId);
        newInstance.translate = new BABYLON.Vector3(0, -1, 0); // ポリゴンモデルの時点で床より１ユニット高いため、-1している
        cellGroup.addChild(newInstance);

        defers_ceiling.resolve();
      });

      ceilingRootGroup.translate = new GLBoost.Vector3(-1, ceilingHeight, -1);
      this._ceilingSprite3D.mesh = ceilingRootGroup;
      scene.add(ceilingRootGroup);



      /// 壁
      var defers_wall = $.Deferred();
      var promise = objLoader.loadObj(basePath + texName + '/' + texName + '_wall.obj');
      promise.then((mesh)=>{
        {
          /// 床側の壁
          let cellGroup = new GLBoost.Group();
          cellGroup.translate = new BABYLON.Vector3(x, 0, y);
          floorRootGroup.addChild(cellGroup);

          // 東向きの壁
          let wallGroupEast = new GLBoost.Group();
          cellGroup.addChild(wallGroupEast);
          wallGroupEast.rotate = new GLBoost.Vector3(0, GLBoost.MathUtil.radianToDegree(Math.PI / 2), 0);
          wallGroupEast.translate = new GLBoost.Vector3(1, 0, 1);
          for (let j = this.minFloorHeight; j < 0; j++) {
            let newInstanceEast = new GLBoost.Mesh(mesh.geometry, null, canvasId);
            newInstanceEast.translate = new GLBoost.Vector3(0, j, 0);
            wallGroupEast.addChild(newInstanceEast);
          }

          // 南向きの壁
          let wallGroupSouth = new GLBoost.Group();
          cellGroup.addChild(wallGroupSouth);
          //wallGroupSouth.rotate = new GLBoost.Vector3(0, Math.PI, 0);
          wallGroupSouth.translate = new GLBoost.Vector3(0, 0, 1);
          for (let j = this.minFloorHeight; j < 0; j++) {
            let newInstanceSouth = new GLBoost.Mesh(mesh.geometry, null, canvasId);
            newInstanceSouth.translate = new GLBoost.Vector3(0, j, 0);
            wallGroupSouth.addChild(newInstanceSouth);
          }

          // 西向きの壁
          let wallGroupWest = new GLBoost.Group();
          cellGroup.addChild(wallGroupWest);
          wallGroupWest.rotate = new GLBoost.Vector3(0, GLBoost.MathUtil.radianToDegree(-Math.PI / 2), 0);
          for (let j = this.minFloorHeight; j < 0; j++) {
            let newInstanceWEST = new GLBoost.Mesh(mesh.geometry, null, canvasId);
            newInstanceWEST.translate = new GLBoost.Vector3(0, j, 0);
            wallGroupWest.addChild(newInstanceWEST);
          }

          // 北向きの壁
          let wallGroupNorth = new GLBoost.Group();
          wallGroupNorth.rotate = new GLBoost.Vector3(0, GLBoost.MathUtil.radianToDegree(Math.PI), 0);
          wallGroupNorth.translate = new GLBoost.Vector3(1, 0, 0);
          cellGroup.addChild(wallGroupNorth);
          for (let j = this.minFloorHeight; j < 0; j++) {
            let newInstanceNORTH = new GLBoost.Mesh(mesh.geometry, null, canvasId);
            newInstanceNORTH.translate = new GLBoost.Vector3(0, j, 0);
            wallGroupNorth.addChild(newInstanceNORTH);
          }
        }

        {
          /// 天井側の壁
          let cellGroup = new GLBoost.Group();
          cellGroup.translate = new BABYLON.Vector3(x, 0, y);
          ceilingRootGroup.addChild(cellGroup);
          // 東向きの壁
          let wallGroupEast = new GLBoost.Group();
          cellGroup.addChild(wallGroupEast);
          wallGroupEast.rotate = new GLBoost.Vector3(0, GLBoost.MathUtil.radianToDegree(Math.PI / 2), 0);
          wallGroupEast.translate = new GLBoost.Vector3(1, 0, 1);
          for (let j=0; j<this.maxCeilingHeight; j++) {
            let newInstanceEast = new GLBoost.Mesh(mesh.geometry, null, canvasId);
            newInstanceEast.translate = new GLBoost.Vector3(0, j, 0);
            wallGroupEast.addChild(newInstanceEast);
          }

          // 南向きの壁
          let wallGroupSouth = new GLBoost.Group();
          cellGroup.addChild(wallGroupSouth);
          //wallGroupSouth.rotate = new GLBoost.Vector3(0, Math.PI, 0);
          wallGroupSouth.translate = new GLBoost.Vector3(0, 0, 1);
          for (let j=0; j<this.maxCeilingHeight; j++) {
            let newInstanceSouth = new GLBoost.Mesh(mesh.geometry, null, canvasId);
            newInstanceSouth.translate = new GLBoost.Vector3(0, j, 0);
            wallGroupSouth.addChild(newInstanceSouth);
          }

          // 西向きの壁
          let wallGroupWest = new GLBoost.Group();
          cellGroup.addChild(wallGroupWest);
          wallGroupWest.rotate = new GLBoost.Vector3(0, GLBoost.MathUtil.radianToDegree(-Math.PI / 2), 0);
          for (let j=0; j<this.maxCeilingHeight; j++) {
            let newInstanceWEST = new GLBoost.Mesh(mesh.geometry, null, canvasId);
            newInstanceWEST.translate = new GLBoost.Vector3(0, j, 0);
            wallGroupWest.addChild(newInstanceWEST);
          }

          // 北向きの壁
          let wallGroupNorth = new GLBoost.Group();
          wallGroupNorth.rotate = new GLBoost.Vector3(0, GLBoost.MathUtil.radianToDegree(Math.PI), 0);
          wallGroupNorth.translate = new GLBoost.Vector3(1, 0, 0);
          cellGroup.addChild(wallGroupNorth);
          for (let j=0; j<this.maxCeilingHeight; j++) {
            let newInstanceNORTH = new GLBoost.Mesh(mesh.geometry, null, canvasId);
            newInstanceNORTH.translate = new GLBoost.Vector3(0, j, 0);
            wallGroupNorth.addChild(newInstanceNORTH);
          }
        }

        defers_wall.resolve();
      });

      return [defers_floor.promise(), defers_ceiling.promise(), defers_wall.promise()];
    }
  }
}
