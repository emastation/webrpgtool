UiScreen = React.createClass({

  renderUiTables: function(uiTable) {
    return <UiTable key={uiTable._id} uiTable={uiTable} uiOperation={this.props.uiOperation} />;
  },

  render: function() {
    return <div className="ui-screen" key={this.props.uiScreen._id} id={ 'ui-screen_' + this.props.uiScreen.identifier}>
      { this.props.uiTables.map(this.renderUiTables) }
    </div>
  }
});
