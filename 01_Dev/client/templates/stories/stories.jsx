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
      var form = <div className="ui segment">
        <form className="ui form" onSubmit={this.submitNewStory}>
          <div className="field">
            <label>タイトル</label>
            <input name="title" id="title" type="text" value={this.state.newStoryTitle} placeholder="新しいストーリーのタイトルを入力してください。" onChange={this.newStoryTitleChange} kl_vkbd_parsed="true" />
          </div>
          <input type="submit" value="投稿  " className="ui submit button"/>
        </form>
      </div>;
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
