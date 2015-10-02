<ui-table>
  <div>
    <table class="ui-table" id="ui-table_{opts.ui_table.identifier}">
      <tr>
        <th>{opts.ui_table.title}</th>
      </tr>
      <tr each="{name, i in opts.ui_table.records}" id="ui-table_{parent.opts.ui_table.identifier}_row-{i}">
        <td each={name, i in name.columns} id="ui-table_{parent.parent.opts.ui_table.identifier}_column-{i}" class="ui-table-cell {determinSelectedCSS(name, i)}">
          <span>{name.title}</span>
        </td>
      </tr>
    </table>
    <div each={_.isUndefined(opts.posterity_ui_tables[0]) ? [] : [true]}>
      <ui-table ui_table={parent.checkPosterityUiTables()} ui_tables={parent.opts.ui_tables} ui_operation={parent.opts.ui_operation} posterity_ui_tables={parent.opts.posterity_ui_tables.slice(1)} />
    </div>
  </div>

  <script>
    this.mixin('ikki'); // THIS LINE IS NEEDED TO USE IKKI'S FEATURES

    this.currentCell = [0,0]; // index 0 is a record, index 1 is a index of column
    this.selectable = false; // whether yoelect an item or not.

    this.on('mount', ()=>{
      this.selectionMoving = false;
    })

    this.determinSelectedCSS = (column, columnIdx)=> {
      if (this.selectable && column.row === this.currentCell[0] && columnIdx === this.currentCell[1]) {
        return selectedCss = 'selected';
      } else {
        return selectedCss = '';
      }
    };

    this.getUiTableFromIdentifier = function(identifier) {
      var results = _.filter(opts.ui_tables, function (uiTable) {
        return uiTable.identifier === identifier;
      });
      return results[0]; // uiTable's identifier is unique. so this array's length is only one.
    };

    this.checkPosterityUiTables = ()=> {
      if (_.isUndefined(opts.posterity_ui_tables[0])) { // if self uiTable is last one.
        var existPosterityUiTables = false;
      } else {
        var uiTable = this.getUiTableFromIdentifier(opts.posterity_ui_tables[0]);
        if (_.isUndefined(uiTable)) {
          var existPosterityUiTables = false;
        } else {
          var existPosterityUiTables = true;
        }
      }
      return uiTable;
    };

    this.constructColumnsRowIdx = ()=> {
      for(var i=0; i<opts.ui_table.records.length; i++) {
        for(var j=0; j<opts.ui_table.records[i].columns.length; j++) {
          opts.ui_table.records[i].columns[j]['row'] = i;
        }
      }
    };

    // Moving UiTable（go back to previous UiTable）
    this.goBackUiTable = function() {
      var rowIdx = this.currentCell[0];
      var clmIdx = this.currentCell[1];

      var uiTableOperation = MongoCollections.UiTableOperations.findOne();
      var attributes = {
        type: 'back'
      };
      MongoCollections.UiTableOperations.update(uiTableOperation._id, {$set: attributes}, function (error) {
        if (error) {
          alert(error.reason);
        }
      });
    };

    // change UiOperation to NO MOVE
    this.resetUiOperations = function() {
      var attributes = {
        operation: WrtGame.L_UI_NO_MOVE,
        times: 0
      };

      MongoCollections.UiOperations.update(opts.ui_operation._id, {$set: attributes}, function(error) {
        if (error) {
          // display the error to the user
          alert(error.reason);
        }
      });
    };

    this.on('update', ()=>{
      if (_.isUndefined(opts.ui_table)) {
        return;
      }

      this.constructColumnsRowIdx();

      if (_.isUndefined(opts.ui_operation)) {
        this.selectable = false; // selection is invisible
        this.update();
        return;
      } else {
        this.selectable = true; // selection is visibule
      }

      if (_.isUndefined(opts.posterity_ui_tables) || !_.isUndefined(opts.posterity_ui_tables[0])) { // if this uiTable is not leaf, return.
        return;
      }

      if (!_.isEqual(this.lastUiTables, opts.ui_tables)) { // if UiScreen has changed
        this.currentCell = [0,0];
        this.update();
      }


      if (opts.ui_operation.operation === WrtGame.L_UI_MOVE_LOWER && !this.selectionMoving) {
        if (this.currentCell[0] >= opts.ui_table.records.length-1) {
          var newIdx = opts.ui_table.records.length-1;
        } else {
          var newIdx = this.currentCell[0] + 1;
        }
        this.currentCell = [newIdx, this.currentCell[1]];
        this.selectionMoving = true;

      } else if (opts.ui_operation.operation === WrtGame.L_UI_MOVE_UPPER && !this.selectionMoving) {
        if (this.currentCell[0] <= 0) {
          var newIdx = 0;
        } else {
          var newIdx = this.currentCell[0] - 1;
        }

        this.currentCell = [newIdx, this.currentCell[1]];
        this.selectionMoving = true;

      } else if (opts.ui_operation.operation === WrtGame.L_UI_PUSH_OK) { // if you push OK

        // change UiOperation to NO MOVE
        this.resetUiOperations();

        var rowIdx = this.currentCell[0];
        var clmIdx = this.currentCell[1];

        // execute the bound function
        var functionName = opts.ui_table.records[rowIdx].columns[clmIdx].functionName;
        if (_.isUndefined(functionName)) {
          console.debug("このメニュー項目にはJavaScript関数がバインドされていません。");
        } else {
      //        window.WrtGame.UserFunctions[functionName]();
          var userFunctionsManager = WrtGame.UserFunctionsManager.getInstance();
          userFunctionsManager.execute(functionName, 'UI');
        }

        // Switching UiScreen
        var goToUiScreenIdentifier = opts.ui_table.records[rowIdx].columns[clmIdx].goToUiScreen;
        if (!_.isUndefined(goToUiScreenIdentifier)) {
          var currentUiScreen = MongoCollections.UiStatuses.findOne({type: 'CurrentUiScreen'});

          var attributes = {
            value: goToUiScreenIdentifier
          };
          MongoCollections.UiStatuses.update(currentUiScreen._id, {$set: attributes}, (error)=> {
            if (error) {
              alert(error.reason);
            }
          });
          return;
        }

        // Moving UiTable（go to next UiTable）
        var nextUiTableIdentifier = opts.ui_table.records[rowIdx].columns[clmIdx].nextUiTable;
        if (!_.isUndefined(nextUiTableIdentifier)) {
          var uiTableOperation = MongoCollections.UiTableOperations.findOne();
          var attributes = {
            type: 'next',
            value: nextUiTableIdentifier
          };
          MongoCollections.UiTableOperations.update(uiTableOperation._id, {$set: attributes}, function (error) {
            if (error) {
              alert(error.reason);
            }
          });
          return;
        }

        // Moving UiTable（go back to previous UiTable）
        var backUiTable_flg = opts.ui_table.records[rowIdx].columns[clmIdx].backUiTable;
        if (!_.isUndefined(backUiTable_flg) && backUiTable_flg) {
          this.goBackUiTable();
        }

      } else if (opts.ui_operation.operation === WrtGame.L_UI_PUSH_CANCEL) {
        // change UiOperation to NO MOVE
        this.resetUiOperations();

        // Moving UiTable（go back to previous UiTable）
        this.goBackUiTable();
      } else if (opts.ui_operation.operation === WrtGame.L_UI_NO_MOVE) {
        this.selectionMoving = false;
      }

      this.lastUiTables = opts.ui_tables;

    });

  </script>

  <style scoped>
    table.ui-table {
      background-color: white;
      border: 2px #999999 solid;
    }
    table.ui-table th {
      border: 2px #999999 solid;
    }

    td.ui-table-cell.selected {
      background-color: yellow;
    }


  </style>
</ui-table>
