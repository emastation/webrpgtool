<app>
  <router>
    <route path="/"><site-header page="top"></site-header></route>
    <route path="maps"><site-header page="maps" /></route>
  </router>
  <router>
    <route path="/"><site-top></site-top></route>
    <route path="maps"><maps-top></maps-top></route>
  </router>
  <script>
    this.mixin('ikki') // THIS LINE IS NEEDED TO USE IKKI'S FEATURES
  </script>
</app>
