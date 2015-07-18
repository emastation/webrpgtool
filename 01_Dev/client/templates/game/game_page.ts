

declare var Template:any;
declare var _:any;
declare var $:any;

function elementRequestFullscreen(element){
  var list = [
    "requestFullscreen",
    "webkitRequestFullScreen",
    "mozRequestFullScreen",
    "msRequestFullscreen"
  ];
  var i;
  var num = list.length;
  for(i=0;i < num;i++){
    if(element[list[i]]){
//      element[list[i]](Element["ALLOW_KEYBOARD_INPUT"]);
      element[list[i]]();
      return true;
    }
  }
  return false;
}

function documentExitFullscreen(document_obj){
  var list = [
    "exitFullscreen",
    "webkitExitFullscreen",
    "mozCancelFullScreen",
    "msExitFullscreen"
  ];
  var i;
  var num = list.length;
  for(i=0;i < num;i++){
    if(document_obj[list[i]]){
      document_obj[list[i]]();
      return true;
    }
  }
  return false;
}

var menu = [{
  name: 'enterFullScreen',
  title: 'フルスクリーンにする',
  fun: function () {
    elementRequestFullscreen($('#canvasWrapper').get(0));
    $('#canvasWrapper').css('top', -window.height/2+"px");
  }
}, {
  name: 'cancelFullScreen',
  title: 'フルスクリーンを解除する',
  fun: function (e) {
    documentExitFullscreen(document);

    e.stopPropagation();
  }
}];


Template.gamePage.rendered = function() {

  var novelPlayer = WrtGame.NovelPlayer.getInstance();
  novelPlayer.init();

  var game = WrtGame.Game.getInstance();
  game.init(this.data);

  //Calling context menu
//  $('#tmlibCanvas').contextMenu(menu);
  $('body').contextMenu(menu,{triggerOn:'contextmenu'});
};

Template.gamePage.onCreated(function () {
  WrtGame.preventDefaultArrowKey();
});

Template.gamePage.onDestroyed(function () {
  WrtGame.enableDefaultArrowKey();
});
