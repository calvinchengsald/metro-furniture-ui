import React, { Component } from 'react'
import {connect} from 'react-redux' ;
import {  updateSubtypes , deleteSubtypes, fetchSubtypes, deleteUpdateSubtypes ,updateTypes, fetchTypes} from '../actions/typeActions';
import { fetchProducts } from '../actions/productActions';
import PropTypes from 'prop-types';
import { isValid , callApiWithToken} from '../utils/standardization';
import {Dropdown } from 'react-bootstrap';
import { deletePostS3 } from '../actions/s3Actions';
import {  throwMessageAction } from '../actions/messageActions';

export class Subtypes extends Component {


    constructor(props){
        super(props);
        this.state = {
            currentEdit: false,
            m_subtype: this.props.subtype.m_subtype,
            m_url: this.props.subtype.m_url,
            m_description: this.props.subtype.m_description,
            prevState: {},
            confirmDelete: false
        };
    }


    edit = () => {
        this.setState({
            ...this.state,
            currentEdit: true,
            prevState: {
                m_subtype:this.state.m_subtype,
                m_url:this.state.m_url,
                m_description:this.state.m_description,
            }
        });
    }
    cancel = () => {
        this.setState({
            ...this.state,
            m_subtype: this.state.prevState.m_subtype,
            m_url: this.state.prevState.m_url,
            m_description: this.state.prevState.m_description,
            currentEdit: false,
            prevState: {}
        });
    }
    changeField = (e) => {
        this.setState({
            ...this.state,
            [e.target.name] : e.target.value
        })
    }
    save = () => {
        // is there really any update?
        if(this.props.subtype.m_subtype.trim() === this.state.m_subtype.trim() && this.props.subtype.m_description === this.state.m_description.trim() 
            && this.props.subtype.m_url === this.state.m_url ) {
               this.cancel();
               return;
        }
        
        
        // just an update or a delete update (changing primary key)
        if(this.props.subtype.m_subtype.trim() !== this.state.m_subtype.trim()){
            var deleteUpdateModel = {
                model: {
                    m_subtype: this.state.m_subtype,
                    m_url: this.state.m_url,
                    m_description: this.state.m_description
                },
                prePrimaryKey: this.props.subtype.m_subtype
            };
            //since this exact subtype has changed, there will be a reload of subtypes.
            // this component will go away, it no longer exits. Will need to refetch subtype list
            // similarly the type list needs to be refreshed since it has a linkage to a new subtype, so it needs to be refreshed
            callApiWithToken(this, (config)=>{
                this.props.deleteUpdateSubtypes(deleteUpdateModel, config, (success) => {
                    if(success){
                        // this.props.updateType(this.props.subtype.m_subtype, this.state.m_subtype);
                        this.props.fetchSubtypes();
                        this.props.fetchTypes();
                        this.props.fetchProducts();
                    } 
                    else {
        
                    }
                });
            } , this.props.throwMessageAction)
            return;
            
        }
        //just a normal update
        else {
            var updatedSubtype = {
                m_subtype: this.state.m_subtype,
                m_url: this.state.m_url,
                m_description: this.state.m_description
            };
            callApiWithToken(this, (config)=>{
                this.props.updateSubtypes(updatedSubtype, config, (success) => {
                    if(success){
                        this.setState({
                            ...this.state,
                            currentEdit: false,
                            prevState: {}
                        })
                    } 
                    else {
        
                    }
                });
            } , this.props.throwMessageAction)
        }
        
    }

    startDelete = () =>{
        this.setState({
            ...this.state,
            confrimDelete: true
        })
    }

    actualDelete = (updateType) => {
        updateType?
        this.props.deleteSubtypesAndUpdateType(this.props.subtype)
        :
        callApiWithToken(this, (config)=>{
            this.props.deleteSubtypes(this.props.subtype, config)
        } , this.props.throwMessageAction)
    }

