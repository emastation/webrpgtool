StoryScene = React.createClass({

  goToStoryScenePage: function(storyScene) {
    Router.go('storyScenePage', {_id: storyScene.storyId, _id2: storyScene._id});
  },

  insertStoryScene: function(id) {
    var storySceneModelClicked = MongoCollections.StoryScenes.findOne(id);
    var attributes = {
      storyId: Router.current().params._id,
      name: "新規Scene",
      order: storySceneModelClicked.order
    };

    Meteor.call('storySceneAdd', attributes, function(error, result) { // display the error to the user and abort
      if (error)
        return alert(error.reason);

      if (result.storySceneExists) {
        return alert('This StoryScene has already been posted');
      }
    });
  },

  deleteStoryScene: function(id) {
    Meteor.call('storySceneDelete', id, function(error, result) { // display the error to the user and abort
//      if (error)
//        return alert(error.reason);
    });
  },

  render: function() {
    if (this.props.meteorUserExist) {
      var sortableHandle = <i className="sortable-handle mdi-action-view-headline pull-left">=&nbsp;</i>;
      var plusButton = <button type="button" className="plus" data-dismiss="alert" onClick={this.insertStoryScene.bind(this, this.props.storyScene._id)}>
        <span aria-hidden="true">+</span><span className="sr-only">Plus</span>
      </button>;
      var closeButton = <button type="button" className="close" data-dismiss="alert" onClick={this.deleteStoryScene.bind(this, this.props.storyScene._id)}>
        <span aria-hidden="true">&times;</span><span className="sr-only">Close</span>
      </button>;
      var editButton =  <button type="button" className="edit pull-right" data-dismiss="alert" onClick={this.goToStoryScenePage.bind(this, this.props.storyScene)}>
        <span aria-hidden="true">Edit</span><span className="sr-only">Edit</span>
      </button>;
    } else {
      var sortableHandle = {};
      var plusButton = {};
      var closeButton = {};
      var editButton = {};
    }

    return <li data-id={this.props.storyScene._id} data-order={this.props.storyScene.order} className="sortable-item removable well well-sm">
      { sortableHandle }
      { plusButton }
      <span className="name">{this.props.storyScene.name}</span>
      <span className="badge">{this.props.storyScene.order}</span>
      { editButton }
      { closeButton }
    </li>
  }
});
