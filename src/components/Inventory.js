import React, { Component } from 'react'
import ProductInfo from './ProductInfo'
import {connect} from 'react-redux' ;
import { fetchProducts, removeRecentAdd,deleteProduct  } from '../actions/productActions';
import PropTypes from 'prop-types';
import { fetchTypes,fetchSubtypes  } from '../actions/typeActions';
import ProductInfoForm from './ProductInfoForm';
import TypeForm from './TypeForm';
import Subtypes from './Subtypes';
import {insertionSort, sortType, sortSubtype} from '../utils/sort'
import {Link} from 'react-router-dom';
import {  Route} from 'react-router-dom';
import Type from './Type';
import {blankStringIncludes} from '../utils/standardization';

class Inventory extends Component {

    constructor(props){
        super(props);
        this.state = {
            typeEditMode: false
        }
    }
    componentDidMount() {
       this.props.fetchProducts();
       this.props.fetchTypes();
       this.props.fetchSubtypes();
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
            parentfulSubtypes =parentfulSubtypes.concat(this.props.types[index].subtype);
        }
        var parentlessSubtypes = [];
        for (var index2 in this.props.subtypes) {
            if( ! blankStringIncludes(parentfulSubtypes, this.props.subtypes[index2].m_subtype) ){
                parentlessSubtypes = [...parentlessSubtypes, this.props.subtypes[index2]];
            }
            
        }
        return parentlessSubtypes;

    }
    

    render() {
        const parentlessSubtypes = this.getParentlessSubtypes().map( sub => (
            
            <Subtypes  key={sub.m_subtype} subtype ={sub} parentless={true} types={this.props.types}></Subtypes>

        ));
        const products = insertionSort(this.props.products).map( data => (
            <ProductInfo key={data.item_code} product={data} recentAddItemCode={this.props.recentAddItemCode} removeRecentAdd={this.props.removeRecentAdd} 
                deleteProduct={this.props.deleteProduct}
            >
            </ProductInfo>
        ));
        
        const types = sortType(this.props.types).map( data => (
            <Type key={data.m_type} type={data} allSubtypes ={this.props.subtypes}

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
                                <TypeForm toggleTypeEditMode={(bool)=>{this.toggleTypeEditMode(bool)}}></TypeForm> 
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
                                <th className="col-sm-2">Type </th>
                                <th className="col-sm-2">Subtype </th>
                                <th className="col-sm-2">Color </th>
                                <th className="col-sm-1">Notes </th>
                                <th className="col-sm-1">Tags </th>
                                <th className="col-sm-1">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products}
                            <ProductInfoForm></ProductInfoForm>
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
    subtypes: sortSubtype(state.typeReducer.subtypes)
});

export default connect(mapStateToProps, {fetchProducts,removeRecentAdd,deleteProduct, fetchTypes,fetchSubtypes})(Inventory);
