<object-schemata-list>
  <object-schema-item each={objectSchemata} object_schema={this}></object-schema-item>
  <script>
    this.on('mount', ()=>{
      Meteor.subscribe('objectSchemata');
    });

    Meteor.autorun(()=> {
      this.objectSchemata = MongoCollections.ObjectSchemata.find().fetch();
      this.update();
    });
  </script>
</object-schemata-list>
