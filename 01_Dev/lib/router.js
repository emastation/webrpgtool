///<reference path="../../typings/meteor/meteor.d.ts"/>
///<reference path="../../typings/ironrouter.d.ts"/>

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() { return Meteor.subscribe('maps'); } // p79に説明あり
});

Router.route('/', {
  name: 'mapsList',
  data: function () {
    return {
      maps:Maps.find()
    };
  }
});

Router.route('/maps/submit', {name: 'mapSubmit'});

Router.route('/maps/:_id', {
  name: 'mapPage',
  data: function() { return Maps.findOne(this.params._id); }
});

Router.route('/maps/:_id/edit', {
  name: 'mapEdit',
  waitOn: function() {
    return [Meteor.subscribe('map_textures'), Meteor.subscribe('map_tile_types')];
  },
  data: function() {
    return {
      map: Maps.findOne(this.params._id),
      mapTextures: MapTextures.find(),
      mapTileTypes: MapTileTypes.find()
    };
  }
});

Router.route('/codes', {
  name: 'codesList',
  waitOn: function() {
    return Meteor.subscribe('codes');
  },
  data: function() {
    return {
      codes: Codes.find()
    };
  }
});

Router.route('/codes/submit', {name: 'codeSubmit'});


Router.route('/game/:_id', {
  name: 'gamePage',
  waitOn: function() {
    return [Meteor.subscribe('map_textures'), Meteor.subscribe('map_tile_types')];
  },
  data: function() {
    return {
      map: Maps.findOne(this.params._id),
      mapTextures: MapTextures.find(),
      mapTileTypes: MapTileTypes.find()
    };
  }
});


var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) { // p116に説明あり
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
};

Router.onBeforeAction(requireLogin, {only: 'mapSubmit'});
