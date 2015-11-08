Meteor.autorun(function() {
  Meteor.subscribe('backgroundImages', {
    onReady: ()=> {
      window.wrtBackgroundImages = MongoCollections.BackgroundImages.find().fetch();
    }
  });
  Meteor.subscribe('bgmAudios', {
    onReady: ()=> {
      window.wrtBgmAudios = MongoCollections.BgmAudios.find().fetch();
    }
  });
  Meteor.subscribe('soundEffectAudios', {
    onReady: ()=> {
      window.wrtSoundEffectAudios = MongoCollections.SoundEffectAudios.find().fetch();
    }
  });
});
