<stories-list id="stories-list">
  <div each={stories} data-id={_id} data-order={order}><story-item story={this} game_id={parent.opts.game_id} /></div>

  <script>
    this.mixin('sortable');

    // Sortable Settings [start]
    this.collectionName = 'stories';
    this.sortableRoot = '#stories-list';
    this.sortableOptions = {
      handle: ".sortable-handle"
    };
    // Sortable Settings [end]

    this.on('mount', ()=>{
      Meteor.subscribe('stories', {
        onReady: ()=>{
          this.getStories();
        }
      });
    });

    getStories() {
      this.stories = MongoCollections.Stories.find({game_id: opts.game_id}, {sort: { order: 1 }}).fetch();
      this.update();
    }


    Meteor.autorun(()=> {
      Session.get('StoryItem_changed');
      this.getStories();
    });

    this.on('update', ()=>{
      this.getStories();
    });

  </script>
</stories-list>
