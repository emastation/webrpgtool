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
    var uiTables = UiTables.find().fetch();

    return {
      uiTables: uiTables
    };
  },

  renderUiTable: function(model) {
    return <UiTable key={model._id} uiTable={model} />;
  },

  render: function() {

    return <div id="game-ui-body">
      { this.state.uiTables.map(this.renderUiTable) }
    </div>

  }

});
