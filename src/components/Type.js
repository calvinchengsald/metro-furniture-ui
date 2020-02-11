import React, { Component } from 'react'

export class Type extends Component {

    

    render() {

        var actualSubtype = [];
        for( var i=0; i < this.props.allSubtypes.length; i++) {
            if (this.props.type.subtype.includes(this.props.allSubtypes[i].m_subtype) ) {
                actualSubtype.push(this.props.allSubtypes[i]);
            }
        }
        
        const getSubtypeList = actualSubtype.map( (sub) => (
            <div key={sub.m_subtype} className="row">
                <img className="col-sm-3" src={sub.m_url} alt="not found"></img> 
                <div className="col-sm-3">{sub.m_subtype}</div>
                <div className="col-sm-3">{sub.m_description}</div>
            </div>

        ));

        
        
        return (

            <tr className="row">
                <td className="col-sm-2 border"> <img src={this.props.type.m_url} alt="not found"></img> </td>
                <td className="col-sm-2 border"> {this.props.type.m_type}</td>
                <td className="col-sm-2 border"> {this.props.type.m_description}</td>
                <td className="col-sm-6 border"> 
                    {getSubtypeList}
                </td>
            </tr>
            
            // <tr className="col-sm-6">
            //     <div className="row">
            //     <td className="col-sm-12 border">Subtype</td>
            //     </div>
            // </tr>

            // <div>
            //     {this.props.type.m_type}
            // </div>
        )
    }
}


export default Type
