import {INIT_LIST_ACTION,ECHARTS_DATA,ECHARTS_OPTION} from '../actionType/index'
const defaultState = {
    num:788,
    obj:{},
    echartsData:{},
    echartsOption:{
        title: {
            text: '2018年月度股票情况及预测',
            left: 5,
            textStyle:{
                color:"#9aa8d4",
                fontSize:22,
                fontWeight:400
            }
        },
        grid:{
            left:60,
            bottom:60,
            right:60
        },
        tooltip:{
            trigger:'axis',
            axisPointer:{
                type:"none"
            },
            formatter:function(params){
                // console.log("-------params----")
                // console.log(params)
                let shijia = params[0].data
                let chengjiao = params[2].data
                let shiyin = params[1].data
                const marker = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#e6b600;"></span>';
                return params[0].axisValue + "<br/>"+
                    marker + "市价总值："+shijia + "<br/>"+
                    marker + "成交总额："+chengjiao + "<br/>"+
                    marker + "平均市盈率："+shiyin 
            }
        },
        
        xAxis: {
            type: 'category',
            data: [],
            axisLine:{
                lineStyle:{
                    color:"rgba(160, 179, 247, 1)"
                }
            }
        },
        yAxis: [{
                name: '金额',
                min: 0,
                max: 400000,
                interval: 100000,
                axisLabel: {
                    formatter: (p)=>{
                        // console.log("-------p------")
                        // console.log(p)
                        return p/10000+"万亿"
                    }
                },
                splitLine:{
                    show:false
                },
                axisLine:{
                    lineStyle:{
                        color:"rgba(160, 179, 247, 1)"
                    }
                }
                
            },{
                type: 'value',
                name: '市盈率',
                min: 0,
                max: 20,
                interval: 5,
                axisLabel: {
                    formatter: '{value}'
                },
                splitLine:{
                    show:false
                },
                axisLine:{
                    lineStyle:{
                        color:"rgba(160, 179, 247, 1)"
                    }
                }
            }
    
        ],
        legend: {
            data: ["市价总值","成交总额","平均市盈率"],
            top:30,
            textStyle:{
                color:"rgba(160, 179, 247, 1)"
            }
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        series: [{
            name:"市价总值",
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'pictorialBar',
            symbol:'triangle',
            showBackground: true,
            itemStyle:{
                color:'rgba(113, 96, 242, 1)'
            },
            backgroundStyle: {
                color: 'rgba(113, 96, 242, 0.8)'
            },
            markLine: {
                data: [
                    {type: 'average', name: '平均值'}
                ],
                label:{
                    position:'insideMiddleTop',
                    formatter:function(params){
                        console.log("----label---")
                        console.log(params)
                        return "月度平均市价总值：" + params.value + "亿元"
                    },
                }
            }
        },
        {   
            name:"平均市盈率",
            data: [],
            type: 'line',
            showBackground: true,
            yAxisIndex: 1,
            backgroundStyle: {
                color: 'rgba(220, 220, 220, 0.8)'
            },
            
        },
        {   
            name:"成交总额",
            data: [],
            type: 'pictorialBar',
            symbol:'triangle',
            showBackground: true,
            itemStyle:{
                color:'rgba(223, 169, 8, 1)'
            },
            backgroundStyle: {
                color: 'rgba(220, 220, 220, 0.8)'
            },
            markLine: {
                data: [
                    {type: 'average', name: '平均值'}
                ],
                label:{
                    position:'insideMiddleTop',
                    formatter:function(params){
                        console.log("----label---")
                        console.log(params)
                        return "月度平均成交总额：" + params.value + "亿元"
                    },
                }
            }
        },
        ]
    },
    CsrcOption:{
        title: {
            text: 'CSRC行业分类',
            top:10,
            left: 30,
            textStyle:{
                color:"#9aa8d4",
                fontSize:22,
                fontWeight:400
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: function(params){
                console.log("-----params----")
                console.log(params)
                return params.name + "<br/>" +
                        "股票数：" + params.value + "<br/>" + 
                        "占比：" + params.percent +"%"

            }
        },
        legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
            textStyle:{color:'rgba(113, 96, 242, 1)'}
        },
        series: [
            {
                name: [],
                type: 'pie',
                radius: '55%',
                center: ['40%', '50%'],
                data: [9,0,9,7,8,1,5,7,5,],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    }
}
export default function(state=defaultState,action){
    let newState = Object.assign({},state)
    switch(action.type){
        case INIT_LIST_ACTION:
            let stock_month = []
            let stock_data =[]
            let stock_line = []
            let stock_amount =[]
            action.payload.data.forEach(element => {
                stock_month.push(element.month)
                stock_data.push(element.sh_market_capitalization)
                stock_line.push(element.sh_pe_ratio)
                stock_amount.push(element.sh_transaction_amount)
            })
            newState.echartsOption.series[0].data = stock_data
            newState.echartsOption.series[1].data = stock_line
            newState.echartsOption.series[2].data = stock_amount
            newState.echartsOption.xAxis.data = stock_month
            // console.log("-----------reducer----------")
            // console.log(action.payload.data)
            
            // console.log(newState.num)
            break;
        case ECHARTS_DATA:
            let stock = []
            let stock_name = []
            newState.echartsData = action.payload.data
            console.log("-------CSRC------")
            console.log(action.payload.data)
            action.payload.data.forEach(element => {
                stock.push({value:element.stock,name:element.alias})
                stock_name.push(element.alias)
            })
            console.log(stock)
            newState.CsrcOption.series[0].data = stock
            newState.CsrcOption.series[0].name = stock_name

            break;
        case ECHARTS_OPTION:
            // newState.echartsOption =  action.
            break;
        default:
            break

        
    }
    return newState
}