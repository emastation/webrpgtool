<object-schemata-list>
  <object-schema-item each={objectSchemata} object_schema={this} game_id={parent.opts.game_id}></object-schema-item>
  <script>
    this.on('mount', ()=>{
      Meteor.subscribe('objectSchemata', {
        onReady: ()=>{
          this.getObjectSchemata();
        }
      });
    });

    getObjectSchemata() {
      this.objectSchemata = MongoCollections.ObjectSchemata.find({'$or' : [{'game_id': ''}, {'game_id': opts.game_id}]}).fetch();
      this.update();
    }

    Meteor.autorun(()=> {
      Session.get('ObjectSchemaItem_changed');
      this.getObjectSchemata();
    });

    this.on('update', ()=>{
      this.getObjectSchemata();
    });

  </script>
</object-schemata-list>
