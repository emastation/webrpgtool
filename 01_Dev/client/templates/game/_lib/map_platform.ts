module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
  export class MapPlatform {
    private heightMap:any;
    private x_onMap:number;
    private y_onMap:number;
    private platformMode:string;
    private levels:any;
    private currentLevel:any;
    private texcoordOne:number = 1;  // Y方向の壁の高さ
    private minFloorHeight:number = -20; // 床の最低の低さ
    private maxCeilingHeight:number = 20; // 天井の最高の高さ
    private _floorSprite3D:any = {};
    private _ceilingSprite3D:any = {};
    private _fired:boolean = false; // プラットフォームが起動されるとtrueになる。

    private _timeLeft:number = 0; // プラットフォームを動かし始めてからの経過時間
    private _direction:number = 1; // プラットフォームが動く上下の方向

    // コンストラクタの宣言
    constructor(x:number, y:number, heightMap:any, parameter:string) {
      this.heightMap = heightMap;
      this.x_onMap = x;
      this.y_onMap = y;

      this.platformMode = parameter.split('|')[0];
      var levelParameters:string = parameter.split('|')[1];
      this.levels = levelParameters.split('~');
      for (var i=0; i<this.levels.length; i++) {
        this.levels[i] = parseInt(this.levels[i], 10);
      }
//            console.log("パラメータ:", this.levels);

      this.currentLevel = this.heightMap[this.y_onMap][this.x_onMap][0]; //this.levels[0];

      if(this.levels[0] > this.levels[1]) {
        var tmpLevel = this.levels[0];
        this.levels[0] = this.levels[1];
        this.levels[1] = tmpLevel;
      }
      
      if (this.currentLevel === this.levels[0]) { // プラットフォームの現在レベルがlevels[0]であれば、
        this._direction = 1; // プラットフォームは上に動かす
      } else {
        this._direction = -1; // そうでなければ、下に動かす
      }

    }

    public move() {
      // プラットフォームの稼働アニメーション
      var span = Math.abs(this.levels[1] - this.levels[0]);
      var time = 5;
      var delta = 1 / 60 * span / time; //60は仮定するFPS値
      var breakTime = 1;


      if (this.platformMode === 'A') { // マニュアルモードのプラットフォームであれば、プレーヤーが乗っかった時に動かす
        this.moveInner(
            delta, time, breakTime, this._floorSprite3D.mesh, 60, true
        );
      } else if (this.platformMode === 'M') {
        if (this._fired) {
          this.moveInner(
              delta, time, breakTime, this._floorSprite3D.mesh, 60, false
          );
        }
      }

    }

    private moveInner(delta:number, time:number, breakTime:number, sprite:any, fps:number, loop_f:boolean) {
      this._timeLeft += 1 / fps;

      sprite.position = new BABYLON.Vector3(sprite.position.x, sprite.position.y + delta * this._direction, sprite.position.z);
      if (sprite.position.y > this.levels[1]) {
        sprite.position.y = this.levels[1];
        this.currentLevel = this.levels[1];
      }
      if (sprite.position.y < this.levels[0]) {
        sprite.position.y = this.levels[0];
        this.currentLevel = this.levels[0];
      }

      this.heightMap[this.y_onMap][this.x_onMap][0] = sprite.position.y;

      if(this._timeLeft > time+breakTime) { // 動かし終わったら、次に動かすまでbreakTime時間だけ休む
        if(loop_f) {
          this._timeLeft = 0;
          this._direction *= -1;
        } else {

          this._fired = false;
        }
      }
    }

    public setupMesh(scene:BABYLON.Scene, mapPlatformTitle:string, floorHeight:number, ceilingHeight:number, imageUrl:string) :void {

      var x = this.x_onMap;
      var y = this.y_onMap;

      this._floorSprite3D.buffer = {positions:[], normals:[], texcoords:[], indices:[]};
      this._floorSprite3D.FaceN = 0;

      this._ceilingSprite3D.buffer = {positions:[], normals:[], texcoords:[], indices:[]};
      this._ceilingSprite3D.FaceN = 0;

      /// 床
      // 床の頂点データ作成
      var verticesStride = this._floorSprite3D.FaceN * 4; // 現在の総四角形数 * 4頂点
      var indicesStride = this._floorSprite3D.FaceN * 4; // 現在の総四角形数 * 4ポリゴン
      this.setupFloorVertices(this._floorSprite3D.buffer, verticesStride, indicesStride, y, x, 0);
      this._floorSprite3D.FaceN++;

      // 床の北向きの壁の頂点データ作成
      verticesStride = this._floorSprite3D.FaceN * 4; // 現在の総四角形数 * 4頂点
      indicesStride = this._floorSprite3D.FaceN * 4; // 現在の総四角形数 * 4ポリゴン
      this.setupFloorNorthWallVertices(this._floorSprite3D.buffer, verticesStride, indicesStride, y, x, 0);
      this._floorSprite3D.FaceN++;

      // 床の東向きの壁の頂点データ作成
      verticesStride = this._floorSprite3D.FaceN * 4; // 現在の総四角形数 * 4頂点
      indicesStride = this._floorSprite3D.FaceN * 4; // 現在の総四角形数 * 4ポリゴン
      this.setupFloorEastWallVertices(this._floorSprite3D.buffer, verticesStride, indicesStride, y, x, 0);
      this._floorSprite3D.FaceN++;


      // 床の南向きの壁の頂点データ作成
      verticesStride = this._floorSprite3D.FaceN * 4; // 現在の総四角形数 * 4頂点
      indicesStride = this._floorSprite3D.FaceN * 4; // 現在の総四角形数 * 4ポリゴン
      this.setupFloorSouthWallVertices(this._floorSprite3D.buffer, verticesStride, indicesStride, y, x, 0);
      this._floorSprite3D.FaceN++;

      // 床の西向きの壁の頂点データ作成
      verticesStride = this._floorSprite3D.FaceN * 4; // 現在の総四角形数 * 4頂点
      indicesStride = this._floorSprite3D.FaceN * 4; // 現在の総四角形数 * 4ポリゴン
      this.setupFloorWestWallVertices(this._floorSprite3D.buffer, verticesStride, indicesStride, y, x, 0);
      this._floorSprite3D.FaceN++;


      /// 天井
      // 天井の頂点データ作成
      verticesStride = this._ceilingSprite3D.FaceN * 4; // 現在の総四角形数 * 4頂点
      indicesStride = this._ceilingSprite3D.FaceN * 4; // 現在の総四角形数 * 4ポリゴン
      this.setupCeilingVertices(this._ceilingSprite3D.buffer, verticesStride, indicesStride, y, x, 0);
      this._ceilingSprite3D.FaceN++;


      // 天井の北向きの壁の頂点データ作成
      verticesStride = this._ceilingSprite3D.FaceN * 4; // 現在の総四角形数 * 4頂点
      indicesStride = this._ceilingSprite3D.FaceN * 4; // 現在の総四角形数 * 4ポリゴン
      this.setupCeilingNorthWallVertices(this._ceilingSprite3D.buffer, verticesStride, indicesStride, y, x, 0);
      this._ceilingSprite3D.FaceN++;

      // 天井の東向きの壁の頂点データ作成
      verticesStride = this._ceilingSprite3D.FaceN * 4; // 現在の総四角形数 * 4頂点
      indicesStride = this._ceilingSprite3D.FaceN * 4; // 現在の総四角形数 * 4ポリゴン
      this.setupCeilingEastWallVertices(this._ceilingSprite3D.buffer, verticesStride, indicesStride, y, x, 0);
      this._ceilingSprite3D.FaceN++;

      // 天井の南向きの壁の頂点データ作成
      verticesStride = this._ceilingSprite3D.FaceN * 4; // 現在の総四角形数 * 4頂点
      indicesStride = this._ceilingSprite3D.FaceN * 4; // 現在の総四角形数 * 4ポリゴン
      this.setupCeilingSouthWallVertices(this._ceilingSprite3D.buffer, verticesStride, indicesStride, y, x, 0);
      this._ceilingSprite3D.FaceN++;

      // 天井の西向きの壁の頂点データ作成
      verticesStride = this._ceilingSprite3D.FaceN * 4; // 現在の総四角形数 * 4頂点
      indicesStride = this._ceilingSprite3D.FaceN * 4; // 現在の総四角形数 * 4ポリゴン
      this.setupCeilingWestWallVertices(this._ceilingSprite3D.buffer, verticesStride, indicesStride, y, x, 0);
      this._ceilingSprite3D.FaceN++;


      // Babylon.jsは左手系なので、z軸を反転する
      for (var j=0; j<this._floorSprite3D.buffer.positions.length; j++) {
        if (j%3 === 2) {
          this._floorSprite3D.buffer.positions[j] *= -1;
          this._floorSprite3D.buffer.normals[j] *= -1;
        }
      }
      for (var j=0; j<this._ceilingSprite3D.buffer.positions.length; j++) {
        if (j%3 === 2) {
          this._ceilingSprite3D.buffer.positions[j] *= -1;
          this._ceilingSprite3D.buffer.normals[j] *= -1;
        }
      }

      // Babylonメッシュの作成
      // マテリアル
      var material:BABYLON.StandardMaterial = new BABYLON.StandardMaterial(mapPlatformTitle + "_map_texture_", scene);
      var color:BABYLON.Color3 = new BABYLON.Color3(1.0, 1.0, 1.0);
      var texture:BABYLON.Texture = new BABYLON.Texture(imageUrl, scene);

      // 床側
      this._floorSprite3D.mesh = new BABYLON.Mesh(mapPlatformTitle + "_" + "floor", scene);
      this._floorSprite3D.mesh.position = new BABYLON.Vector3(this._floorSprite3D.mesh.position.x, floorHeight, this._floorSprite3D.mesh.position.z);
      var updatable = true;
      this._floorSprite3D.mesh.setVerticesData(BABYLON.VertexBuffer.PositionKind, this._floorSprite3D.buffer.positions, updatable);
      this._floorSprite3D.mesh.setVerticesData(BABYLON.VertexBuffer.NormalKind, this._floorSprite3D.buffer.normals, updatable);
      this._floorSprite3D.mesh.setVerticesData(BABYLON.VertexBuffer.UVKind, this._floorSprite3D.buffer.texcoords, updatable);
      this._floorSprite3D.mesh.setIndices(this._floorSprite3D.buffer.indices);

      this._floorSprite3D.mesh.material = material;
      this._floorSprite3D.mesh.material.diffuseColor = color;
      this._floorSprite3D.mesh.material.diffuseTexture = texture;

      // 天井側
      this._ceilingSprite3D.mesh = new BABYLON.Mesh(mapPlatformTitle + "_" + "ceiling", scene);
      this._ceilingSprite3D.mesh.position = new BABYLON.Vector3(this._floorSprite3D.mesh.position.x, ceilingHeight, this._floorSprite3D.mesh.position.z);
      var updatable = true;
      this._ceilingSprite3D.mesh.setVerticesData(BABYLON.VertexBuffer.PositionKind, this._ceilingSprite3D.buffer.positions, updatable);
      this._ceilingSprite3D.mesh.setVerticesData(BABYLON.VertexBuffer.NormalKind, this._ceilingSprite3D.buffer.normals, updatable);
      this._ceilingSprite3D.mesh.setVerticesData(BABYLON.VertexBuffer.UVKind, this._ceilingSprite3D.buffer.texcoords, updatable);
      this._ceilingSprite3D.mesh.setIndices(this._ceilingSprite3D.buffer.indices);

      this._ceilingSprite3D.mesh.material = material;
      this._ceilingSprite3D.mesh.material.diffuseColor = color;
      this._ceilingSprite3D.mesh.material.diffuseTexture = texture;

    }

    // １つ分の床の面の頂点を作成
    private setupFloorVertices (buffer:any, verticesStride:number, indicesStride:number, y:number, x:number, floorHeight:number)
    {

      // 1頂点目
      buffer.positions.push( x-1, floorHeight, y-1 );
      buffer.normals.push(0, 1, 0);
      buffer.texcoords.push(0, 0);

      // 2頂点目
      buffer.positions.push( x-1, floorHeight, y );
      buffer.normals.push(0, 1, 0);
      buffer.texcoords.push(0, 1);

      // 3頂点目
      buffer.positions.push( x, floorHeight, y );
      buffer.normals.push(0, 1, 0);
      buffer.texcoords.push(0.25, 1);

      // 4頂点目
      buffer.positions.push( x, floorHeight, y-1 );
      buffer.normals.push(0, 1, 0);
      buffer.texcoords.push(0.25, 0);

      // 表三角形の１個目
      buffer.indices.push(verticesStride+0, verticesStride+1, verticesStride+2);
      // 表三角形の２個目
      buffer.indices.push(verticesStride+0, verticesStride+2, verticesStride+3);
      // 裏三角形の１個目
      buffer.indices.push(verticesStride+2, verticesStride+1, verticesStride+0);
      // 裏三角形の２個目
      buffer.indices.push(verticesStride+3, verticesStride+2, verticesStride+0);

    }

    // １つ分の床の北の壁の面の頂点を作成
    private setupFloorNorthWallVertices(buffer:any, verticesStride:number, indicesStride:number, y:number, x:number, floorHeight:number)
    {

      // 1頂点目
      buffer.positions.push( x-1, floorHeight, y-1 );
      buffer.normals.push(0, 0, 1);
      buffer.texcoords.push(0.25, 0);

      // 2頂点目
      buffer.positions.push( x-1, this.minFloorHeight, y-1 );
      buffer.normals.push(0, 0, 1);
      buffer.texcoords.push(0.25, this.texcoordOne * (floorHeight - this.minFloorHeight));

      // 3頂点目
      buffer.positions.push( x, this.minFloorHeight, y-1 );
      buffer.normals.push(0, 0, 1);
      buffer.texcoords.push(0.5, this.texcoordOne * (floorHeight - this.minFloorHeight));

      // 4頂点目
      buffer.positions.push( x, floorHeight, y-1 );
      buffer.normals.push(0, 0, 1);
      buffer.texcoords.push(0.5, 0);

      // 表三角形の１個目
      buffer.indices.push(verticesStride+0, verticesStride+1, verticesStride+2);
      // 表三角形の２個目
      buffer.indices.push(verticesStride+0, verticesStride+2, verticesStride+3);
      // 裏三角形の１個目
      buffer.indices.push(verticesStride+2, verticesStride+1, verticesStride+0);
      // 裏三角形の２個目
      buffer.indices.push(verticesStride+3, verticesStride+2, verticesStride+0);

    }

    // １つ分の床の東の壁の面の頂点を作成
    private setupFloorEastWallVertices(buffer:any, verticesStride:number, indicesStride:number, y:number, x:number, floorHeight:number)
    {

      // 1頂点目
      buffer.positions.push( x, floorHeight, y-1 );
      buffer.normals.push(-1, 0, 0);
      buffer.texcoords.push(0.25, 0);

      // 2頂点目
      buffer.positions.push( x, this.minFloorHeight, y-1 );
      buffer.normals.push(-1, 0, 0);
      buffer.texcoords.push(0.25, this.texcoordOne * (floorHeight - this.minFloorHeight));

      // 3頂点目
      buffer.positions.push( x, this.minFloorHeight, y );
      buffer.normals.push(-1, 0, 0);
      buffer.texcoords.push(0.5, this.texcoordOne * (floorHeight - this.minFloorHeight));

      // 4頂点目
      buffer.positions.push( x, floorHeight, y );
      buffer.normals.push(-1, 0, 0);
      buffer.texcoords.push(0.5, 0);

      // 表三角形の１個目
      buffer.indices.push(verticesStride+0, verticesStride+1, verticesStride+2);
      // 表三角形の２個目
      buffer.indices.push(verticesStride+0, verticesStride+2, verticesStride+3);
      // 裏三角形の１個目
      buffer.indices.push(verticesStride+2, verticesStride+1, verticesStride+0);
      // 裏三角形の２個目
      buffer.indices.push(verticesStride+3, verticesStride+2, verticesStride+0);

    }

    // １つ分の床の南の壁の面の頂点を作成
    private setupFloorSouthWallVertices(buffer:any, verticesStride:number, indicesStride:number, y:number, x:number, floorHeight:number)
    {

      // 1頂点目
      buffer.positions.push( x, floorHeight, y );
      buffer.normals.push(0, 0, -1);
      buffer.texcoords.push(0.25, 0);

      // 2頂点目
      buffer.positions.push( x, this.minFloorHeight, y );
      buffer.normals.push(0, 0, -1);
      buffer.texcoords.push(0.25, this.texcoordOne * (floorHeight - this.minFloorHeight));

      // 3頂点目
      buffer.positions.push( x-1, this.minFloorHeight, y );
      buffer.normals.push(0, 0, -1);
      buffer.texcoords.push(0.5, this.texcoordOne * (floorHeight - this.minFloorHeight));

      // 4頂点目
      buffer.positions.push( x-1, floorHeight, y );
      buffer.normals.push(0, 0, -1);
      buffer.texcoords.push(0.5, 0);


      // 表三角形の１個目
      buffer.indices.push(verticesStride+0, verticesStride+1, verticesStride+2);
      // 表三角形の２個目
      buffer.indices.push(verticesStride+0, verticesStride+2, verticesStride+3);
      // 裏三角形の１個目
      buffer.indices.push(verticesStride+2, verticesStride+1, verticesStride+0);
      // 裏三角形の２個目
      buffer.indices.push(verticesStride+3, verticesStride+2, verticesStride+0);

    }

    // １つ分の床の西の壁の面の頂点を作成
    private setupFloorWestWallVertices(buffer:any, verticesStride:number, indicesStride:number, y:number, x:number, floorHeight:number)
    {
      // 1頂点目
      buffer.positions.push( x-1, floorHeight, y );
      buffer.normals.push(1, 0, 0);
      buffer.texcoords.push(0.25, 0);

      // 2頂点目
      buffer.positions.push( x-1, this.minFloorHeight, y );
      buffer.normals.push(1, 0, 0);
      buffer.texcoords.push(0.25, this.texcoordOne * (floorHeight - this.minFloorHeight));

      // 3頂点目
      buffer.positions.push( x-1, this.minFloorHeight, y-1 );
      buffer.normals.push(1, 0, 0);
      buffer.texcoords.push(0.5, this.texcoordOne * (floorHeight - this.minFloorHeight));

      // 4頂点目
      buffer.positions.push( x-1, floorHeight, y-1 );
      buffer.normals.push(1, 0, 0);
      buffer.texcoords.push(0.5, 0);


      // 表三角形の１個目
      buffer.indices.push(verticesStride+0, verticesStride+1, verticesStride+2);
      // 表三角形の２個目
      buffer.indices.push(verticesStride+0, verticesStride+2, verticesStride+3);
      // 裏三角形の１個目
      buffer.indices.push(verticesStride+2, verticesStride+1, verticesStride+0);
      // 裏三角形の２個目
      buffer.indices.push(verticesStride+3, verticesStride+2, verticesStride+0);

    }

    // １つ分の天井の面の頂点を作成
    private setupCeilingVertices(buffer:any, verticesStride:number, indicesStride:number, y:number, x:number, ceilingHeight:number)
    {
      // 1頂点目
      buffer.positions.push( x, ceilingHeight, y-1 );
      buffer.normals.push(0, -1, 0);
      buffer.texcoords.push(0.75, 0);

      // 2頂点目
      buffer.positions.push( x, ceilingHeight, y );
      buffer.normals.push(0, -1, 0);
      buffer.texcoords.push(0.75, 1);

      // 3頂点目
      buffer.positions.push( x-1, ceilingHeight, y );
      buffer.normals.push(0, -1, 0);
      buffer.texcoords.push(0.5, 1);

      // 4頂点目
      buffer.positions.push( x-1, ceilingHeight, y-1 );
      buffer.normals.push(0, -1, 0);
      buffer.texcoords.push(0.5, 0);

      // 表三角形の１個目
      buffer.indices.push(verticesStride+0, verticesStride+1, verticesStride+2);
      // 表三角形の２個目
      buffer.indices.push(verticesStride+0, verticesStride+2, verticesStride+3);
      // 裏三角形の１個目
      buffer.indices.push(verticesStride+2, verticesStride+1, verticesStride+0);
      // 裏三角形の２個目
      buffer.indices.push(verticesStride+3, verticesStride+2, verticesStride+0);

    }

    // １つ分の天井の北の壁の面の頂点を作成
    private setupCeilingNorthWallVertices(buffer:any, verticesStride:number, indicesStride:number, y:number, x:number, ceilingHeight:number)
    {
      // 1頂点目
      buffer.positions.push( x-1, this.maxCeilingHeight, y-1 );
      buffer.normals.push(0, 0, 1);
      buffer.texcoords.push(0.75, 0);

      // 2頂点目
      buffer.positions.push( x-1, ceilingHeight, y-1 );
      buffer.normals.push(0, 0, 1);
      buffer.texcoords.push(0.75, this.texcoordOne * (this.maxCeilingHeight - ceilingHeight));

      // 3頂点目
      buffer.positions.push( x, ceilingHeight, y-1 );
      buffer.normals.push(0, 0, 1);
      buffer.texcoords.push(1, this.texcoordOne * (this.maxCeilingHeight - ceilingHeight));

      // 4頂点目
      buffer.positions.push( x, this.maxCeilingHeight, y-1 );
      buffer.normals.push(0, 0, 1);
      buffer.texcoords.push(1, 0);


      // 表三角形の１個目
      buffer.indices.push(verticesStride+0, verticesStride+1, verticesStride+2);
      // 表三角形の２個目
      buffer.indices.push(verticesStride+0, verticesStride+2, verticesStride+3);
      // 裏三角形の１個目
      buffer.indices.push(verticesStride+2, verticesStride+1, verticesStride+0);
      // 裏三角形の２個目
      buffer.indices.push(verticesStride+3, verticesStride+2, verticesStride+0);

    }

    // １つ分の天井の東の壁の面の頂点を作成
    private setupCeilingEastWallVertices(buffer:any, verticesStride:number, indicesStride:number, y:number, x:number, ceilingHeight:number)
    {
      // 1頂点目
      buffer.positions.push( x, this.maxCeilingHeight, y-1 );
      buffer.normals.push(-1, 0, 0);
      buffer.texcoords.push(0.75, 0);

      // 2頂点目
      buffer.positions.push( x, ceilingHeight, y-1 );
      buffer.normals.push(-1, 0, 0);
      buffer.texcoords.push(0.75, this.texcoordOne * (this.maxCeilingHeight - ceilingHeight));

      // 3頂点目
      buffer.positions.push( x, ceilingHeight, y );
      buffer.normals.push(-1, 0, 0);
      buffer.texcoords.push(1, this.texcoordOne * (this.maxCeilingHeight - ceilingHeight));

      // 4頂点目
      buffer.positions.push( x, this.maxCeilingHeight, y );
      buffer.normals.push(-1, 0, 0);
      buffer.texcoords.push(1, 0);


      // 表三角形の１個目
      buffer.indices.push(verticesStride+0, verticesStride+1, verticesStride+2);
      // 表三角形の２個目
      buffer.indices.push(verticesStride+0, verticesStride+2, verticesStride+3);
      // 裏三角形の１個目
      buffer.indices.push(verticesStride+2, verticesStride+1, verticesStride+0);
      // 裏三角形の２個目
      buffer.indices.push(verticesStride+3, verticesStride+2, verticesStride+0);

    }

    // １つ分の天井の南の壁の面の頂点を作成
    private setupCeilingSouthWallVertices(buffer:any, verticesStride:number, indicesStride:number, y:number, x:number, ceilingHeight:number)
    {
      // 1頂点目
      buffer.positions.push( x, this.maxCeilingHeight, y );
      buffer.normals.push(0, 0, -1);
      buffer.texcoords.push(0.75, 0);

      // 2頂点目
      buffer.positions.push( x, ceilingHeight, y );
      buffer.normals.push(0, 0, -1);
      buffer.texcoords.push(0.75, this.texcoordOne * (this.maxCeilingHeight - ceilingHeight));

      // 3頂点目
      buffer.positions.push( x-1, ceilingHeight, y );
      buffer.normals.push(0, 0, -1);
      buffer.texcoords.push(1, this.texcoordOne * (this.maxCeilingHeight - ceilingHeight));

      // 4頂点目
      buffer.positions.push( x-1, this.maxCeilingHeight, y );
      buffer.normals.push(0, 0, -1);
      buffer.texcoords.push(1, 0);


      // 表三角形の１個目
      buffer.indices.push(verticesStride+0, verticesStride+1, verticesStride+2);
      // 表三角形の２個目
      buffer.indices.push(verticesStride+0, verticesStride+2, verticesStride+3);
      // 裏三角形の１個目
      buffer.indices.push(verticesStride+2, verticesStride+1, verticesStride+0);
      // 裏三角形の２個目
      buffer.indices.push(verticesStride+3, verticesStride+2, verticesStride+0);

    }

    // １つ分の天井の西の壁の面の頂点を作成
    private setupCeilingWestWallVertices(buffer:any, verticesStride:number, indicesStride:number, y:number, x:number, ceilingHeight:number)
    {
      // 1頂点目
      buffer.positions.push( x-1, this.maxCeilingHeight, y );
      buffer.normals.push(1, 0, 0);
      buffer.texcoords.push(0.75, 0);

      // 2頂点目
      buffer.positions.push( x-1, ceilingHeight, y );
      buffer.normals.push(1, 0, 0);
      buffer.texcoords.push(0.75, this.texcoordOne * (this.maxCeilingHeight - ceilingHeight));

      // 3頂点目
      buffer.positions.push( x-1, ceilingHeight, y-1 );
      buffer.normals.push(1, 0, 0);
      buffer.texcoords.push(1, this.texcoordOne * (this.maxCeilingHeight - ceilingHeight));

      // 4頂点目
      buffer.positions.push( x-1, this.maxCeilingHeight, y-1 );
      buffer.normals.push(1, 0, 0);
      buffer.texcoords.push(1, 0);


      // 表三角形の１個目
      buffer.indices.push(verticesStride+0, verticesStride+1, verticesStride+2);
      // 表三角形の２個目
      buffer.indices.push(verticesStride+0, verticesStride+2, verticesStride+3);
      // 裏三角形の１個目
      buffer.indices.push(verticesStride+2, verticesStride+1, verticesStride+0);
      // 裏三角形の２個目
      buffer.indices.push(verticesStride+3, verticesStride+2, verticesStride+0);

    }

  }
}
