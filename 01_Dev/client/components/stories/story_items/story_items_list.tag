<story-items-list id="sentences-list">
  <div each={storyItem, i in storyItems} data-id={storyItem._id} data-order={storyItem.order}>
    <div each={sentence in contents[i].sentence}>
      <sentence-item story_item={storyItem} sentence_item={sentence} scene_id={parent.parent.opts.scene_id} />
    </div>
    <div each={background in contents[i].background}>
      <background-item story_item={storyItem} background_item={background} scene_id={parent.parent.opts.scene_id} />
    </div>
    <div each={bgm in contents[i].bgm}>
      <bgm-item story_item={storyItem} bgm_item={bgm} scene_id={parent.parent.opts.scene_id} />
    </div>
    <hr if={storyItem.needClick} onclick={toggleNeedClick.bind(this, i)} class="needClick" />
    <hr if={!storyItem.needClick} onclick={toggleNeedClick.bind(this, i)} class="dontNeedClick" />
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

    toggleNeedClick(i) {
      var attribute = {
        needClick: !this.storyItems[i].needClick
      };

      MongoCollections.StoryItems.update(this.storyItems[i]._id, {$set: attribute}, (error)=> {
        if (error) {
          // display the error to the user
          alert(error.reason);
        }
        this.update();
      });
    }

    this.getContents = ()=> {
      // sceneに属するstoryItemsをソートされた状態で取得する
      this.storyItems = [];
      this.update();

      this.storyItems = MongoCollections.StoryItems.find({sceneId: opts.scene_id}, {sort: { order: 1 }}).fetch();

      var sentenceIds = [];
      var backgroundIds = [];
      var bgmIds = [];
      this.storyItems.forEach(function(storyItem){
        if (storyItem.contentType === 'sentence') {
          sentenceIds.push(storyItem.contentId); // storyItemsが持っているcontentIdが、sentenceIdだった場合、それらの配列を作る
        } else if (storyItem.contentType === 'background') {
          backgroundIds.push(storyItem.contentId); // storyItemsが持っているcontentIdが、backgroundIdだった場合、それらの配列を作る
        } else if (storyItem.contentType === 'bgm') {
          bgmIds.push(storyItem.contentId); // storyItemsが持っているcontentIdが、backgroundIdだった場合、それらの配列を作る
        }
      });

      // sentenceIdの配列をセレクタにして、sentenceの配列を取得する
      var selector = {_id: {$in: sentenceIds}};
      var sentencesTmp = MongoCollections.Sentences.find(selector).fetch();

      // backgroundIdの配列をセレクタにして、backgroundの配列を取得する
      var selector = {_id: {$in: backgroundIds}};
      var backgroundsTmp = MongoCollections.Backgrounds.find(selector).fetch();

      var selector = {_id: {$in: bgmIds}};
      var bgmsTmp = MongoCollections.Bgms.find(selector).fetch();

      // storyItemの配列に対応するcontents配列（sentenceやbackgroundなどが入った配列）を作る。
      // それぞれの配列で、同じ添え字箇所だと、その値は対応付けされたstoryItem&contentになっている。
      this.contents = [];
      this.storyItems.forEach((storyItem)=>{
        var content = {
          sentence: [],
          background: [],
          bgm: []
        };
        if (storyItem.contentType === 'sentence') {
          var sentence = _.where(sentencesTmp, { '_id': storyItem.contentId })[0];
          content.sentence.push(sentence);
        } else if (storyItem.contentType === 'background') {
          var background = _.where(backgroundsTmp, { '_id': storyItem.contentId })[0];
          content.background.push(background);
        } else if (storyItem.contentType === 'bgm') {
          var bgm = _.where(bgmsTmp, { '_id': storyItem.contentId })[0];
          content.bgm.push(bgm);
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
      var deferBgms = $.Deferred();
      Meteor.subscribe('bgms', {
        onReady: ()=>{
          deferBgms.resolve();
        }
      });

      $.when(
        deferStoryItems.promise(),
        deferSentences.promise(),
        deferBackgrounds.promise(),
        deferBgms.promise()
      ).done(()=> {
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

  <style scoped>
    hr.needClick {
      height: 10px;
      background-color: #DDDDDD;
      color: #DDDDDD;
    }
    hr.dontNeedClick {
      height: 10px;
      background-color: #FFFFFF;
      color: #DDDDDD;
    }

  </style>
</story-items-list>
