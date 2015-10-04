<stories-list id="stories-list">
  <div each={stories} data-id={_id} data-order={order}><story-item story={this} /></div>

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
      Meteor.subscribe('stories');
    });

    Meteor.autorun(()=> {
      this.stories = MongoCollections.Stories.find({}, {sort: { order: 1 }}).fetch();
      this.update();
    });
  </script>
</stories-list>
