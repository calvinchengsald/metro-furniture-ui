import React, { Component } from 'react';
import Subtypes from './Subtypes';
import SubtypeForm from './SubtypeForm';
import {connect} from 'react-redux' ;
import PropTypes from 'prop-types';
import { updateTypes, deleteSubtypes, postSubtypes, fetchTypes, deleteUpdateTypes, deleteTypes } from '../actions/typeActions';
import {  removeFromArray, getSubtypeFromType ,callApiWithToken, isValid} from '../utils/standardization';
import { fetchProducts } from '../actions/productActions';
import { deletePostS3 } from '../actions/s3Actions';
import {  throwMessageAction } from '../actions/messageActions';
export class Type extends Component {

    constructor(props) {
        super(props);
        this.state = {
            addSubtype: false,
            editMode: false,
            comfirmDelete: false,
            m_type:  this.props.type.m_type,
            m_url:  this.props.type.m_url,
            m_description:  this.props.type.m_description,
            m_subtype: this.props.type.m_subtype,
            prevState: {
                m_type: "",
                m_url: "",
                m_description: "",
                m_subtype: ""
            }
        }
    }

    //update only the subtype list of this type object
    updateType = (oldSubtype, newSubtype) => {

        var typeObject = this.props.type;
        var subtypeArray = typeObject.m_subtype;
        var newSubtypeArray = [];
        for(var i =0 ; i<subtypeArray.length; i++) {
            if(subtypeArray[i]!==oldSubtype){
                newSubtypeArray.push(subtypeArray[i]);
            }
        }
        newSubtypeArray.push(newSubtype);
        typeObject = {
            ...typeObject,
            m_subtype: newSubtypeArray
        }
        callApiWithToken(this, (config)=>{
            this.props.updateTypes(typeObject, config, (success) => { });
        } , this.props.throwMessageAction)
    }

    // post on database with this updated type object
    fullUpdateType = () => {

         // is there really any update?
         if(this.props.type.m_type.trim() === this.state.m_type.trim() && this.props.type.m_description.trim() === this.state.m_description.trim() 
            && this.props.type.m_url === this.state.m_url ) {
               this.toggleEditMode(false);
               return;
        }


        // just an update or a delete update (changing primary key)
        if(this.props.type.m_type.trim() !== this.state.m_type.trim()){
            var deleteUpdateModel = {
                model: {
                    m_type: this.state.m_type,
                    m_url: this.state.m_url,
                    m_description: this.state.m_description,
                    m_subtype: this.state.m_subtype
                },
                prePrimaryKey: this.props.type.m_type
            };
            // this component will go away, it no longer exits. refetch type list to get the updated list
            callApiWithToken(this, (config)=>{
                this.props.deleteUpdateTypes(deleteUpdateModel, config, (success) => {
                    if(success){
                        this.props.fetchTypes();
                        this.props.fetchProducts();
                    } 
                    else {
        
                    }
                });
            } , this.props.throwMessageAction)

            return;
            
        }

        var newType = {
            m_type: this.state.m_type,
            m_description: this.state.m_description,
            m_url: this.state.m_url,
            m_subtype: this.state.m_subtype
        }
        callApiWithToken(this, (config)=>{
            this.props.updateTypes(newType, config, (success) =>{
                if(success){
                    this.setState({
                        ...this.state,
                        editMode: false
                    })
                }
            });
        } , this.props.throwMessageAction)
    }
    
    deleteSubtypesAndUpdateType = (subtype) => {
        
        const newType = {
            ...this.props.type,
            m_subtype: removeFromArray(this.props.type.m_subtype, subtype.m_subtype)
        }
        
        callApiWithToken(this, (config)=>{
            this.props.deleteSubtypes(subtype, config);
        } , this.props.throwMessageAction)
        
        callApiWithToken(this, (config)=>{
            this.props.updateTypes(newType, config, (success) => { });
        } , this.props.throwMessageAction)
    }

