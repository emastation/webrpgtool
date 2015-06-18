var GameUi = ReactMeteor.createClass({
  templateName: "gameUi",

  startMeteorSubscriptions: function() {
    Meteor.subscribe("uiTables");
  },

  getInitialState: function() {
    return {
    };
  },

  getMeteorState: function() {
    var uiTables = MongoCollections.UiTables.find().fetch();
    var uiOperation = UiOperations.findOne();

    return {
      uiTables: uiTables,
      uiOperation: uiOperation
    };
  },

  renderUiTable: function(model) {
    return <UiTable key={model._id} uiTable={model} uiOperation={this.state.uiOperation} />;
  },

  render: function() {

    return <div id="game-ui-body">
      { this.state.uiTables.map(this.renderUiTable) }
    </div>

  }

});
