UiScreen = React.createClass({

  renderUiTables: function(uiTable) {
    if (uiTable.identifier === this.props.uiScreen.firstUiTable) {
      var uiOperation = this.props.uiOperation;
    } else {
      var uiOperation = void(0);
    }
    return <UiTable key={uiTable._id} uiTable={uiTable} uiOperation={uiOperation} />;
  },

  render: function() {
    return <div className="ui-screen" key={this.props.uiScreen._id} id={ 'ui-screen_' + this.props.uiScreen.identifier}>
      { this.props.uiTables.map(this.renderUiTables) }
    </div>
  }
});
