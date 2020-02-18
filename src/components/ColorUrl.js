import React, { Component } from 'react'

export class ColorUrl extends Component {


    
    

    render() {
        return (
            <div className="row">
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
                        Choose file
                        </label>
                    </div>
                </div>
                <input className=" col-sm-6 form-control"  type="text" name="color" value={this.props.color.color} onChange={(e) =>this.props.editColorModel(this.props.color.id, e.target.name, e.target.value)} placeholder="Type"></input> 
            </div>
        )
    }
}

export default ColorUrl
