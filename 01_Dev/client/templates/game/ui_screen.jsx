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
      if (_.contains(this.state.uiTableStack, newProps.uiTableOperation.value)) {
        return;
      }
      this.state.uiTableStack.push(newProps.uiTableOperation.value);
      this.setState({
        uiTableStack: this.state.uiTableStack
      });
//      this.resetUiTableOperation();
    } else if (newProps.uiTableOperation.type === 'back') {
      this.state.uiTableStack.pop();
      this.setState({
        uiTableStack: this.state.uiTableStack
      });
      this.resetUiTableOperation();
    } else {
      console.log("this.state.uiTableStack: "+this.state.uiTableStack);
      this.setState({
        uiTableStack: [newProps.uiScreen.firstUiTable]
      });
    }

  },

  render: function() {
    return <div className="ui-screen" key={this.props.uiScreen._id} id={ 'ui-screen_' + this.props.uiScreen.identifier}>
      { this.props.uiTables.map(this.renderUiTables) }
    </div>
  }
});
