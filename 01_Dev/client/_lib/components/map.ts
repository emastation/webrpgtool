declare var tm:any;
declare var _:any;

class MapManager {
  private mapSprite:any = null;
  constructor() {
    this.init();
  }

  private init() {
    var that = this;
    tm.define('MapScene', {
      superClass: tm.app.Scene,

      init: function () {
        this.superInit();
        this.load('001');
      },

      load: function (name) {
        if (!_.isNull(that.mapSprite)) {
            that.mapSprite.remove();
        }
        that.mapSprite = tm.display.MapSprite("map." + name,64,64).addChildTo(this);
          
        /*
        # マップCanvasの幅と高さを更新
        mapdata = that.get('MAP_DATA')
        width = mapdata[that.mapName].width
        height = mapdata[that.mapName].height
        Tool.app.resize(64*width, 64*height)
        */
      }
    });
  }

  public getMapData(model:any):any {
    var mapName = 'map.001'

    var mapdata = this.getMapBaseData();

    mapdata[mapName].width = model.width;
    mapdata[mapName].height = model.height;
    var type_map = model.type_array;

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
        
        var offset = 5;
        mapdata[mapName].layers[0].data[x+mapdata[mapName].width*y] = texId - 1; // テクスチャ設定
        mapdata[mapName].layers[1].data[x+mapdata[mapName].width*y] = offset + typeId; // タイルタイプチップ設定

      }
    }
    var height_map = model.height_array;
    var splitted_with_n2 = height_map.split("\n"); // マップ文字列を行ごとに区切る
    for (var i_ = 0; i_ < splitted_with_n2.length-1; i_++) { // 行ごとの処理。データの最後で改行しているため、データの行数より１個改行が多いので、lengthに-1している。
      var splitted_with_comma2 = splitted_with_n2[i_].split(","); //カンマで区切り、各列の値を配列に
      for (var j_ = 0; j_ < splitted_with_comma2.length; j_++) {
        var yy = i_;
        var xx = j_;
        var splitted_with_space2 = splitted_with_comma2[j_].split(" "); // タイルのデータをスプリットする。例えば"10 Dh5% Dk"だったら、"10","Dh5%","Dk"の配列にする
        var floorHeight = parseInt(splitted_with_space2[0], 10); // 床の高さを取得する "1 10"だったら、1を数値として保存
        var ceilingHeight = parseInt(splitted_with_space2[1], 10); // 天井の高さを取得する。 "1 10"だったら、10を数値として保存

        var offset2 = 5 + 4;
        mapdata[mapName].layers[2].data[xx+mapdata[mapName].width*yy] = offset2 + floorHeight + 10; // 床の高さ設定
        //offset2 = 5 + 4 + 21
        mapdata[mapName].layers[3].data[xx+mapdata[mapName].width*yy] = offset2 + ceilingHeight + 10; // 天井の高さ設定
      }
    }
    return mapdata;
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
            image: 'http://www.emastation.net/uploadspace/WebRPGTool/material/tileImage/toolTile/output_tile.jpg'
          },
          {
            // 32x32 のタイル（マップチップ）を並べた画像（幅と段数は自由）
            name: 'typeTile',
            image: 'http://www.emastation.net/uploadspace/WebRPGTool/material/typeTypeImage/output_tile.png'
          },
          {
            // 32x32 のタイル（マップチップ）を並べた画像（幅と段数は自由）
            name: 'heightTile',
            image: 'http://www.emastation.net/uploadspace/WebRPGTool/material/tileHeightImage/tileHeightImage.png'
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
            visible: false,
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
            //visible: false,
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
