import React, { Component } from 'react'

export default class Error404 extends Component {
    render() {
        return (
            <div style={{ textAlign: 'center', color: 'black', opacity: 0.3, marginTop: 100, textTransform: 'uppercase' }}>
                <h1 style={{ fontSize: 55 }}>ERROR 404</h1>
                <h3 style={{ fontSize: 25 }}>Page Not found</h3>
            </div>
        )
    }
}
