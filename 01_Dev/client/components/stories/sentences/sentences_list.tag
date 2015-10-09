<sentences-list id="sentences-list">
  <div each={name, i in storyItems} data-id={name._id} data-order={name.order}>
    <div each={sentence in contents[i].sentence}>
      <sentence-item story_item={name} sentence_item={sentence} scene_id={parent.parent.opts.scene_id} />
    </div>
    <div each={background in contents[i].background}>
      <background-item story_item={name} background_item={background} scene_id={parent.parent.opts.scene_id} />
    </div>
  </div>
  <script>
    this.mixin('sortable');

    // Sortable Settings [start]
    this.collectionName = 'storyItems';
    this.sortableRoot = '#sentences-list';
    this.sortingScopeValue = '';
    this.sortableOptions = {
      handle: ".sortable-handle"
    };
    // Sortable Settings [end]

    this.getContents = ()=> {
      // sceneに属するstoryItemsをソートされた状態で取得する
      this.storyItems = [];
      this.update();

      this.storyItems = MongoCollections.StoryItems.find({sceneId: opts.scene_id}, {sort: { order: 1 }}).fetch();

      var sentenceIds = [];
      var backgroundIds = [];
      this.storyItems.forEach(function(storyItem){
        if (storyItem.contentType === 'sentence') {
          sentenceIds.push(storyItem.contentId); // storyItemsが持っているcontentIdが、sentenceIdだった場合、それらの配列を作る
        } else if (storyItem.contentType === 'background') {
          backgroundIds.push(storyItem.contentId); // storyItemsが持っているcontentIdが、backgroundIdだった場合、それらの配列を作る
        }
      });

      // sentenceIdの配列をセレクタにして、sentenceの配列を取得する
      var selector = {_id: {$in: sentenceIds}};
      var sentencesTmp = MongoCollections.Sentences.find(selector).fetch();

      // backgroundIdの配列をセレクタにして、backgroundの配列を取得する
      var selector = {_id: {$in: backgroundIds}};
      var backgroundsTmp = MongoCollections.Backgrounds.find(selector).fetch();

      // storyItemの配列に対応するcontents配列（sentenceやbackgroundなどが入った配列）を作る。
      // それぞれの配列で、同じ添え字箇所だと、その値は対応付けされたstoryItem&contentになっている。
      this.contents = [];
      this.storyItems.forEach((storyItem)=>{
        var content = {
          sentence: [],
          background: []
        };
        if (storyItem.contentType === 'sentence') {
          var sentence = _.where(sentencesTmp, { '_id': storyItem.contentId })[0];
          content.sentence.push(sentence);
        } else if (storyItem.contentType === 'background') {
          var background = _.where(backgroundsTmp, { '_id': storyItem.contentId })[0];
          content.background.push(background);
        }
        this.contents.push(content);
      });

      this.update();
    };

    this.on('mount', ()=>{
      var deferStoryItems = $.Deferred();
      Meteor.subscribe('storyItems', {
        onReady: ()=>{
          deferStoryItems.resolve();
        }
      });
      var deferSentences = $.Deferred();
      Meteor.subscribe('sentences', {
        onReady: ()=>{
          deferSentences.resolve();
        }
      });
      var deferBackgrounds = $.Deferred();
      Meteor.subscribe('backgrounds', {
        onReady: ()=>{
          deferBackgrounds.resolve();
        }
      });

      $.when(deferStoryItems.promise(), deferSentences.promise(), deferBackgrounds.promise()).done(()=> {
        this.getContents();
      });
    });

    this.on('update', ()=>{
      if (this.sortingScopeValue !== opts.scene_id) {
        this.sortingScopeValue = opts.scene_id;
        Session.set('storyItems_changed', Date.now());
      }
    });

    Meteor.autorun(()=> {
      Session.get('storyItems_changed');
      this.getContents();
    });

  </script>
</sentences-list>
