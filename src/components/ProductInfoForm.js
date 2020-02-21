import React, { Component } from 'react'
import {connect } from 'react-redux';
import PropTypes from 'prop-types';
import { postProduct  } from '../actions/productActions';
import { isValidString, removeFromArray, isValid, distinctOnObjectArrayByKey } from '../utils/standardization';
import { deletePostS3 } from '../actions/s3Actions';
import { sortObjectArrayByKey } from '../utils/sort';
import { Modal , Button} from 'react-bootstrap';
import ColorUrl from './ColorUrl';
import {  throwMessageAction } from '../actions/messageActions';


export class ProductInfoForm extends Component {


    constructor (props){
        super(props);
        this.state = { 
            base_code: "",
            colorModel: [],
            colorCounter: 0
    
        }
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
        
        if (!distinctOnObjectArrayByKey(this.state.colorModel, "color") ) {
            this.props.throwMessageAction("Error", "Cannot have duplicate colors for the same item. Please use a different color name");
            return ;
        }
        var convertedColorModel = this.state.colorModel.filter((data) => data!==null);
        const product = {
            item_code: this.state.item_code,
            base_code: this.state.base_code,
            m_size: this.state.m_size,
            m_type: this.state.m_type,
            m_subtype: this.state.m_subtype,
            notes: this.state.notes,
            tag: this.state.tag,
            color: convertedColorModel

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
                m_size:    "",
                colorModel: [],
                colorCounter : 0,
            })
        });
    }

    constructItemCode = () => {
        // console.log( this.props.base_code + this.props.m_size.trim()!==""? "-"+this.props.m_size.trim() : "");
        return this.props.base_code + this.props.m_size.trim()!==""? "-"+this.props.m_size.trim() : "";
    }

    
    deleteColorModel = (uuid) => {
        var newColorModelArray = this.state.colorModel;
        newColorModelArray[uuid] = null;
        this.setState({
            ...this.state,
            colorModel: newColorModelArray
        });
        // this.colorModel
    }

    editColorModel = (uuid, field, value) => {
        var oldColorModel = this.state.colorModel[uuid];
        var newColorModelArray = this.state.colorModel;
        if(isValid(oldColorModel)){
            oldColorModel[field] = value;
            newColorModelArray[uuid] = oldColorModel;
        }
        this.setState({
            ...this.state,
            colorModel: newColorModelArray
        })
    }
    addNewColorModel = () => {
        var newColorModelArray = this.state.colorModel;
        var newlyAddedColorModel = {
            id: this.state.colorCounter
        }
        newColorModelArray.push(newlyAddedColorModel);
        this.setState({
            ...this.state,
            colorModel: newColorModelArray,
            colorCounter: this.state.colorCounter + 1,
        })

    }
    changeInputFileColorModal = (e, uuid) => {
        if( !isValid(e.target.files) || e.target.files.length === 0){
            return
        }
        var file = e.target.files[0];
        this.props.deletePostS3(file, this.state.m_type + "/" + this.state.m_subtype +"/", "", (success, url)=> {
            console.log(url);
            if (success){
                this.editColorModel(uuid, "url", url);

            }
        })
    }
    
    toggleColorModalShow = (show) => {
        this.setState({
            ...this.state,
            colorModalShow: show
        })
    }
    
    
    render() {
        
        const colorModalFragment = 
            <React.Fragment>
                <Button variant="primary" onClick={() => this.toggleColorModalShow(true)}>
                        Edit Colors
                </Button>
                <Modal
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered show={this.state.colorModalShow}
                    onHide={() => this.toggleColorModalShow(false)} >
                    <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Color
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    { sortObjectArrayByKey(this.state.colorModel,"id").map( (color) => (
                        <ColorUrl key={color.id} color={color} deleteColorModel={(uuid)=>this.deleteColorModel(uuid)} editColorModel={(uuid, field, value) => this.editColorModel(uuid, field, value)} changeInputFileColorModal={(e,id)=>this.changeInputFileColorModal(e,id)} > </ColorUrl>
                    ))
                    }
                    <Button onClick={this.addNewColorModel}> New Color </Button>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button onClick={() => this.toggleColorModalShow(false)} >Close</Button>
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
        

        return (
            <tr className="row">
                <td className="col-sm-1"> <div className='input form-control' name="item_code">{this.state.item_code}</div></td>
                <td className="col-sm-1"> <input className='form-control' type="text" name="base_code" id="input_base_code" onChange={this.onChange} placeholder="base code"></input></td>
                <td className="col-sm-1"> <input className='form-control' type="text" name="m_size"    id="input_m_size"    onChange={this.onChange} placeholder="size"></input></td>
                <td className="col-sm-1"> <input className='form-control' type="text" name="m_type"    id="input_m_type"    onChange={this.onChange} placeholder="type"></input></td>
                <td className="col-sm-1"> <input className='form-control' type="text" name="m_subtype" id="input_m_subtype" onChange={this.onChange} placeholder="subtype"></input></td>
                
                <td className="col-sm-2">{ isValid(this.state.colorModel)? this.state.colorModel.map((color)=>{
                        return color===null? "" : <div key={color.id} className="btn btn-outline-primary" >{color.color}</div>
                    }): "N/A" 
                    }   
                    
                    {colorModalFragment}  
                </td> 
                <td className="col-sm-2"> <input className='form-control' type="text" name="notes"     id="input_notes"     onChange={this.onChange} placeholder="notes"></input></td>
                <td className="col-sm-2"> <input className='form-control' type="text" name="tag"       id="input_tag"       onChange={this.onChangeTag} placeholder="tag"></input></td>

                <td> <button  onClick={this.onSubmit}  > Create </button></td>
            </tr>
        )
    }
}


ProductInfoForm.propTypes = {
    postProduct: PropTypes.func.isRequired,
    deletePostS3: PropTypes.func.isRequired,
    throwMessageAction: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    product: state.productReducer.product
});

export default connect(mapStateToProps, {postProduct, deletePostS3, throwMessageAction})(ProductInfoForm);

