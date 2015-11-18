<story-scenes-list id="story-scenes-list">
  <div each={storyScenes} data-id={_id} data-order={order}><story-scene-item story_scenes={parent.storyScenes} story_scene={this} story_id={parent.opts.story_id} game_id={parent.opts.game_id} /></div>
  <script>
    this.mixin('sortable');

    // Sortable Settings [start]
    this.collectionName = 'storyScenes';
    this.sortableRoot = '#story-scenes-list';
    this.sortingScopeValue = '';
    this.sortableOptions = {
      handle: ".sortable-handle"
    };
    // Sortable Settings [end]

    this.getStoryScenes = ()=> {
      var allStoryScenes = MongoCollections.StoryScenes.find({}, {sort: { order: 1 }}).fetch();
      this.storyScenes = _.filter(allStoryScenes, function(scene){
        return scene.storyId === opts.story_id;
      });
      this.update();
    };

    this.on('mount', ()=>{
      Meteor.subscribe('storyScenes', {
        onReady: ()=>{
          this.getStoryScenes();
        }
      });
    });

    this.on('update', ()=>{
      this.sortingScopeValue = opts.story_id;
      this.getStoryScenes();
    });

    Meteor.autorun(()=> {
      this.getStoryScenes();
    });

  </script>
</story-scenes-list>
