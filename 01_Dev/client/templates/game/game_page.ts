
declare var Template:any;
declare var _:any;
declare var $:any;

Template.gamePage.rendered = function() {

  var novelPlayer = WrtGame.NovelPlayer.getInstance();
  novelPlayer.init();

  var game = WrtGame.Game.getInstance();
  game.init(this.data);

};
