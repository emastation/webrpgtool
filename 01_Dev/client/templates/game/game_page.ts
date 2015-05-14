
declare var Template:any;
declare var _:any;
declare var $:any;

Template.gamePage.rendered = function() {

  var game = WrtGame.Game.getInstance();
  game.init(this.data);

};
