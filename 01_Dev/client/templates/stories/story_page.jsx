var Sentence = React.createClass({

  getInitialState: function() {
    return {
      editable: false
    };
  },

  editableThisStory: function() {
    this.setState({
      editable: true
    });
  },

  insertSentence: function(id) {
    var storyItemModelClicked = StoryItems.findOne(id);
    var attributes = {
      storyId: Router.current().params._id,
      comment: "This is a sentence.",
      text: 'New Sentence',
      order: storyItemModelClicked.order
    };

    Meteor.call('sentenceInsert', attributes, function(error, result) { // display the error to the user and abort
      if (error)
        return alert(error.reason);

    });
  },

  completeEditing: function(id, evt) {

    if (!this.props.meteorUserExist) {
      return;
    }
    if (!_.isUndefined(evt.keyCode) && evt.keyCode !== 13) {// 何らかのキーが押されていて、それがEnterキー以外だった場合
      return; // 処理を抜ける
    }

    var sentence = {
      text: evt.target.textContent
    };

    Sentences.update(id, {$set: sentence}, function(error) {
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

  deleteSentence: function(id) {

    Meteor.call('storyItemDelete', id, function(error, result) {
      if (error) {
        return alert(error.reason);
      }
    });
  },

  render: function() {
    if (this.props.meteorUserExist) {
      var sortableHandle = <i className="sortable-handle mdi-action-view-headline pull-left">=&nbsp;</i>;
      var plusButton = <button type="button" className="plus" data-dismiss="alert" onClick={this.insertSentence.bind(this, this.props.storyItem._id)}>
        <span aria-hidden="true">+</span><span className="sr-only">Plus</span>
      </button>;
      var closeButton = <button type="button" className="close" data-dismiss="alert" onClick={this.deleteSentence.bind(this, this.props.storyItem._id)}>
        <span aria-hidden="true">&times;</span><span className="sr-only">Close</span>
      </button>;
    } else {
      var sortableHandle = {};
      var plusButton = {};
      var closeButton = {};
    }

    var text = _.isUndefined(this.props.sentence) ? '' : this.props.sentence.text;
    var sentenceId = _.isUndefined(this.props.sentence) ? '' : this.props.sentence._id;
    var contentEditable = this.state.editable && this.props.meteorUserExist;

    return <li data-id={this.props.storyItem._id} data-order={this.props.storyItem.order} className="sortable-item removable well well-sm">
      { sortableHandle }
      { plusButton }
      <span className="name" contentEditable={contentEditable}
            onClick={this.editableThisStory}
            onBlur={this.completeEditing.bind(this, sentenceId)}
            onKeyDown={this.completeEditing.bind(this, sentenceId)}
          >{text}</span>
      <span className="badge">{this.props.storyItem.order}</span>
      { closeButton }
    </li>
  }
});

var SortableStoryItems = React.createClass({
  mixins: [window.SortableMixin],

  sortableOptions: {
    handle: ".sortable-handle",
    model: "storyItems"
  },

  collectionName: "storyItems", // SortableMixinに、どのCollectionのorderを操作するか指定する
  sortingScopeValue: '', // collectionNameで指定したCollectionで、このコンポーネントで操作する対象のScopeプロパティの値を指定する

  getInitialState: function() {
    this.sortingScopeValue = Router.current().params._id;
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


var StoryPage = ReactMeteor.createClass({
  templateName: "storyPage",

  getInitialState: function() {
    return {
      displaySubmitForm: false,
      newText: ''
    };
  },
  startMeteorSubscriptions: function() {
    Meteor.subscribe("storyItems");
    Meteor.subscribe("sentences");
  },

  getMeteorState: function() {
    var storyId = Router.current().params._id;

    var storyItems = StoryItems.find({storyId:storyId}, {sort: { order: 1 }}).fetch();
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

    var storyId = Router.current().params._id;

    var attributes = {
      storyId: storyId,
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

    var storyId = Router.current().params._id;

    return <div className="StoryPage">
      { form }
      <SortableStoryItems sentences={ this.state.sentences } storyItems={ this.state.storyItems } meteorUserExist={this.state.displaySubmitForm} />
    </div>;

  }

});
