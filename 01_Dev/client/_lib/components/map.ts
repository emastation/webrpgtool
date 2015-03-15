declare var WRT:any;
declare var tm:any;
declare var _:any;

enum MapLayer {
  TEXTURE = 0,
  TILE_TYPE = 1,
  FLOOR_HEIGHT = 2,
  CEILING_HEIGHT = 3
}

class MapManager {
  private mapSprite:any = null;
  private initialTypes:string = '1 N'; // マップのサイズを増やす時に増えたタイプタイルに設定するタイプタイル文字列
  private initialHeights:string = '0 1'; // マップのサイズを増やす時に増えたタイルに設定するタイル文字列
  private minMapWidth = 1;
  private maxMapWidth = 100;
  private minMapHeight = 1;
  private maxMapHeight = 100;
  private textureTileUrl = 'http://www.emastation.net/uploadspace/WebRPGTool/material/tileImage/toolTile/output_tile.jpg';
  private typeTileUrl = 'http://www.emastation.net/uploadspace/WebRPGTool/material/typeTypeImage/output_tile.png';
  static heightTileUrl = 'http://www.emastation.net/uploadspace/WebRPGTool/material/tileHeightImage/tileHeightImage.png';
  private chipSize = 64;
  private mapName = 'map.001';
  static heightLevels = [-10,-9,-8,-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7,8,9,10];
  private currentMode = MapLayer.TEXTURE;
  private currentTileIndex = 0; // tmlib Mapのインデックス（０起算）

  constructor(private map:any) {
    this.init();
  }

  private init() {
    var that = this;
    tm.define('MapScene', {
      superClass: tm.app.Scene,

      init: function () {
        this.superInit();
        var tm_this = this;
        var canvasDom = tm.dom.Element("#world");
        canvasDom.event.pointstart( (e:any) => {
          var cellX = Math.floor(e.pointX/that.chipSize);
          var cellY = Math.floor(e.pointY/that.chipSize);

          var mapData = that.getMapFullData();

          var layerId:MapLayer = null;
          switch (that.currentMode) {
            case MapLayer.TEXTURE:
              layerId = MapLayer.TEXTURE;
              break;

            case MapLayer.TILE_TYPE:
              layerId = MapLayer.TILE_TYPE;
              break;

            case MapLayer.FLOOR_HEIGHT:
              layerId = MapLayer.FLOOR_HEIGHT;
              break;

            case MapLayer.CEILING_HEIGHT:
              layerId = MapLayer.CEILING_HEIGHT;
              break;
          }
          mapData[that.mapName].layers[layerId].data[cellX+mapData[that.mapName].width*cellY] = that.currentTileIndex;
          that.switchMapLayer(layerId, mapData);
        });

        var mapData = that.getMapFullData();
        this.load('001', mapData);
      },

      load: function (name, mapData) {
        if (!_.isNull(that.mapSprite)) {
            that.mapSprite.remove();
        }

        for(var key in mapData) {
          tm.asset.Manager.set(key, tm.asset.MapSheet(mapData[key]));
        }

        that.mapSprite = tm.display.MapSprite("map." + name, that.chipSize, that.chipSize).addChildTo(this);
      }
    });
  }
  public getMapWidth():number {
    return this.map.width;
  }

