import React, { Component } from 'react'
import ProductInfo from './ProductInfo'
import {connect} from 'react-redux' ;
import { fetchProducts, removeRecentAdd,deleteProduct  } from '../actions/productActions';
import PropTypes from 'prop-types';
import { fetchTypes,fetchSubtypes ,removeRecentType } from '../actions/typeActions';
import ProductInfoForm from './ProductInfoForm';
import TypeForm from './TypeForm';
import Subtypes from './Subtypes';
import {insertionSort, sortType, sortSubtype} from '../utils/sort'
import {Link} from 'react-router-dom';
import {  Route} from 'react-router-dom';
import Type from './Type';
import {blankStringIncludes, isValid, isValidString} from '../utils/standardization';
import {Button} from 'react-bootstrap';
import {  throwMessageAction } from '../actions/messageActions';


class Inventory extends Component {

    constructor(props){
        super(props);
        this.state = {
            typeEditMode: false,
            filter : {
                item_code: "",
                base_code: "",
                m_size: "",
                m_type: "",
                m_subtype: "",
                color: "",
                notes: "",
                tag: "",
            }
        }
    }
    toggleTypeEditMode = (editMode) => {
        // if(bool){
        //     this.setState({
        //         ...this.state,
        //         typeEditMode: bool
        //     })
        // }

        this.setState({
            ...this.state,
            typeEditMode: editMode
        });
    }


    getParentlessSubtypes = () => {
        var parentfulSubtypes = [];
        for (var index in this.props.types) {
            parentfulSubtypes =parentfulSubtypes.concat(this.props.types[index].m_subtype);
        }
        var parentlessSubtypes = [];
        for (var index2 in this.props.subtypes) {
            if( ! blankStringIncludes(parentfulSubtypes, this.props.subtypes[index2].m_subtype) ){
                parentlessSubtypes = [...parentlessSubtypes, this.props.subtypes[index2]];
            }
            
        }
        return parentlessSubtypes;

    }

