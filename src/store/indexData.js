import fs from 'fs'

export default {
	namespaced:true,
	actions:{

	},
	mutations:{
		loadGuidance(state, path){
			var file = fs.readFileSync(path, 'utf8')
			state.showingParams = JSON.parse(file)
		}
	},
	state:{
		showingParams:{}
	},
	getters:{
	}
}

