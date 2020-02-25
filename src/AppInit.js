import React, { Component } from 'react'
import {connect} from 'react-redux' ;
import PropTypes from 'prop-types';
import { fetchTypes,fetchSubtypes  } from './actions/typeActions';
import { fetchProducts } from './actions/productActions';

export class AppInit extends Component {

    componentDidMount() {
        this.props.fetchProducts();
        this.props.fetchTypes();
        this.props.fetchSubtypes();
     }

    render() {
        return (
            <div>
                
            </div>
        )
    }
}


AppInit.propTypes = {
    fetchProducts: PropTypes.func.isRequired,
    fetchTypes: PropTypes.func.isRequired,
    fetchSubtypes: PropTypes.func.isRequired,
}


const mapStateToProps = state => ({ 

});

export default connect(mapStateToProps, {fetchProducts, fetchTypes,fetchSubtypes })(AppInit);
