StoryScene = React.createClass({

  goToStoryScenePage: function(storyScene) {
    Router.go('storyScenePage', {_id: storyScene.storyId, _id2: storyScene._id});
  },

  render: function() {
    if (this.props.meteorUserExist) {
      var sortableHandle = <i className="sortable-handle mdi-action-view-headline pull-left">=&nbsp;</i>;
      var editButton =  <button type="button" className="edit pull-right" data-dismiss="alert" onClick={this.goToStoryScenePage.bind(this, this.props.storyScene)}>
        <span aria-hidden="true">Edit</span><span className="sr-only">Edit</span>
      </button>;
    } else {
      var sortableHandle = {};
      var editButton = {};
    }

    return <li data-id={this.props.storyScene._id} data-order={this.props.storyScene.order} className="sortable-item removable well well-sm">
      { sortableHandle }
      <span className="name">{this.props.storyScene.name}</span>
      <span className="badge">{this.props.storyScene.order}</span>
      { editButton }
    </li>
  }
});
