<maps-list>
  <map-item each={maps} map={this}></map-item>
  <script>
    this.on('mount', ()=>{
      Meteor.subscribe('maps');
    });

    Meteor.autorun(()=> {
      this.maps = MongoCollections.Maps.find().fetch();
      this.update();
    });
  </script>
</maps-list>
