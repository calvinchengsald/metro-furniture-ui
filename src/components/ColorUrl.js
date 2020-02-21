import React, { Component } from 'react'

export class ColorUrl extends Component {


    constructor(props){
        super(props);
        this.state = {
            confirmDelete: false,
        }
    }

    toggleConfirmDelete = (confrimDelete) => {
        this.setState({
            ...this.state,
            confirmDelete: confrimDelete
        })
    }
    

    render() {
        return (
            <div className="row" key={this.props.color.id}>
                <img className="col-sm-3"  src={this.props.color.url} alt="not found"></img> 
                <div className=" col-sm-3 input-group">
                    <div className="custom-file">
                        <input
                        type="file"
                        className="custom-file-input"
                        id="inputGroupFile01"
                        aria-describedby="inputGroupFileAddon01"
                        onChange ={(e)=>{this.props.changeInputFileColorModal(e, this.props.color.id) }}
                        />
                        <label className="custom-file-label" htmlFor="inputGroupFile01">
                        Upload
                        </label>
                    </div>
                </div>
                <input className=" col-sm-4 form-control"  type="text" name="color" value={this.props.color.color} onChange={(e) =>this.props.editColorModel(this.props.color.id, e.target.name, e.target.value)} placeholder="Color"></input> 
                <div className="col-sm-2">
                    {this.state.confirmDelete?
                        <button  data-toggle="tooltip" data-placement="top" title="Delete" className='btn-danger'  onClick={() => this.props.deleteColorModel(this.props.color.id)} onMouseOut={() => this.toggleConfirmDelete(false)}  > 
                            Delete
                        </button>
                        :
                        <button   data-toggle="tooltip" data-placement="top" title="Delete" className='btn-danger' onClick={() => this.toggleConfirmDelete(true)}   > 
                            <svg className="bi bi-trash" width="1em" height="1em" viewBox="0 0 20 20" fill="currentColor" >
                                <path d="M7.5 7.5A.5.5 0 018 8v6a.5.5 0 01-1 0V8a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V8a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V8z"></path>
                                <path fillRule="evenodd" d="M16.5 5a1 1 0 01-1 1H15v9a2 2 0 01-2 2H7a2 2 0 01-2-2V6h-.5a1 1 0 01-1-1V4a1 1 0 011-1H8a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM6.118 6L6 6.059V15a1 1 0 001 1h6a1 1 0 001-1V6.059L13.882 6H6.118zM4.5 5V4h11v1h-11z" clipRule="evenodd"></path>
                            </svg>
                        </button>
                    }
                </div>
                
            </div>
        )
    }
}

export default ColorUrl
