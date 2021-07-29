import {copyData} from '../../utils/common'
const lamp = {
    state: {
       type:'1',//佛灯类型：1供灯，2千墙佛
       temple_id:'2',//	 寺庙ID     
       article_id:'1',//文章ID
       lamppay:{},
       location:{
           x:'',
           y:'',
           id:''
       }
    },
    getters:{
        getLamp:(state)=>{
            return state
        }
    },
    mutations:{
        setLamp(state,params){
            for(let i in params){
                state[i] = copyData(params[i])
            }
        }
    }
}
export default lamp