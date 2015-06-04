var StoryList = ReactMeteor.createClass({
  templateName: "storiesList",

  startMeteorSubscriptions: function() {
    Meteor.subscribe("stories");
  },

  getInitialState: function() {
    return {
      newStoryTitle: ''
    };
  },

  getMeteorState: function() {
    var stories = Stories.find().fetch();
    return {
      stories: stories
    };
  },

  renderStory: function(model) {
    var _id = model._id;

    return <Story key={_id} story={model} />;
  },

  newStoryTitleChange: function(e) {
    this.setState({
      newStoryTitle: e.target.value
    });
  },

  submitNewStory: function(e) {
    e.preventDefault();

    var story = {
      title: this.state.newStoryTitle.trim()
    };

    Meteor.call('storyInsert', story, function(error, result) { // display the error to the user and abort
      if (error)
        return alert(error.reason);

      if (result.storyExists)
        return alert('This title has already been posted');

    });

    this.setState({
      newStoryTitle: ''
    });
  },

  render: function() {
    var stories = [
        <div className="StoryList" key="1">
        { this.state.stories.map(this.renderStory) }
        </div>
    ];

    var form = <form className="main form" onSubmit={this.submitNewStory}>
      <div className="form-group">
        <label className="control-label" htmlFor="title">タイトル</label>
        <div className="controls">
          <input name="title" id="title" type="text" value={this.state.newStoryTitle} placeholder="Name your new story's title." className="form-control" onChange={this.newStoryTitleChange}/>
        </div>
      </div>
      <input type="submit" value="Submit" className="btn btn-primary"/>
    </form>;

    return <div className="StoryList">
        <IncludeTemplate template={Template.spinner} />
        { form }
        <div className="inner">{ stories }</div>
      </div>;
  }

});

var Story = React.createClass({
  render: function() {
    return <div key={this.props.story._id}>
      <span>{this.props.story._id}</span> <b>{this.props.story.title}</b>
    </div>;
  }
});