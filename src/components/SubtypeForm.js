import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { coalesceString , isValid, callApiWithToken} from '../utils/standardization';
import { deletePostS3 } from '../actions/s3Actions';
import {connect } from 'react-redux';
import {  throwMessageAction } from '../actions/messageActions';


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
            [e.target.name] : e.target.value
        })
    }
    add = () => {
        const newSubtpe = {
            m_subtype: this.state.m_subtype,
            m_url: coalesceString(this.state.m_url,"").trim(),
            m_description: coalesceString(this.state.m_description,"").trim()
        }
        this.props.postSubtypesAndUpdateType(newSubtpe, (success)=>{
            if(success) {
                this.resetFields();
            }
        });
    }

    changeInputFile = (e) => {
        if( !isValid(e.target.files) || e.target.files.length === 0){
            return
        }
        var file = e.target.files[0];
        callApiWithToken(this, (config)=>{
            this.props.deletePostS3(file, "subtypes/", "", config,(success, url)=> {
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
            <div  className="row border-bottom">
                <div className="col-sm-3">
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
                </div>
                
                <input className="col-sm-3 form-control"  type="text" name="m_subtype" value={this.state.m_subtype} onChange={this.changeField} placeholder="Subtype"></input>
                <input className="col-sm-3 form-control"  type="text" name="m_description" value={this.state.m_description} onChange={this.changeField} placeholder="Description"></input>
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
    toggleAddSubtype: PropTypes.func.isRequired,
    deletePostS3:  PropTypes.func.isRequired,
}


const mapStateToProps = state => ({
    
    // currentTypeEdit: state.typeReducer.currentTypeEdit,

});

export default connect(mapStateToProps, { deletePostS3,throwMessageAction })(SubtypeForm);