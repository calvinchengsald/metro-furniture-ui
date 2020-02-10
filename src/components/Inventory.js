import React, { Component } from 'react'
import ProductInfo from './ProductInfo'
import {connect} from 'react-redux' ;
import { fetchProducts, removeRecentAdd,deleteProduct  } from '../actions/productActions';
import { fetchTypes  } from '../actions/typeActions';
import PropTypes from 'prop-types';
import ProductInfoForm from './ProductInfoForm';
import {insertionSort} from '../utils/sort'
import {Link} from 'react-router-dom';
import {  Route} from 'react-router-dom';
import Type from './Type';

class Inventory extends Component {

    componentDidMount() {
       this.props.fetchProducts();
       this.props.fetchTypes();
    }


    render() {
        const products = insertionSort(this.props.products).map( data => (
            <ProductInfo key={data.item_code} product={data} recentAddItemCode={this.props.recentAddItemCode} removeRecentAdd={this.props.removeRecentAdd} 
                deleteProduct={this.props.deleteProduct}
            >
            </ProductInfo>
        ));
        
        const types = this.props.types.map( data => (
            <Type key={data.type} type={data}

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
                    <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {types}
                            </tbody>
                        </table>
                </Route>
                <Route path="/inventory/products" > 
                    <table className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Item Code</th>
                                <th>Base Code</th>
                                <th>Size </th>
                                <th>Type </th>
                                <th>Subtype </th>
                                {/* <th>Thickness </th>
                                <th>Cost </th> */}
                                <th>Color </th>
                                {/* <th>Edge Option </th>
                                <th>Seat Option </th> */}
                                <th>Notes </th>
                                <th>Tags </th>
                                <th>Action</th>
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
    products: PropTypes.array.isRequired,
    removeRecentAdd: PropTypes.func.isRequired
}


const linkStyle = {
    color: '#36EB1D'
}

const mapStateToProps = state => ({
    products: state.productReducer.products,
    types: state.typeReducer.types,
    recentAddItemCode: state.productReducer.recentAddItemCode
});

export default connect(mapStateToProps, {fetchProducts,removeRecentAdd,deleteProduct, fetchTypes})(Inventory);