  public setMapWidth(value:number) {
    var newWidth = 0;
    if (value < this.minMapWidth) {
      newWidth = this.minMapWidth;
    } else if (value > this.maxMapWidth) {
      newWidth = this.maxMapWidth;
    } else {
      newWidth = value;
    }

    var curWidth = this.getMapWidth();
    var delta = newWidth - curWidth;
    
    if (delta === 0) {
      return
    }

    // テクスチャとタイルタイプの増減
    if (delta > 0) { // 横幅が増えた場合
      var map_data_str = this.map.type_array;
      var addStr = "";
      for (var i=0; i<delta; i++) {
        addStr += ","; // カンマを付加する。
        addStr += this.initialTypes; // 初期値を文字列として加える
      }
      addStr += '\n';
      map_data_str = map_data_str.replace(/\n/g, addStr); // 現状のマップ文字列の各改行（つまり、各行の一番後ろ）をaddStr文字列に置き換える
    }
    else // 横幅が減った場合
    {
      delta *= -1 // 正の数にする
      map_data_str = this.map.type_array
      for (var i=0; i<delta; i++) {
        var re = new RegExp(",[^,]+\n", 'g'); // 一つ分の ,0 dz(改行) などにマッチして、
        map_data_str = map_data_str.replace(re, '\n'); // それを改行で置き換える
      }
    }
    // タイプアレイにデータ保存
    this.map.type_array = map_data_str;
        
    delta = newWidth - curWidth;
    // 高さタイルの増減
    if (delta > 0) // 横幅が増えた場合
    {  
      map_data_str = this.map.height_array;
      addStr = ""
      for (var i=0; i<delta; i++) {
        addStr += ","; //カンマを付加する。
        addStr += this.initialHeights; // 初期値を文字列として加える
      }
      addStr += '\n';
      map_data_str = map_data_str.replace(/\n/g, addStr) // 現状のマップ文字列の各改行（つまり、各行の一番後ろ）をaddStr文字列に置き換える
    }
    else // 横幅が減った場合
    {
      delta *= -1 // 正の数にする
      map_data_str = this.map.height_array
      for (var i=0; i<delta; i++) {
        var re = new RegExp(",[^,]+\n", 'g') // 一つ分の ,0 dz(改行) などにマッチして、
        map_data_str = map_data_str.replace(re, '\n') // それを改行で置き換える
      }
    }
    // 高さアレイにデータ保存
    this.map.height_array = map_data_str;
        
    this.map.width = newWidth;
        
    this.reloadMap();

  }

  public getMapHeight():any {
    return this.map.height;
  }

  public setMapHeight(value:number) {
    var newHeight = 0;
    if (value < this.minMapHeight) {
      newHeight = this.minMapHeight;
    } else if (value > this.maxMapHeight) {
      newHeight = this.maxMapHeight;
    } else {
      newHeight = value;      
    }
    var curHeight = this.getMapHeight();
    var width = this.getMapWidth();
    var delta = newHeight - curHeight;
    
    if (delta === 0) { // 高さに変更がなかったら、何もしない
      return
    }

    // テクスチャとタイルタイプの増減
    if (delta > 0) // 縦幅が増えた場合
    {
      var map_data_str = this.map.type_array;
      var row = ""
      for (var i=0; i<delta; i++) {
        for (var j=0; j<width; j++) {
          if (j != 0) { // 1列目以外の列で
            row += ","; // 値の前にカンマを加える
          }
          row += this.initialTypes;
        }
        row += '\n'
      }
      map_data_str += row;
    }
    else //縦幅が減った場合
    {
      var map_data_str = this.map.type_array;
      var splitted_with_n = map_data_str.split("\n") // マップ文字列を行ごとに区切る
      var index = 0
      for (var i=0; i<newHeight; i++) {
        index += splitted_with_n[i].length + 1; // height-1行までの各行の文字数と改行をindexに加算する
      }
      map_data_str = map_data_str.substr(0, index);
    }
    
    // タイプアレイにデータ保存
    this.map.type_array = map_data_str;
    
    delta = newHeight - curHeight;
    // 高さタイルの増減
    if (delta > 0) // 縦幅が増えた場合
    {
      map_data_str = this.map.height_array;
      row = "";
      for (var i=0; i<delta; i++) {
        for (var j=0; j<width; j++) {
          if (j != 0) {// 1列目以外の列で
            row += ","; // 値の前にカンマを加える
          }
          row += this.initialHeights;
        }
        row += '\n';
      }
      map_data_str += row;
    }
    else // 縦幅が減った場合
    {
      map_data_str = this.map.height_array;
      splitted_with_n = map_data_str.split("\n") // マップ文字列を行ごとに区切る
      index = 0
      for (var i=0; i<newHeight; i++) {
        index += splitted_with_n[i].length + 1; // height-1行までの各行の文字数と改行をindexに加算する
      }
      map_data_str = map_data_str.substr(0, index);
    }
    // 高さアレイにデータ保存
    this.map.height_array = map_data_str;
    
    this.map.height = newHeight;
    
    this.reloadMap();
  }

