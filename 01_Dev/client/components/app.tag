<app>
  <router>
    <route path="/"><site-header message="hello world"></site-header></route>
    <route path="lorem"><site-header message="Lorem Ipsum is..." /></route>
    <route path="member/:person"><site-header message="$person" /></route>
    <route path="merol" redirect="lorem" />
    <route path="*"><site-header message="not found." /></route>
  </router>
  <script>
    this.mixin('ikki') // THIS LINE IS NEEDED TO USE IKKI'S FEATURES
  </script>
</app>
