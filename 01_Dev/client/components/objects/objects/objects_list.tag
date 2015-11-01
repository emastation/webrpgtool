<objects-list>
  <object-item each={objects} object={this}></object-item>
  <script>
    this.on('mount', ()=>{
      Meteor.subscribe('objects');
    });

    Meteor.autorun(()=> {
      this.objects = MongoCollections.Objects.find().fetch();
      this.update();
    });
  </script>
</objects-list>
