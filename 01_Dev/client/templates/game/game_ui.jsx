var GameUi = ReactMeteor.createClass({
  templateName: "gameUi",

  startMeteorSubscriptions: function() {
    Meteor.subscribe("uiScreens");
    Meteor.subscribe("uiTables");
  },

  getInitialState: function() {
    return {
      firstUiScreen: ''
    };
  },

  getMeteorState: function() {
    var uiTables = [];
    var currentUiScreen = MongoCollections.UiStatuses.findOne({type: 'CurrentUiScreen'});
    var uiScreen = MongoCollections.UiScreens.findOne({identifier: currentUiScreen.value});
    if (!_.isUndefined(uiScreen)) {
      for (var i=0; i<uiScreen.uiTables.length; i++) {
        uiTables.push(MongoCollections.UiTables.findOne({identifier: uiScreen.uiTables[i]}));
      }
    }
    var uiOperation = MongoCollections.UiOperations.findOne();

    var uiTableOperation = MongoCollections.UiTableOperations.findOne();
    return {
      uiScreen: uiScreen,
      uiTables: uiTables,
      uiOperation: uiOperation,
      uiTableOperation: uiTableOperation
    };
  },

  render: function() {

    if (_.isUndefined(this.state.uiScreen)) {
      var uiScreen = {};
    } else {
      var uiScreen = <UiScreen uiScreen={this.state.uiScreen}
                               uiTables={this.state.uiTables}
                               uiOperation={this.state.uiOperation}
                               uiTableOperation={this.state.uiTableOperation} />;
    }

    return <div id="game-ui-body">
      { uiScreen }
    </div>

  }

});
