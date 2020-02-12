import React, { Component } from 'react';
import Subtypes from './Subtypes';
import {connect} from 'react-redux' ;
import PropTypes from 'prop-types';
import { updateTypes } from '../actions/typeActions';
export class Type extends Component {

    updateType = (oldType, newType) => {

        var typeObject = this.props.type;
        var subtypeArray = typeObject.subtype;
        var newSubtypeArray = [];
        for(var i =0 ; i<subtypeArray.length; i++) {
            if(subtypeArray[i]!==oldType){
                newSubtypeArray.push(subtypeArray[i]);
            }
        }
        newSubtypeArray.push(newType);
        typeObject = {
            ...typeObject,
            subtype: newSubtypeArray
        }
        this.props.updateTypes(typeObject);
    }
    

    render() {

        var actualSubtype = [];
        for( var i=0; i < this.props.allSubtypes.length; i++) {
            if (this.props.type.subtype.includes(this.props.allSubtypes[i].m_subtype) ) {
                actualSubtype.push(this.props.allSubtypes[i]);
            }
        }
        
        const getSubtypeList = actualSubtype.map( (sub) => (
            <Subtypes  key={sub.m_subtype} subtype ={sub} updateType={this.updateType} ></Subtypes>
            

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
            
        )
    }
}



Type.propTypes = {
    allSubtypes: PropTypes.array.isRequired,
    type: PropTypes.object.isRequired,
    updateTypes: PropTypes.func.isRequired
    // currentTypeEdit: PropTypes.string.isRequired
}


const mapStateToProps = state => ({
    
    // currentTypeEdit: state.typeReducer.currentTypeEdit,

});

export default connect(mapStateToProps, { updateTypes })(Type);
