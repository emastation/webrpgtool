UiScreen = React.createClass({
  getInitialState: function() {
    return {
      uiTableStack: [this.props.uiScreen.firstUiTable]
    };
  },

  renderOtherVisibleUiTables: function(uiTable) {
    return <UiTable key={uiTable._id} uiTable={uiTable} uiTables={this.props.uiTables} uiOperation={void(0)} posterityUiTables={[]} />;
  },

  componentWillMount: function() {
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

    /// UiScreenを切り替えた時に、this.state.uiTableStackが、切り替える前のUiScreenのもののままである場合があるので、それを検出して、正しく初期化する
    var uiTableIdentifiers = [];
    for (var i=0; i<newProps.uiTables.length; i++) {
      uiTableIdentifiers.push(newProps.uiTables[i].identifier);
    }
    // UiScreenを切り替えた際に、this.state.uiTableStackが、ちゃんと切り替わった後のものであるならば、
    // this.state.uiTableStack の中は uiTableIdentifiersの中にある項目しか含んでいないはず（=条件A）
    if (_.difference(this.state.uiTableStack, uiTableIdentifiers).length !== 0) { // もし、差異があれば、条件Aを満たさない、つまりUiScreenが切り替わる前の古いuiTableStackなので
      this.setState({
        uiTableStack: [newProps.uiScreen.firstUiTable] // 初期化しなおす
      });
    }

    if (newProps.uiTableOperation.type === 'next') {
      this.resetUiTableOperation();
      /*
      if (_.contains(this.state.uiTableStack, newProps.uiTableOperation.value)) {
        return;
      }
      */
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

  getUiTableFromIdentifier: function(identifier) {
    var results = _.filter(this.props.uiTables, function (uiTable) {
      return uiTable.identifier === identifier;
    });
    return results[0]; // uiTableのidentifierはユニークという仕様なので、１つしか見つからないはず
  },


  render: function() {
    var uiOperation = this.props.uiOperation;
    var uiTable = this.getUiTableFromIdentifier(this.props.uiScreen.firstUiTable);
    var otherVisibleUiTableIdentifiers = this.props.uiScreen.otherVisibleUiTables;
    var otherVisibleUiTables = otherVisibleUiTableIdentifiers.map(this.getUiTableFromIdentifier);

    return <div className="ui-screen" key={this.props.uiScreen._id} id={ 'ui-screen_' + this.props.uiScreen.identifier}>
      { otherVisibleUiTables.map(this.renderOtherVisibleUiTables) }
      <UiTable key={uiTable._id} uiTable={uiTable} uiTables={this.props.uiTables} uiOperation={uiOperation} posterityUiTables={this.state.uiTableStack.slice(1)} />
    </div>;
  }
});