    cancelDelete = () => {
        this.setState({
            ...this.state,
            confrimDelete: false
        })
    }

    
    // add this subtype to the type array for the new type parent
    updateType = (e) => {
        var m_type = e.target.name
        var typeObject = this.props.types.filter( type => type.m_type===m_type);
        try {
            if (!isValid(typeObject[0])) {
                console.log("invalid type assignment. this should be impossible through the UI");
                return;
            }
            var newTypeObject = {
                ...typeObject[0],
                m_subtype: [...typeObject[0].m_subtype, this.state.m_subtype.trim()]
            }
            callApiWithToken(this, (config)=>{
                this.props.updateTypes(newTypeObject,config,  (success) => {
                    if(success){
                        this.setState({
                            ...this.state,
                            parentless: false
                        })
                    }
                });
            } , this.props.throwMessageAction)
        } 
        catch (error) {
            console.log("invalid type assignment. this should be impossible through the UI");
            console.log("error");
        }

    }

    
    changeInputFile = (e) => {
        if( !isValid(e.target.files) || e.target.files.length === 0){
            return
        }
        var file = e.target.files[0];
        console.log(file)
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
        
        const centerText = this.state.currentEdit? 
            <div className="row border-bottom">
                <div className="col-sm-3">
                    <div className="row">
                        <img className="col-sm-12"  src={this.state.m_url} alt="not found"></img> 
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
                
                <input className="col-sm-3 form-control"  type="text" name="m_subtype" value={this.state.m_subtype} onChange={this.changeField}></input>
                <input className="col-sm-3 form-control"  type="text" name="m_description" value={this.state.m_description} onChange={this.changeField}></input>
                <div className="col-sm-3">
                    <button data-toggle="tooltip" data-placement="top" title="Save" onClick={this.save} > Save
                    </button>
                    <button data-toggle="tooltip" data-placement="top" title="Cancel" className='btn-danger' onClick={this.cancel}   > 
                        Cancel
                    </button>
                </div>
            </div>
            : 
            <div className="row border-bottom">
                <img className="col-sm-3" src={this.props.subtype.m_url} alt="not found"></img> 
                <div className="col-sm-3">{this.props.subtype.m_subtype}</div>
                <div className="col-sm-3">{this.props.subtype.m_description}</div>
                <div className="col-sm-3">
                    {this.props.parentless? 
                        <React.Fragment>
                            <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                Select Type
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                            {this.props.types.map( (type) => (
                                <Dropdown.Item key={type.m_type} name={type.m_type} onClick={(e)=>this.updateType(e)}>{type.m_type}</Dropdown.Item>
                            ))}
                            </Dropdown.Menu>
                            </Dropdown>
                            {this.state.confrimDelete?
                                <button data-toggle="tooltip" data-placement="top" title="Delete" className='btn-danger' onClick={() => this.actualDelete(false)} onMouseOut={this.cancelDelete}   > 
                                    Delete
                                </button>
                                :
                                <button data-toggle="tooltip" data-placement="top" title="Delete" className='btn-danger' onClick={this.startDelete}   > 
                                    <svg className="bi bi-trash" width="1em" height="1em" viewBox="0 0 20 20" fill="currentColor" >
                                        <path d="M7.5 7.5A.5.5 0 018 8v6a.5.5 0 01-1 0V8a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V8a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V8z"></path>
                                        <path fillRule="evenodd" d="M16.5 5a1 1 0 01-1 1H15v9a2 2 0 01-2 2H7a2 2 0 01-2-2V6h-.5a1 1 0 01-1-1V4a1 1 0 011-1H8a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM6.118 6L6 6.059V15a1 1 0 001 1h6a1 1 0 001-1V6.059L13.882 6H6.118zM4.5 5V4h11v1h-11z" clipRule="evenodd"></path>
                                    </svg>
                                </button>
                            }
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <button data-toggle="tooltip" data-placement="top" title="Edit" onClick={this.edit} > 
                                <svg className="bi bi-document-text" width="1em" height="1em" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M6 3h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2zm0 1a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V5a1 1 0 00-1-1H6z" clipRule="evenodd"></path>
                                    <path fillRule="evenodd" d="M6.5 14a.5.5 0 01.5-.5h3a.5.5 0 010 1H7a.5.5 0 01-.5-.5zm0-2a.5.5 0 01.5-.5h6a.5.5 0 010 1H7a.5.5 0 01-.5-.5zm0-2a.5.5 0 01.5-.5h6a.5.5 0 010 1H7a.5.5 0 01-.5-.5zm0-2a.5.5 0 01.5-.5h6a.5.5 0 010 1H7a.5.5 0 01-.5-.5zm0-2a.5.5 0 01.5-.5h6a.5.5 0 010 1H7a.5.5 0 01-.5-.5z" clipRule="evenodd"></path>
                                </svg>
                            </button>
                            {this.state.confrimDelete?
                                <button data-toggle="tooltip" data-placement="top" title="Delete" className='btn-danger' onClick={() => this.actualDelete(true)} onMouseOut={this.cancelDelete}   > 
                                    Delete
                                </button>
                                :
                                <button data-toggle="tooltip" data-placement="top" title="Delete" className='btn-danger' onClick={this.startDelete}   > 
                                    <svg className="bi bi-trash" width="1em" height="1em" viewBox="0 0 20 20" fill="currentColor" >
                                        <path d="M7.5 7.5A.5.5 0 018 8v6a.5.5 0 01-1 0V8a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V8a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V8z"></path>
                                        <path fillRule="evenodd" d="M16.5 5a1 1 0 01-1 1H15v9a2 2 0 01-2 2H7a2 2 0 01-2-2V6h-.5a1 1 0 01-1-1V4a1 1 0 011-1H8a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM6.118 6L6 6.059V15a1 1 0 001 1h6a1 1 0 001-1V6.059L13.882 6H6.118zM4.5 5V4h11v1h-11z" clipRule="evenodd"></path>
                                    </svg>
                                </button>
                            }
                        </React.Fragment>
                    
                    }
                    
                    
                </div>
            </div>
            ;
        
        
        return (
            <div key={this.props.subtype.m_subtype} className="">
                {centerText}
            </div>
        )
    }
}



Subtypes.propTypes = {
    subtype: PropTypes.object.isRequired,
    updateSubtypes: PropTypes.func.isRequired,
    deleteSubtypes: PropTypes.func.isRequired,
    deleteUpdateSubtypes: PropTypes.func.isRequired,
    fetchSubtypes: PropTypes.func.isRequired,
    updateTypes: PropTypes.func.isRequired,
    fetchTypes: PropTypes.func.isRequired,
    fetchProducts: PropTypes.func.isRequired,
    deletePostS3: PropTypes.func.isRequired
    // updateType: PropTypes.func.isRequired

}


const mapStateToProps = state => ({
    // currentTypeEdit: state.typeReducer.currentTypeEdit,

});

export default connect(mapStateToProps, {updateSubtypes,fetchSubtypes,deleteUpdateSubtypes,throwMessageAction,deleteSubtypes,updateTypes,fetchTypes,fetchProducts, deletePostS3 })(Subtypes);
