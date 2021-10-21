<template>
  <div class="container" id="divCodeArea">
      <form id="Codeform" class="form-horizontal">
        <div class="row">
          <!-- <div class="col"><textarea class="form-control" rows="6" id="codeInps" v-model.trim.lazy="cmdStringInpts"></textarea></div>
          <div class="col"><textarea class="form-control" rows="6" id="codeVideo" v-model.trim.lazy="cmdStringVideo"></textarea></div>
          <div class="col"><textarea class="form-control" rows="6" id="codeAudio" v-model.trim.lazy="cmdStringAudio"></textarea></div>
          <div class="col"><textarea class="form-control" rows="6" id="codeOups" v-model.trim.lazy="cmdStringOups"></textarea></div> -->
          <div class="col"><textarea class="form-control" rows="6" id="codeInps" ></textarea></div>
          <div class="col"><textarea class="form-control" rows="6" id="codeVideo" ></textarea></div>
          <div class="col"><textarea class="form-control" rows="6" id="codeAudio" ></textarea></div>
          <div class="col"><textarea class="form-control" rows="6" id="codeOups" ></textarea></div>
        </div>
      </form>
    </div>
</template>

<script>
export default {
  name:'LowerCodeArea'
}
</script>

<style>

</style>