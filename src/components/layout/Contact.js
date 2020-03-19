
import React, { Component } from 'react'

export class Contact extends Component {
    render() {
        return (
            <div>
                <h1 className="text-left">Contact Information</h1>
                <h5>Telephone: 718-366-6888</h5>
                <h5>Email: metrofurnitureny@gmail.com</h5>
                <h5>Address: 110-90 Dunkirt St, Queens, NY 11412</h5>
                <h5>Hours: 8:AM - 5:PM monday-saturaday</h5>
                
                <a target="_blank" rel="noopener noreferrer"
                href="https://www.google.com/maps/place/Metro+Restaurant+Furniture+Supplies/@40.6977782,-73.7726964,17z/data=!3m1!4b1!4m5!3m4!1s0x89c25ea7cd21db35:0xf2cc81486bfc9e5!8m2!3d40.6977782!4d-73.7705077">
                    <div className="row">
                        <div className="col-md-10 col-lg-10 col-xl-9">
                            <img className='img-fluid' src="https://metro2-furniture-resource-stash.s3.amazonaws.com/misc/location.png" alt="..."></img>    
                        </div>
                    </div>
                </a>
                <hr></hr>
                <hr></hr>
            </div>
        )
    }
}

export default Contact
