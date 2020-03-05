import React, { Component } from 'react'
import { isValid, removeFromArray, isValidString, arrayToCSV,getSubtypeFromTypeString,callApiWithToken ,distinctOnObjectArrayByKey, blankStringIncludesByKey,cloneObjectArray } from '../utils/standardization';
import {connect} from 'react-redux' ;
import {  updateProduct, deleteUpdateProducts, fetchProducts} from '../actions/productActions';
import {deletePostS3 } from '../actions/s3Actions';
import PropTypes from 'prop-types';
import {Dropdown, Modal , Button} from 'react-bootstrap';
import ColorUrl from './ColorUrl';
import {sortObjectArrayByKey } from '../utils/sort';
import {  throwMessageAction } from '../actions/messageActions';

export class ProductInfo extends Component {

    constructor(props){
        super(props);
        var colorCounter = 0;
        this.state = {
            editMode: false,
            comfirmDelete: false,
            colorModalShow: false,
            item_code: this.props.product.item_code,
            base_code: this.props.product.base_code,
            m_size: this.props.product.m_size,
            m_type: this.props.product.m_type,
            m_subtype: this.props.product.m_subtype,
            color: this.props.product.color,
            colorModel: isValid(this.props.product.color)? 
                this.props.product.color.map( (color) => {
                    return {
                        id: colorCounter++,
                        color: color.color,
                        url: color.url
                    }
                }) : [],
            colorCounter : colorCounter,
            notes: this.props.product.notes,
            tag: this.props.product.tag,
            tagString: arrayToCSV(this.props.product.tag),
            prevState: {
                
                item_code: "",
                base_code: "",
                m_size:    "",
                m_type:    "",
                m_subtype: "",
                color: [],
                colorModel : [],
                notes:     "",
                tag:       [],
                tagString: "",
                colorCounter: colorCounter,
            }
        }
    }
    removeRecent = () => {
        this.props.removeRecentAdd();
    }

    delete = () => {
        
        callApiWithToken(this, (config)=>{
            this.props.deleteProduct(this.props.product, config);
        } , this.props.throwMessageAction)
    }
    toggleConfirmDelete = (confrimDel) => {
        this.setState({
            ...this.state,
            comfirmDelete: confrimDel
        })
    }

    toggleColorModalShow = (show) => {
        this.setState({
            ...this.state,
            colorModalShow: show
        })
    }
    
    toggleEditMode = (editModeBool, resetFields) => {
        if(editModeBool){
            this.setState({
                ...this.state,
                editMode: editModeBool,
                prevState: {
                    item_code: this.state.item_code,
                    base_code: this.state.base_code,
                    m_size:    this.state.m_size,
                    m_type:    this.state.m_type,
                    m_subtype: this.state.m_subtype,
                    color:  this.state.color,
                    colorModel: cloneObjectArray(this.state.colorModel),
                    notes:     this.state.notes,
                    tag:       this.state.tag,
                    tagString: arrayToCSV(this.state.tag),
                    colorCounter:       this.state.colorCounter,
                }
            })
        }
        else {
            // console.log("resetting fields " + resetFields);
            this.setState({
                ...this.state,
                editMode: editModeBool,
                item_code: resetFields? this.state.prevState.item_code : this.state.item_code,
                base_code: resetFields? this.state.prevState.base_code : this.state.base_code,
                m_size:    resetFields? this.state.prevState.m_size : this.state.m_size,
                m_type:    resetFields? this.state.prevState.m_type : this.state.m_type,
                m_subtype: resetFields? this.state.prevState.m_subtype : this.state.m_subtype,
                color:     resetFields? this.state.prevState.color : this.state.color,
                colorModel:     resetFields? this.state.prevState.colorModel : this.state.colorModel,
                notes:     resetFields? this.state.prevState.notes : this.state.notes,
                tag:       resetFields? this.state.prevState.tag : this.state.tag,
                tagString: resetFields? this.state.prevState.tagString : arrayToCSV(this.state.tag),
                colorCounter:       resetFields? this.state.prevState.colorCounter : this.state.colorCounter,
            })
        }
    }

