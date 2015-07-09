Story = React.createClass({

  collectionName: "stories",

  getInitialState: function() {
    return {
      editable: false
    };
  },

  goToStoryPage: function(id) {
    Router.go('storyPage', {_id: id});
  },

  insertStory: function(id, evt) {
    var storyModelClicked = MongoCollections.Stories.findOne(id);

    var story = {
      title: 'Untitled',
      order: storyModelClicked.order
    };

    Meteor.call('storyInsert', story, function(error, result) { // display the error to the user and abort
      if (error)
        return alert(error.reason);

      if (result.storyExists) {
        return alert('This Story has already been posted');
      }
    });

  },

  deleteStory: function(id) {

    Meteor.call('storyDelete', id, function(error, result) { // display the error to the user and abort
//      if (error)
//        return alert(error.reason);
    });
  },

  editableThisStory: function() {
    this.setState({
      editable: true
    });
  },

  completeEditing: function(id, evt) {

    if (!this.props.meteorUserExist) {
      return;
    }
    if (!_.isUndefined(evt.keyCode) && evt.keyCode !== 13) {// 何らかのキーが押されていて、それがEnterキー以外だった場合
      return; // 処理を抜ける
    }

    var story = {
      title: evt.target.textContent
    };

    MongoCollections.Stories.update(id, {$set: story}, function(error) {
      if (error) {
        // display the error to the user
        alert(error.reason);
      }
    });

    evt.target.blur();

    this.setState({
      editable: false
    });
  },

  render: function() {

    if (this.props.meteorUserExist) {
      var sortableHandle = <i className="sortable-handle mdi-action-view-headline">=&nbsp;</i>;
      var plusButton = <button type="button" className="plus circular ui icon button" data-dismiss="alert" onClick={this.insertStory.bind(this, this.props.story._id)}>
        <i className="plus icon"></i>
      </button>;

      var closeButton = <button type="button" className="close circular ui icon button" data-dismiss="alert" onClick={this.deleteStory.bind(this, this.props.story._id)}>
        <i className="remove icon"></i>
      </button>;

      var editButton =  <button type="button" className="edit circular ui icon button" data-dismiss="alert" onClick={this.goToStoryPage.bind(this, this.props.story._id)}>
        <i className="edit icon"></i>
      </button>;
    } else {
      var sortableHandle = {};
      var plusButton = {};
      var closeButton = {};
      var editButton = {};
    }

    var contentEditable = this.state.editable && this.props.meteorUserExist;

    return <li data-id={this.props.story._id} data-order={this.props.story.order} className="sortable-item removable ui grid segment">
          <div className="two wide column">
            { sortableHandle }
            <span className="badge one wide column">{this.props.story.order}</span>
            { plusButton }
          </div>
          <span className="name ten wide column" contentEditable={contentEditable}
                onClick={this.editableThisStory}
                onBlur={this.completeEditing.bind(this, this.props.story._id)}
                onKeyDown={this.completeEditing.bind(this, this.props.story._id)}
              >{this.props.story.title}</span>
          <div className="two wide column">
            { editButton }
            { closeButton }
          </div>
        </li>;
  }
});