  public reloadMap() {
    var mapData = this.getMapFullData();
    WRT.map.app.currentScene.load('001', mapData);
  }

  public getMap():any {
    return this.map; 
  }
  public setMap(map:any) {
    this.map = map; 
  }

  private getMapFullData():any {
    var mapName = this.mapName;

    var mapdata = this.getMapBaseData();

    mapdata[mapName].width = this.map.width;
    mapdata[mapName].height = this.map.height;
    var type_map = this.map.type_array;

    var splitted_with_n = type_map.split("\n"); //マップ文字列を行ごとに区切る
    //console.log(splitted_with_n);

    for (var i=0; i<splitted_with_n.length-1; i++) { //行ごとの処理。データの最後で改行しているため、データの行数より１個改行が多いので、lengthに-1している。
      var splitted_with_comma = splitted_with_n[i].split(",") // カンマで区切り、各列の値を配列に
      for (var j=0; j<splitted_with_comma.length; j++) {
        var y = i;
        var x = j;
        var splitted_with_space = splitted_with_comma[j].split(" "); // タイルのデータをスプリットする。例えば"10 Dh5% Dk"だったら、"10","Dh5%","Dk"の配列にする
        var texId = parseInt(splitted_with_space[0], 10); // テクスチャIDを記憶する。 "10","Dh5%","Dk"だったら、10を数値として保存
        var typeStr = splitted_with_comma[j].substr(splitted_with_space[0].length + 1); // タイルタイプ文字列を取得する。 "10 Dh5% Dk"だったら、"Dh5% Dk"を保存
        var firstTypeStr = typeStr.split(" ")[0]; // 最初のタイルタイプ文字列を取得する。 "Dh5% Dk" だったら "Dh5%"を保存
        var typeId = 0;
        
        if (/^N/.test(firstTypeStr)) { typeId = 0; }
        else if (/^W/.test(firstTypeStr)) { typeId = 1; }
        else if (/^Dk/.test(firstTypeStr)) { typeId = 2; }
        else if (/^P/.test(firstTypeStr)) { typeId = 3; }
        else { typeId = 0; }
        
        mapdata[mapName].layers[0].data[x+mapdata[mapName].width*y] = texId - 1; // テクスチャ設定
        mapdata[mapName].layers[1].data[x+mapdata[mapName].width*y] = typeId; // タイルタイプチップ設定

      }
    }
    var height_map = this.map.height_array;
    var splitted_with_n2 = height_map.split("\n"); // マップ文字列を行ごとに区切る
    for (var i_ = 0; i_ < splitted_with_n2.length-1; i_++) { // 行ごとの処理。データの最後で改行しているため、データの行数より１個改行が多いので、lengthに-1している。
      var splitted_with_comma2 = splitted_with_n2[i_].split(","); //カンマで区切り、各列の値を配列に
      for (var j_ = 0; j_ < splitted_with_comma2.length; j_++) {
        var yy = i_;
        var xx = j_;
        var splitted_with_space2 = splitted_with_comma2[j_].split(" "); // タイルのデータをスプリットする。例えば"10 Dh5% Dk"だったら、"10","Dh5%","Dk"の配列にする
        var floorHeight = parseInt(splitted_with_space2[0], 10); // 床の高さを取得する "1 10"だったら、1を数値として保存
        var ceilingHeight = parseInt(splitted_with_space2[1], 10); // 天井の高さを取得する。 "1 10"だったら、10を数値として保存

        mapdata[mapName].layers[2].data[xx+mapdata[mapName].width*yy] = floorHeight + 10; // 床の高さ設定
        mapdata[mapName].layers[3].data[xx+mapdata[mapName].width*yy] = ceilingHeight + 10; // 天井の高さ設定
      }
    }
    return mapdata;
  }

