<codes-list>
  <code-item each={codes} code={this} game_id={parent.opts.game_id}></code-item>
  <script>
    this.on('mount', ()=>{
      Meteor.subscribe('codes', {
        onReady: ()=>{
          this.getCodes();
        }
      });
    });

    getCodes() {
      this.codes = MongoCollections.Codes.find({ '$or' : [{'game_id': ''}, {'game_id': opts.game_id}]}).fetch();
      this.update();
    }

    Meteor.autorun(()=> {
      this.getCodes();
    });
  </script>
</codes-list>
