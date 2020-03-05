import React, { Component } from 'react'
import { coalesceString, objectStandardizer, callApiWithToken, isValid} from '../utils/standardization';
import { modelAttributeMapping } from '../models/models';
import { postTypes } from '../actions/typeActions';
import { deletePostS3 } from '../actions/s3Actions';
import {connect } from 'react-redux';
import PropTypes from 'prop-types';
import {  throwMessageAction } from '../actions/messageActions';


export class TypeForm extends Component {

    constructor(props){
        super(props);
        this.state={
            m_type: "",
            m_url: "",
            m_description: "",
            m_subtype: []
        }
    }
        
    resetFields = () => {
        this.setState({
            m_type: "",
            m_url: "",
            m_description: "",
            m_subtype: []
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
            m_subtype: this.state.m_subtype
        }
        newType = objectStandardizer(newType,modelAttributeMapping.TYPE_MODEL );
        callApiWithToken(this, (config)=>{
            this.props.postTypes(newType, config, (success)=>{
                if(success) {
                    this.exitEdit();
                }
            });
        } , this.props.throwMessageAction)
    }
        
    exitEdit = () =>{
        this.resetFields();
        this.props.toggleTypeEditMode(false)
    }
    changeInputFile = (e) => {
        if( !isValid(e.target.files) || e.target.files.length === 0){
            return
        }
        var file = e.target.files[0];
        callApiWithToken(this, (config)=>{
            this.props.deletePostS3(file, "types/", "", config,(success, url)=> {
                if (success){
                    this.setState({
                        ...this.state,
                        m_url : url
                    })

                }
            })
        } , this.props.throwMessageAction)
    }

    render() {
        return (
            <React.Fragment>
                <td className="col-sm-2"> 
                    <div className="row">
                        <img className="col-sm-12" src={this.state.m_url} alt="Upload"></img> 
                    </div>
                    <div className="input-group">
                        <div className="custom-file">
                            <input
                            type="file"
                            className="custom-file-input"
                            id="inputGroupFile01"
                            aria-describedby="inputGroupFileAddon01"
                            onChange ={(e)=>{this.changeInputFile(e) }}
                            />
                            <label className="custom-file-label" htmlFor="inputGroupFile01">
                            Choose file
                            </label>
                        </div>
                    </div>
                </td>
                <td className="col-sm-1">   <input className="form-control"  type="text" name="m_type" value={this.state.m_type} onChange={this.changeField} placeholder="Type"></input> </td>
                <td className="col-sm-2">   <input className="form-control"  type="text" name="m_description" value={this.state.m_description} onChange={this.changeField} placeholder="Description"></input> </td>
                <td className="col-sm-7">
                    <div className="">
                        <button data-toggle="tooltip" data-placement="top" title="Save" onClick={this.add} > Add
                        </button>
                        <button data-toggle="tooltip" data-placement="top" title="Cancel" className='btn-danger' onClick={this.exitEdit}   > 
                            Cancel
                        </button>
                    </div>
                </td>
            </React.Fragment>
        )
    }
}



TypeForm.propTypes = {
    postTypes: PropTypes.func.isRequired,
    toggleTypeEditMode:  PropTypes.func.isRequired,
    deletePostS3:  PropTypes.func.isRequired,
}


const mapStateToProps = state => ({
    
    // currentTypeEdit: state.typeReducer.currentTypeEdit,

});

export default connect(mapStateToProps, {postTypes, deletePostS3 ,throwMessageAction})(TypeForm);
