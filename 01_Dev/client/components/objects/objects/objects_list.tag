<objects-list>
  <object-item each={objects} object={this} object_schema={objectSchema} is_login={parent.opts.is_login}></object-item>
  <script>
  this.objects = [];

  getObjects() {
    if(!_.isUndefined(opts.schema_id)) {
      this.objectSchema = MongoCollections.ObjectSchemata.findOne({_id: opts.schema_id});
      if (this.objectSchema) {
        this.objects = MongoCollections.Objects.find({schema_identifier: this.objectSchema.identifier}).fetch();
        this.objects.forEach((object)=> {
          object.attributes.forEach((attribute)=> {
            var schemaAttrib = _.filter(this.objectSchema.attributes, (attrib)=>{
              return attrib.identifier === attribute.identifier;
            })[0];
            attribute.name = schemaAttrib.name;
            attribute.type = schemaAttrib.type;
          });
        });
        this.update();
      }
    }
  }

  this.on('mount', ()=>{
    var deferObjectSchemata = $.Deferred();
    Meteor.subscribe('objectSchemata', {
      onReady: ()=>{
        deferObjectSchemata.resolve();
      }
    });
    var deferObjects = $.Deferred();
    Meteor.subscribe('objects', {
      onReady: ()=>{
        deferObjects.resolve();
      }
    });
    $.when(deferObjectSchemata.promise(), deferObjects.promise()).done(()=> {
      this.getObjects();
    });
  });

  this.on('update', ()=>{
    this.getObjects();
  });

  Meteor.autorun(()=> {
    Session.get('ObjectItem_changed');
    this.getObjects();
  });

  </script>
</objects-list>
