import React, { Component } from 'react'
import { coalesceString, objectStandardizer} from '../utils/standardization';
import { modelAttributeMapping } from '../models/models';
import { postTypes } from '../actions/typeActions';
import {connect } from 'react-redux';
import PropTypes from 'prop-types';

export class TypeForm extends Component {

    constructor(props){
        super(props);
        this.state={
            m_type: "",
            m_url: "",
            m_description: "",
            subtype: []
        }
    }
        
    resetFields = () => {
        this.setState({
            m_type: "",
            m_url: "",
            m_description: "",
            subtype: []
        })
    }

    changeField = (e) => {
        this.setState({
            ...this.state,
            [e.target.name] : e.target.value
        })
    }
    add = () => {
        var newType = {
            m_type: this.state.m_type,
            m_url: coalesceString(this.state.m_url,"").trim(),
            m_description: coalesceString(this.state.m_description,"").trim(),
            subtype: this.state.subtype
        }
        newType = objectStandardizer(newType,modelAttributeMapping.TYPE_MODEL );
        
        this.props.postTypes(newType, (success)=>{
            if(success) {
                this.exitEdit();
            }
        });
    }
        
    exitEdit = () =>{
        this.resetFields();
        this.props.toggleTypeEditMode(false)
    }

    render() {
        return (
                
            <td>
                <img className="col-sm-3" src={this.state.m_url} alt="Upload"></img> 
                <input className="col-sm-3"  type="text" name="m_type" value={this.state.m_type} onChange={this.changeField} placeholder="Type"></input>
                <input className="col-sm-3"  type="text" name="m_description" value={this.state.m_description} onChange={this.changeField} placeholder="Description"></input>
                <div className="col-sm-3">
                    <button data-toggle="tooltip" data-placement="top" title="Save" onClick={this.add} > Add
                    </button>
                    <button data-toggle="tooltip" data-placement="top" title="Cancel" className='btn-danger' onClick={this.exitEdit}   > 
                        Cancel
                    </button>
                </div>
            </td>
        )
    }
}



TypeForm.propTypes = {
    postTypes: PropTypes.func.isRequired,
    toggleTypeEditMode:  PropTypes.func.isRequired
}


const mapStateToProps = state => ({
    
    // currentTypeEdit: state.typeReducer.currentTypeEdit,

});

export default connect(mapStateToProps, {postTypes })(TypeForm);
