import React, { Component } from 'react'
import {Jumbotron, Carousel } from 'react-bootstrap'
import { sortObjectArrayByKey } from '../../utils/sort'

import "react-alice-carousel/lib/alice-carousel.css";
export class Home extends Component {

    constructor(props){
        super(props);
        this.state = {
            currentIndex: 0,
            imageList: []
        }
    }
    
    componentDidMount () {
        const caraselName = "homeCarasel"
        const size = 5;
        let imageList = [];
        for(var i = 1; i <= size ; i++){
            let imageItem =  {
                index: i,
                src: 'https://metro2-furniture-resource-stash.s3.amazonaws.com/misc/carasel/'+ caraselName + '/' +i+ '.png' 
            }
            imageList.push(imageItem);
        }

        this.setState({
            ...this.state,
            imageList: imageList
        });
    }
    
    setStateVariable = (varName, varValue) => {
        this.setState({
            [varName]: varValue
        })
    }
        
    render() {
        const caraselThumbnailImages = sortObjectArrayByKey(this.state.imageList, "index").map( (imageItem) => (
            <div key={imageItem.index} className=" col-sm-2 col-md-1 col-lg-1 col-xs-2 m-0 p-0" onClick={() =>this.setStateVariable("currentIndex",imageItem.index-1)}>
                <img  className='img-thumbnail' key={imageItem.index} src={imageItem.src} alt='s3' /> 
            </div>
           
        ))

        return (

            <React.Fragment>
                <Jumbotron fluid className='mt-2 p-4'>
                    <div className='container bg-dark' >
                        
                        <div className="row justify-content-center">
                            {caraselThumbnailImages}
                        </div>
                        <hr></hr>
                        <div className="row justify-content-center">
                            <Carousel className="col-md-10 col-lg-10 col-xl-9" activeIndex={this.state.currentIndex} onSelect={(selectedIndex, e) => this.setStateVariable("currentIndex", selectedIndex)}>
                                {sortObjectArrayByKey(this.state.imageList, "index").map( (imageItem) => (
                                    <Carousel.Item key={imageItem.index}>
                                        <img  className='img-thumbnail'  src={imageItem.src} alt='s3' /> 
                                    </Carousel.Item>
                                ))}
                            </Carousel> 
                        </div>
                    </div>
                </Jumbotron>
            </React.Fragment>
        )
    }
}


export default Home;

