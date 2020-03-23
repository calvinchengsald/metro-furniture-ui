import React, { Component } from 'react'
import {connect} from 'react-redux' ;
import { fetchProducts} from '../../actions/productActions';
import { fetchTypes, fetchSubtypes} from '../../actions/typeActions';
import PropTypes from 'prop-types';
import {distinctObjectArrayByKeyFirstOne,isValidString,isValid, getSubtypeFromTypeString } from '../../utils/standardization';
import { changeSearch } from '../../actions/searchActions';
import { changeInformation } from '../../actions/informationActions';
import {Dropdown } from 'react-bootstrap';
import {Link } from 'react-router-dom';

export class Search extends Component {

    
    // constructor(props){
    //     super(props);
    //     this.state = {
    //         filterBaseCode: "",
    //         filterType: "",
    //         filterSubtype: "",
    //         filterTag: "",
    //     }
    // }

    setStateVariable = (varName, varValue) => {
        var newFilterObject = {
            ...this.props.filterObject,
            [varName] : varValue
        };

        this.props.changeSearch(newFilterObject);
    }
    
    applyGeneralFilter = (data, generalFilter) => {
        if (isValid(data.item_code) &&  data.item_code.trim().toLowerCase().includes(generalFilter.trim().toLowerCase()) ) return true;
        if (isValid(data.base_code) &&  data.base_code.trim().toLowerCase().includes(generalFilter.trim().toLowerCase()) ) return true;
        if (isValid(data.m_size) &&  data.m_size.trim().toLowerCase().includes(generalFilter.trim().toLowerCase()) ) return true;
        if (isValid(data.m_type) &&  data.m_type.trim().toLowerCase().includes(generalFilter.trim().toLowerCase()) ) return true;
        if (isValid(data.m_subtype) &&  data.m_subtype.trim().toLowerCase().includes(generalFilter.trim().toLowerCase()) ) return true;
        if (isValid(data.color) &&  data.color.filter((color) => isValid(color.color) && color.color.trim().toLowerCase().includes(generalFilter.trim().toLowerCase())).length>0  ) return true;
        if (isValid(data.notes) &&  data.notes.trim().toLowerCase().includes(generalFilter.trim().toLowerCase()) ) return true;
        if (isValid(data.tag) &&  data.tag.filter((tagObj) => tagObj.trim().toLowerCase().includes(generalFilter.trim().toLowerCase())).length>0  ) return true;
        return false;
    }


