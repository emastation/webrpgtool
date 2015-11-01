<app>
  <router>
    <route path="/"><site-header page="top"></site-header></route>
    <route path="maps"><site-header page="maps" /></route>
    <route path="map/:map_id"><site-header page="maps" /></route>
    <route path="map/:map_id/edit"><site-header page="maps" /></route>
    <route path="codes"><site-header page="codes" /></route>
    <route path="code/new"><site-header page="codes" /></route>
    <route path="code/:code_id/edit"><site-header page="codes" /></route>
    <route path="stories"><site-header page="stories" /></route>
    <route path="story/:story_id"><site-header page="stories" /></route>
    <route path="story/:story_id/scene/:scene_id"><site-header page="stories" /></route>
    <route path="story_play/:story_id"><site-header page="stories" /></route>
    <route path="story_play/:story_id/scene/:scene_id"><site-header page="stories" /></route>
    <route path="schemata"><site-header page="objects" /></route>
    <route path="game/:map_id"><site-header /></route>
  </router>
  <router>
    <route path="/"><site-top></site-top></route>
    <route path="maps"><maps-top></maps-top></route>
    <route path="map/:map_id"><map-page opts={parent.parent.routeFunc} /></route>
    <route path="map/:map_id/edit"><map-edit opts={parent.parent.routeFunc} /></route>
    <route path="codes"><codes-top opts={parent.parent.routeFunc} /></route>
    <route path="code/new"><code-edit opts={parent.parent.routeFunc} /></route>
    <route path="code/:code_id/edit"><code-edit opts={parent.parent.routeFunc} /></route>
    <route path="stories"><stories-top opts={parent.parent.routeFunc} /></route>
    <route path="story/:story_id"><story-page opts={parent.parent.routeFunc} /></route>
    <route path="story/:story_id/scene/:scene_id"><story-scene-page opts={parent.parent.routeFunc} /></route>
    <route path="story_play/:story_id"><story-play opts={parent.parent.routeFunc} /></route>
    <route path="story_play/:story_id/scene/:scene_id"><story-play opts={parent.parent.routeFunc} /></route>
    <route path="schemata"><objects-top opts={parent.parent.routeFunc} /></route>
    <route path="objects"><objects-top opts={parent.parent.routeFunc} /></route>
    <route path="game/:map_id"><game opts={parent.parent.routeFunc} /></route>
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
