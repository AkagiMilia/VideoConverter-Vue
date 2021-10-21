<template>
  <div class="col-6" id="divUpperLeft">
    <UpperLeftProjects/>
    <UpperLeftGuide/>
  </div>
</template>

<script>
import UpperLeftProjects from './UpperLeftProjects.vue'
import UpperLeftGuide from './UpperLeftGuide.vue'
export default {
  name:'UpperLeft',
  components: { 
    UpperLeftProjects,
    UpperLeftGuide
  },

}
</script>

<style>

</style>