    // new subtype is created, need to update type as well (the subtype array list in type)
    postSubtypesAndUpdateType = (subtype, successCallbackFunction) => {
        
        const newType = {
            ...this.props.type,
            m_subtype: [...this.props.type.m_subtype, subtype.m_subtype]
        }
        callApiWithToken(this, (config)=>{
            this.props.postSubtypes(subtype,config, (success) => {
                if(success) {
                    callApiWithToken(this, (config)=>{
                        this.props.updateTypes(newType, config, (success) => { });
                        successCallbackFunction(true);
                        this.setState({
                            ...this.state,
                            addSubtype: false
                        })
                    } , this.props.throwMessageAction)
                }
            });
        } , this.props.throwMessageAction)
    }

    toggleAddSubtype = (bool) => {
        this.setState({
            ...this.state,
            addSubtype: bool
        });
    }
    toggleEditMode = (bool) => {
        if (bool) {
            this.setState({
                ...this.state,
                editMode: bool,
                prevState: {
                    m_type:this.state.m_type,
                    m_url:this.state.m_url,
                    m_description:this.state.m_description,
                    m_subtype:this.state.m_subtype,
                }
            });
        } 
        else {
            this.setState({
                ...this.state,
                editMode: bool,
                m_type:this.state.prevState.m_type,
                m_url:this.state.prevState.m_url,
                m_description:this.state.prevState.m_description,
                m_subtype:this.state.prevState.m_subtype,
                prevState: {}
            });
        }
    }
    toggleConfirmDelete = (bool) => {
        this.setState({
            ...this.state,
            confrimDelete: bool
        });
    }

    
    changeField = (e) => {
        this.setState({
            ...this.state,
            [e.target.name] : e.target.value
        })
    }

