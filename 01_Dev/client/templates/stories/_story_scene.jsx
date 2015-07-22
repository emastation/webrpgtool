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
      var plusButton = <button type="button" className="plus circular ui icon button" data-dismiss="alert" onClick={this.insertStoryScene.bind(this, this.props.storyScene._id)}>
        <i className="plus icon"></i>
      </button>;
      var closeButton = <button type="button" className="close circular ui icon button" data-dismiss="alert" onClick={this.deleteStoryScene.bind(this, this.props.storyScene._id)}>
        <i className="remove icon"></i>
      </button>;
      var editButton =  <button type="button" className="edit circular ui icon button" data-dismiss="alert" onClick={this.goToStoryScenePage.bind(this, this.props.storyScene)}>
        <i className="edit icon"></i>
      </button>;
    } else {
      var sortableHandle = {};
      var plusButton = {};
      var closeButton = {};
      var editButton = {};
    }

    return <li data-id={this.props.storyScene._id} data-order={this.props.storyScene.order} className="sortable-item removable ui grid segment">
      <div className="two wide columns">
        { sortableHandle }
        { plusButton }
      </div>
      <span className="badge one wide columns">{this.props.storyScene.name}</span>
      <span className="badge one wide columns">{this.props.storyScene.order}</span>
      { editButton }
      { closeButton }
    </li>
  }
});