    changeField = (e) => {
        var newState = {
            ...this.state,
            [e.target.name] : e.target.value
        };

        // if either base code or m_size changes, we need to recompute the item_code
        if (e.target.name === "base_code" ||  e.target.name === "m_size"){
            this.setState(newState, (newstate) => {
                newState = {
                    ...newState,
                    item_code: isValidString(this.state.base_code)?  this.state.base_code.trim()+  
                                    (isValidString(this.state.m_size)? "-" + this.state.m_size : "" ) :   ""
                }
                this.setState(newState);
            });
        }
        else {
            this.setState(newState);
        }
    }
    
    onChangeTag = (e) => {
        const tagArr = removeFromArray(e.target.value.split(','),"");
        this.setState({
            ...this.state,
            tag: tagArr,
            tagString: e.target.value
        });
    }
    changeFieldFromDropdown = (field, value) => {
        // if field changed, need to reset subtype as well
        if(field === "m_type"){
            this.setState({
                ...this.state,
                [field]: value,
                m_subtype: ""
            })
        }
        else {
            this.setState({
                ...this.state,
                [field]: value
            })

        }
    }

    //to see if there was a change
    //color model contains unique ID, need to compare to model...
    compareColorToColorModel = (color, colorModel) => {
        //both invalid, nothing to compare nothing changed
        if( !isValid(colorModel) && !isValid(color) ){
            return true;
        }
        //either invalid but not both, than something changed
        if( !isValid(colorModel) || !isValid(color) ){
            return false;
        }
        if(color.length !== colorModel.length) {
            return false;
        }
        var colorSorted = sortObjectArrayByKey(color, "color");
        var colorModelsorted = sortObjectArrayByKey(colorModel, "color");
        for(var i = 0; i<colorSorted.length; i++){
            if (colorSorted[i].color !== colorModelsorted[i].color  || colorSorted[i].url !== colorModelsorted[i].url   ){
                return false;
            }
        }
        return true;
    }

    // colorModel can have null objects inside, need to convert to just color object used in the request
    convertColorModelToColor = () => {
        // var modelClone = cloneObjectArray(this.state.colorModel);
        return this.state.colorModel.filter((data) => data!==null);
    }

    triggerUpdateProduct = () => {
       //check color model, error if duplicate on color
       if (!distinctOnObjectArrayByKey(this.state.colorModel, "color") ) {
            this.props.throwMessageAction("Error", "Cannot have duplicate colors for the same item. Please use a different color name");
            return ;
        }
        var convertedColorModel = this.convertColorModelToColor();
        
        // is there really any update?
        if( this.props.product.item_code.trim() ===  this.state.item_code.trim() &&
            this.props.product.base_code.trim() === this.state.base_code.trim() &&
            this.props.product.m_size.trim() === this.state.m_size.trim() &&
            this.props.product.m_type.trim() === this.state.m_type.trim() &&
            this.props.product.m_subtype.trim() === this.state.m_subtype.trim() &&
            this.compareColorToColorModel(this.props.product.color , convertedColorModel) &&
            this.props.product.notes.trim() === this.state.notes.trim() &&
            arrayToCSV(this.props.product.tag).trim() === this.state.tagString.trim()
            ){
              this.toggleEditMode(false, true);
              return;
       }

       // just an update or a delete update (changing primary key)
       if(this.props.product.item_code.trim() !== this.state.item_code.trim()){
            var deleteUpdateModel = {
                model: {
                    item_code: this.state.item_code,
                    base_code: this.state.base_code,
                    m_size : this.state.m_size,
                    m_type: this.state.m_type,
                    m_subtype: this.state.m_subtype,
                    color: convertedColorModel,
                    notes: this.state.notes,
                    tag: this.state.tag
                },
                prePrimaryKey: this.props.product.item_code
            };
            // this component will go away, it no longer exits. refetch type list to get the updated list
            
            callApiWithToken(this, (config)=>{
                this.props.deleteUpdateProducts(deleteUpdateModel, config,(success) => {
                    if(success){
                        this.props.fetchProducts();
                    } 
                    else {
    
                    }
                });
            } , this.props.throwMessageAction)
            

            return;
            
        }

        
        //else just a regular update
        const updatedProduct = {
            item_code: this.state.item_code,
            base_code: this.state.base_code,
            m_size : this.state.m_size,
            m_type: this.state.m_type,
            m_subtype: this.state.m_subtype,
            color: convertedColorModel,
            notes: this.state.notes,
            tag: this.state.tag
        };
        
        callApiWithToken(this, (config)=>{
            this.props.updateProduct(updatedProduct, config, (success) => {
                if(success){
                    this.toggleEditMode(false, false);
                }
            });
        } , this.props.throwMessageAction)
    }

