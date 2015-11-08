<story-play>
  <div id="canvasWrapper">
    <canvas id="tmlibCanvas"></canvas>
  </div>

  <script>
    this.mixin('ikki'); // THIS LINE IS NEEDED TO USE IKKI'S FEATURES

    this.on('mount', ()=>{

      var deferStories = $.Deferred();
      Meteor.subscribe('stories', {
        onReady: ()=>{
          deferStories.resolve();
        }
      });

      var deferStoryScenes = $.Deferred();
      Meteor.subscribe('storyScenes', {
        onReady: ()=>{
          deferStoryScenes.resolve();
        }
      });

      var deferStoryItems = $.Deferred();
      Meteor.subscribe('storyItems', {
        onReady: ()=>{
          deferStoryItems.resolve();
        }
      });

      var deferSentences = $.Deferred();
      Meteor.subscribe('sentences', {
        onReady: ()=>{
          deferSentences.resolve();
        }
      });

      var deferCharacters = $.Deferred();
      Meteor.subscribe('characters', {
        onReady: ()=>{
          deferCharacters.resolve();
        }
      });

      var deferCharacterImages = $.Deferred();
      Meteor.subscribe('characterImages', {
        onReady: ()=>{
          deferCharacterImages.resolve();
        }
      });

      var deferBackgrounds = $.Deferred();
      Meteor.subscribe('backgrounds', {
        onReady: ()=>{
          deferBackgrounds.resolve();
        }
      });

      var deferBackgroundImages = $.Deferred();
      Meteor.subscribe('backgroundImages', {
        onReady: ()=>{
          deferBackgroundImages.resolve();
        }
      });

      var deferBgms = $.Deferred();
      Meteor.subscribe('bgms', {
        onReady: ()=>{
          deferBgms.resolve();
        }
      });

      var deferBgmAudios= $.Deferred();
      Meteor.subscribe('bgmAudios', {
        onReady: ()=>{
          deferBgmAudios.resolve();
        }
      });
      var deferSoundEffects = $.Deferred();
      Meteor.subscribe('soundEffects', {
        onReady: ()=>{
          deferSoundEffects.resolve();
        }
      });

      var deferSoundEffectAudios = $.Deferred();
      Meteor.subscribe('soundEffectAudios', {
        onReady: ()=>{
          deferSoundEffectAudios.resolve();
        }
      });


      // Game class initialization after all assets load complite
      $.when.apply(null,
        [
          deferStories.promise(),
          deferStoryScenes.promise(),
          deferStoryItems.promise(),
          deferSentences.promise(),
          deferCharacters.promise(),
          deferCharacterImages.promise(),
          deferBackgrounds.promise(),
          deferBackgroundImages.promise(),
          deferBgms.promise(),
          deferBgmAudios.promise(),
          deferSoundEffects.promise(),
          deferSoundEffectAudios.promise()
        ]
      ).done(()=> {
        var game = WrtGame.Game.getInstance();
        game.init(null, true, ()=>{
          var novelPlayer = WrtGame.NovelPlayer.getInstance();
          var story = MongoCollections.Stories.findOne({_id: opts.story_id});
          novelPlayer.loadStory(story.title, opts.scene_id);
          novelPlayer.playNext();
        });
		  });

      WrtGame.preventDefaultArrowKey();

    });

    this.on('unmount', ()=>{
      WrtGame.enableDefaultArrowKey();
//      var game = WrtGame.Game.getInstance();
//      game.clear();
    });

    this.on('update', ()=>{
    });
  </script>

  <style scoped>
    div#canvasWrapper {
      position: absolute;
      top: 50px;
    }

    canvas#tmlibCanvas {
      width: 1200px;
      height: 800px;
      margin: 0px;
      position: absolute;
      top: 0px;
      z-index: 300;
    }

  </style>
</story-play>
