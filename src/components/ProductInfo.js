import React, { Component } from 'react'
import { isValid } from '../utils/standardization';

export class ProductInfo extends Component {

    removeRecent = () => {
        this.props.removeRecentAdd();
    }

    delete = () => {
        this.props.deleteProduct(this.props.product);
    }
    render() {
        return (
            <tr className= { this.props.recentAddItemCode===this.props.product.item_code?"bg-warning":""}   
                 onMouseLeave= {this.props.recentAddItemCode===this.props.product.item_code? this.removeRecent : null}  >
                <td>{this.props.product.item_code}  </td> 
                <td>{this.props.product.base_code}  </td> 
                <td>{this.props.product.m_size}  </td> 
                <td>{this.props.product.m_type}  </td> 
                <td>{this.props.product.m_subtype}  </td> 
                {/* <td>{this.props.product.thickness}  </td> 
                <td>{this.props.product.cost}  </td>  */}
                <td>{ isValid(this.props.product.color)? this.props.product.color.map((color)=>{
                        return color.color;
                    }): "N/A" 
                    }   
                </td> 
                {/* <td>{this.props.product.edge_option}  </td> 
                <td>{this.props.product.seat_option!==null? this.props.product.seat_option.map((seat_option)=>{
                        return seat_option.seat;
                    }): "N/A" 
                    }   
                </td>  */}
                <td>{this.props.product.notes}  </td> 
                <td>{this.props.product.tag}  </td> 
                <td className="inline"> 
                    <div className="row">
                        <button onClick={this.edit}  > 
                            <svg className="bi bi-document-text" width="1em" height="1em" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M6 3h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2zm0 1a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V5a1 1 0 00-1-1H6z" clipRule="evenodd"></path>
                                <path fillRule="evenodd" d="M6.5 14a.5.5 0 01.5-.5h3a.5.5 0 010 1H7a.5.5 0 01-.5-.5zm0-2a.5.5 0 01.5-.5h6a.5.5 0 010 1H7a.5.5 0 01-.5-.5zm0-2a.5.5 0 01.5-.5h6a.5.5 0 010 1H7a.5.5 0 01-.5-.5zm0-2a.5.5 0 01.5-.5h6a.5.5 0 010 1H7a.5.5 0 01-.5-.5zm0-2a.5.5 0 01.5-.5h6a.5.5 0 010 1H7a.5.5 0 01-.5-.5z" clipRule="evenodd"></path>
                            </svg>
                        </button>
                        <button onClick={this.copy}  > 
                            <svg className="bi bi-documents" width="1em" height="1em" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M5 4h8a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2zm0 1a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V6a1 1 0 00-1-1H5z" clipRule="evenodd"></path>
                                <path d="M7 2h8a2 2 0 012 2v10a2 2 0 01-2 2v-1a1 1 0 001-1V4a1 1 0 00-1-1H7a1 1 0 00-1 1H5a2 2 0 012-2z"></path>
                            </svg>
                        </button>
                        <button className='btn-danger' onClick={this.delete}  > 
                            <svg className="bi bi-trash" width="1em" height="1em" viewBox="0 0 20 20" fill="currentColor" >
                                <path d="M7.5 7.5A.5.5 0 018 8v6a.5.5 0 01-1 0V8a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V8a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V8z"></path>
                                <path fillRule="evenodd" d="M16.5 5a1 1 0 01-1 1H15v9a2 2 0 01-2 2H7a2 2 0 01-2-2V6h-.5a1 1 0 01-1-1V4a1 1 0 011-1H8a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM6.118 6L6 6.059V15a1 1 0 001 1h6a1 1 0 001-1V6.059L13.882 6H6.118zM4.5 5V4h11v1h-11z" clipRule="evenodd"></path>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        )
    }
}

export default ProductInfo

// ProductInfoForm.propTypes = {
//     postProduct: PropTypes.func.isRequired
// }

// const mapStateToProps = state => ({
//     product: state.productReducer.product
// });

// export default connect(mapStateToProps, {postProduct})(ProductInfo);

