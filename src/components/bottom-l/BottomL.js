import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import {monthData} from '../../store/actionCreate/actionCreaters'
import EchartsReact from 'echarts-for-react'
// import store from '../../store'

class BottomL extends Component {
    componentDidMount(){
        this.props.monthsData().then(res=>{
            // console.log('------then----')
            // console.log(this.props.option)
            this.myechart.getEchartsInstance().setOption(this.props.option,true)
            
        })
        

    }
    render() {
        return (
            <React.Fragment>
                <EchartsReact 
                style={{height:"100%",width:"100%"}}
                ref={e=>{this.myechart = e}}
                option={this.props.option}> 
                </EchartsReact>
            </React.Fragment>
        
        )
    }
}

const mapStateToProps = (state)=>{
    return{
        num:state.obj,
        option:state.echartsOption
    }
}
// 注入方法的函数
const mapDispatchToProps = (dispatch)=>{
    return {
        monthsData:function(){
            return axios.get('/data/month-count.json').then(res=>{
                // console.log(res.data)
                dispatch(monthData(res.data))
            })
        },
        getEchartsOption:function(){
            // return dispatch(getEchartsOption())
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(BottomL)
