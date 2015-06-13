var SortableStoryItems = React.createClass({
  mixins: [window.SortableMixin],

  sortableOptions: {
    handle: ".sortable-handle",
    model: "storyItems"
  },

  collectionName: "storyItems", // SortableMixinに、どのCollectionのorderを操作するか指定する
  sortingScopeValue: '', // collectionNameで指定したCollectionで、このコンポーネントで操作する対象のScopeプロパティの値を指定する

  getInitialState: function() {
    this.sortingScopeValue = Router.current().params._id2;
    return {
    };
  },

  renderSentence: function(model, i) {
    return <Sentence key={model._id} sentence={this.props.sentences[i]} storyItem={ model } meteorUserExist={this.props.meteorUserExist} />;
  },

  render: function() {
    return <ul className="StoryItemList" key="1">
      { this.props.storyItems.map(this.renderSentence) }
    </ul>;
  }
});


var StoryScenePage = ReactMeteor.createClass({
  templateName: "storyScenePage",

  getInitialState: function() {
    return {
      displaySubmitForm: false,
      newText: ''
    };
  },
  startMeteorSubscriptions: function() {
    Meteor.subscribe("storyScenes"); // goBackToSceneListのためだけ
    Meteor.subscribe("storyItems");
    Meteor.subscribe("sentences");
  },

  goBackToSceneList: function() {
    var storyId = Router.current().params._id;

    Router.go('storyPage', {_id: storyId});
  },

  getMeteorState: function() {
    var sceneId = Router.current().params._id2;

    var storyItems = StoryItems.find({sceneId:sceneId}, {sort: { order: 1 }}).fetch();
    var sentenceIds = [];
    storyItems.map(function(storyItem){
      sentenceIds.push(storyItem.contentId);
    });

    var selector = {_id: {$in: sentenceIds}};
    var sentencesTmp = Sentences.find(selector).fetch();
    var sentences = [];
    storyItems.map(function(storyItem){
      var sentence = _.where(sentencesTmp, { '_id': storyItem.contentId })[0];
      sentences.push(sentence);
    });


    return {
      displaySubmitForm: Meteor.userId() ? true : false,
      storyItems: storyItems,
      sentences: sentences
    };
  },


  newTextChange: function(e) {
    this.setState({
      newText: e.target.value
    });
  },

  submitNewItem: function(e) {
    e.preventDefault();

    var sceneId = Router.current().params._id2;

    var attributes = {
      sceneId: sceneId,
      comment: "This is a sentence.",
      text: this.state.newText
    };

    var that = this;
    Meteor.call('sentencePush', attributes, function(error, result) {
      if (error) {
        return alert(error.reason);
      }
      that.setState({
        newText: ''
      });
    });

  },

  render: function() {

    if (this.state.displaySubmitForm) {
      var form = <form className="main form" onSubmit={this.submitNewItem}>
        <div className="form-group">
          <label className="control-label" htmlFor="title">センテンス</label>
          <div className="controls">
            <input name="title" id="title" type="text" value={this.state.newText} placeholder="Name your new sentence." className="form-control" onChange={this.newTextChange}/>
          </div>
        </div>
        <input type="submit" value="Submit" className="btn btn-primary"/>
      </form>;
    } else {
      var form = {}
    }

    return <div className="StoryPage">
      { form }
      <p><a href="#" onClick={this.goBackToSceneList}>シーンリストに戻る</a></p>
      <SortableStoryItems sentences={ this.state.sentences } storyItems={ this.state.storyItems } meteorUserExist={this.state.displaySubmitForm} />
    </div>;

  }

});
