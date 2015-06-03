var StoryList = ReactMeteor.createClass({
  templateName: "storiesList",

  startMeteorSubscriptions: function() {
    Meteor.subscribe("stories");
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

  render: function() {
    var stories = [
        <div className="StoryList" key="1">
        { this.state.stories.map(this.renderStory) }
        </div>
    ];

    return <div className="inner">{ stories }</div>;
  }

});

var Story = React.createClass({
  render: function() {
    return <div key={this.props.story._id}>
      <span>{this.props.story._id}</span> <b>{this.props.story.title}</b>
    </div>;
  }
});