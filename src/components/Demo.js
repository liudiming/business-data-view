import React, { Component } from 'react'
import Header from './header/Headers'
import Container from './container/Container'
import Footer from './footer/Footer'
import './Demo.css'

export default class Demo extends Component {
    render() {
        return (
            <div>
                <Header></Header>
                <Container></Container>
                <Footer></Footer>
            </div>
        )
    }
}
