import React, { Component } from 'react'
import axios from 'axios'
import echarts from 'echarts'
import CountUp from "react-countup"
import 'echarts/theme/shine'
import 'echarts/map/js/china'
import BottomL from '../bottom-l/BottomL'
import BottomR from '../bottom-r/BottomR'
// 引入provider
import {Provider} from 'react-redux'
// 引入仓库
import store from '../../store'

export default class Container extends Component {
    state = {
        companies:0,  // 上市公司数
        securities:0, // 上市证券数
        market:0, //股票总市值
        circulation_market_value:0,  //股票流通市值
        sh_pe_ratio: 0,// 上市平均市盈率
        sz_pe_ratio: 0 //深市平均市盈率
    }
    componentDidMount (){
        // 获取统计数据
        axios.get('/data/count-data.json').then(res => {
            // console.log(res.data)
            this.setState({companies:res.data.listed_companies_total})
            this.setState({securities:res.data.listed_securities_total})
            this.setState({market:res.data.total_market_value})
            this.setState({circulation_market_value:res.data.circulation_market_value})
            this.setState({sh_pe_ratio:res.data.sh_pe_ratio})
            this.setState({sz_pe_ratio:res.data.sz_pe_ratio})
        }).catch(err => {
            console.log(err)
        })

        // 获取排行数据
        const myCharts = echarts.init(document.getElementById("rankChart"),'shine')
        

        const myChartsOpt = {
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "shadow"
                },
                formatter: function (params) {
                    const param = params[0];
                    const marker = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#e6b600;"></span>';
                    const suffix = '<span style="margin-left:5px;font-size:12px;">亿元</span>';
                    return param.name + "<br />" +
                        marker + "排名：" + (param.dataIndex + 1) + "<br />" +
                        marker + "市价总值：" + param.value + suffix;
                }
            },
            grid: {
                top: 10,
                bottom: 10,
                left: 60
            },
            xAxis: {
                show: false,
                type: "value"
            },
            yAxis: {
                type: "category",
                inverse: true,
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: {
                    fontSize: 12,
                    color: "#b0c2f9"
                }
            },
            series: [{
                name: "市价总值排行",
                type: "bar",
                barCategoryGap: "60%",
                label: {
                    show: true,
                    position: "right",
                    fontSize: 12,
                    color: "#188df0",
                    emphasis: {
                        color: "#e6b600"
                    }
                },
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 1, 1, 1,
                            [
                                { offset: 0, color: '#b0c2f9' },
                                { offset: 0.5, color: '#188df0' },
                                { offset: 1, color: '#185bff' }
                            ]
                        )
                    },
                    emphasis: {
                        color: new echarts.graphic.LinearGradient(
                            0, 1, 1, 1,
                            [
                                { offset: 0, color: '#b0c2f9' },
                                { offset: 0.7, color: '#e6b600' },
                                { offset: 1, color: '#ceac09' }
                            ]
                        )
                    }
                }
            }]
        }

        myCharts.setOption(myChartsOpt)
        axios.get('/business-dashboard/data/ranking-list.json').then(res =>{
            // console.log(res.data)
            let data = res.data
            const yData = []
            const xData = []
            for(let i in data){
                yData.push(data[i].stock_name)
                xData.push(data[i].market_capitalization)
            }
            myCharts.setOption({
                yAxis:{
                    data:yData
                },
                series:[{
                    name:'市总值排行',
                    data:xData
                }]
            })
        })
        //地域分布数据获取
        const myMapCharts = echarts.init(document.getElementById('map'),'shine')
        const myMapChartsOpt = {
            textStyle:{
                color:'#5c5ec2'
            },
            series: [{
                type: 'map',
                map: 'china',
                label:{
                    show:true,
                    fontSize: 10,
                    color: "#ceac09",
                },
                data:[]
            }],
            itemStyle:{
                normal:{
                    label:{
                        show:true,
                        color:'#fff'
                    }
                }
            },
            geo: {
                // map: "china",
                roam: true, //开启鼠标缩放和漫游
                zoom: 1, //地图缩放级别
                selectedMode: "single",
                top: 10,
                bottom: 10,
                layoutCenter: ["50%", "50%"],
                //layoutSize: "100%", //保持地图宽高比
                label: {
                    show: true,
                    fontSize: 10,
                    color: "#ceac09"
                }
            },
            tooltip: {
                trigger: 'item',
                padding:10,
                backgroundColor:'#201440',
                borderColor:'#8391ce',
                borderWidth:1,
                formatter: (p)=>{
                    // console.log(p)
                    var dot = "<span style='display:inline-block;width:10px;height:10px;border-radius:50%;background-color:gold;margin-right:6px;'></span>"
                    var bijiao = p.data ? ("<br>" + dot +"深圳上市 : " + p.data.sz + "<br>" + dot +"上海上市 : " + p.data.sh ): ""
                    return  p.name + "<br/>"+dot+"上市公司数 : " + (p.value?p.value:"无数据") +(bijiao || "" )
                }
            },
            visualMap: {
                type:'piecewise',
                splitNumber: 6 ,
                itemWidth:10,
                itemHeight:7,
                left:6,
                bottom:0,
                itemGap: 5,
                textGap: 5,
                pieces: [
                    {min: 500, max: 600}, 
                    {min: 400, max: 500},
                    {min: 300, max: 400},
                    {min: 200, max: 300},
                    {min: 100, max: 200},
                    {min: 0, max: 100}
                ],
                inRange:{
                    color: ['#8ee399', '#1780ef']
                },
                textStyle:{
                    color:'#83ccce'
                },
                calculable: true,
                seriesIndex: [0]
            },
        }
        myMapCharts.setOption(myMapChartsOpt)
        axios.get('business-dashboard/data/region-count.json').then(res =>{
            // console.log(res.data)
            let data = res.data
            const chartData = []
            for(let i in data){
                chartData.push({
                    name:data[i].region,
                    value:data[i].count,
                    sh:data[i].sh_count,
                    sz:data[i].sz_count
                })
            }
            myMapCharts.setOption({
                series:{
                    name:'地域分布',
                    data:chartData
                }
            })
        })
    }
    render() {
        return (
            <div className='container'>
                <div className='container-top'>
                    <div className='container-top-l'>
                        <div className='charts-warp'>
                            <h3 className='charts-title'>市价总值排行top10</h3>
                            <div id='rankChart' style={{height:"400px",width:"640px"}}>
                                {/* <div className="chart-loader"><div className="loader"></div></div> */}
                            </div>
                        </div>
                    </div>
                    <div className='container-top-c'>
                        <div className='charts-warp'>
                            <h3 className='charts-title'>统计数据</h3>
                            <div className='charts-cont'>
                                <div className='charts-cont-left'>
                                    <div className='charts-cont-item'>
                                        <img src='img/icon-01.png' alt='上市公司数'></img>
                                        <div className='charts-item-cont'>
                                            <p className='com-num'><CountUp end={this.state.companies}></CountUp></p>
                                            <p className='com-name'>上市公司数</p>
                                        </div>
                                    </div>
                                    <div className='charts-cont-item'>
                                        <img src='img/icon-03.png' alt='股票总市值'></img>
                                        <div className='charts-item-cont'>
                                            <p className='com-num'><CountUp end={Math.round(this.state.market)}></CountUp></p>
                                            <p className='com-name'>股票总市值(亿元)</p>
                                        </div>
                                    </div>
                                    <div className='charts-cont-item'>
                                        <img src='img/icon-05.png' alt='上市平均市盈率'></img>
                                        <div className='charts-item-cont'>
                                            <p className='com-num'><CountUp end={Math.round(this.state.sh_pe_ratio)}></CountUp></p>
                                            <p className='com-name'>上市平均市盈率</p>
                                        </div>
                                    </div>
                                    
                                </div>
                                <div className='charts-cont-right'>
                                    <div className='charts-cont-item'>
                                        <img src='img/icon-02.png' alt='上市证券数'></img>
                                        <div className='charts-item-cont'>
                                            <p className='com-num'><CountUp end={this.state.securities}></CountUp></p>
                                            <p className='com-name'>上市证券数</p>
                                        </div>
                                    </div>
                                    <div className='charts-cont-item'>
                                        <img src='img/icon-04.png' alt='股票流通市值'></img>
                                        <div className='charts-item-cont'>
                                            <p className='com-num'><CountUp end={Math.round(this.state.circulation_market_value)}></CountUp></p>
                                            <p className='com-name'>股票流通市值(亿元)</p>
                                        </div>
                                    </div>
                                    <div className='charts-cont-item'>
                                        <img src='img/icon-06.png' alt='深市平均市盈率'></img>
                                        <div className='charts-item-cont'>
                                            <p className='com-num'><CountUp end={Math.round(this.state.sz_pe_ratio)}></CountUp></p>
                                            <p className='com-name'>深市平均市盈率</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='container-top-r'>
                        <div className='charts-warp'>
                            <h3 className='charts-title'>上市公司地域分布</h3>
                            <div id='map' style={{height:'400px'}}></div>
                        </div>
                    </div>
                </div>
                <div className='container-bottom'>
                    <div className='container-bottom-l'>
                        <Provider store={store}>
                            <BottomL></BottomL>
                        </Provider>
                        
                    </div>
                    <div className='container-bottom-r'>
                        <Provider store={store}>
                            <BottomR></BottomR>
                        </Provider>
                    </div>
                </div>
            </div>
        )
    }
}
