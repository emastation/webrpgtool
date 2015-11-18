<maps-list>
  <map-item each={maps} map={this} game_id={parent.opts.game_id}></map-item>
  <script>
    this.on('mount', ()=>{
      Meteor.subscribe('maps', {
        onReady: ()=>{
          this.getMaps();
        }
      });
    });

    getMaps() {
      if(opts.game_id) {
        this.maps = MongoCollections.Maps.find({ '$or' : [{'game_id': ''}, {'game_id': opts.game_id}]}).fetch();
        this.update();
      }
    }

    this.on('update', ()=>{
      Session.get('MapItem_changed');
      this.getMaps();
    });

    Meteor.autorun(()=> {
      this.getMaps();
    });
  </script>
</maps-list>
