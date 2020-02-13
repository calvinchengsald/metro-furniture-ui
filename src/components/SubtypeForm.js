import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { coalesceString } from '../utils/standardization';


export class SubtypeForm extends Component {

    constructor(props){
        super(props);
        this.state = {
            m_subtype: "",
            m_url: "",
            m_description: ""
        };
    }
    
    resetFields = () => {
        this.setState({
            m_subtype: "",
            m_url: "",
            m_description: ""
        })
    }

    changeField = (e) => {
        this.setState({
            ...this.state,
            [e.target.name] : e.target.value.trim()
        })
    }
    add = () => {
        const newSubtpe = {
            m_subtype: this.state.m_subtype,
            m_url: coalesceString(this.state.m_url,""),
            m_description: coalesceString(this.state.m_description,"")
        }
        this.props.postSubtypesAndUpdateType(newSubtpe, (success)=>{
            if(success) {
                this.resetFields();
            }
        });
    }



    render() {
        return (
            <div  className="row border-bottom">
                <img className="col-sm-3" src={this.state.m_url} alt="Upload"></img> 
                <input className="col-sm-3"  type="text" name="m_subtype" value={this.state.m_subtype} onChange={this.changeField} placeholder="Subtype"></input>
                <input className="col-sm-3"  type="text" name="m_description" value={this.state.m_description} onChange={this.changeField} placeholder="Description"></input>
                <div className="col-sm-3">
                    <button data-toggle="tooltip" data-placement="top" title="Save" onClick={this.add} > Add
                    </button>
                    <button data-toggle="tooltip" data-placement="top" title="Cancel" className='btn-danger' onClick={() => {this.props.toggleAddSubtype(false) }}   > 
                        Cancel
                    </button>
                </div>
            </div>
        )
    }
}



SubtypeForm.propTypes = {
    toggleAddSubtype: PropTypes.func.isRequired
}


export default SubtypeForm