  public switchMapLayer(mode:MapLayer, mapData:any = null) {

    if (mapData == null) {
      mapData = this.getMapFullData();
    }
    var mapName = this.mapName;

    switch (mode) {
      case MapLayer.TEXTURE:
        this.currentMode = MapLayer.TEXTURE;
        break;

      case MapLayer.TILE_TYPE:
        delete mapData[mapName].layers[1].visible;
        mapData[mapName].layers[2].visible = false;
        mapData[mapName].layers[3].visible = false;
        this.currentMode = MapLayer.TILE_TYPE;
        break;

      case MapLayer.FLOOR_HEIGHT:
        mapData[mapName].layers[1].visible = false;
        delete mapData[mapName].layers[2].visible;
        mapData[mapName].layers[3].visible = false;
        this.currentMode = MapLayer.FLOOR_HEIGHT;
        break;

      case MapLayer.CEILING_HEIGHT:
        mapData[mapName].layers[1].visible = false;
        mapData[mapName].layers[2].visible = false;
        delete mapData[mapName].layers[3].visible;
        this.currentMode = MapLayer.CEILING_HEIGHT;
        break;
    }


    WRT.map.app.currentScene.load('001', mapData);

  }

  public setCurrentTileIndex(index:number) {
    this.currentTileIndex = index;
  }

  static getHeightCssOffsetStrArray():any {
    var heightIndexArray = _.map(MapManager.heightLevels, function(num) {
      return num + 10;
    });

    var that = this;
    return _.map(heightIndexArray, function(index) {
      return {
        hid: index,
        offset: 'background-image: url(' + that.heightTileUrl + ' ); background-position: -' + index*32 + 'px 0px;'
      };
    });
  }

  private getMapBaseData():any {
    return {
      'map.001': {
        name: '001',

        // マップのサイズ
        width: 10,
        height: 10,

        // タイルのサイズ
        tilewidth: 64,
        tileheight: 64,

        // タイルセット
        tilesets: [
          {
            // 32x32 のタイル（マップチップ）を並べた画像（幅と段数は自由）
            name: 'textureTile',
            image: this.textureTileUrl
          },
          {
            // 32x32 のタイル（マップチップ）を並べた画像（幅と段数は自由）
            name: 'typeTile',
            image: this.typeTileUrl
          },
          {
            // 32x32 のタイル（マップチップ）を並べた画像（幅と段数は自由）
            name: 'heightTile',
            image: MapManager.heightTileUrl
          }
        ],

        // マップレイヤー
        layers: [
          {
            type: 'layer',
            name: 'layer1',
            tilesets: 'textureTile',
            // 実際のデータ（数値配列）
            // 数値は、タイルセットのインデックス（何番目のマップチップを表示するか）
            // マップサイズの幅と高さを掛けた分を用意する
            data: []
          },
          {
            type: 'layer',
            name: 'layer2',
            tilesets: 'typeTile',
            // 実際のデータ（数値配列）
            // 数値は、タイルセットのインデックス（何番目のマップチップを表示するか）
            // マップサイズの幅と高さを掛けた分を用意する
            data: []
          },
          {
            type: 'layer',
            name: 'layer3',
            tilesets: 'heightTile',
            visible: false,
            // 実際のデータ（数値配列）
            // 数値は、タイルセットのインデックス（何番目のマップチップを表示するか）
            // マップサイズの幅と高さを掛けた分を用意する
            data: []
          },
          {
            type: 'layer',
            name: 'layer4',
            tilesets: 'heightTile',
            visible: false,
            // 実際のデータ（数値配列）
            // 数値は、タイルセットのインデックス（何番目のマップチップを表示するか）
            // マップサイズの幅と高さを掛けた分を用意する
            data: []
          }
        ]
      }
    };
  }
}

interface Window {
  MapManager: any;
}


window.MapManager = MapManager;
