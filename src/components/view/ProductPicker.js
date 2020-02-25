import React, { Component } from 'react'
import {connect} from 'react-redux' ;
import { fetchProducts} from '../../actions/productActions';
import { fetchTypes, fetchSubtypes} from '../../actions/typeActions';
import { changeSearch } from '../../actions/searchActions';
import PropTypes from 'prop-types';
import {getSubtypeFromTypeString } from '../../utils/standardization';
import {Link } from 'react-router-dom';

export class ProductPicker extends Component {

    
    constructor(props){
        super(props);
        this.state = {
            currentType: "",
            redirect: false,
        }
    }

    setStateVariable = (varName, varValue) => {
        this.setState({
            ...this.state,
            [varName] : varValue
        })
    }
    
    followToSearch = (e) => {
        var filterObject = {
            filterBaseCode: "",
            filterType: this.state.currentType,
            filterSubtype: e.target.name,
            filterTag: "",
        }
        this.props.changeSearch(filterObject);

    }


    render() {

        return (
            <React.Fragment>

                <div className="card-group">
                    {this.props.types.map((type)=>(
                        <div key={type.m_type} className="card border-success mb-3" onClick={()=>this.setStateVariable("currentType", type.m_type)}>
                            <img src={type.m_url} className="card-img-top" alt="..."/>
                            <div className="card-body">
                                <h5 className="card-title">{type.m_type}</h5>
                            </div>
                        </div>
                    ))}
                </div>
                {this.state.currentType === "" ? 
                    <h1>Select a type</h1>
                        :
                    
                    <div className="card-group">
                        {getSubtypeFromTypeString(this.state.currentType, this.props.types, this.props.subtypes).map((subtype) => (
                            
                            <Link  key={subtype.m_subtype} to="/search" name={subtype.m_subtype} onClick={(e) => this.followToSearch(e)}>
                                <div key={subtype.m_subtype} name={subtype.m_subtype} className="card border-success mb-3">
                                    <img src={subtype.m_url} name={subtype.m_subtype} className="card-img-top" alt="..."/>
                                    <div className="card-body" name={subtype.m_subtype} >
                                        <h5 className="card-title" name={subtype.m_subtype} >{subtype.m_subtype}</h5>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                }
            </React.Fragment>
        )
    }
}




ProductPicker.propTypes = {
    fetchProducts: PropTypes.func.isRequired,
    fetchTypes: PropTypes.func.isRequired,
    fetchSubtypes: PropTypes.func.isRequired,
    changeSearch: PropTypes.func.isRequired,
}


const mapStateToProps = state => ({
    
    products: state.productReducer.products,
    types: state.typeReducer.types,
    subtypes: state.typeReducer.subtypes,
});

export default connect(mapStateToProps, {changeSearch, fetchProducts, fetchTypes,fetchSubtypes })(ProductPicker);
