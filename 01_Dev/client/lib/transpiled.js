/// <reference path="../../typings/browser.d.ts" />
var MapLayer;
(function (MapLayer) {
    MapLayer[MapLayer["TEXTURE"] = 0] = "TEXTURE";
    MapLayer[MapLayer["TILE_TYPE"] = 1] = "TILE_TYPE";
    MapLayer[MapLayer["FLOOR_HEIGHT"] = 2] = "FLOOR_HEIGHT";
    MapLayer[MapLayer["CEILING_HEIGHT"] = 3] = "CEILING_HEIGHT";
    MapLayer[MapLayer["SCRIPT"] = 4] = "SCRIPT";
})(MapLayer || (MapLayer = {}));
var MapManager = (function () {
    function MapManager(map) {
        this.map = null;
        this.mapSprite = null;
        this.initialTypes = '1 N'; // マップのサイズを増やす時に増えたタイプタイルに設定するタイプタイル文字列
        this.initialHeights = '0 1'; // マップのサイズを増やす時に増えたタイルに設定する高さタイル文字列
        this.initialScript = '0'; // マップのサイズを増やす時に増えたタイルに設定するスクリプトタイル文字列
        this.minMapWidth = 1;
        this.maxMapWidth = 100;
        this.minMapHeight = 1;
        this.maxMapHeight = 100;
        this.textureTileUrl = 'https://www.emastation.com/wrt/material/tileImage/toolTile/output_tile.jpg';
        this.typeTileUrl = '/material/typeTypeImage/output_tile.png';
        this.chipSize = 64;
        this.mapName = 'map.001';
        this.currentMode = MapLayer.TEXTURE;
        this.currentTileIndex = 0; // tmlib Mapのインデックス（０起算）
        this.currentTileScriptName = '0'; // '0'はスクリプトが設定されていないという意味
        this.currentPlatformParameter = ""; // タイルタイプにプラットフォームを選択した場合に使われる文字列
        this.callback = null;
        this.map = _.clone(map);
        this.init();
    }
    MapManager.prototype.init = function () {
        var that = this;
        tm.define('MapScene', {
            superClass: tm.app.Scene,
            init: function () {
                var _this = this;
                var this_ = this;
                this_.superInit();
                var tm_this = this;
                var mapData = that.getMapFullData();
                this.load('001', mapData);
                // 以下、マウスによるペイント操作のハンドル処理
                var canvasDom = tm.dom.Element("#world");
                this.mouseDown = false;
                var paintFunc = function (e) {
                    if (!_this.mouseDown) {
                        return;
                    }
                    var cellX = Math.floor(e.pointX / that.chipSize);
                    var cellY = Math.floor(e.pointY / that.chipSize);
                    var mapData = that.getMapFullData();
                    var layerId = null;
                    var cellStr = null;
                    var mapWidth = mapData[that.mapName].width;
                    switch (that.currentMode) {
                        case MapLayer.TEXTURE:
                            layerId = MapLayer.TEXTURE;
                            mapData[that.mapName].layers[layerId].data[cellX + mapWidth * cellY] = that.currentTileIndex;
                            cellStr = that.makeCellStrOfTypeArray(cellX, cellY, mapData, false);
                            that.modifyMap(cellX, cellY, cellStr, 'type');
                            break;
                        case MapLayer.TILE_TYPE:
                            layerId = MapLayer.TILE_TYPE;
                            mapData[that.mapName].layers[layerId].data[cellX + mapWidth * cellY] = that.currentTileIndex;
                            cellStr = that.makeCellStrOfTypeArray(cellX, cellY, mapData, true);
                            that.modifyMap(cellX, cellY, cellStr, 'type');
                            break;
                        case MapLayer.FLOOR_HEIGHT:
                            layerId = MapLayer.FLOOR_HEIGHT;
                            mapData[that.mapName].layers[layerId].data[cellX + mapWidth * cellY] = that.currentTileIndex;
                            cellStr = that.makeCellStrOfHeightArray(cellX, cellY, mapData);
                            that.modifyMap(cellX, cellY, cellStr, 'height');
                            break;
                        case MapLayer.CEILING_HEIGHT:
                            layerId = MapLayer.CEILING_HEIGHT;
                            mapData[that.mapName].layers[layerId].data[cellX + mapWidth * cellY] = that.currentTileIndex;
                            cellStr = that.makeCellStrOfHeightArray(cellX, cellY, mapData);
                            that.modifyMap(cellX, cellY, cellStr, 'height');
                            break;
                        case MapLayer.SCRIPT:
                            layerId = MapLayer.SCRIPT;
                            if (that.currentTileIndex !== 0 && that.currentTileScriptName === '0') {
                                return;
                            }
                            mapData[that.mapName].layers[layerId].data[cellX + mapWidth * cellY] = that.currentTileIndex;
                            cellStr = that.currentTileScriptName;
                            that.modifyMap(cellX, cellY, cellStr, 'script');
                            break;
                    }
                    that.switchMapLayer(layerId, mapData); // マップをリロード
                    $("input#reloadData").click();
                };
                var mouseDownFunc = function (e) {
                    _this.mouseDown = true;
                    paintFunc(e);
                };
                var mouseReleaseFunc = function (e) {
                    _this.mouseDown = false;
                };
                canvasDom.event.pointstart(mouseDownFunc);
                canvasDom.event.pointmove(paintFunc);
                canvasDom.event.pointend(mouseReleaseFunc);
            },
            load: function (name, mapData) {
                if (!_.isNull(that.mapSprite)) {
                    that.mapSprite.remove();
                }
                for (var key in mapData) {
                    tm.asset.Manager.set(key, tm.asset.MapSheet(mapData[key]));
                }
                that.mapSprite = tm.display.MapSprite("map." + name, that.chipSize, that.chipSize).addChildTo(this);
            }
        });
    };
    MapManager.prototype.getMapWidth = function () {
        return this.map.width;
    };
    MapManager.prototype.setMapWidth = function (value) {
        var newWidth = 0;
        if (value < this.minMapWidth) {
            newWidth = this.minMapWidth;
        }
        else if (value > this.maxMapWidth) {
            newWidth = this.maxMapWidth;
        }
        else {
            newWidth = value;
        }
        var curWidth = this.getMapWidth();
        var delta = newWidth - curWidth;
        if (delta === 0) {
            return;
        }
        // テクスチャとタイルタイプの増減
        if (delta > 0) {
            var map_data_str = this.map.type_array;
            var addStr = "";
            for (var i = 0; i < delta; i++) {
                addStr += ","; // カンマを付加する。
                addStr += this.initialTypes; // 初期値を文字列として加える
            }
            addStr += '\n';
            map_data_str = map_data_str.replace(/\n/g, addStr); // 現状のマップ文字列の各改行（つまり、各行の一番後ろ）をaddStr文字列に置き換える
        }
        else {
            delta *= -1; // 正の数にする
            map_data_str = this.map.type_array;
            for (var i = 0; i < delta; i++) {
                var re = new RegExp(",[^,]+\n", 'g'); // 一つ分の ,0 dz(改行) などにマッチして、
                map_data_str = map_data_str.replace(re, '\n'); // それを改行で置き換える
            }
        }
        // タイプアレイにデータ保存
        this.map.type_array = map_data_str;
        // 高さタイルの増減
        delta = newWidth - curWidth;
        if (delta > 0) {
            map_data_str = this.map.height_array;
            addStr = "";
            for (var i = 0; i < delta; i++) {
                addStr += ","; //カンマを付加する。
                addStr += this.initialHeights; // 初期値を文字列として加える
            }
            addStr += '\n';
            map_data_str = map_data_str.replace(/\n/g, addStr); // 現状のマップ文字列の各改行（つまり、各行の一番後ろ）をaddStr文字列に置き換える
        }
        else {
            delta *= -1; // 正の数にする
            map_data_str = this.map.height_array;
            for (var i = 0; i < delta; i++) {
                var re = new RegExp(",[^,]+\n", 'g'); // 一つ分の ,0 dz(改行) などにマッチして、
                map_data_str = map_data_str.replace(re, '\n'); // それを改行で置き換える
            }
        }
        // 高さアレイにデータ保存
        this.map.height_array = map_data_str;
        // スクリプトタイルの増減
        delta = newWidth - curWidth;
        if (delta > 0) {
            map_data_str = this.map.script_array;
            addStr = "";
            for (var i = 0; i < delta; i++) {
                addStr += ","; //カンマを付加する。
                addStr += this.initialScript; // 初期値を文字列として加える
            }
            addStr += '\n';
            map_data_str = map_data_str.replace(/\n/g, addStr); // 現状のマップ文字列の各改行（つまり、各行の一番後ろ）をaddStr文字列に置き換える
        }
        else {
            delta *= -1; // 正の数にする
            map_data_str = this.map.script_array;
            for (var i = 0; i < delta; i++) {
                var re = new RegExp(",[^,]+\n", 'g'); // 一つ分の ,0 dz(改行) などにマッチして、
                map_data_str = map_data_str.replace(re, '\n'); // それを改行で置き換える
            }
        }
        // スクリプトアレイにデータ保存
        this.map.script_array = map_data_str;
        this.map.width = newWidth;
        this.reloadMap();
    };
    MapManager.prototype.getMapHeight = function () {
        return this.map.height;
    };
    MapManager.prototype.setMapHeight = function (value) {
        var newHeight = 0;
        if (value < this.minMapHeight) {
            newHeight = this.minMapHeight;
        }
        else if (value > this.maxMapHeight) {
            newHeight = this.maxMapHeight;
        }
        else {
            newHeight = value;
        }
        var curHeight = this.getMapHeight();
        var width = this.getMapWidth();
        var delta = newHeight - curHeight;
        if (delta === 0) {
            return;
        }
        // テクスチャとタイルタイプの増減
        if (delta > 0) {
            var map_data_str = this.map.type_array;
            var row = "";
            for (var i = 0; i < delta; i++) {
                for (var j = 0; j < width; j++) {
                    if (j != 0) {
                        row += ","; // 値の前にカンマを加える
                    }
                    row += this.initialTypes;
                }
                row += '\n';
            }
            map_data_str += row;
        }
        else {
            var map_data_str = this.map.type_array;
            var splitted_with_n = map_data_str.split("\n"); // マップ文字列を行ごとに区切る
            var index = 0;
            for (var i = 0; i < newHeight; i++) {
                index += splitted_with_n[i].length + 1; // height-1行までの各行の文字数と改行をindexに加算する
            }
            map_data_str = map_data_str.substr(0, index);
        }
        // タイプアレイにデータ保存
        this.map.type_array = map_data_str;
        // 高さタイルの増減
        delta = newHeight - curHeight;
        if (delta > 0) {
            map_data_str = this.map.height_array;
            row = "";
            for (var i = 0; i < delta; i++) {
                for (var j = 0; j < width; j++) {
                    if (j != 0) {
                        row += ","; // 値の前にカンマを加える
                    }
                    row += this.initialHeights;
                }
                row += '\n';
            }
            map_data_str += row;
        }
        else {
            map_data_str = this.map.height_array;
            splitted_with_n = map_data_str.split("\n"); // マップ文字列を行ごとに区切る
            index = 0;
            for (var i = 0; i < newHeight; i++) {
                index += splitted_with_n[i].length + 1; // height-1行までの各行の文字数と改行をindexに加算する
            }
            map_data_str = map_data_str.substr(0, index);
        }
        // 高さアレイにデータ保存
        this.map.height_array = map_data_str;
        // スクリプトタイルの増減
        delta = newHeight - curHeight;
        if (delta > 0) {
            map_data_str = this.map.script_array;
            row = "";
            for (var i = 0; i < delta; i++) {
                for (var j = 0; j < width; j++) {
                    if (j != 0) {
                        row += ","; // 値の前にカンマを加える
                    }
                    row += this.initialScript;
                }
                row += '\n';
            }
            map_data_str += row;
        }
        else {
            map_data_str = this.map.script_array;
            splitted_with_n = map_data_str.split("\n"); // マップ文字列を行ごとに区切る
            index = 0;
            for (var i = 0; i < newHeight; i++) {
                index += splitted_with_n[i].length + 1; // height-1行までの各行の文字数と改行をindexに加算する
            }
            map_data_str = map_data_str.substr(0, index);
        }
        // スクリプトアレイにデータ保存
        this.map.script_array = map_data_str;
        this.map.height = newHeight;
        this.reloadMap();
    };
    MapManager.prototype.reloadMap = function () {
        var mapData = this.getMapFullData();
        WRT.map.app.currentScene.load('001', mapData);
        this.callback();
    };
    MapManager.prototype.getMap = function () {
        return this.map;
    };
    MapManager.prototype.setMap = function (map) {
        this.map = _.clone(map);
    };
    MapManager.prototype.getMapFullData = function () {
        var mapName = this.mapName;
        var mapdata = this.getMapBaseData();
        mapdata[mapName].width = this.map.width;
        mapdata[mapName].height = this.map.height;
        // タイプマップの処理
        var type_map = this.map.type_array;
        var splitted_with_n = type_map.split("\n"); //マップ文字列を行ごとに区切る
        //console.log(splitted_with_n);
        for (var i = 0; i < splitted_with_n.length - 1; i++) {
            var splitted_with_comma = splitted_with_n[i].split(","); // カンマで区切り、各列の値を配列に
            for (var j = 0; j < splitted_with_comma.length; j++) {
                var y = i;
                var x = j;
                var splitted_with_space = splitted_with_comma[j].split(" "); // タイルのデータをスプリットする。例えば"10 Dh5% Dk"だったら、"10","Dh5%","Dk"の配列にする
                var texId = parseInt(splitted_with_space[0], 10); // テクスチャIDを記憶する。 "10","Dh5%","Dk"だったら、10を数値として保存
                var typeStr = splitted_with_comma[j].substr(splitted_with_space[0].length + 1); // タイルタイプ文字列を取得する。 "10 Dh5% Dk"だったら、"Dh5% Dk"を保存
                var firstTypeStr = typeStr.split(" ")[0]; // 最初のタイルタイプ文字列を取得する。 "Dh5% Dk" だったら "Dh5%"を保存
                var typeId = 0;
                if (/^N/.test(firstTypeStr)) {
                    typeId = 0;
                }
                else if (/^W/.test(firstTypeStr)) {
                    typeId = 1;
                }
                else if (/^Dk/.test(firstTypeStr)) {
                    typeId = 2;
                }
                else if (/^P/.test(firstTypeStr)) {
                    typeId = 3;
                }
                else {
                    typeId = 0;
                }
                mapdata[mapName].layers[0].data[x + mapdata[mapName].width * y] = texId - 1; // テクスチャ設定
                mapdata[mapName].layers[1].data[x + mapdata[mapName].width * y] = typeId; // タイルタイプチップ設定
            }
        }
        // 高さマップの処理
        var height_map = this.map.height_array;
        var splitted_with_n2 = height_map.split("\n"); // マップ文字列を行ごとに区切る
        for (var i_ = 0; i_ < splitted_with_n2.length - 1; i_++) {
            var splitted_with_comma2 = splitted_with_n2[i_].split(","); //カンマで区切り、各列の値を配列に
            for (var j_ = 0; j_ < splitted_with_comma2.length; j_++) {
                var yy = i_;
                var xx = j_;
                var splitted_with_space2 = splitted_with_comma2[j_].split(" "); // タイルのデータをスプリットする。例えば"10 Dh5% Dk"だったら、"10","Dh5%","Dk"の配列にする
                var floorHeight = parseInt(splitted_with_space2[0], 10); // 床の高さを取得する "1 10"だったら、1を数値として保存
                var ceilingHeight = parseInt(splitted_with_space2[1], 10); // 天井の高さを取得する。 "1 10"だったら、10を数値として保存
                mapdata[mapName].layers[2].data[xx + mapdata[mapName].width * yy] = floorHeight + 10; // 床の高さ設定
                mapdata[mapName].layers[3].data[xx + mapdata[mapName].width * yy] = ceilingHeight + 10; // 天井の高さ設定
            }
        }
        // スクリプトマップの処理
        var script_map = this.map.script_array;
        var splitted_with_n = script_map.split("\n"); // マップ文字列を行ごとに区切る
        for (var i = 0; i < splitted_with_n.length - 1; i++) {
            var splitted_with_comma = splitted_with_n[i].split(","); //カンマで区切り、各列の値を配列に
            for (var j = 0; j < splitted_with_comma.length; j++) {
                var y = i;
                var x = j;
                var value = (splitted_with_comma[j] === '0') ? 0 : 1;
                mapdata[mapName].layers[4].data[x + mapdata[mapName].width * y] = value; // スクリプト設定
            }
        }
        return mapdata;
    };
    MapManager.prototype.switchMapLayer = function (mode, mapData) {
        if (mapData === void 0) { mapData = null; }
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
                mapData[mapName].layers[4].visible = false;
                this.currentMode = MapLayer.TILE_TYPE;
                break;
            case MapLayer.FLOOR_HEIGHT:
                mapData[mapName].layers[1].visible = false;
                delete mapData[mapName].layers[2].visible;
                mapData[mapName].layers[3].visible = false;
                mapData[mapName].layers[4].visible = false;
                this.currentMode = MapLayer.FLOOR_HEIGHT;
                break;
            case MapLayer.CEILING_HEIGHT:
                mapData[mapName].layers[1].visible = false;
                mapData[mapName].layers[2].visible = false;
                delete mapData[mapName].layers[3].visible;
                mapData[mapName].layers[4].visible = false;
                this.currentMode = MapLayer.CEILING_HEIGHT;
                break;
            case MapLayer.SCRIPT:
                mapData[mapName].layers[1].visible = false;
                mapData[mapName].layers[2].visible = false;
                mapData[mapName].layers[3].visible = false;
                delete mapData[mapName].layers[4].visible;
                this.currentMode = MapLayer.SCRIPT;
                break;
        }
        WRT.map.app.currentScene.load('001', mapData);
    };
    MapManager.prototype.setCurrentTileIndex = function (index) {
        this.currentTileIndex = index;
    };
    MapManager.prototype.setCurrentTileScriptName = function (scriptName) {
        this.currentTileScriptName = scriptName;
    };
    MapManager.getHeightCssOffsetStrArray = function () {
        var heightIndexArray = _.map(MapManager.heightLevels, function (num) {
            return num + 10;
        });
        var that = this;
        return _.map(heightIndexArray, function (index) {
            return {
                hid: index,
                //        offset: 'background-image: url(' + that.heightTileUrl + ' ); background-position: -' + index*32 + 'px 0px;'
                heightTileUrl: that.heightTileUrl,
                offset: index * 32
            };
        });
    };
    // tmlib の マップ配列データから、当該チップ用の文字列を生成する。
    MapManager.prototype.makeCellStrOfTypeArray = function (cellX, cellY, mapData, isType) {
        var mapWidth = mapData[this.mapName].width;
        var resultStr = '';
        resultStr += mapData[this.mapName].layers[0].data[cellX + mapWidth * cellY] + 1; // MAD_DATAからクリックされたセルのテクスチャのインデックス値を読み取る
        resultStr += ' ';
        var typeStr = null;
        switch (mapData[this.mapName].layers[1].data[cellX + mapWidth * cellY]) {
            case 0:
                typeStr = 'N';
                break;
            case 1:
                typeStr = 'W';
                break;
            case 2:
                typeStr = 'Dk';
                break;
            case 3:
                typeStr = 'P';
                break;
        }
        var typeChipStr = this.getMapTypeChipStr(cellX, cellY);
        var option = typeChipStr.match(/\[(.+)\]/); // オプション文字列を取得
        if (isType === true) {
            if (typeStr === 'P') {
                if (!option) {
                    option = [];
                    option[1] = "A|0~1";
                }
                var answer = window.prompt("プラットフォームの動作モードをA（自動）またはM（手動）で指定し、|で区切った上で、\n" +
                    "次にプラットフォームの床の最低の高さと最高の高さを\nチルダで区切って入力してください。\n指定できる数値の範囲は -10 ~ 10 です。\n" +
                    "また、M(手動)の場合はさらに|で区切って、プラットフォームの動きの繰り返し数（0:片道、1:往復）を指定します。" +
                    "\n\n例：\nA|0~5\nM|-2~0|1", option[1]);
                if (answer === null) {
                    this.currentPlatformParameter = '[' + option[1] + ']';
                }
                else {
                    this.currentPlatformParameter = '[' + answer + ']';
                }
            }
            else {
                this.currentPlatformParameter = '';
            }
        }
        else {
            if (!option) {
                this.currentPlatformParameter = '';
            }
            else {
                this.currentPlatformParameter = '[' + option[1] + ']';
            }
        }
        resultStr += typeStr + this.currentPlatformParameter;
        this.currentPlatformParameter = '';
        return resultStr;
    };
    MapManager.prototype.getMapTypeChipStr = function (cellX, cellY) {
        var type_map = this.map.type_array;
        var splitted_with_n = type_map.split("\n"); //マップ文字列を行ごとに区切る
        var splitted_with_comma = splitted_with_n[cellY].split(","); // カンマで区切り、各列の値を配列に
        var chipStr = splitted_with_comma[cellX];
        return chipStr;
    };
    // tmlib の マップ配列データから、当該チップ用の文字列を生成する。
    MapManager.prototype.makeCellStrOfHeightArray = function (cellX, cellY, mapData) {
        var resultStr = '';
        var mapWidth = mapData[this.mapName].width;
        var floorHeightIndexStartedZero = mapData[this.mapName].layers[2].data[cellX + mapWidth * cellY];
        resultStr += (floorHeightIndexStartedZero - 10); // MAD_DATAからクリックされたセルのインデックス値を読み取る
        resultStr += ' ';
        var ceilHeightIndexStartedZero = mapData[this.mapName].layers[3].data[cellX + mapWidth * cellY]; // MAD_DATAからクリックされたセルのインデックス値を読み取る
        resultStr += (ceilHeightIndexStartedZero - 10); // MAD_DATAからクリックされたセルのインデックス値を読み取る
        return resultStr;
    };
    MapManager.prototype.replaceChar = function (text, index, lastIndex, value) {
        return text.substr(0, index) + value + text.substr(lastIndex); // indexとlastIndexの前後でマップ文字列を分けて、その間に値を挿入する。
    };
    MapManager.prototype.modifyMap = function (x, y, valueChar, type_or_height) {
        var map_data_str = null;
        switch (type_or_height) {
            case 'type':
                map_data_str = this.map.type_array;
                break;
            case 'height':
                map_data_str = this.map.height_array;
                break;
            case 'script':
                map_data_str = this.map.script_array;
                break;
        }
        var splitted_with_n = map_data_str.split("\n"); // マップ文字列を行ごとに区切る
        var index = 0;
        for (var i = 0; i < y; i++) {
            index += splitted_with_n[i].length + 1; // 1足しているのは、改行を含めるため
        }
        var splitted_with_comma = splitted_with_n[y].split(",");
        for (var i = 0; i < x; i++) {
            index += splitted_with_comma[i].length + 1; // 1足しているのは、カンマを含めるため
        }
        // この時点で、indexは、指定位置(x,y)のマップ文字列中の開始位置を示す。
        var lastIndex = index + splitted_with_comma[x].length; // 指定位置(x,y)のマップ文字列中の終了位置（値の後ろのカンマは含めない）を示す。
        map_data_str = this.replaceChar(map_data_str, index, lastIndex, valueChar);
        switch (type_or_height) {
            case 'type':
                this.map.type_array = map_data_str;
                break;
            case 'height':
                this.map.height_array = map_data_str;
                break;
            case 'script':
                this.map.script_array = map_data_str;
                break;
        }
        this.callback();
    };
    MapManager.prototype.getMapBaseData = function () {
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
                    },
                    {
                        // 32x32 のタイル（マップチップ）を並べた画像（幅と段数は自由）
                        name: 'scriptTile',
                        image: MapManager.scriptTileUrl
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
                    },
                    {
                        type: 'layer',
                        name: 'layer5',
                        tilesets: 'scriptTile',
                        visible: false,
                        // 実際のデータ（数値配列）
                        // 数値は、タイルセットのインデックス（何番目のマップチップを表示するか）
                        // マップサイズの幅と高さを掛けた分を用意する
                        data: []
                    }
                ]
            }
        };
    };
    Object.defineProperty(MapManager.prototype, "callbackOnChangeMap", {
        get: function () {
            return this.callback;
        },
        set: function (callback) {
            this.callback = callback;
        },
        enumerable: true,
        configurable: true
    });
    MapManager.heightTileUrl = '/material/tileHeightImage/tileHeightImage.png';
    MapManager.scriptTileUrl = '/material/typeTypeImage/scriptTile.png';
    MapManager.heightLevels = [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    return MapManager;
}());
window.MapManager = MapManager;
