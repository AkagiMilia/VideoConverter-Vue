// Vuex 
import Vuex from 'vuex'
import Vue from 'vue'
import { nanoid } from 'nanoid'

const actions = { 

}
const mutations = { 

}
const state = { 

  /* 
  projects:[
    {
      projectId:...
      ...
      imputFiles:[
        {
          fileId:...
        }
      ]
    },
    {
      projectId:...
      ...
    }
  ]
  */
  projects:[
    // example.project1
    { 
      projectId:nanoid(),
      inputFiles:
      [
        {
          fileId:nanoid(),
          filePath:'Elerye_-_Edera.mp4',
          fileName:'Elerye_-_Edera.mp4',
          streams:[
            {index:0, code_name:'h264', code_type:'video'},
            {index:1, code_name:'aac', code_type:'audio'}
          ],
          streamsUsed:{0:true, 1:true},
          fileParams:['-itsoffset', '0ms']
        },
      ],
      outputFilePath:'Elerye_-_Edera-fast-265.mp4',
      outputFileName:'Elerye_-_Edera-fast-265.mp4',
      outputParas:['-y']
    },
    // example.project2
    { 
      projectId:nanoid(),
      inputFiles:
      [
        {
          fileId:nanoid(),
          filePath:'UmaLive02.mkv',
          fileName:'UmaLive02.mkv',
          streams:[
            {index:0, code_name:'hevc', code_type:'video'},
            {index:1, code_name:'flac', code_type:'audio'}
          ],
          streamsUsed:{0:true, 1:true},
          fileParams:[]
        },
      ],
      outputFilePath:'UmaLive02.mp4',
      outputFileName:'UmaLive02.mp4',
      outputParas:['-y']
    }
  ],
  parameters:[
    {
      maping:{
        '-map':'0:a',
        '-map':'0:v'
      },
      video:{
        '-c:v':'libx265',
        '-crf':'24',
        '-preset':'ultrafast',
        '-pix_fmt':'yuv420p',
        '-x265-params':{
          'ssim':'true',
          'rd':'5'
        }
      },
      audio:{
        '-c:a':'copy'
      },
      projectId:''
    },
    {
      maping:{
        '-map':'0:a',
        '-map':'0:v'
      },
      video:{
        '-c:v':'libx264',
        '-crf':'24',
        '-preset':'ultrafast',
        '-pix_fmt':'yuv420p',
      },
      audio:{
        '-c:a':'copy'
      },
      projectId:""
    }
  ],
}

Vue.use(Vuex)
export default new Vuex.Store({
  actions,
  mutations,
  state
})