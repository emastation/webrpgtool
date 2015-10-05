<sentences-list id="sentences-list">
  <div each={name, i in storyItems} data-id={name._id} data-order={name.order}><sentence-item story_item={name} sentence_item={sentences[i]} scene_id={parent.opts.scene_id} /></div>
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

    this.getSentences = ()=> {
      // sceneに属するstoryItemsをソートされた状態で取得する
      this.storyItems = [];
      this.update();

      this.storyItems = MongoCollections.StoryItems.find({sceneId: opts.scene_id}, {sort: { order: 1 }}).fetch();

      // storyItemsが持っているcontentIdが、sentenceIdだった場合、それらの配列を作る
      var sentenceIds = [];
      this.storyItems.forEach(function(storyItem){
        sentenceIds.push(storyItem.contentId);
      });

      // sentenceIdの配列をセレクタにして、sentenceの配列を取得する
      var selector = {_id: {$in: sentenceIds}};
      var sentencesTmp = MongoCollections.Sentences.find(selector).fetch();

      // storyItemの配列に対応するsentenceの配列を作る。それぞれの配列で、同じ添え字箇所だと、その値は対応付けされたstoryItem&sentenceになっている。
      this.sentences = [];
      this.storyItems.forEach((storyItem)=>{
        var sentence = _.where(sentencesTmp, { '_id': storyItem.contentId })[0];
        this.sentences.push(sentence);
      });

      this.update();
    };

    this.on('mount', ()=>{
      Meteor.subscribe('storyItems', {
        onReady: ()=>{
          Meteor.subscribe('sentences', {
            onReady: ()=>{
              this.getSentences();
            }
          });
        }
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
      this.getSentences();
    });

  </script>
</sentences-list>
