<app>
  <router>
    <route path="/"><site-header page="top" opts={parent.parent.routeFunc} /><site-top opts={parent.parent.routeFunc} /></route>
    <route path="game/:game_id"><site-header page="top" opts={parent.parent.routeFunc} /><site-top opts={parent.parent.routeFunc} /></route>
    <route path="game/:game_id/maps"><site-header page="maps" opts={parent.parent.routeFunc} /><maps-top opts={parent.parent.routeFunc} /></route>
    <route path="game/:game_id/map/:map_id"><site-header page="maps" opts={parent.parent.routeFunc} /><map-page opts={parent.parent.routeFunc} /></route>
    <route path="game/:game_id/map/:map_id/edit"><site-header page="maps" opts={parent.parent.routeFunc} /><map-edit opts={parent.parent.routeFunc} /></route>
    <route path="game/:game_id/codes"><site-header page="codes" opts={parent.parent.routeFunc} /><codes-top opts={parent.parent.routeFunc} /></route>
    <route path="game/:game_id/code/new"><site-header page="codes" opts={parent.parent.routeFunc} /><code-edit opts={parent.parent.routeFunc} /></route>
    <route path="game/:game_id/code/:code_id/edit"><site-header page="codes" opts={parent.parent.routeFunc} /><code-edit opts={parent.parent.routeFunc} /></route>
    <route path="game/:game_id/stories"><site-header page="stories" opts={parent.parent.routeFunc} /><stories-top opts={parent.parent.routeFunc} /></route>
    <route path="game/:game_id/story/:story_id"><site-header page="stories" opts={parent.parent.routeFunc} /><story-page opts={parent.parent.routeFunc} /></route>
    <route path="game/:game_id/story/:story_id/scene/:scene_id"><site-header page="stories" opts={parent.parent.routeFunc} /><story-scene-page opts={parent.parent.routeFunc} /></route>
    <route path="game/:game_id/story/:story_id/play"><site-header page="stories" opts={parent.parent.routeFunc} /><story-play opts={parent.parent.routeFunc} /></route>
    <route path="game/:game_id/story/:story_id/scene/:scene_id/play"><site-header page="stories" opts={parent.parent.routeFunc} /><story-play opts={parent.parent.routeFunc} /></route>
    <route path="game/:game_id/schemata"><site-header page="objects" opts={parent.parent.routeFunc} /><objects-top opts={parent.parent.routeFunc} /></route>
    <route path="game/:game_id/schema/:schema_id"><site-header page="objects" opts={parent.parent.routeFunc} /><objects-page opts={parent.parent.routeFunc} /></route>
    <route path="game/:game_id/map/:map_id/play"><site-header /><game opts={parent.parent.routeFunc} /></route>
  </router>
  <script>
//    this.mixin('ikki'); // THIS LINE IS NEEDED TO USE IKKI'S FEATURES

    this.routeFunc = function(route) {
      // route.path: hour/10
      // route.query: {}
//      console.log("gejhogehgoeheogho" + route.param);
      return route.param;
    }

  </script>
</app>
