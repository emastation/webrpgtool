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
      maps: MongoCollections.Maps.find()
    };
  }
});

Router.route('/maps/submit', {name: 'mapSubmit'});

Router.route('/maps/:_id', {
  name: 'mapPage',
  data: function() { return MongoCollections.Maps.findOne(this.params._id); }
});

Router.route('/maps/:_id/edit', {
  name: 'mapEdit',
  waitOn: function() {
    return [Meteor.subscribe('map_textures'), Meteor.subscribe('map_tile_types')];
  },
  data: function() {
    return {
      map: MongoCollections.Maps.findOne(this.params._id),
      mapTextures: MongoCollections.MapTextures.find(),
      mapTileTypes: MongoCollections.MapTileTypes.find()
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
      codes: MongoCollections.Codes.find()
    };
  }
});

Router.route('/codes/submit', {name: 'codeSubmit'});

Router.route('/codes/:_id/edit', {
  name: 'codeEdit',
  waitOn: function() {
    return [
      Meteor.subscribe('codes'),
      Meteor.subscribe("uiScreens"),
      Meteor.subscribe("uiTables")
    ];
  },
  data: function() {
    return {
      code: MongoCollections.Codes.findOne(this.params._id)
    };
  }
});

Router.route('/game/:_id', {
  name: 'gamePage',
  layoutTemplate: null,
  waitOn: function() {
    return [
      Meteor.subscribe('map_textures'),
      Meteor.subscribe('map_tile_types'),
      Meteor.subscribe('stories'),
      Meteor.subscribe('storyScenes'),
      Meteor.subscribe('storyItems'),
      Meteor.subscribe('sentences'),
      Meteor.subscribe("characters"),
      Meteor.subscribe('characterImages'),
      Meteor.subscribe('codes'),
      Meteor.subscribe("uiScreens"),
      Meteor.subscribe("uiTables")
    ];
  },
  data: function() {
    return {
      map: MongoCollections.Maps.findOne(this.params._id),
      mapTextures: MongoCollections.MapTextures.find(),
      mapTileTypes: MongoCollections.MapTileTypes.find()
    };
  }
});

Router.route('/stories', {
  name: 'storiesList',
  waitOn: function() {
    return [
      Meteor.subscribe("stories")
    ];
  }
});

Router.route('/story/:_id', {
  name: 'storyPage',
  waitOn: function() {
    return [
      Meteor.subscribe("storyScenes")
    ];
  }
});

Router.route('/story/:_id/scene/:_id2', {
  name: 'storyScenePage',
  waitOn: function() {
    return [
      Meteor.subscribe("storyScenes"), // goBackToSceneListのためだけ
      Meteor.subscribe("storyItems"),
      Meteor.subscribe("sentences"),
      Meteor.subscribe("characters"),
      Meteor.subscribe("characterImages")
    ];
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
