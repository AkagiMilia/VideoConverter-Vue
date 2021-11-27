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
    <a-row>
      <a-steps :current="currentPage">
        <!-- Step 1 -->
        <a-step title="selectFiles" >
          <span slot="description">This is a description.</span>
        </a-step>
        <a-step title="In Progress" sub-title="Left 00:00:08" description="This is a description." />
        <a-step title="Waiting" description="This is a description." />
      </a-steps>
    </a-row>
    <div v-if="currentPage == 0">
      <a-upload-dragger
        name="file"
        :multiple="true"
        :showUploadList="false"
        :customRequest="handleChange"
      >
        <p class="ant-upload-drag-icon">
          <a-icon type="inbox" />
        </p>
        <p class="ant-upload-text">
          Click or drag file to this area
        </p>

        <a-list :grid="{ gutter: 16, column: 3 }" :data-source="newProject.inputFiles">
          <a-list-item slot="renderItem" slot-scope="item, index">
            <a-card :title="'File'+index">
              <span>{{item.fileName}}</span>
            </a-card>
          </a-list-item>
        </a-list>
      </a-upload-dragger>
    </div>
  </a-modal>
</template>

<script>
import { exec } from 'child_process'
import { nanoid } from 'nanoid'

export default {
  name:'UpperLeftNewProject',
  props:['newProjectVisible', 'windowWidth'],
  data() {
    return {
      currentPage:0,
      newProject:{}
    }
  },
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
    handleChange(info){
      var newFile = {}
      newFile.fileId = nanoid()
      newFile.filePath = info.file.path
      newFile.fileName = info.file.name
      var streams = []
      exec(`ffprobe -i "${info.file.path}" -show_streams -of json`, (error, stdout, stderr)=>{
        if (error){
          this.$message.error(`File ${info.file.name} Load Failed!`)
          return
        }
        streams = [...JSON.parse(stdout).streams]
        newFile.streams = streams
        console.log(newFile.streams);
        for (let stream of newFile.streams){
          stream.used = true
        }
        newFile.fileParams = []
        if (this.newProject.inputFiles)
          this.newProject.inputFiles.push(newFile)
        else
          this.$set(this.newProject, 'inputFiles', [newFile])
      })
    }
  },
}
</script>

<style>

</style>