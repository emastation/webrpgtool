<codes-list>
  <code-item each={codes} code={this}></code-item>
  <script>
    this.on('mount', ()=>{
      Meteor.subscribe('codes');
    });

    Meteor.autorun(()=> {
      this.codes = MongoCollections.Codes.find().fetch();
      this.update();
    });
  </script>
</codes-list>
