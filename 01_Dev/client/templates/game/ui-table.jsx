UiTable = React.createClass({

  getInitialState: function() {
    return {
      currentCell: [0,0]
    };
  },

  renderColumn: function(column, columnIdx) {
    if (column.row === this.state.currentCell[0] && columnIdx === this.state.currentCell[1]) {
      var selectedCss = 'selected';
    } else {
      var selectedCss = '';
    }

    return <td id={'ui-table_' + this.props.uiTable.identifier + '_column-' + columnIdx}
        className={'ui-table-cell ' + selectedCss}>
      {column.title}
    </td>;
  },

  renderRecord: function(record, rowIdx) {
    return <tr id={'ui-table_' + this.props.uiTable.identifier + '_row-' + rowIdx}>
      { record.columns.map(this.renderColumn) }
      </tr>;
  },

  render: function() {
    return <table className="ui-table" id={ 'ui-table_' + this.props.uiTable.identifier}>
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
  },

  componentWillReceiveProps: function(newProps) {
    this.constructColumnsRowIdx(newProps);

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
    }

  }

});
