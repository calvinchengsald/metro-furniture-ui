import React, { Component } from 'react'

export class Footer extends Component {
    render() {
        return (
            <footer style={footerStyle}>
                This is footer
            </footer>
        )
    }
}


const footerStyle= {
    background: '#333',
    color: '#FFFF00',
    textAlign: 'center',
    padding: '5px'
}

export default Footer