    deleteColorModel = (uuid) => {
        var newColorModelArray = this.state.colorModel;
        newColorModelArray[uuid] = null;
        this.setState({
            ...this.state,
            colorModel: newColorModelArray
        });
        // this.colorModel
    }

    editColorModel = (uuid, field, value) => {
        var oldColorModel = this.state.colorModel[uuid];
        var newColorModelArray = this.state.colorModel;
        if(isValid(oldColorModel)){
            oldColorModel[field] = value;
            newColorModelArray[uuid] = oldColorModel;
        }
        this.setState({
            ...this.state,
            colorModel: newColorModelArray
        })
    }
    addNewColorModel = () => {
        var newColorModelArray = this.state.colorModel;
        var newlyAddedColorModel = {
            id: this.state.colorCounter
        }
        newColorModelArray.push(newlyAddedColorModel);
        this.setState({
            ...this.state,
            colorModel: newColorModelArray,
            colorCounter: this.state.colorCounter + 1,
        })

    }
    changeInputFileColorModal = (e, uuid) => {
        if( !isValid(e.target.files) || e.target.files.length === 0){
            return
        }
        var file = e.target.files[0];
        
        callApiWithToken(this, (config)=>{
            this.props.deletePostS3(file, this.props.product.m_type + "/" + this.props.product.m_subtype +"/", "", config, (success, url)=> {
                console.log(url);
                if (success){
                    this.editColorModel(uuid, "url", url);

                }
            })
        } , this.props.throwMessageAction)
    }

    colorModelToString = () => {
        var colorModelString = JSON.stringify(this.state.colorModel);
        const el = document.createElement('textarea');
        el.value = colorModelString;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        // this.stringToColorModel();
    }
    stringToColorModel = () => {

        navigator.clipboard.readText().then(text => {
            
            try{
                var obj = JSON.parse(text);
                this.setState({
                    ...this.state,
                    colorModel : obj,
                    colorCounter: obj.length
                })
            }
            catch (e) {
                this.props.throwMessageAction("Error", "Invalid paste, please copy a valid color");
            }
        })
            
        
    }
    
    tagToString = () => {
        const el = document.createElement('textarea');
        el.value = this.state.tagString;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    }
    stringToTag = () => {
        
        navigator.clipboard.readText().then(text => {
            
            try{
                const tagArr = removeFromArray(text.split(','),"");
                this.setState({
                    ...this.state,
                    tag: tagArr,
                    tagString: text
                });
            }
            catch (e) {
                this.props.throwMessageAction("Error", "Invalid paste, please copy a valid tag CSV");
            }
        })
            
    }
    

