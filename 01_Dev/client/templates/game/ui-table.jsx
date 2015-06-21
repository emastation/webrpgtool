UiTable = React.createClass({

  getInitialState: function() {
    return {
      currentCell: [0,0], // 0要素目がレコード、1要素目がカラムのインデックス
      selectable: false // 選択が見えるかどうか
    };
  },

  renderColumn: function(column, columnIdx) {
    if (this.state.selectable && column.row === this.state.currentCell[0] && columnIdx === this.state.currentCell[1]) {
      var selectedCss = 'selected';
    } else {
      var selectedCss = '';
    }

    return <td key={this.props.uiTable._id + '_column-' + columnIdx} id={'ui-table_' + this.props.uiTable.identifier + '_column-' + columnIdx}
        className={'ui-table-cell ' + selectedCss}>
      {column.title}
    </td>;
  },

  renderRecord: function(record, rowIdx) {
    return <tr key={this.props.uiTable._id + '_row-' + rowIdx} id={'ui-table_' + this.props.uiTable.identifier + '_row-' + rowIdx}>
      { record.columns.map(this.renderColumn) }
      </tr>;
  },

  render: function() {
    if (_.isUndefined(this.props.posterityUiTables[0])) { // 自分が末端であれば
      var uiTableJsx = {}
    } else {
      var uiTable = this.getUiTableFromIdentifier(this.props, this.props.posterityUiTables[0]);
      if (_.isUndefined(uiTable)) {
        var uiTableJsx = {}
      } else {
        var uiTableJsx = <UiTable key={uiTable._id} uiTable={uiTable} uiTables={this.props.uiTables} uiOperation={this.props.uiOperation} posterityUiTables={this.props.posterityUiTables.slice(1)} />;
      }
    }

    return <div>
    <table className="ui-table" key={this.props.uiTable._id} id={ 'ui-table_' + this.props.uiTable.identifier}>
      <tr>
        <th>{this.props.uiTable.title}</th>
      </tr>
      { this.props.uiTable.records.map(this.renderRecord) }
    </table>
      { uiTableJsx }
    </div>;

  },

  getUiTableFromIdentifier: function(props, identifier) {
    var results = _.filter(props.uiTables, function (uiTable) {
      return uiTable.identifier === identifier;
    });
    return results[0]; // uiTableのidentifierはユニークという仕様なので、１つしか見つからないはず
  },

  constructColumnsRowIdx: function(props) {
    for(var i=0; i<props.uiTable.records.length; i++) {
      for(var j=0; j<props.uiTable.records[i].columns.length; j++) {
        props.uiTable.records[i].columns[j]['row'] = i;
      }
    }
  },

  componentWillMount: function() {
    this.constructColumnsRowIdx(this.props);

    if (_.isUndefined(this.props.uiOperation)) {
      this.setState({
        selectable: false // 選択が見えないようにする
      });
    } else {
      this.setState({
        selectable: true // 選択が見えるようにする
      });
    }

  },

  componentWillReceiveProps: function(newProps) {
    this.constructColumnsRowIdx(newProps);

    if (_.isUndefined(newProps.uiOperation)) {
      this.setState({
        selectable: false // 選択が見えないようにする
      });
      return;
    } else {
      this.setState({
        selectable: true // 選択が見えるようにする
      });
    }

    if (!_.isUndefined(this.props.posterityUiTables[0])) { // 自分が末端でなければ
      return;
    }

    if (newProps.uiOperation.operation === WrtGame.L_UI_MOVE_LOWER) {
      if (this.state.currentCell[0] >= newProps.uiTable.records.length-1) {
        var newIdx = newProps.uiTable.records.length-1;
      } else {
        var newIdx = this.state.currentCell[0] + 1;
      }

      this.setState({
        currentCell:[newIdx, this.state.currentCell[1]]
      });
    } else if (newProps.uiOperation.operation === WrtGame.L_UI_MOVE_UPPER) {
      if (this.state.currentCell[0] <= 0) {
        var newIdx = 0;
      } else {
        var newIdx = this.state.currentCell[0] - 1;
      }

      this.setState({
        currentCell:[newIdx, this.state.currentCell[1]]
      });
    } else if (newProps.uiOperation.operation === WrtGame.L_UI_PUSH_OK) { // OK を押した時

      // まずは、UiOperationを「何も操作しない」に変更。
      var attributes = {
        operation: WrtGame.L_UI_NO_MOVE,
        times: 0
      };

      MongoCollections.UiOperations.update(newProps.uiOperation._id, {$set: attributes}, function(error) {
        if (error) {
          // display the error to the user
          alert(error.reason);
        }
      });


      var rowIdx = this.state.currentCell[0];
      var clmIdx = this.state.currentCell[1];

      // バインドされた関数の実行
      var functionName = newProps.uiTable.records[rowIdx].columns[clmIdx].functionName;
      if (_.isUndefined(functionName)) {
        console.debug("このメニュー項目にはJavaScript関数がバインドされていません。");
      } else {
        window.WrtGame.UserFunctions[functionName]();
      }

      // UiScreenの切り替え
      var goToUiScreenIdentifier = newProps.uiTable.records[rowIdx].columns[clmIdx].goToUiScreen;
      if (!_.isUndefined(goToUiScreenIdentifier)) {
        var currentUiScreen = MongoCollections.UiStatuses.findOne({type: 'CurrentUiScreen'});

        var attributes = {
          value: goToUiScreenIdentifier
        };
        MongoCollections.UiStatuses.update(currentUiScreen._id, {$set: attributes}, function(error) {
          if (error) {
            alert(error.reason);
          }
        });
        return;
      }

      // UiTableの移動（次のUiTableへ）
      var nextUiTableIdentifier = newProps.uiTable.records[rowIdx].columns[clmIdx].nextUiTable;
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

      // UiTableの移動（前のUiTableへ戻る）
      var backUiTable_flg = newProps.uiTable.records[rowIdx].columns[clmIdx].backUiTable;
      if (!_.isUndefined(backUiTable_flg) && backUiTable_flg) {
        var uiTableOperation = MongoCollections.UiTableOperations.findOne();
        var attributes = {
          type: 'back'
        };
        MongoCollections.UiTableOperations.update(uiTableOperation._id, {$set: attributes}, function (error) {
          if (error) {
            alert(error.reason);
          }
        });
      }
    }

  }

});
