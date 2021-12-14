import {UPDATE_FINAL_WGT,UPDATE_SN} from './buildFinalConstants'

const updateSN = (val)=>(dispatch)=>{
    dispatch({type:UPDATE_SN,payload:value})
}