    render() {

        const deleteButtonFragment = 
            <React.Fragment>
                {this.state.comfirmDelete?
                                <button data-toggle="tooltip" data-placement="top" title="Delete" className='btn-danger' onMouseOut={()=>this.toggleConfirmDelete(false)}  onClick={this.delete}  > 
                                    Delete
                                </button>
                                :
                                <button data-toggle="tooltip" data-placement="top" title="Delete" className='btn-danger'  onClick={()=>this.toggleConfirmDelete(true)}   > 
                                    <svg className="bi bi-trash" width="1em" height="1em" viewBox="0 0 20 20" fill="currentColor" >
                                        <path d="M7.5 7.5A.5.5 0 018 8v6a.5.5 0 01-1 0V8a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V8a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V8z"></path>
                                        <path fillRule="evenodd" d="M16.5 5a1 1 0 01-1 1H15v9a2 2 0 01-2 2H7a2 2 0 01-2-2V6h-.5a1 1 0 01-1-1V4a1 1 0 011-1H8a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM6.118 6L6 6.059V15a1 1 0 001 1h6a1 1 0 001-1V6.059L13.882 6H6.118zM4.5 5V4h11v1h-11z" clipRule="evenodd"></path>
                                    </svg>
                                </button>
                        }
            </React.Fragment>
        
        const showModeFragment = 
            <React.Fragment>
                <td className="col-sm-1">{this.props.product.item_code}  </td> 
                <td className="col-sm-1">{this.props.product.base_code}  </td> 
                <td className="col-sm-1">{this.props.product.m_size}  </td> 
                <td className="col-sm-1">
                    { blankStringIncludesByKey( this.props.allTypes,this.props.product.m_type, "m_type"  ) ? 
                    <div>{this.props.product.m_type}  </div>
                    :
                    <React.Fragment>
                        <span data-toggle="tooltip" data-placement="top" title={"'" +this.props.product.m_type + "' is no longer a valid type"} className='btn-sm btn-danger'>
                            <svg className="bi bi-alert-triangle-fill" width="1em" height="1em" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M9.022 3.566a1.13 1.13 0 011.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H3.144c-.889 0-1.437-.99-.98-1.767L9.022 3.566zM9.002 14a1 1 0 112 0 1 1 0 01-2 0zM10 7a.905.905 0 00-.9.995l.35 3.507a.553.553 0 001.1 0l.35-3.507A.905.905 0 0010 7z" clipRule="evenodd"></path>
                            </svg>
                        </span> 
                        <span>  {this.props.product.m_type}</span> 
                        
                    </React.Fragment>
                    }
                </td> 
                <td className="col-sm-1">
                    { blankStringIncludesByKey( this.props.allSubtypes,this.props.product.m_subtype, "m_subtype"  ) ? 
                    <div>{this.props.product.m_subtype}  </div>
                    :
                    <React.Fragment>
                        <span data-toggle="tooltip" data-placement="top" title={"'" +this.props.product.m_subtype + "' is no longer a valid subtype"} className='btn-sm btn-danger'>
                            <svg className="bi bi-alert-triangle-fill" width="1em" height="1em" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M9.022 3.566a1.13 1.13 0 011.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H3.144c-.889 0-1.437-.99-.98-1.767L9.022 3.566zM9.002 14a1 1 0 112 0 1 1 0 01-2 0zM10 7a.905.905 0 00-.9.995l.35 3.507a.553.553 0 001.1 0l.35-3.507A.905.905 0 0010 7z" clipRule="evenodd"></path>
                            </svg>
                        </span> 
                        <span>  {this.props.product.m_subtype}</span> 
                        
                    </React.Fragment>
                    }
                </td> 
                <td className="col-sm-2">{ isValid(this.props.product.color)? this.props.product.color.map((color)=>(
                        <div key={color.color} className="btn btn-outline-primary" >{color.color}</div>
                    )): "N/A" 
                    } 
                    <hr></hr>
                    <Button onClick={this.colorModelToString}>Copy</Button>   
                </td> 
                <td className="col-sm-2">{this.props.product.notes}  </td> 
                <td className="col-sm-2">{ isValid(this.props.product.tag)? this.props.product.tag.filter((tag)=>tag!==null).map((tag)=>{
                        return <div key={tag} className="btn btn-outline-primary" >{tag}</div>
                    }): "N/A" 
                    }   
                    <hr></hr>
                    <Button onClick={this.tagToString}>Copy</Button>   
                </td> 
                <td className="col-sm-1"> 
                    <div className="row">
                        <button onClick={() => this.toggleEditMode(true, false)}  > 
                            <svg className="bi bi-document-text" width="1em" height="1em" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M6 3h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2zm0 1a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V5a1 1 0 00-1-1H6z" clipRule="evenodd"></path>
                                <path fillRule="evenodd" d="M6.5 14a.5.5 0 01.5-.5h3a.5.5 0 010 1H7a.5.5 0 01-.5-.5zm0-2a.5.5 0 01.5-.5h6a.5.5 0 010 1H7a.5.5 0 01-.5-.5zm0-2a.5.5 0 01.5-.5h6a.5.5 0 010 1H7a.5.5 0 01-.5-.5zm0-2a.5.5 0 01.5-.5h6a.5.5 0 010 1H7a.5.5 0 01-.5-.5zm0-2a.5.5 0 01.5-.5h6a.5.5 0 010 1H7a.5.5 0 01-.5-.5z" clipRule="evenodd"></path>
                            </svg>
                        </button>
                        {deleteButtonFragment}
                    </div>
                </td>
            </React.Fragment> ;
        
        const colorModalFragment = 
            <React.Fragment>
                <Button variant="primary" onClick={() => this.toggleColorModalShow(true)}>
                        Edit
                </Button>
                <Modal
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered show={this.state.colorModalShow}
                    onHide={() => this.toggleColorModalShow(false)} >
                    <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Color
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    { sortObjectArrayByKey(this.state.colorModel,"id").map( (color) => (
                        <ColorUrl key={color.id} color={color} deleteColorModel={(uuid)=>this.deleteColorModel(uuid)} editColorModel={(uuid, field, value) => this.editColorModel(uuid, field, value)} changeInputFileColorModal={(e,id)=>this.changeInputFileColorModal(e,id)} > </ColorUrl>
                    ))
                    }
                    <Button onClick={this.addNewColorModel}> New Color </Button>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button onClick={() => this.toggleColorModalShow(false)} >Close</Button>
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
        
        
        const editModeFragment = 
            <React.Fragment>
                <td className="col-sm-1"> <div className='input form-control' name="item_code">{this.state.item_code}</div></td> 
                <td className='col-sm-1' ><input className='form-control' type="text" name="base_code" value={this.state.base_code} onChange={this.changeField}></input></td>
                <td className='col-sm-1' ><input className='form-control' type="text" name="m_size" value={this.state.m_size} onChange={this.changeField}></input></td>
                <td className='col-sm-1' >
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {this.state.m_type}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                        {this.props.allTypes.map((type) => (
                            <Dropdown.Item className={this.state.m_type===type.m_type?"bg-primary":""} key={type.m_type} name="m_type"  onClick={()=>this.changeFieldFromDropdown( "m_type",type.m_type)}>{type.m_type}</Dropdown.Item>
                        ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </td>
                <td className='col-sm-1' >
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {this.state.m_subtype}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                        { getSubtypeFromTypeString(this.state.m_type, this.props.allTypes, this.props.allSubtypes).map((subtype) => (
                            <Dropdown.Item className={this.state.subtype===subtype.m_subtype?"bg-primary":""} key={subtype.m_subtype} name="m_subtype"  onClick={()=>this.changeFieldFromDropdown( "m_subtype",subtype.m_subtype)}>{subtype.m_subtype}</Dropdown.Item>
                        ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </td>

                <td className="col-sm-2">{ isValid(this.state.colorModel)? this.state.colorModel.filter((color)=>color!==null).map((color)=>{
                        return  <div key={color.id} className="btn btn-outline-primary" >{color.color}</div>
                    }): "N/A" 
                    }   
                    <hr></hr>
                    <Button onClick={this.colorModelToString}>Copy</Button>   
                    <Button onClick={this.stringToColorModel}>Paste</Button>
                    {colorModalFragment}  
                </td> 
                <td className='col-sm-2'><input className='form-control'  type="text" name="notes" value={this.state.notes} onChange={this.changeField}></input></td>
                <td className='col-sm-2'>
                    <input className='form-control'  type="text" name="tag" value={this.state.tagString} onChange={this.onChangeTag}></input>
                    <hr></hr>
                    <Button onClick={this.tagToString}>Copy</Button>   
                    <Button onClick={this.stringToTag}>Paste</Button>
                </td>
                <td className="col-sm-1"> 
                    <div className="row">
                        <button data-toggle="tooltip" data-placement="top" title="Save" onClick={this.triggerUpdateProduct} > Save
                        </button>
                        <button data-toggle="tooltip" data-placement="top" title="Cancel" className='btn-danger' onClick={() => {this.toggleEditMode(false, true)}}  > 
                            Cancel
                        </button>
                    </div>
                    

                </td>
            </React.Fragment> ;

        return (
            <tr className= { this.props.recentAddItemCode===this.props.product.item_code?"bg-warning row":"row"}   
                 onMouseLeave= {this.props.recentAddItemCode===this.props.product.item_code? this.removeRecent : null}  >
                {this.state.editMode? 
                editModeFragment
                :
                showModeFragment
                }
                
            </tr>
        )
    }
}


ProductInfo.propTypes = {
    updateProduct: PropTypes.func.isRequired,
    deleteUpdateProducts: PropTypes.func.isRequired,
    fetchProducts: PropTypes.func.isRequired,
    allSubtypes: PropTypes.array.isRequired,
    allTypes: PropTypes.array.isRequired,
    deletePostS3: PropTypes.func.isRequired,
    throwMessageAction: PropTypes.func.isRequired,
    
}

const mapStateToProps = state => ({
    // product: state.productReducer.product
});

export default connect(mapStateToProps, {updateProduct, deleteUpdateProducts,deletePostS3, fetchProducts, throwMessageAction})(ProductInfo);

