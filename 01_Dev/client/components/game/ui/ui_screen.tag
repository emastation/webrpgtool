<ui-screen>
  <div class="ui-screen" id="ui-screen_{opts.ui_screen.identifier}">
    <ui-table each={otherVisibleUiTables} ui_table={this} uiTables={opts.uiTables} ui_operation={void(0)} posterity_ui_tables={[]} />
    <ui-table ui_table={uiTable} ui_tables={opts.ui_tables} ui_operation={opts.ui_operation} posterity_ui_tables={uiTableStack.slice(1)} />
  </div>

  <script>

    this.getUiTableFromIdentifier = (identifier)=> {
      var results = _.filter(opts.ui_tables, function (uiTable) {
        return uiTable.identifier === identifier;
      });
      return results[0]; // uiTable's identifier is unique. so this array's length is only one.
    };
    // check other visible UiTables on init.
    this.checkOtherVisibleUiTables = (uiTableStack)=> {
      if (_.isUndefined(uiTableStack)) {
        return;
      }
      var otherVisibleUiTableIdentifiers = opts.ui_screen.otherVisibleUiTables;

      var otherVisibleUiTables = [];
      for (var i=0; i<otherVisibleUiTableIdentifiers.length; i++) {
        otherVisibleUiTables.push(this.getUiTableFromIdentifier(otherVisibleUiTableIdentifiers[i]));
      }

      // display tables which are not in 'uiTableStack' array
      // (in other word, which are out of display controll by user selection)
      // as initial visible tables.
      this.otherVisibleUiTables = _.filter(otherVisibleUiTables, function (uiTable) {
        return !_.contains(uiTableStack, uiTable.identifier);
      });

    };

    this.resetUiTableOperation = ()=> {
      var uiTableOperation = MongoCollections.UiTableOperations.findOne();
      var attributes = {
        type: void(0),
        value: void(0)
      };
      MongoCollections.UiTableOperations.update(uiTableOperation._id, {$set: attributes}, function (error) {
        if (error) {
          alert(error.reason);
        }
      });
    };

    this.on('update', ()=>{
      if (_.isUndefined(opts.ui_screen) || _.isUndefined(opts.ui_tables)) {
        return;
      }
      if (!this.uiTableStack || this.uiTableStack[0] !== opts.ui_screen.firstUiTable) {
        this.uiTableStack = [opts.ui_screen.firstUiTable];
        this.otherVisibleUiTables = [];
        this.uiTable = this.getUiTableFromIdentifier(opts.ui_screen.firstUiTable);
      }

      if (opts.ui_table_operation.type === 'next') {
        this.resetUiTableOperation();
        this.uiTableStack = this.uiTableStack.concat(opts.ui_table_operation.value);
      } else if (opts.ui_table_operation.type === 'back') {
        this.resetUiTableOperation();
        this.uiTableStack.pop();
      } else {
        if (this.uiTableStack.length === 1) {
          this.uiTableStack = [opts.ui_screen.firstUiTable];
        }
      }

      this.checkOtherVisibleUiTables(this.uiTableStack);
      this.update();
    });
  </script>
</ui-screen>
