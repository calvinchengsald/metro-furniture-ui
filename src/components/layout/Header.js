import React, { Component } from 'react';
import {Link} from 'react-router-dom';

export class Header extends Component {



    render() {
        return (
            <header style={headerStyle}>
                <h1> Metro Furiture Website</h1>
                <Link style={linkStyle} className='brightLink' to="/">Home</Link>
                <span>|</span> 
                <Link  style={linkStyle}  className="brightLink" to='/information'>Information</Link>
                <span>|</span> 
                <Link  style={linkStyle}  className="brightLink" to='/search'>Search</Link>
                <span>|</span> 
                <Link  style={linkStyle}  className="brightLink" to='/about'>About</Link>
                <span>|</span> 
                <Link  style={linkStyle}  className="brightLink" to='/inventory'>Inventory</Link>
                <span>|</span> 
                <Link  style={linkStyle}  className="brightLink" to='/external_api'>external_api</Link>
            </header>
        )
    }
}

const headerStyle= {
    background: '#333',
    color: '#FFFF00',
    textAlign: 'center',
    padding: '5px'
}
export const linkStyle = {
    color: '#FFFF00'
}
export default Header
