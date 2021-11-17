<template>
  <a-modal v-model="visible" title="Title" on-ok="newProjectOk" :width="windowWidth*0.7">
    <template slot="footer">
      <a-button key="back" @click="newProjectCancel">
        Return
      </a-button>
      <a-button key="submit" type="primary" @click="newProjectOk">
        Submit
      </a-button>
    </template>
    <a-steps :current="1">
      <a-step title="selectFiles" >
        <span slot="description">This is a description.</span>
      </a-step>
      <a-step title="In Progress" sub-title="Left 00:00:08" description="This is a description." />
      <a-step title="Waiting" description="This is a description." />
    </a-steps>
  </a-modal>
</template>

<script>
export default {
  name:'UpperLeftNewProject',
  props:['newProjectVisible', 'windowWidth'],
  computed:{
    visible:{
      get(){
        return this.newProjectVisible
      },
      set(val){
        this.$bus.$emit('changeVisible', val) 
      }
    }
  },
  methods: {
    newProjectOk(event){
      this.$bus.$emit('changeVisible', false) 
    },
    newProjectCancel(event){
      this.$bus.$emit('changeVisible', false)
    },
  },
}
</script>

<style>

</style>