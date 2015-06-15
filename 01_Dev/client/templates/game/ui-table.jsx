UiTable = React.createClass({

  renderColumn: function(column) {
    return <td>
      {column.title}
    </td>;
  },

  renderRecord: function(record) {
    return <tr>
      { record.columns.map(this.renderColumn) }
      </tr>;
  },

  render: function() {
    return <table className="ui-table">
      <tr>
        <th>{this.props.uiTable.title}</th>
      </tr>
      { this.props.uiTable.records.map(this.renderRecord) }
    </table>

  }

});