    filterProducts = () => {
        var products = this.props.products;
        products = isValidString(this.props.filterObject.filterGeneral)? products.filter((data)=> this.applyGeneralFilter(data,this.props.filterObject.filterGeneral) ) : products;
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
            filterGeneral: "",
        };
        this.props.changeSearch(newFilterObject);
    }
    changeFieldFromDropdown = (field, value) => {
        // if field changed, need to reset subtype as well
        var newFilterObject = {};
        if(field === "filterType"){
            
            newFilterObject = {
                ...this.props.filterObject,
                [field]: value,
                filterSubtype: ""
            };
        }
        else {
            newFilterObject = {
                ...this.props.filterObject,
                [field]: value
            };
        }
        this.props.changeSearch(newFilterObject);
    }

    
    followToInformation = (base_cd) => {
        var informationObject = {   
            base_code: base_cd
        }
        this.props.changeInformation(informationObject);

    }


    render() {

        var unfilteredProducts = this.filterProducts();

        const allProductsFragment = (!isValid(unfilteredProducts) || unfilteredProducts.length===0)? 
            <div className="card border-success mb-3 col-sm-6 col-md-4 col-lg-3" >
                <img src="https://metro-furniture-resource-stash.s3.amazonaws.com/misc/NoResult.png" className="card-img-top" alt="..."/>
                <div  className="card-body">
                    <div className="row card-title"> 
                        <h5 className="col-sm-12 text-center">No Result :(</h5>
                    </div>
                </div>
            </div>
        :        
        unfilteredProducts.map((product)=>(
            <Link name={product.base_code} key={product.base_code} to="/information" onClick={(e) => this.followToInformation(product.base_code)} className="card border-success mb-3 col-sm-6 col-md-4 col-lg-3" >
                <img name={product.base_code} src={(isValid(product.color)&&isValid(product.color[0])&&isValidString(product.color[0].url))?product.color[0].url:""} className="card-img-top" alt="..."/>
                <div name={product.base_code} className="card-body">
                    <div name={product.base_code} className="row card-title"> 
                        <h5 name={product.base_code} className="col-sm-12 text-center">{product.base_code}</h5>
                    </div>
                    <div name={product.base_code} className="row"> 
                        <div name={product.base_code} className="col-sm-6">Type:</div>
                        <div name={product.base_code} className="col-sm-6">{product.m_type}</div>
                    </div>
                    <div name={product.base_code} className="row"> 
                        <div name={product.base_code} className="col-sm-6">Subtype:</div>
                        <div name={product.base_code} className="col-sm-6">{product.m_subtype}</div>
                    </div>
                    <hr></hr>
                    <div name={product.base_code} className="row"> 
                        {product.tag.map((tag)=> 
                            // <span name={product.base_code} key={tag+"_holder"} className="btn btn-outline-primary mr-sm-2"> {tag}</span>
                            <span name={product.base_code} key={tag+"_holder"} className="badge badge-pill badge-primary mr-sm-2"> {tag}</span>
                        )}
                    </div>

                </div>
            </Link>
        ))


        return (
            <React.Fragment>

                <div className="container-fluid mt-3 border border-grey bg-light">

                    <div className="row  border-dark border-top border-right border-left">
                        <div className="col mt-3">
                            <div className="input-group ">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="base_code">General Search</span>
                                </div>
                                <input type="text" className="form-control  ml-0 align-items-stretch" value={this.props.filterObject.filterGeneral} onChange={(e)=>this.setStateVariable("filterGeneral", e.target.value )} aria-label="Small" aria-describedby="inputGroup-sizing-sm"></input>
                            </div>
                        </div>
                    </div>
                    <div className="row  border-dark border-bottom  border-right border-left">

                        <div className="col-sm-6 col-md-6 col-lg-6 col-xl  my-3">
                            <div className="input-group ">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="base_code">Base Code</span>
                                </div>
                                <input type="text" className=" form-control  ml-0 align-items-stretch" aria-label="Small" aria-describedby="inputGroup-sizing-sm" value={this.props.filterObject.filterBaseCode} onChange={(e)=>this.setStateVariable("filterBaseCode", e.target.value)}></input>
                            </div>
                        </div>
                        
                        
                        <div className="col-sm-6 col-md-6 col-lg-6 col-xl  my-3">
                            <div className="input-group ">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="tag">Tag</span>
                                </div>
                                <input type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" value={this.props.filterObject.filterTag} onChange={(e)=>this.setStateVariable("filterTag", e.target.value)}></input>
                            </div>
                        </div>
                        
                        

                        <div className="col-sm-4 col-md-4 col-lg-4  col-xl my-3 mx-2">
                            <Dropdown className="row">
                                <span className="input-group-text col-sm-3" >Type</span>
                                <Dropdown.Toggle variant="success" id="dropdown-basic" className="col-sm-9">
                                    {this.props.filterObject.filterType===""?"ALL" : this.props.filterObject.filterType }
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                <Dropdown.Item name="m_type"  onClick={()=>this.changeFieldFromDropdown( "filterType","")}>ALL</Dropdown.Item>
                                {this.props.types.map((type) => (
                                    <Dropdown.Item className={this.props.filterObject.filterType===type.m_type?"bg-primary":""} key={type.m_type} name="m_type"  onClick={()=>this.changeFieldFromDropdown( "filterType",type.m_type)}>{type.m_type}</Dropdown.Item>
                                ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        
                        <div className="col-sm-4 col-md-4 col-lg-4 col-xl my-3 mx-2">
                            <Dropdown className="row">
                                <span className="input-group-text col-sm-4" >Subtype</span>
                                <Dropdown.Toggle variant="success" id="dropdown-basic" className="col-sm-8">
                                    {this.props.filterObject.filterSubtype==="" ? "ALL" : this.props.filterObject.filterSubtype}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                <Dropdown.Item name="m_subtype"  onClick={()=>this.changeFieldFromDropdown( "filterSubtype","")}>ALL</Dropdown.Item>
                                {  getSubtypeFromTypeString(this.props.filterObject.filterType, this.props.types, this.props.subtypes).map((subtype) => (
                                    <Dropdown.Item className={this.props.filterObject===subtype.m_subtype?"bg-primary":""} key={subtype.m_subtype} name="m_subtype"  onClick={()=>this.changeFieldFromDropdown( "filterSubtype",subtype.m_subtype)}>{subtype.m_subtype}</Dropdown.Item>
                                ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        

                        <div className="col-sm col-md col-lg my-3 ">
                            <div className="btn btn-primary" onClick={this.clearFilters}>Clear Filters</div>
                        </div>
                    </div>
                    
                    <div className="row">
                        {allProductsFragment}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}




Search.propTypes = {
    fetchProducts: PropTypes.func.isRequired,
    fetchTypes: PropTypes.func.isRequired,
    fetchSubtypes: PropTypes.func.isRequired,
    changeSearch: PropTypes.func.isRequired,
    changeInformation: PropTypes.func.isRequired,
    filterObject: PropTypes.object.isRequired,
}


const mapStateToProps = state => ({
    
    products: state.productReducer.products,
    types: state.typeReducer.types,
    subtypes: state.typeReducer.subtypes,
    filterObject : state.searchReducer.filterObject,
});

export default connect(mapStateToProps, {changeSearch, fetchProducts, fetchTypes,fetchSubtypes,changeInformation })(Search);
