import React, { Component } from 'react'
import ProductInfo from './ProductInfo'
import {connect} from 'react-redux' ;
import { fetchProducts, removeRecentAdd,deleteProduct  } from '../actions/productActions';
import PropTypes from 'prop-types';
import ProductInfoForm from './ProductInfoForm';
import {insertionSort} from '../utils/sort'


class Inventory extends Component {

    componentDidMount() {
       this.props.fetchProducts();
    }


    render() {
        const products = insertionSort(this.props.products).map( data => (
            <ProductInfo key={data.item_code} product={data} recentAddItemCode={this.props.recentAddItemCode} removeRecentAdd={this.props.removeRecentAdd} 
                deleteProduct={this.props.deleteProduct}
            >
            </ProductInfo>
        ));

        

        return (
            <div className="">
                
                <h1 className="page-header text-center"> Inventory </h1>
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
            </div>
        )
    }
}


Inventory.propTypes = {
    fetchProducts: PropTypes.func.isRequired,
    deleteProduct: PropTypes.func.isRequired,
    products: PropTypes.array.isRequired,
    removeRecentAdd: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    products: state.productReducer.products,
    recentAddItemCode: state.productReducer.recentAddItemCode
});

export default connect(mapStateToProps, {fetchProducts,removeRecentAdd,deleteProduct})(Inventory);
