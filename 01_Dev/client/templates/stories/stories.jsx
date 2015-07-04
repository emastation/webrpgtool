SortableStories = React.createClass({
  mixins: [window.SortableMixin],

  sortableOptions: {
//    ref: "stories",
    /*
    group: {
      name: 'storiesList',
      put: true
    },
    */
//    animation: 100,
    handle: ".sortable-handle"
//    model: "stories"
  },

  collectionName: "stories",

  renderStory: function(model) {
    return <Story key={model._id} story={model} meteorUserExist={this.props.meteorUserExist} />;
  },

  render: function() {
    return <ul className="StoryList" key="1">
      { this.props.items.map(this.renderStory) }
    </ul>;
  }
});


var StoryList = React.createClass({
  mixins: [ReactMeteorData],

  getInitialState: function() {
    return {
      displaySubmitForm: false,
      newStoryTitle: ''
    };
  },

  getMeteorData: function() {
    var stories = MongoCollections.Stories.find({}, {sort: { order: 1 }}).fetch();
    return {
      displaySubmitForm: Meteor.userId() ? true : false,
      stories: stories
    };
  },



  newStoryTitleChange: function(e) {
    this.setState({
      newStoryTitle: e.target.value
    });
  },

  submitNewStory: function(e) {
    e.preventDefault();

    var story = {
      title: this.state.newStoryTitle.trim(),
      order: -1
    };

    Meteor.call('storyCreate', story, function(error, result) { // display the error to the user and abort
      if (error)
        return alert(error.reason);

      if (result.storyExists)
        return alert('This Story has already been posted');

    });

    this.setState({
      newStoryTitle: ''
    });
  },

  render: function() {

    if (this.data.displaySubmitForm) {
      var form = <form className="main form" onSubmit={this.submitNewStory}>
        <div className="form-group">
          <label className="control-label" htmlFor="title">タイトル</label>
          <div className="controls">
            <input name="title" id="title" type="text" value={this.state.newStoryTitle} placeholder="Name your new story's title." className="form-control" onChange={this.newStoryTitleChange}/>
          </div>
        </div>
        <input type="submit" value="Submit" className="btn btn-primary"/>
      </form>;
    } else {
      var form = {}
    }

    // JSXテンプレートでSortableする方法（実装途中）
    return <div className="StoryList">
          { form }
          <SortableStories items={ this.data.stories } meteorUserExist={this.data.displaySubmitForm} />
        </div>

  }

});

Template.storiesList.helpers({
  StoryList() {
    return StoryList;
  }
});
