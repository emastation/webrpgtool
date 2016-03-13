<game-ui>
  <ui-screen ui_screen={uiScreen} ui_tables={uiTables}
            ui_operation={uiOperation} ui_table_operation={uiTableOperation} />

  <script>
  this.on('mount', ()=>{
    Meteor.subscribe('uiScreens');
    Meteor.subscribe('uiTables');
  });

  Meteor.autorun(()=> {
    this.uiTables = [];
    var currentUiScreen = MongoCollections.UiStatuses.findOne({type: 'CurrentUiScreen'});
    this.uiScreen = MongoCollections.UiScreens.findOne({identifier: currentUiScreen.value});
    if (!_.isUndefined(this.uiScreen)) {
      for (var i=0; i<this.uiScreen.uiTables.length; i++) {
        this.uiTables.push(MongoCollections.UiTables.findOne({identifier: this.uiScreen.uiTables[i]}));
      }
    }
    this.uiOperation = MongoCollections.UiOperations.findOne();

    this.uiTableOperation = MongoCollections.UiTableOperations.findOne();

    this.update();
  });
  </script>
  <style scoped>
    :scope {
      pointer-events: none;
    }
  </style>

  </script>
</game-ui>
