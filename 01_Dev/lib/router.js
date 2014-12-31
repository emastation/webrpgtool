///<reference path="../../typings/meteor/meteor.d.ts"/>
///<reference path="../../typings/ironrouter.d.ts"/>

Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', {
  name: 'mapsList',
  data: function () {
    return {
      maps:Maps.find()
    };
  }
});
