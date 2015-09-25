<app>
  <router>
    <route path="/"><site-header page="top"></site-header></route>
    <route path="maps"><site-header page="maps" /></route>
    <route path="map/:id"><site-header page="maps" /></route>
  </router>
  <router>
    <route path="/"><site-top></site-top></route>
    <route path="maps"><maps-top></maps-top></route>
    <route path="map/:map_id"><map-page opts={parent.parent.mapFunc} /></route>
    <route path="map/:map_id/edit"><map-edit opts={parent.parent.mapFunc} /></route>
  </router>
  <script>
//    this.mixin('ikki'); // THIS LINE IS NEEDED TO USE IKKI'S FEATURES

    this.mapFunc = function(route) {
      // route.path: hour/10
      // route.query: {}
//      console.log("gejhogehgoeheogho" + route.param);
      return route.param;
    }

    this.object = { message: 'Hi!' };
  </script>
</app>
