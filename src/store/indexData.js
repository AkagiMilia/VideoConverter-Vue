import fs from 'fs'

export default {
	namespaced:true,
	actions:{

	},
	mutations:{
		loadGuidance(state, path){
			var file = fs.readFileSync(path, 'utf8')
			state.showingParams = JSON.parse(file)
		},
    loadEncoders(state, path){
      var file = fs.readFileSync(path, 'utf8')
			state.encodersInfo = JSON.parse(file)
    }
	},
	state:{
		showingParams:{},
    encodersInfo:{},
    markParams:{
      video:['-c:v'],
      audio:['-c:a']
    }
	},
	getters:{
	}
}

