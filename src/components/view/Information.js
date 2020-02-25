import React, { Component } from 'react'
import {connect} from 'react-redux' ;
import { fetchProducts} from '../../actions/productActions';
import { fetchTypes, fetchSubtypes} from '../../actions/typeActions';
import PropTypes from 'prop-types';
import {distinctObjectArrayByKeyFirstOne,isValidString,isValid, getSubtypeFromTypeString } from '../../utils/standardization';
import { changeSearch } from '../../actions/searchActions';
import { changeInformation } from '../../actions/productActions';
import {Dropdown } from 'react-bootstrap';

export class Information extends Component {

    

    setStateVariable = (varName, varValue) => {
        var newInformationObject = {
            ...this.props.informationObject,
            [varName] : varValue
        };

        this.props.changeInformation(newInformationObject);
    }
    


    filterProducts = () => {
        var products = this.props.products;
        products = isValidString(this.props.filterObject.filterBaseCode)? products.filter((data)=> isValid(data.base_code) &&  data.base_code.trim().toLowerCase().includes(         this.props.filterObject.filterBaseCode.trim().toLowerCase()) ) : products;
        products = isValidString(this.props.filterObject.filterType)? products.filter((data)=> isValid(data.m_type) &&  data.m_type.trim().toLowerCase().includes(                   this.props.filterObject.filterType.trim().toLowerCase()) ) : products;
        products = isValidString(this.props.filterObject.filterSubtype)? products.filter((data)=> isValid(data.m_subtype) &&  data.m_subtype.trim().toLowerCase().includes(          this.props.filterObject.filterSubtype.trim().toLowerCase()) ) : products;
        products = isValidString(this.props.filterObject.filterTag)? products.filter((data)=> isValid(data.tag) &&  data.tag.filter((tagObj) => tagObj.trim().toLowerCase().includes(this.props.filterObject.filterTag.trim().toLowerCase())).length>0 ) : products;
        products = distinctObjectArrayByKeyFirstOne(products,"base_code" );
        return products;
    }

    clearFilters = () => {
        var newFilterObject = {
            ...this.props.filterObject, 
            filterBaseCode: "",
            filterType: "",
            filterSubtype: "",
            filterTag: "",
        };
        this.props.changeSearch(newFilterObject);
    }

    render() {

        const relevantProduct = this.props.products.filter((product)=> product.base_code===this.props.informationObject.base_code);
        return (
            <React.Fragment>
                {(!isValid(relevantProduct) || relevantProduct.length===0 ) ? 
                <div> 
                    No Products matches this Base Code: {this.props.informationObject.base_code}
                </div>
                : 
                <div className="container">
                    <div className="Row">
                        
                    </div>

                </div>
                } 
            </React.Fragment>
        )
    }
}




Information.propTypes = {
    changeSearch: PropTypes.func.isRequired,
}


const mapStateToProps = state => ({
    products: state.productReducer.products,
    informationObject : state.informationReducer.informationObject,
    
});

export default connect(mapStateToProps, {changeSearch })(Information);