    //to be implemented, delete this type, need to also delete ALL subtypes associated with this type
    // what about items of this type? oh boy
    // when edit, also what about items of this type????????
    actualDelete = () => {
        
        callApiWithToken(this, (config)=>{
            this.props.deleteTypes(this.props.type,config, (success) => {

            });
        } , this.props.throwMessageAction)
    }
        
    
    changeInputFile = (e) => {
        if( !isValid(e.target.files) || e.target.files.length === 0){
            return
        }
        var file = e.target.files[0];
        
        callApiWithToken(this, (config)=>{
            this.props.deletePostS3(file, "types/", "",config, (success, url)=> {
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

        const subtypeDisplayElements = getSubtypeFromType(this.props.type, this.props.allSubtypes).map( (sub) => (
            <Subtypes  key={sub.m_subtype} subtype ={sub} updateType={this.updateType} deleteSubtypesAndUpdateType={this.deleteSubtypesAndUpdateType} getTokenSilently={this.props.getTokenSilently} ></Subtypes>
            

        ));

        

        const mainJSXShowMode = 
            <React.Fragment>
                {/* <td className="col-sm-2 border"> <img src="https://metro-furniture-resource-stash.s3.amazonaws.com/1581809118084-pepe_pika.jpg" alt="not found"></img> </td> */}
                <td className="col-sm-2 border"> 
                    <div className="row">
                        <img className="col-sm-12" src={this.props.type.m_url} alt="not found"></img> 
                    </div>
                </td>
                <td className="col-sm-1 border"> {this.props.type.m_type}</td>
                <td className="col-sm-2 border"> {this.props.type.m_description}</td>
                <td className="col-sm-1 boarder">
                    <button data-toggle="tooltip" data-placement="top" title="Edit" onClick={() => {this.toggleEditMode(true)}} > 
                        <svg className="bi bi-document-text" width="1em" height="1em" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M6 3h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2zm0 1a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V5a1 1 0 00-1-1H6z" clipRule="evenodd"></path>
                            <path fillRule="evenodd" d="M6.5 14a.5.5 0 01.5-.5h3a.5.5 0 010 1H7a.5.5 0 01-.5-.5zm0-2a.5.5 0 01.5-.5h6a.5.5 0 010 1H7a.5.5 0 01-.5-.5zm0-2a.5.5 0 01.5-.5h6a.5.5 0 010 1H7a.5.5 0 01-.5-.5zm0-2a.5.5 0 01.5-.5h6a.5.5 0 010 1H7a.5.5 0 01-.5-.5zm0-2a.5.5 0 01.5-.5h6a.5.5 0 010 1H7a.5.5 0 01-.5-.5z" clipRule="evenodd"></path>
                        </svg>
                    </button>
                    {this.state.confrimDelete?
                        <button data-toggle="tooltip" data-placement="top" title="Delete" className='btn-danger' onClick={this.actualDelete} onMouseOut={()=>{this.toggleConfirmDelete(false)}}   > 
                            Delete
                        </button>
                        :
                        <button data-toggle="tooltip" data-placement="top" title="Delete" className='btn-danger' onClick={()=>{this.toggleConfirmDelete(true)}}  > 
                            <svg className="bi bi-trash" width="1em" height="1em" viewBox="0 0 20 20" fill="currentColor" >
                                <path d="M7.5 7.5A.5.5 0 018 8v6a.5.5 0 01-1 0V8a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V8a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V8z"></path>
                                <path fillRule="evenodd" d="M16.5 5a1 1 0 01-1 1H15v9a2 2 0 01-2 2H7a2 2 0 01-2-2V6h-.5a1 1 0 01-1-1V4a1 1 0 011-1H8a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM6.118 6L6 6.059V15a1 1 0 001 1h6a1 1 0 001-1V6.059L13.882 6H6.118zM4.5 5V4h11v1h-11z" clipRule="evenodd"></path>
                            </svg>
                        </button>
                    }
                    
                </td>
            </React.Fragment>
        ;
        const mainJSXEditMode = 
            <React.Fragment>
                
                <td className="col-sm-2 border"> 
                    <div className="row">
                        <img className="col-sm-12"  src={this.state.m_url} alt="Upload"></img>
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
                <td className="col-sm-1 border"> 
                    <input className="form-control"  type="text" name="m_type" value={this.state.m_type} onChange={this.changeField}></input>
                </td>
                <td className="col-sm-2 border">
                    <input className="form-control"  type="text" name="m_description" value={this.state.m_description} onChange={this.changeField}></input>
                </td>
                <td className="col-sm-1">
                    <button data-toggle="tooltip" data-placement="top" title="Save" onClick={this.fullUpdateType} > Save
                    </button>
                    <button data-toggle="tooltip" data-placement="top" title="Cancel" className='btn-danger' onClick={() => {this.toggleEditMode(false)}}  > 
                        Cancel
                    </button>
                </td>
                
            </React.Fragment>
        ;
        
        return (
            <tr className= { this.props.recentAddType===this.props.type.m_type?"bg-warning row":"row"}   
                 onMouseLeave= {this.props.recentAddType===this.props.type.m_type? this.props.removeRecentType : null}  >
                {this.state.editMode? mainJSXEditMode: mainJSXShowMode}
                <td className="col-sm-6 border"> 
                    {subtypeDisplayElements}

                    {this.state.addSubtype? 
                        <SubtypeForm toggleAddSubtype={ (bool) => {this.toggleAddSubtype(bool)}}
                            postSubtypesAndUpdateType={this.postSubtypesAndUpdateType} getTokenSilently={this.props.getTokenSilently}
                        ></SubtypeForm>
                        : 
                        <button className="btn btn-primary" onClick={ () => {this.toggleAddSubtype(true)}}>Add Subtype</button>
                    }
                </td>
            </tr>
            
        )
    }
}


Type.propTypes = {
    allSubtypes: PropTypes.array.isRequired,
    type: PropTypes.object.isRequired,
    updateTypes: PropTypes.func.isRequired,
    deleteSubtypes: PropTypes.func.isRequired,
    postSubtypes: PropTypes.func.isRequired,
    fetchTypes: PropTypes.func.isRequired,
    deleteUpdateTypes: PropTypes.func.isRequired,
    deleteTypes: PropTypes.func.isRequired,
    fetchProducts: PropTypes.func.isRequired,
    deletePostS3: PropTypes.func.isRequired,
    removeRecentType: PropTypes.func.isRequired,
    // currentTypeEdit: PropTypes.string.isRequired
}


const mapStateToProps = state => ({
    
    // currentTypeEdit: state.typeReducer.currentTypeEdit,

});

export default connect(mapStateToProps, { updateTypes ,fetchProducts, deleteSubtypes,postSubtypes,deleteUpdateTypes, throwMessageAction,fetchTypes, deleteTypes,deletePostS3})(Type);
