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
  data: function() { return Maps.findOne(this.params._id); }
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
}

Router.onBeforeAction(requireLogin, {only: 'mapSubmit'});
