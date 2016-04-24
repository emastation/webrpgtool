<map-edit>
  <div class="ui grid">
    <map-edit-main-form map={map} game_id={gameId}></map-edit-main-form>
    <map-edit-manipulate-panel map={map} map_textures={mapTextures} map_tile_types={mapTileTypes}
                            height_tile_div_style_str_array={heightTileDivStyleStrArray}></map-edit-manipulate-panel>
    <div class="eight wide column"></div>
    <map-edit-script-panel codes={codes}></map-edit-script-panel>
  </div>
  <div id="map-container">
    <canvas id="world" />
  </div>

  <script>
    this.mixin('ikki'); // THIS LINE IS NEEDED TO USE IKKI'S FEATURES

    window.WRT = {};
    window.WRT.map = {};

    this.getMap = ()=> {
      if (opts.map_id) {
        this.map = MongoCollections.Maps.findOne({_id: opts.map_id});
        this.update();
      }
    }

    this.getMapTextures = ()=> {
      this.mapTextures = MongoCollections.MapTextures.find().fetch();
      this.update();
    }

    this.getMapTileTypes = ()=> {
      this.mapTileTypes = MongoCollections.MapTileTypes.find().fetch();
      this.update();
    }

    this.getCodes = ()=> {
      this.codes = MongoCollections.Codes.find().fetch();
      this.update();
    }

    var initPhina = function() {
      var ASSETS = {};

      //    WRT.map.previousMap = _.clone(that.data.map);

      var mapData = WRT.map.mapManager.getMapFullData();
      for(var key in mapData) {
        tm.asset.Manager.set(key, tm.asset.MapSheet(mapData[key]));
        for(var idx in mapData[key].tilesets) {
          ASSETS[mapData[key].tilesets[idx].image] = mapData[key].tilesets[idx].image;
        }
      }
      // 読み込みシーンを初期セット
      var loadingScene = tm.game.LoadingScene({
        assets: ASSETS,
        nextScene: MapScene
      });

      tm.main( function() {

        if(!_.isUndefined(WRT.map.app)) {
          WRT.map.app.stop();
        }

        WRT.map.app = tm.app.CanvasApp("#world");
        // リサイズ
        WRT.map.app.resize(6400, 6400);
        // 画面フィット
        //WRT.map.app.fitWindow();
        // 背景色をセット
        WRT.map.app.background = "rgba(150, 150, 150, 1.0)";

      //    WRT.map.app.replaceScene(WRT.map.app.mapScene);


      //    WRT.map.app.mapScene = MapScene();

        WRT.map.app.replaceScene(loadingScene);
        // 実行
        WRT.map.app.run();

      });

      if (document.readyState == "complete") {
        // loadイベントをエミュレート
      //    setTimeout( function() {
        if (!document.createEvent) {
          window.fireEvent('onload');
        } else {
          var event = document.createEvent('HTMLEvents');
          event.initEvent ("load", false, true);
          window.dispatchEvent(event);
        }
      //    }
      //    , 100);
      }
    };


    this.on('mount', ()=>{
      Meteor.subscribe('maps', {
        onReady: ()=>{
          this.getMap();
          if(_.isUndefined(this.map)) {
            return;
          }
          window.WRT.map.mapManager = new window.MapManager(this.map);
          this.heightTileDivStyleStrArray = window.MapManager.getHeightCssOffsetStrArray();
          initTmlib();
        }
      });
      Meteor.subscribe('map_textures', {
        onReady: ()=>{
          this.getMapTextures();
        }
      });
      Meteor.subscribe('map_tile_types', {
        onReady: ()=>{
          this.getMapTileTypes();
        }
      });
      Meteor.subscribe('codes', {
        onReady: ()=>{
          this.getCodes();
        }
      });
    });

    this.on('update', ()=>{
      this.gameId = (opts.game_id) ? opts.game_id : this.gameId;
      this.getMap();
      this.getMapTextures();
      this.getMapTileTypes();
      this.getCodes();
    });

  </script>

  <style scoped>
    :scope {
      position: relative;
      top: 20px;
      left: 10px;
    }
  </style>
</map-edit>
