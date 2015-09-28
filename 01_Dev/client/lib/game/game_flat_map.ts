/// <reference path="game__map.ts"/>

module WrtGame {
  eval('WrtGame = _.isUndefined(window.WrtGame) ? WrtGame : window.WrtGame;'); // 内部モジュールを複数ファイルで共有するためのハック
  export class FlatMap extends Map {
    private textureImageUrls:any;
    private chipMeshExArray:Array<any> = [];
    private minFloorHeight:number = -10; // 床の最低の低さ
    private maxCeilingHeight:number = 10; // 天井の最高の高さ
    private texcoordOne:number = 1; // Y方向の壁テクスチャの高さ

    private _platforms:Array<MapPlatform> = new Array();

    constructor(private _scene:BABYLON.Scene, map:any, textures:any) {
      super(true);
      this.map = map;
      this.setupMesh(this.heightMapData, this.width, this.height, textures);
    }

    public setupMesh(heightMapData:any, mapWidth:number, mapHeight:number, imageUrls:any):void {
//      this.mapObject3D = tm.three.Element();
      this.textureImageUrls = imageUrls;
//      this.chipMeshExArray.push(null); // 0番目はnullをいれておく。
      var texMapData = this._texMapData;
      var typeMapData = this._typeMapData;
      var heightMapData = this._heightMapData;

      for (var i = 0; i < this.textureImageUrls.length; i++) { //マテリアルごとに処理
        var ii = i+1; // texMapData配列の中のテキスチャIDは1起算なので、それに合わせる
        var sprite:any = {};
        sprite.textureName = this.textureImageUrls[i].gametex_url;
        sprite.buffer = {positions:[], normals:[], texcoords:[], indices:[]};
        sprite.FaceN = 0;

        this.chipMeshExArray.push(sprite);
//        this.setTextureToSprite3D(sprite, sprite.textureName);

        for (var y = 0; y < mapHeight + 2; y++) {
          for (var x = 0; x < mapWidth + 2; x++) {
            if (!doesThisTypeExist(typeMapData[y][x], 'P') && texMapData[y][x] === ii) { //

              /// 床
              // 床の頂点データ作成
              var verticesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4頂点
              var indicesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4ポリゴン
              this.setupFloorVertices(this.chipMeshExArray[i].buffer, verticesStride, indicesStride, y, x, heightMapData[y][x][0]);
              this.chipMeshExArray[i].FaceN++; //このマテリアルの面数をカウントする

              // 床の北向きの壁の頂点データ作成
              var verticesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4頂点
              var indicesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4ポリゴン
              this.setupFloorNorthWallVertices(this.chipMeshExArray[i].buffer, verticesStride, indicesStride, y, x, heightMapData[y][x][0]);
              this.chipMeshExArray[i].FaceN++; //このマテリアルの面数をカウントする

              // 床の東向きの壁の頂点データ作成
              var verticesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4頂点
              var indicesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4ポリゴン
              this.setupFloorEastWallVertices(this.chipMeshExArray[i].buffer, verticesStride, indicesStride, y, x, heightMapData[y][x][0]);
              this.chipMeshExArray[i].FaceN++; //このマテリアルの面数をカウントする

              // 床の南向きの壁の頂点データ作成
              var verticesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4頂点
              var indicesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4ポリゴン
              this.setupFloorSouthWallVertices(this.chipMeshExArray[i].buffer, verticesStride, indicesStride, y, x, heightMapData[y][x][0]);
              this.chipMeshExArray[i].FaceN++; //このマテリアルの面数をカウントする

              // 床の西向きの壁の頂点データ作成
              var verticesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4頂点
              var indicesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4ポリゴン
              this.setupFloorWestWallVertices(this.chipMeshExArray[i].buffer, verticesStride, indicesStride, y, x, heightMapData[y][x][0]);
              this.chipMeshExArray[i].FaceN++; //このマテリアルの面数をカウントする


              /// 天井
              // 天井の頂点データ作成
              var verticesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4頂点
              var indicesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4ポリゴン
              this.setupCeilingVertices(this.chipMeshExArray[i].buffer, verticesStride, indicesStride, y, x, heightMapData[y][x][1]);
              this.chipMeshExArray[i].FaceN++; //このマテリアルの面数をカウントする

              // 天井の北向きの壁の頂点データ作成
              var verticesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4頂点
              var indicesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4ポリゴン
              this.setupCeilingNorthWallVertices(this.chipMeshExArray[i].buffer, verticesStride, indicesStride, y, x, heightMapData[y][x][1]);
              this.chipMeshExArray[i].FaceN++; //このマテリアルの面数をカウントする

              // 天井の東向きの壁の頂点データ作成
              var verticesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4頂点
              var indicesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4ポリゴン
              this.setupCeilingEastWallVertices(this.chipMeshExArray[i].buffer, verticesStride, indicesStride, y, x, heightMapData[y][x][1]);
              this.chipMeshExArray[i].FaceN++; //このマテリアルの面数をカウントする

              // 天井の南向きの壁の頂点データ作成
              var verticesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4頂点
              var indicesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4ポリゴン
              this.setupCeilingSouthWallVertices(this.chipMeshExArray[i].buffer, verticesStride, indicesStride, y, x, heightMapData[y][x][1]);
              this.chipMeshExArray[i].FaceN++; //このマテリアルの面数をカウントする

              // 天井の西向きの壁の頂点データ作成
              var verticesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4頂点
              var indicesStride = this.chipMeshExArray[i].FaceN * 4; // 現在の総四角形数 * 4ポリゴン
              this.setupCeilingWestWallVertices(this.chipMeshExArray[i].buffer, verticesStride, indicesStride, y, x, heightMapData[y][x][1]);
              this.chipMeshExArray[i].FaceN++; //このマテリアルの面数をカウントする

            }

            if(doesThisTypeExist(typeMapData[y][x], 'P')) {
              var platform = new MapFlatPlatform(x, y, heightMapData, getTypeParameter(typeMapData[y][x], 'P'));
              platform.setupMesh(this._scene, this._map.title + "_platform["+x+"]["+y+"]", heightMapData[y][x][0], heightMapData[y][x][1], this.textureImageUrls[texMapData[y][x]-1].gametex_url);
              this._platforms.push(platform);
            }
          }
        }

        // Babylon.jsは左手系なので、z軸を反転する
        for (var j=0; j<sprite.buffer.positions.length; j++) {
          if (j%3 === 2) {
            sprite.buffer.positions[j] *= -1;
            sprite.buffer.normals[j] *= -1;
          }
        }

        if (this.chipMeshExArray[i].FaceN > 0) {
          sprite.mesh = new BABYLON.Mesh(this._map.title + "_" + i, this._scene);
          var updatable = true;
          sprite.mesh.setVerticesData(BABYLON.VertexBuffer.PositionKind, sprite.buffer.positions, updatable);
          sprite.mesh.setVerticesData(BABYLON.VertexBuffer.NormalKind, sprite.buffer.normals, updatable);
          sprite.mesh.setVerticesData(BABYLON.VertexBuffer.UVKind, sprite.buffer.texcoords, updatable);
          sprite.mesh.setIndices(sprite.buffer.indices);

          sprite.mesh.material = new BABYLON.StandardMaterial("map_texture_" + i, this._scene);
          sprite.mesh.material.diffuseColor = new BABYLON.Color3(1.0, 1.0, 1.0);
          sprite.mesh.material.diffuseTexture = new BABYLON.Texture(sprite.textureName, this._scene);
        } else {
          sprite.mesh = null;
        }
      }
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

