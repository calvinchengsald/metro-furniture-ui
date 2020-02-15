import React, { Component } from 'react'
import { isValid, removeFromArray, isValidString, arrayToCSV } from '../utils/standardization';
import {connect} from 'react-redux' ;
import {  updateProduct, deleteUpdateProducts, fetchProducts} from '../actions/productActions';
import PropTypes from 'prop-types';

export class ProductInfo extends Component {

    constructor(props){
        super(props);
        this.state = {
            editMode: false,
            comfirmDelete: false,
            item_code: this.props.product.item_code,
            base_code: this.props.product.base_code,
            m_size: this.props.product.m_size,
            m_type: this.props.product.m_type,
            m_subtype: this.props.product.m_subtype,
            // color: "",
            notes: this.props.product.notes,
            tag: this.props.product.tag,
            tagString: arrayToCSV(this.props.product.tag),
            prevState: {
                
                item_code: "",
                base_code: "",
                m_size:    "",
                m_type:    "",
                m_subtype: "",
                // color: "",
                notes:     "",
                tag:       [],
                tagString: ""
            }
        }
    }
    removeRecent = () => {
        this.props.removeRecentAdd();
    }

    delete = () => {
        this.props.deleteProduct(this.props.product);
    }
    toggleConfirmDelete = (confrimDel) => {
        this.setState({
            ...this.state,
            comfirmDelete: confrimDel
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
                    // color: ""
                    notes:     this.state.notes,
                    tag:       this.state.tag,
                    tagString: arrayToCSV(this.state.tag)
                }
            })
        }
        else {
            this.setState({
                ...this.state,
                editMode: editModeBool,
                item_code: resetFields? this.state.prevState.item_code : this.state.item_code,
                base_code: resetFields? this.state.prevState.base_code : this.state.base_code,
                m_size:    resetFields? this.state.prevState.m_size : this.state.m_size,
                m_type:    resetFields? this.state.prevState.m_type : this.state.m_type,
                m_subtype: resetFields? this.state.prevState.m_subtype : this.state.m_subtype,
                // color:  resetFields? this.state.prevState.color : this.state.color,
                notes:     resetFields? this.state.prevState.notes : this.state.notes,
                tag:       resetFields? this.state.prevState.tag : this.state.tag,
                tagString: resetFields? this.state.prevState.tagString : arrayToCSV(this.state.tag)
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


    triggerUpdateProduct = () => {

        
        // is there really any update?
        if( this.props.product.item_code.trim() ===  this.state.item_code.trim() &&
            this.props.product.base_code.trim() === this.state.base_code.trim() &&
            this.props.product.m_size.trim() === this.state.m_size.trim() &&
            this.props.product.m_type.trim() === this.state.m_type.trim() &&
            this.props.product.m_subtype.trim() === this.state.m_subtype.trim() &&
            // this.props.product.color.trim() === this.state.color.trim() &&
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
                    color: this.state.color,
                    notes: this.state.notes,
                    tag: this.state.tag
                },
                prePrimaryKey: this.props.product.item_code
            };
            // this component will go away, it no longer exits. refetch type list to get the updated list
            this.props.deleteUpdateProducts(deleteUpdateModel, (success) => {
                if(success){
                    this.props.fetchProducts();
                } 
                else {

                }
            });

            return;
            
        }

        //else just a regular update
        const updatedProduct = {
            item_code: this.state.item_code,
            base_code: this.state.base_code,
            m_size : this.state.m_size,
            m_type: this.state.m_type,
            m_subtype: this.state.m_subtype,
            color: this.state.color,
            notes: this.state.notes,
            tag: this.state.tag
        };

        this.props.updateProduct(updatedProduct, (success) => {
            if(success){
                this.toggleEditMode(false, false);
            }
        });
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
                <td className="col-sm-2">{this.props.product.m_type}  </td> 
                <td className="col-sm-2">{this.props.product.m_subtype}  </td> 
                <td className="col-sm-2">{ isValid(this.props.product.color)? this.props.product.color.map((color)=>{
                        return color.color;
                    }): "N/A" 
                    }   
                </td> 
                <td className="col-sm-1">{this.props.product.notes}  </td> 
                <td className="col-sm-1">{this.props.product.tag}  </td> 
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
        
        
        
        const editModeFragment = 
            <React.Fragment>
                <td className="col-sm-1"> <div className='input form-control' name="item_code">{this.state.item_code}</div></td> 
                <td className='col-sm-1' ><input className='form-control' type="text" name="base_code" value={this.state.base_code} onChange={this.changeField}></input></td>
                <td className='col-sm-1' ><input className='form-control' type="text" name="m_size" value={this.state.m_size} onChange={this.changeField}></input></td>
                <td className='col-sm-2' ><input className='form-control' type="text" name="m_type" value={this.state.m_type} onChange={this.changeField}></input></td>
                <td className='col-sm-2' ><input className='form-control' type="text" name="m_subtype" value={this.state.m_subtype} onChange={this.changeField}></input></td>
                <td className='col-sm-2' >{ isValid(this.props.product.color)? this.props.product.color.map((color)=>{
                        return color.color;
                    }): "N/A" 
                    }   
                </td> 
                <td className='col-sm-1'><input className='form-control'  type="text" name="notes" value={this.state.notes} onChange={this.changeField}></input></td>
                <td className='col-sm-1'><input className='form-control'  type="text" name="tag" value={this.state.tagString} onChange={this.onChangeTag}></input></td>
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
    fetchProducts: PropTypes.func.isRequired
    
}

const mapStateToProps = state => ({
    // product: state.productReducer.product
});

export default connect(mapStateToProps, {updateProduct, deleteUpdateProducts, fetchProducts})(ProductInfo);

