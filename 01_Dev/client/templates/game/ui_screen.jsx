UiScreen = React.createClass({

  renderUiTables: function(uiTable) {
    if (_.isUndefined(this.props.currentUiTableIdentifier) || this.props.currentUiTableIdentifier !== uiTable.identifier) {
      var uiOperation = void(0);
    } else {
      var uiOperation = this.props.uiOperation;
    }
    return <UiTable key={uiTable._id} uiTable={uiTable} uiOperation={uiOperation} />;
  },

  setCurrentUiTable: function(firstUiTableIdentifier) {
    var currentUiTable = MongoCollections.UiStatuses.findOne({type: 'CurrentUiTable'});

    var attributes = {
      value: firstUiTableIdentifier
    };
    MongoCollections.UiStatuses.update(currentUiTable._id, {$set: attributes}, function(error) {
      if (error) {
        alert(error.reason);
      }
    });
  },

  componentWillMount: function() {
    this.setCurrentUiTable(this.props.uiScreen.firstUiTable)
  },

  componentWillReceiveProps: function(newProps) {
    this.setCurrentUiTable(newProps.uiScreen.firstUiTable)
  },

  render: function() {
    return <div className="ui-screen" key={this.props.uiScreen._id} id={ 'ui-screen_' + this.props.uiScreen.identifier}>
      { this.props.uiTables.map(this.renderUiTables) }
    </div>
  }
});
