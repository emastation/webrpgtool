interface Window {
  fireEvent: any;
}


WRT = {};
WRT.map = {};

declare var MapScene:any;
declare var MongoCollections:any;
declare var Router:any;

Template.mapEdit.helpers({
  heightTileDivStyleStrArray: _.isUndefined(window.MapManager) ? null : window.MapManager.getHeightCssOffsetStrArray()
});

Template.mapEdit.rendered = function() {
  var that = this;

  var ASSETS = {};
  WRT.map.mapManager = new window.MapManager(that.data.map);
  
  WRT.map.previousMap = _.clone(that.data.map);
  
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
        event.initEvent ("load", false, true)
        window.dispatchEvent(event);
      }
//    }
//    , 100);
  }

  $($("a[id^='texture_']>div").get(0)).addClass('selected'); //テクスチャの０番目を選択する

};

var updateMap = function(currentMapId, map) {
  var mapProperties = {
    title: map.title,
    width: map.width,
    height: map.height,
    type_array: map.type_array,
    height_array: map.height_array
  };

  MongoCollections.Maps.update(currentMapId, {$set: mapProperties}, function(error) { 
    if (error) {
      // display the error to the user
      alert(error.reason);
    }
  });
};

var updateSelectedClass = function(target) {
  $("a[id^='texture_']>div").removeClass('selected');
  $("a[id^='tiletype_']>div").removeClass('selected');
  $("a[id^='floorheight_']>div").removeClass('selected');
  $("a[id^='ceilingheight_']>div").removeClass('selected');

  $(target).addClass('selected');
};

Template.mapEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var currentMapId = this.map._id;

    var mapProperties = {
      title: $(e.target).find('[name=title]').val(),
      width: parseInt($(e.target).find('[name=width]').val(), 10),
      height: parseInt($(e.target).find('[name=height]').val(), 10),
      type_array: $(e.target).find('[name=type_array]').val(),
      height_array: $(e.target).find('[name=height_array]').val()
    };

    MongoCollections.Maps.update(currentMapId, {$set: mapProperties}, function(error) {
      if (error) {
        // display the error to the user
        alert(error.reason);
      } else {
        Router.go('mapPage', {_id: currentMapId});
      }
    });
  },

  'click .delete': function(e) {
    e.preventDefault();

    if (confirm("Delete this map?")) {
      var currentMapId = this.map._id;
      MongoCollections.Maps.remove(currentMapId);
      Router.go('mapsList');
    }
  },
  
  'click .rollback': function(e) {
    e.preventDefault();

    var currentMapId = this.map._id;
    updateMap(currentMapId, WRT.map.previousMap);
    
    WRT.map.mapManager.setMap(WRT.map.previousMap);
    WRT.map.mapManager.reloadMap();
  },
    
  'change #width': function(e) {
    e.preventDefault();
    
    var newWidth = parseInt($(e.target).val(), 10);
    WRT.map.mapManager.setMapWidth(newWidth);
    
    var map = WRT.map.mapManager.getMap();
    
    var currentMapId = this.map._id;
    updateMap(currentMapId, map);
  },
  
  'change #height': function(e) {
    e.preventDefault();
    
    var newHeight = parseInt($(e.target).val(), 10);
    WRT.map.mapManager.setMapHeight(newHeight);
    
    var map = WRT.map.mapManager.getMap();
    
    var currentMapId = this.map._id;
    updateMap(currentMapId, map);

  },

  "click a[id^='texture_']": function(e) {
    e.preventDefault();

    WRT.map.mapManager.switchMapLayer(0);
    WRT.map.mapManager.setCurrentTileIndex($(e.target).data('mtid'))

    updateSelectedClass(e.target);
  },

  "click a[id^='tiletype_']": function(e) {
    e.preventDefault();

    WRT.map.mapManager.switchMapLayer(1);
    WRT.map.mapManager.setCurrentTileIndex($(e.target).data('mttid'))

    updateSelectedClass(e.target);
  },

  "click a[id^='floorheight_']": function(e) {
    e.preventDefault();

    WRT.map.mapManager.switchMapLayer(2);
    WRT.map.mapManager.setCurrentTileIndex($(e.target).data('hid'))

    updateSelectedClass(e.target);
  },

  "click a[id^='ceilingheight_']": function(e) {
    e.preventDefault();

    WRT.map.mapManager.switchMapLayer(3);
    WRT.map.mapManager.setCurrentTileIndex($(e.target).data('hid'))

    updateSelectedClass(e.target);
  },

  "click input#reloadData": function(e) {
    var map = WRT.map.mapManager.getMap();

    var currentMapId = this.map._id;
    updateMap(currentMapId, map);
  }
});
