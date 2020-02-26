import React, { Component } from 'react'
import {connect} from 'react-redux' ;
import { fetchProducts} from '../../actions/productActions';
import { fetchTypes, fetchSubtypes} from '../../actions/typeActions';
import PropTypes from 'prop-types';
import {distinctObjectArrayByKeyFirstOne,isValidString,isValid, getSubtypeFromTypeString,getObjectFromArrayByKey } from '../../utils/standardization';
import { changeSearch } from '../../actions/searchActions';
import { changeInformation } from '../../actions/productActions';
import {Dropdown } from 'react-bootstrap';
import {  throwMessageAction } from '../../actions/messageActions';
import {sortObjectArrayByKey } from '../../utils/sort'
export class Information extends Component {

    constructor(props){
        super(props);
        this.state = {
            focusedProduct: {},
            focusedColor: {},
            relevantProduct: [],
            prevPropBaseCode: "",
        }
    }

    setStateVariable = (varName, varValue) => {
        var newInformationObject = {
            ...this.props.informationObject,
            [varName] : varValue
        };

        this.props.changeInformation(newInformationObject);
    }
    

    componentDidMount(){
        const relevantProduct = this.props.products.filter((product)=> product.base_code===this.props.informationObject.base_code);
        const focusedProduct = relevantProduct[0];
        this.setState({
            focusedProduct: focusedProduct ,
            relevantProduct: relevantProduct,
            prevPropBaseCode: this.props.informationObject.base_code,
            focusedColor: (isValid(focusedProduct)&&isValid(focusedProduct.color)&&isValid(focusedProduct.color[0])&& isValidString(focusedProduct.color[0].color) && isValidString(focusedProduct.color[0].url) )?focusedProduct.color[0]:{color:"",url:""}
        
        })
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
    
    static getDerivedStateFromProps(props, state) {
        if(state.prevPropBaseCode === props.informationObject.base_code) {
            return state;
        }
        const relevantProduct = props.products.filter((product)=> product.base_code===props.informationObject.base_code);
        const focusedProduct = relevantProduct[0];
        return {
            focusedProduct: focusedProduct ,
            relevantProduct: relevantProduct,
            prevPropBaseCode: props.informationObject.base_code,
            focusedColor: (isValid(focusedProduct)&&isValid(focusedProduct.color)&&isValid(focusedProduct.color[0])&& isValidString(focusedProduct.color[0].color) && isValidString(focusedProduct.color[0].url) )?focusedProduct.color[0]:{color:"",url:""}
        };
    }
    changeFocusedProduct = (item_code) => {
        var newFocusedProduct =  getObjectFromArrayByKey(this.state.relevantProduct,"item_code", item_code);

        //if changed, does color still exist? if not default to first one
        var newFocusedColor =  getObjectFromArrayByKey(newFocusedProduct.color,"color", this.state.focusedColor.color);
        if(!isValid(newFocusedColor)){
            newFocusedColor = newFocusedProduct.color[0]
        }
        if(!isValid(newFocusedProduct)){
            this.props.throwMessageAction("Invalid Size selected");
        }
        else {
            this.setState({
                focusedProduct: newFocusedProduct,
                focusedColor: newFocusedColor,
            });
        }
    }
    
    changeFocusedColor = (color) => {
        var newFocusedColor =  getObjectFromArrayByKey(this.state.focusedProduct.color,"color", color);
        if(!isValid(newFocusedColor)){
            this.props.throwMessageAction("Invalid Color selected");
        }
        else {
            this.setState({
                focusedColor: newFocusedColor
            });
        }
    }


    render() {
        return (
            <React.Fragment>
                {(!isValid(this.state.focusedProduct) ) ? 
                <div> 
                    No Products matches this Base Code: {this.props.informationObject.base_code}
                </div>
                : 
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-6">
                            <hr></hr>
                            <div className="row">
                                <h1 className="col-sm-12 text-center">{this.state.focusedProduct.item_code}</h1> 
                            </div>
                            <div className="row">
                                <h5 className="col-md-6 col-lg-4 text-left border">Base Code:</h5> 
                                <h5 className="col-md-6 col-lg-8 text-left border">{this.state.focusedProduct.base_code}</h5> 
                            </div>
                            <div className="row">
                                <h5 className="col-md-6 col-lg-4 text-left border">Type:</h5> 
                                <h5 className="col-md-6 col-lg-8 text-left border">{this.state.focusedProduct.m_type}</h5> 
                            </div>
                            <div className="row">
                                <h5 className="col-md-6 col-lg-4 text-left border">Subtype:</h5> 
                                <h5 className="col-md-6 col-lg-8 text-left border">{this.state.focusedProduct.m_subtype}</h5> 
                            </div>
                            <div className="row">
                                <h5 className="col-md-6 col-lg-4 text-left border">Notes: {this.state.focusedProduct.notes}</h5> 
                                <h5 className="col-md-6 col-lg-8 text-left border">{this.state.focusedProduct.notes}</h5> 
                            </div>
                            <div className="row">
                                <h5>Size:</h5> 
                            </div>
                            <div className="row">
                                {sortObjectArrayByKey(this.state.relevantProduct,"m_size").map((product)=> {
                                    return <span key={product.m_size} className={"btn mr-sm-2 " + ((product.m_size===this.state.focusedProduct.m_size)?"btn-primary":"btn-outline-primary")} 
                                    onClick={()=>this.changeFocusedProduct( this.state.focusedProduct.base_code+"-"+product.m_size)}>
                                    {product.m_size}
                                    </span> 
                                })
                                }
                            </div>
                            <div className="row">
                                <h5>Colors:</h5> 
                            </div>
                            <div className="row">
                                {sortObjectArrayByKey(this.state.focusedProduct.color,"color").map((color)=> {
                                    return <span key={color.color} className={"btn mr-sm-2 " + ((color.color===this.state.focusedColor.color)?"btn-primary":"btn-outline-primary")} 
                                    onClick={()=>this.changeFocusedColor( color.color)}>
                                    {color.color}
                                    </span> 
                                })
                                }
                            </div>
                            <div className="row">
                                <h5>Tags:</h5> 
                            </div>
                            <div className="row ">
                                {this.state.focusedProduct.tag.map((tag)=> {
                                    return <span key={tag} className="btn btn-success mr-sm-2" >
                                    {tag}
                                    </span> 
                                })
                                }
                            </div>
                            
                        </div>

                        <img className="border border-primary col-sm-6" src={this.state.focusedColor.url} alt="Not found :("/>

                    </div>

                </div>
                } 
            </React.Fragment>
        )
    }
}




Information.propTypes = {
    changeSearch: PropTypes.func.isRequired,
    throwMessageAction: PropTypes.func.isRequired,
}


const mapStateToProps = state => ({
    products: state.productReducer.products,
    informationObject : state.informationReducer.informationObject,
    
});

export default connect(mapStateToProps, {changeSearch,throwMessageAction })(Information);
