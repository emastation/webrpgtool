WRT = {};
WRT.map = {};

Template.mapEdit.rendered = function() {
  WRT.map.app = tm.app.CanvasApp("#world");
  // リサイズ
  WRT.map.app.resize(6400, 6400);
  // 画面フィット
  //WRT.map.app.fitWindow();
  // 背景色をセット
  WRT.map.app.background = "rgba(150, 150, 150, 1.0)";
  // 実行
  WRT.map.app.run();
};

Template.mapEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var currentMapId = this._id;

    var mapProperties = {
      title: $(e.target).find('[name=title]').val(),
      width: parseInt($(e.target).find('[name=width]').val(), 10),
      height: parseInt($(e.target).find('[name=height]').val(), 10),
      type_array: $(e.target).find('[name=type_array]').val(),
      height_array: $(e.target).find('[name=height_array]').val()
    }

    Maps.update(currentMapId, {$set: mapProperties}, function(error) {
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
      var currentMapId = this._id;
      Maps.remove(currentMapId);
      Router.go('mapsList');
    }
  }
});
