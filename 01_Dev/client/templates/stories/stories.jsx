var StoryList = ReactMeteor.createClass({
//  mixins: [window.SortableMixin],
  templateName: "storiesList",


  attributesOptions: {
    group: {
      name: 'sortableTemplate',
      put: true
    }
  },

  /*
  sortableOptions: {
    ref: "stories",
    group: {
      name: 'storiesList',
      put: true
    },
    animation: 100,
    handle: ".sortable-handle",
    model: "stories"
  },
*/

  startMeteorSubscriptions: function() {
    Meteor.subscribe("stories");
  },

  getInitialState: function() {
    return {
      newStoryTitle: ''
    };
  },

  getMeteorState: function() {
//    var stories = Stories.find({}, {sort: { order: 1 }}).fetch();
    var stories = Stories.find({}, {sort: { order: 1 }});
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

//  handleSort: function (/** Event */evt) { /*..*/ },

  render: function() {
    var stories = [
        <div className="StoryList" key="1" ref="stories">
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

/*
    // JSXテンプレートでSortableする方法（実装途中）
    return <div className="StoryList">
        { form }
        <div className="inner">{ stories }</div>
      </div>;
 */

    // BlazeテンプレートでSortableする方法（実装途中）
    return <div className="StoryList">
      { form }
      <div className="inner">
        <IncludeTemplate template={Template.sortableTemplate} models={this.state.stories} options={this.attributesOptions} />
      </div>
    </div>;
  }

});

var Story = React.createClass({

  render: function() {
    /*
    return <div key={this.props.story._id} className="">
      <span>{this.props.story._id}</span> <b>{this.props.story.title}</b>
    </div>;*/
    return <div data-id={this.props.story.order} className="sortable-item removable well well-sm">
      <i className="sortable-handle mdi-action-view-headline pull-right">=</i>
      <span className="name">{this.props.story.title}</span>
      <span className="badge">{this.props.story.order}</span>
      <button type="button" className="close" data-dismiss="alert">
        <span aria-hidden="true">&times;</span><span className="sr-only">Close</span>
      </button>
    </div>
  }
});