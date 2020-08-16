import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import {echartsData} from '../../store/actionCreate/actionCreaters'
import EchartsReact from 'echarts-for-react'


class BottomR extends Component {
    componentDidMount(){
        this.props.echartsData().then(res=>{
            console.log(this.props.echarts)
            this.myechart.getEchartsInstance().setOption(this.props.option,true)
        })
    }
    render() {
        return (
            <React.Fragment>
                <EchartsReact
                style={{height:"100%",width:"100%"}}
                ref={e=>{this.myechart = e}}
                option={this.props.option}
                >

                </EchartsReact>
            </React.Fragment>
        )
    }
}


const mapStateToProps = (state)=>{
    return{
        echarts:state.echartsData,
        option:state.CsrcOption
    }
}
// 注入方法的函数
const mapDispatchToProps = (dispatch)=>{
    return {
        echartsData:function(){
            return axios.get('/data/csrc-industry.json').then(res=>{
                // console.log(res.data)
                dispatch(echartsData(res.data))
            })
        },
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(BottomR)
