import {INIT_LIST_ACTION,ECHARTS_DATA,ECHARTS_OPTION} from '../actionType/index'
export const monthData = (data)=>({
    type:INIT_LIST_ACTION,
    payload:{
        data
    }
})

export const echartsData = (data)=>({
    type:ECHARTS_DATA,
    payload:{
        data
    }
})

export const getEchartsOption = (data)=>({
    type:ECHARTS_OPTION,
    payload:{
        data
    }
}) 



