<game>
  <div id="canvasWrapper">
    <p>Game! {data.map.title}</p>
    <canvas id="renderCanvas"></canvas>
    <canvas id="tmlibCanvas"></canvas>
    <game-ui></game-ui>
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

      // Game class initialization after all assets load complite
      $.when(deferMaps.promise(), deferMapTextures.promise(), deferMapTileTypes.promise()).done(()=> {
        var game = WrtGame.Game.getInstance();
        game.init(this.data);
		  });
    });

    this.on('update', ()=>{
      this.getMap();
    });
  </script>
</game>
