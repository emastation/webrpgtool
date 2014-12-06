///<reference path="../../../typings/meteor/meteor.d.ts"/>

var mapsData = [
  {
    title: 'Introducing Telescope'
  },
  {
    title: 'Meteor'
  },
  {
    title: 'The Meteor Book'
  }
];

Template['mapsList'].helpers({
  maps: mapsData
});
