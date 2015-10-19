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

      Meteor.subscribe('stories');
      Meteor.subscribe('storyScenes');
      Meteor.subscribe('storyItems');
      Meteor.subscribe('sentences');
      Meteor.subscribe("characters");
      Meteor.subscribe("backgrounds");
      Meteor.subscribe("backgroundImages");
      Meteor.subscribe('codes');

      // Game class initialization after all assets load complite
      $.when(deferMaps.promise(), deferMapTextures.promise(), deferMapTileTypes.promise(), deferCharacterImages.promise()).done(()=> {
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
