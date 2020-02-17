import React, { Component } from 'react'
import {connect } from 'react-redux';
import PropTypes from 'prop-types';
import { postProduct  } from '../actions/productActions';
import { isValidString, removeFromArray } from '../utils/standardization';


export class ProductInfoForm extends Component {


    constructor (props){
        super(props);
        this.state = { base_code: ""}
    }
    onChange = (e) => {
        var newState = {
            [e.target.name] : e.target.value.trim()
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
            tag: tagArr
        });
    }

    onSubmit = (e) => {
        e.preventDefault();
        const product = {
            item_code: this.state.item_code,
            base_code: this.state.base_code,
            m_size: this.state.m_size,
            m_type: this.state.m_type,
            m_subtype: this.state.m_subtype,
            notes: this.state.notes,
            tag: this.state.tag

        }
        this.props.postProduct(product, (success) => {
            document.getElementById("input_base_code").value="";
            document.getElementById("input_m_size").value="";
            document.getElementById("input_m_type").value="";
            document.getElementById("input_m_subtype").value="";
            // document.getElementById("input_color").value="";
            document.getElementById("input_notes").value="";
            document.getElementById("input_tag").value=[];
            this.setState({
                item_code: "",
                base_code: "",
                m_size:    ""
            })
        });
    }

    constructItemCode = () => {
        console.log( this.props.base_code + this.props.m_size.trim()!==""? "-"+this.props.m_size.trim() : "");
        return this.props.base_code + this.props.m_size.trim()!==""? "-"+this.props.m_size.trim() : "";
    }

    render() {
        return (
            <tr className="row">
                <td className="col-sm-1"> <div className='input form-control' name="item_code">{this.state.item_code}</div></td>
                <td className="col-sm-1"> <input className='form-control' type="text" name="base_code" id="input_base_code" onChange={this.onChange} placeholder="base code"></input></td>
                <td className="col-sm-1"> <input className='form-control' type="text" name="m_size"    id="input_m_size"    onChange={this.onChange} placeholder="size"></input></td>
                <td className="col-sm-1"> <input className='form-control' type="text" name="m_type"    id="input_m_type"    onChange={this.onChange} placeholder="type"></input></td>
                <td className="col-sm-1"> <input className='form-control' type="text" name="m_subtype" id="input_m_subtype" onChange={this.onChange} placeholder="subtype"></input></td>
                <td className="col-sm-2"> <input className='form-control' type="text" name="color"     id="input_color"     onChange={this.color} placeholder="color"></input></td>
                <td className="col-sm-2"> <input className='form-control' type="text" name="notes"     id="input_notes"     onChange={this.onChange} placeholder="notes"></input></td>
                <td className="col-sm-2"> <input className='form-control' type="text" name="tag"       id="input_tag"       onChange={this.onChangeTag} placeholder="tag"></input></td>

                <td> <button  onClick={this.onSubmit}  > Create </button></td>
            </tr>
        )
    }
}


ProductInfoForm.propTypes = {
    postProduct: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    product: state.productReducer.product
});

export default connect(mapStateToProps, {postProduct})(ProductInfoForm);

