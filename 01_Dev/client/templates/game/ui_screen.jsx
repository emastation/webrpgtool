UiScreen = React.createClass({
  getInitialState: function() {
    return {
      uiTableStack: [this.props.uiScreen.firstUiTable]
    };
  },

  renderUiTables: function(uiTable) {
    if (_.isUndefined(this.state.uiTableStack.last) || this.state.uiTableStack.last !== uiTable.identifier) {
      var uiOperation = void(0);
    } else {
      var uiOperation = this.props.uiOperation;
    }
    return <UiTable key={uiTable._id} uiTable={uiTable} uiOperation={uiOperation} />;
  },
  componentWillMount: function() {
    this.setState({
      uiTableStack: [this.props.uiScreen.firstUiTable]
    });

  },

  resetUiTableOperation: function () {
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
  },
  componentWillReceiveProps: function(newProps) {

    if (newProps.uiTableOperation.type === 'next') {
      this.resetUiTableOperation();
      if (_.contains(this.state.uiTableStack, newProps.uiTableOperation.value)) {
        return;
      }
      this.state.uiTableStack.push(newProps.uiTableOperation.value);
      this.setState({
        uiTableStack: this.state.uiTableStack
      });
    } else if (newProps.uiTableOperation.type === 'back') {
      this.resetUiTableOperation();
      this.state.uiTableStack.pop();
      this.setState({
        uiTableStack: this.state.uiTableStack
      });
    } else {
      if (this.state.uiTableStack.length === 1) {
        this.setState({
          uiTableStack: [newProps.uiScreen.firstUiTable]
        });
      }
    }

  },

  render: function() {
    return <div className="ui-screen" key={this.props.uiScreen._id} id={ 'ui-screen_' + this.props.uiScreen.identifier}>
      { this.props.uiTables.map(this.renderUiTables) }
    </div>
  }
});
