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

  componentWillMount: function() {

    for(var i=0; i<this.props.uiTable.records.length; i++) {
      for(var j=0; j<this.props.uiTable.records[i].columns.length; j++) {
        this.props.uiTable.records[i].columns[j]['row'] = i;
      }
    }

  }

});
