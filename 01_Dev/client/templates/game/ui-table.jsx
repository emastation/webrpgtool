UiTable = React.createClass({

  getInitialState: function() {
    return {
      currentCell: [0,0] // 0要素目がレコード、1要素目がカラムのインデックス
    };
  },

  renderColumn: function(column, columnIdx) {
    if (column.row === this.state.currentCell[0] && columnIdx === this.state.currentCell[1]) {
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
    return <table className="ui-table" key={this.props.uiTable._id} id={ 'ui-table_' + this.props.uiTable.identifier}>
      <tr>
        <th>{this.props.uiTable.title}</th>
      </tr>
      { this.props.uiTable.records.map(this.renderRecord) }
    </table>

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
      this.state.currentCell[0] = -1; // 見えないようにする
      return;
    }

  },

  componentWillReceiveProps: function(newProps) {
    this.constructColumnsRowIdx(newProps);

    if (_.isUndefined(newProps.uiOperation)) {
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
      var goToUiScreenStr = newProps.uiTable.records[rowIdx].columns[clmIdx].goToUiScreen;
      if (!_.isUndefined(goToUiScreenStr)) {
        var currentUiScreen = MongoCollections.UiStatuses.findOne({type: 'CurrentUiScreen'});

        var attributes = {
          value: goToUiScreenStr
        };
        MongoCollections.UiStatuses.update(currentUiScreen._id, {$set: attributes}, function(error) {
          if (error) {
            alert(error.reason);
          }
        });
      }
    }

  }

});
