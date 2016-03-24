<game>
  <div id="canvasWrapper">
    <p>Game! {data.map.title}</p>
    <canvas id="renderCanvas"></canvas>
    <canvas id="tmlibCanvas"></canvas>
    <game-ui id="game-ui"></game-ui>
  </div>

  <script>
    this.mixin('ikki'); // THIS LINE IS NEEDED TO USE IKKI'S FEATURES

    this.data = {};

    this.getMap = ()=> {
      if (opts.map_id) {
        this.data.map = MongoCollections.Maps.findOne({_id: opts.map_id});
        this.update();
      }
    }
    this.getMapTextures = ()=> {
      this.data.mapTextures = MongoCollections.MapTextures.find().fetch();
      this.update();
    }

    this.getMapTileTypes = ()=> {
      this.data.mapTileTypes = MongoCollections.MapTileTypes.find().fetch();
      this.update();
    }
/*
      {
          map: MongoCollections.Maps.findOne(this.params._id),
          mapTextures: MongoCollections.MapTextures.find(),
          mapTileTypes: MongoCollections.MapTileTypes.find()
        }
        */
    this.on('mount', ()=>{

      // load game assets
      var deferMaps = $.Deferred();
      Meteor.subscribe('maps', {
        onReady: ()=>{
          this.getMap();
          deferMaps.resolve();
        }
      });

      var deferMapTextures = $.Deferred();
      Meteor.subscribe('map_textures', {
        onReady: ()=>{
          this.getMapTextures();
          deferMapTextures.resolve();
        }
      });

      var deferMapTileTypes = $.Deferred();
      Meteor.subscribe('map_tile_types', {
        onReady: ()=>{
          this.getMapTileTypes();
          deferMapTileTypes.resolve();
        }
      });

      var deferCharacterImages = $.Deferred();
      Meteor.subscribe('characterImages', {
        onReady: ()=>{
          this.getMapTileTypes();
          deferCharacterImages.resolve();
        }
      });

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

      var deferBgmAudios = $.Deferred();
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

      var deferCodes = $.Deferred();
      Meteor.subscribe('codes', {
        onReady: ()=>{
          deferCodes.resolve();
        }
      });
      var deferObjects = $.Deferred();
      Meteor.subscribe('objects', {
        onReady: ()=>{
          deferObjects.resolve();
        }
      });

      // Game class initialization after all assets load complite
      $.when(
        deferMaps.promise(),
        deferMapTextures.promise(),
        deferMapTileTypes.promise(),
        deferCharacterImages.promise(),
        deferStories.promise(),
        deferStoryScenes.promise(),
        deferStoryItems.promise(),
        deferSentences.promise(),
        deferCharacters.promise(),
        deferBackgrounds.promise(),
        deferBackgroundImages.promise(),
        deferBgms.promise(),
        deferBgmAudios.promise(),
        deferSoundEffects.promise(),
        deferSoundEffectAudios.promise(),
        deferCodes.promise(),
        deferObjects.promise()
      ).done(()=> {
        var game = WrtGame.Game.getInstance();
        game.init(this.data);
		  });

      WrtGame.preventDefaultArrowKey();

    });

    this.on('unmount', ()=>{
      WrtGame.enableDefaultArrowKey();
    //  $('body').contextMenu( 'destroy' );
      var game = WrtGame.Game.getInstance();
      game.clear();
    });

    this.on('update', ()=>{
      this.getMap();
    });
  </script>

  <style scoped>
    div#canvasWrapper {
      position: absolute;
      top: 50px;
    }

    canvas#renderCanvas {
      width: 1200px;
      height: 800px;
      margin: 0px;
      position: absolute;
      top: 0px;
      z-index: 100;
      background-color: black;
    }

    canvas#tmlibCanvas {
      width: 1200px;
      height: 800px;
      margin: 0px;
      position: absolute;
      top: 0px;
      z-index: 300;
    }

    #game-ui {
      width: 1200px;
      height: 800px;
      margin: 0px;
      position: absolute;
      top: 0px;
      z-index: 200;
    }
  </style>
</game>
