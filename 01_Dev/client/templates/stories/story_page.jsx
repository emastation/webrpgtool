var SortableStoryScenes = React.createClass({
  mixins: [window.SortableMixin],

  sortableOptions: {
    handle: ".sortable-handle",
    model: "storyScenes"
  },

  collectionName: "storyScenes", // SortableMixinに、どのCollectionのorderを操作するか指定する
  sortingScopeValue: '', // collectionNameで指定したCollectionで、このコンポーネントで操作する対象のScopeプロパティの値を指定する

  getInitialState: function() {
    this.sortingScopeValue = Router.current().params._id;
    return {
    };
  },

  renderSentence: function(model) {
    return <StoryScene key={model._id} storyScene={ model } meteorUserExist={this.props.meteorUserExist} />;
  },

  render: function() {
    return <ul className="StorySceneList" key="1">
      { this.props.storyScenes.map(this.renderSentence) }
    </ul>;
  }
});

var StoryPage = React.createClass({
  mixins: [ReactMeteorData],
  templateName: "storyPage",

  getInitialState: function() {
    return {
      displaySubmitForm: false,
      newSceneName: ''
    };
  },

  goBackToStoryList: function() {
    Router.go('storiesList');
  },

  getMeteorData: function() {
    var storyId = Router.current().params._id;

    var storyScenes = MongoCollections.StoryScenes.find({storyId:storyId}, {sort: { order: 1 }}).fetch();

    return {
      displaySubmitForm: Meteor.userId() ? true : false,
      storyScenes: storyScenes
    };
  },


  newSceneNameChange: function(e) {
    this.setState({
      newSceneName: e.target.value
    });
  },

  submitNewItem: function(e) {
    e.preventDefault();

    var storyId = Router.current().params._id;

    var attributes = {
      storyId: storyId,
      name: this.state.newSceneName,
      order: -1
    };

    var that = this;
    Meteor.call('storySceneCreate', attributes, function(error, result) {
      if (error) {
        return alert(error.reason);
      }
      that.setState({
        newSceneName: ''
      });
    });

  },

  render: function() {

    if (this.data.displaySubmitForm) {
      var form = <div className="ui segment">
        <form className="ui form" onSubmit={this.submitNewItem}>
          <div className="field">
            <label>シーンの新規作成</label>
            <input name="title" id="title" type="text" value={this.state.newSceneName} placeholder="新しいシーンの名前を入力してください。" onChange={this.newSceneNameChange}/>
          </div>
          <input type="submit" value="Submit" className="ui submit button"/>
        </form>
      </div>;
    } else {
      var form = {}
    }

    return <div className="StoryPage">
      { form }
      <p><a href="#" onClick={this.goBackToStoryList}>ストーリーリストに戻る</a></p>
      <SortableStoryScenes storyScenes={ this.data.storyScenes } meteorUserExist={this.data.displaySubmitForm} />
    </div>;

  }

});

Template.storyPage.helpers({
  StoryPage() {
    return StoryPage;
  }
});
