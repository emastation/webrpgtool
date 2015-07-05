var GameUi = React.createClass({
  mixins: [ReactMeteorData],

  getInitialState: function() {
    return {
      firstUiScreen: ''
    };
  },

  getMeteorData: function() {
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

    if (_.isUndefined(this.data.uiScreen)) {
      var uiScreen = {};
    } else {
      var uiScreen = <UiScreen uiScreen={this.data.uiScreen}
                               uiTables={this.data.uiTables}
                               uiOperation={this.data.uiOperation}
                               uiTableOperation={this.data.uiTableOperation} />;
    }

    return <div id="game-ui-body">
      { uiScreen }
    </div>

  }

});

Template.gamePage.helpers({
  GameUi() {
    return GameUi;
  }
});