    clearFilters = () => {



        this.setState({
            ...this.state,
            filter : {
                item_code: "",
                base_code: "",
                m_size: "",
                m_type: "",
                m_subtype: "",
                color: "",
                notes: "",
                tag: "",
            }
        })
    }
    filterProducts = () => {
        var products = this.props.products;
        products = isValidString(this.state.filter.item_code)? products.filter((data)=> isValid(data.item_code) && data.item_code.trim().toLowerCase().includes(this.state.filter.item_code.trim().toLowerCase()) ) : products;
        products = isValidString(this.state.filter.base_code)? products.filter((data)=> isValid(data.base_code) &&  data.base_code.trim().toLowerCase().includes(this.state.filter.base_code.trim().toLowerCase()) ) : products;
        products = isValidString(this.state.filter.m_size)? products.filter((data)=> isValid(data.m_size) &&  data.m_size.trim().toLowerCase().includes(this.state.filter.m_size.trim().toLowerCase()) ) : products;
        products = isValidString(this.state.filter.m_type)? products.filter((data)=> isValid(data.m_type) &&  data.m_type.trim().toLowerCase().includes(this.state.filter.m_type.trim().toLowerCase()) ) : products;
        products = isValidString(this.state.filter.m_subtype)? products.filter((data)=> isValid(data.m_subtype) &&  data.m_subtype.trim().toLowerCase().includes(this.state.filter.m_subtype.trim().toLowerCase()) ) : products;
        products = isValidString(this.state.filter.notes)? products.filter((data)=> isValid(data.notes) &&  data.notes.trim().toLowerCase().includes(this.state.filter.notes.trim().toLowerCase()) ) : products;
        products = isValidString(this.state.filter.tag)? products.filter((data)=> isValid(data.tag) &&  data.tag.filter((tagObj) => tagObj.trim().toLowerCase().includes(this.state.filter.tag.trim().toLowerCase())).length>0 ) : products;
        products = isValidString(this.state.filter.color)? products.filter((data)=> isValid(data.color) && data.color.filter((colorObj) => isValid(colorObj) && isValid(colorObj.color) && colorObj.color.trim().toLowerCase().includes(this.state.filter.color.trim().toLowerCase())).length>0 ) : products;

        return products;
    }
    onChangeFilter = (e) =>{
        var newFilter = {
            ...this.state.filter,
            [e.target.name]: e.target.value
        };
        this.setState({
            ...this.state,
            filter: newFilter
        })
    }

    
    // callApiWithToken(this, ()=>{console.log("success") } , this.props.throwMessageAction)
    render() {
        
        const parentlessSubtypes = this.getParentlessSubtypes().map( sub => (
            
            <Subtypes  key={sub.m_subtype} subtype ={sub} parentless={true} types={this.props.types} getTokenSilently={this.props.getTokenSilently} ></Subtypes>

        ));
        const products = insertionSort(this.filterProducts()).map( data => (
            <ProductInfo key={data.item_code} product={data} recentAddItemCode={this.props.recentAddItemCode} removeRecentAdd={this.props.removeRecentAdd} 
                deleteProduct={this.props.deleteProduct} allTypes ={this.props.types} allSubtypes = {this.props.subtypes} getAuthenticationHeader={this.getAuthenticationHeader}
                getTokenSilently={this.props.getTokenSilently}
            >
            </ProductInfo>
        ));
        
        const types = sortType(this.props.types).map( data => (
            <Type key={data.m_type} type={data} allSubtypes ={this.props.subtypes} recentAddType={this.props.recentAddType} removeRecentType={this.props.removeRecentType}
                    getTokenSilently={this.props.getTokenSilently}
            >
            </Type>
        ));

        

        return (
            <div className="">
                
                <h1 className="page-header text-center"> Inventory </h1>
                <div  className="btn-group btn-group-toggle " data-toggle="buttons">
                    <label className= {"btn btn-secondary " + (window.location.href.substring(window.location.href.lastIndexOf('/')+1)==="products"? "active" : "" ) }>
                        <Link style={linkStyle} className='brightLink' to="/inventory/products" type="radio" name="options" id="option1" autoComplete="off" checked >Products</Link>
                    </label>
                    <label className= {"btn btn-secondary " + (window.location.href.substring(window.location.href.lastIndexOf('/')+1)==="types"? "active" : "" ) }>
                        <Link style={linkStyle} className='brightLink' to="/inventory/types" type="radio" name="options" id="option2" autoComplete="off" >Types</Link>
                    </label>
                </div>
                <hr></hr>
                <Route path="/inventory/types" > 
                    <table className="table table-striped  table-hover ">
                        <thead className="">
                            <tr className="row">
                                <th className="col-sm-2 border">Pciture</th>
                                <th className="col-sm-1 border">Type</th>
                                <th className="col-sm-2 border">Description</th>
                                <th className="col-sm-1 border">Actions</th>
                                <th className="col-sm-6 border text-center">Subtype
                                    <div className="row">
                                        <span className="col-sm-3 text-left"> Picture</span>
                                        <span className="col-sm-3 text-left"> Subtype</span>
                                        <span className="col-sm-3 text-left"> Description</span>
                                        <span className="col-sm-3 text-left"> Actions</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {types}
                            <tr className="row">
                                <td className="col-sm-6 border"> 
                                    Parentless Subtypes
                                </td>
                                <td className="col-sm-6 border"> 
                                    {parentlessSubtypes}
                                </td>
                            </tr>
                            <tr className="row">
                                {this.state.typeEditMode? 
                                <TypeForm toggleTypeEditMode={(bool)=>{this.toggleTypeEditMode(bool)}} getTokenSilently={this.props.getTokenSilently} ></TypeForm> 
                                :
                                <td>
                                    <button className="btn btn-primary" onClick={()=>{this.toggleTypeEditMode(true)}} >Add Type</button>
                                </td> 
                                
                                }
                            </tr>
                        </tbody>
                    </table>
                </Route>
                <Route path="/inventory/products" > 
                    <table className="table table-striped table-hover">
                        <thead className="">
                            <tr className="row">
                                <th className="col-sm-1">Item Code</th>
                                <th className="col-sm-1">Base Code</th>
                                <th className="col-sm-1">Size </th>
                                <th className="col-sm-1">Type </th>
                                <th className="col-sm-1">Subtype </th>
                                <th className="col-sm-2">Color </th>
                                <th className="col-sm-2">Notes </th>
                                <th className="col-sm-2">Tags </th>
                                <th className="col-sm-1">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="row">
                                <td className="col-sm-1"> <input className='form-control' value={this.state.filter.item_code} type="text" name="item_code" onChange={this.onChangeFilter} placeholder="base code"></input></td>
                                <td className="col-sm-1"> <input className='form-control' value={this.state.filter.base_code} type="text" name="base_code" onChange={this.onChangeFilter} placeholder="base code"></input></td>
                                <td className="col-sm-1"> <input className='form-control' value={this.state.filter.m_size} type="text" name="m_size"    onChange={this.onChangeFilter} placeholder="size"></input></td>
                                <td className="col-sm-1"> <input className='form-control' value={this.state.filter.m_type} type="text" name="m_type"    onChange={this.onChangeFilter} placeholder="type"></input></td>
                                <td className="col-sm-1"> <input className='form-control' value={this.state.filter.m_subtype} type="text" name="m_subtype" onChange={this.onChangeFilter} placeholder="subtype"></input></td>
                                <td className="col-sm-2"> <input className='form-control' value={this.state.filter.color} type="text" name="color"     onChange={this.onChangeFilter} placeholder="color"></input></td>
                                <td className="col-sm-2"> <input className='form-control' value={this.state.filter.notes} type="text" name="notes"     onChange={this.onChangeFilter} placeholder="notes"></input></td>
                                <td className="col-sm-2"> <input className='form-control' value={this.state.filter.tag} type="text" name="tag"       onChange={this.onChangeFilter} placeholder="tag"></input></td>

                                <td className="col-sm-1"> <Button className="btn btn-primary" onClick={this.clearFilters} >Clear Filter</Button></td> 
                            </tr>
                            {products}
                            <ProductInfoForm allTypes ={this.props.types} allSubtypes = {this.props.subtypes} getTokenSilently={this.props.getTokenSilently} ></ProductInfoForm>
                        </tbody>
                    </table>
                </Route>
                
            </div>
        )
    }
}


Inventory.propTypes = {
    fetchProducts: PropTypes.func.isRequired,
    deleteProduct: PropTypes.func.isRequired,
    fetchTypes: PropTypes.func.isRequired,
    fetchSubtypes: PropTypes.func.isRequired,
    products: PropTypes.array.isRequired,
    removeRecentAdd: PropTypes.func.isRequired,
    removeRecentType: PropTypes.func.isRequired,
    subtypes: PropTypes.array.isRequired,
    types: PropTypes.array.isRequired
}


const linkStyle = {
    color: '#36EB1D'
}

const mapStateToProps = state => ({
    products: state.productReducer.products,
    types: state.typeReducer.types,
    recentAddItemCode: state.productReducer.recentAddItemCode,
    recentAddType: state.typeReducer.recentAddType,
    subtypes: sortSubtype(state.typeReducer.subtypes)
});

export default connect(mapStateToProps, {fetchProducts,removeRecentAdd,deleteProduct, fetchTypes,fetchSubtypes,removeRecentType , throwMessageAction})(Inventory);
