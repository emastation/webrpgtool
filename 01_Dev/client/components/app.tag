<app>
  <router>
    <route path="/"><site-header page="top" /><site-top /></route>
    <route path="maps"><site-header page="maps" /><maps-top /></route>
    <route path="map/:map_id"><site-header page="maps" /><map-page opts={parent.parent.routeFunc} /></route>
    <route path="map/:map_id/edit"><site-header page="maps" /><map-edit opts={parent.parent.routeFunc} /></route>
    <route path="codes"><site-header page="codes" /><codes-top opts={parent.parent.routeFunc} /></route>
    <route path="code/new"><site-header page="codes" /><code-edit opts={parent.parent.routeFunc} /></route>
    <route path="code/:code_id/edit"><site-header page="codes" /><code-edit opts={parent.parent.routeFunc} /></route>
    <route path="stories"><site-header page="stories" /><stories-top opts={parent.parent.routeFunc} /></route>
    <route path="story/:story_id"><site-header page="stories" /><story-page opts={parent.parent.routeFunc} /></route>
    <route path="story/:story_id/scene/:scene_id"><site-header page="stories" /><story-scene-page opts={parent.parent.routeFunc} /></route>
    <route path="story_play/:story_id"><site-header page="stories" /><story-play opts={parent.parent.routeFunc} /></route>
    <route path="story_play/:story_id/scene/:scene_id"><site-header page="stories" /><story-play opts={parent.parent.routeFunc} /></route>
    <route path="schemata"><site-header page="objects" /><objects-top opts={parent.parent.routeFunc} /></route>
    <route path="schema/:schema_id"><site-header page="objects" /><objects-page opts={parent.parent.routeFunc} /></route>
    <route path="game/:map_id"><site-header /><game opts={parent.parent.routeFunc} /></route>
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
