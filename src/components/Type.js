import React, { Component } from 'react'

export class Type extends Component {
    render() {
        return (
            <div>
                {this.props.type.m_type}
            </div>
        )
    }
}

export default Type
