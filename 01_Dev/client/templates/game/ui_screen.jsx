UiScreen = React.createClass({
  getInitialState: function() {
    return {
      uiTableStack: [this.props.uiScreen.firstUiTable],
      otherVisibleUiTables: []
    };
  },

  renderOtherVisibleUiTables: function(uiTable) {
    return <UiTable key={uiTable._id} uiTable={uiTable} uiTables={this.props.uiTables} uiOperation={void(0)} posterityUiTables={[]} />;
  },

  componentWillMount: function() {
    this.checkOtherVisibleUiTables(this.props, this.state.uiTableStack);
  },

  checkOtherVisibleUiTables: function(props, uiTableStack) {
    if (_.isUndefined(uiTableStack)) {
      return;
    }
    // 初期表示のその他UiTablesの取得
    var otherVisibleUiTableIdentifiers = props.uiScreen.otherVisibleUiTables;

    var otherVisibleUiTables = [];
    for (var i=0; i<otherVisibleUiTableIdentifiers.length; i++) {
      otherVisibleUiTables.push(this.getUiTableFromIdentifier(props, otherVisibleUiTableIdentifiers[i]));
    }

    // this.state.uiTableStack に入っていないもの（選択制御による表示の対象になっていないもの）のみ、その他初期表示する。
    var that = this;
    otherVisibleUiTables = _.filter(otherVisibleUiTables, function (uiTable) {
      return !_.contains(uiTableStack, uiTable.identifier);
    });

    this.setState({
      otherVisibleUiTables: otherVisibleUiTables
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

    /// UiScreenを切り替えた時に、this.state.uiTableStackが、切り替える前のUiScreenのもののままである場合があるので、それを検出して、正しく初期化する
    var uiTableIdentifiers = [];
    for (var i=0; i<newProps.uiTables.length; i++) {
      uiTableIdentifiers.push(newProps.uiTables[i].identifier);
    }
    var newUiTableStack = void(0);
    // UiScreenを切り替えた際に、this.state.uiTableStackが、ちゃんと切り替わった後のものであるならば、
    // this.state.uiTableStack の中は uiTableIdentifiersの中にある項目しか含んでいないはず（=条件A）
    if (_.difference(this.state.uiTableStack, uiTableIdentifiers).length !== 0) { // もし、差異があれば、条件Aを満たさない、つまりUiScreenが切り替わる前の古いuiTableStackなので
      newUiTableStack = [newProps.uiScreen.firstUiTable];
      this.setState({
        uiTableStack: newUiTableStack // 初期化しなおす
      });
    }

    if (newProps.uiTableOperation.type === 'next') {
      this.resetUiTableOperation();
      newUiTableStack = this.state.uiTableStack.concat(newProps.uiTableOperation.value);
      this.setState({
        uiTableStack: newUiTableStack
      });
    } else if (newProps.uiTableOperation.type === 'back') {
      this.resetUiTableOperation();

      this.state.uiTableStack.pop();
      newUiTableStack = this.state.uiTableStack;
      this.setState({
        uiTableStack: newUiTableStack
      });
    } else {
      if (this.state.uiTableStack.length === 1) {
        newUiTableStack = [newProps.uiScreen.firstUiTable];
        this.setState({
          uiTableStack: newUiTableStack
        });
      }
    }

    this.checkOtherVisibleUiTables(newProps, newUiTableStack);
  },

  getUiTableFromIdentifier: function(props, identifier) {
    var results = _.filter(props.uiTables, function (uiTable) {
      return uiTable.identifier === identifier;
    });
    return results[0]; // uiTableのidentifierはユニークという仕様なので、１つしか見つからないはず
  },


  render: function() {
    var uiOperation = this.props.uiOperation;
    var uiTable = this.getUiTableFromIdentifier(this.props, this.props.uiScreen.firstUiTable);

    return <div className="ui-screen" key={this.props.uiScreen._id} id={ 'ui-screen_' + this.props.uiScreen.identifier}>
      { this.state.otherVisibleUiTables.map(this.renderOtherVisibleUiTables) }
      <UiTable key={uiTable._id} uiTable={uiTable} uiTables={this.props.uiTables} uiOperation={uiOperation} posterityUiTables={this.state.uiTableStack.slice(1)} />
    </div>;
  }
});
