
import React, { Component } from 'react'

export class Contact extends Component {
    render() {
        return (
            <div>
                <h1 className="text-left">Contact Information</h1>
                <h5>Telephone: 718-366-6888</h5>
                <h5>Email: metrofurnitureny@gmail.com</h5>
                <h5>Address: 5105 Flushing Ave, Maspeth NY 11378</h5>
                <h5>Hours: 8:AM - 5:PM monday-saturaday</h5>
                
                <a target="_blank" 
                href="https://www.google.com/maps/place/Metro+Restaurant+Furniture+Supplies/@40.7134259,-73.9212232,15z/data=!4m5!3m4!1s0x0:0xf2cc81486bfc9e5!8m2!3d40.7137525!4d-73.9156187">
                <img src="https://s3.us-east-1.amazonaws.com/metro-furniture-resource-stash/Table/Solid%20Wood/scary_pika.png-1582488027037" alt="..."></img>    
                    
                </a>
            </div>
        )
    }
}

export default Contact
