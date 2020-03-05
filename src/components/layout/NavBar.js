
import {Link} from 'react-router-dom';
import React, { Component } from 'react'
import {connect} from 'react-redux' ;
import PropTypes from 'prop-types';
import {isValid,getSubtypeFromType } from '../../utils/standardization'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import {sortObjectArrayByKey  } from '../../utils/sort'
import {changeSearch} from '../../actions/searchActions'

export class NavBar extends Component {

  constructor(props){
    super(props);
    this.state = {
      prevTypes : [],
      _isOpen: false,
      currentType: ""
    }
  }

  
  static getDerivedStateFromProps(props, state) {
      if( NavBar.getOrderTypeListCSV(state.prevTypes) === NavBar.getOrderTypeListCSV(props.types)) {
          return state;
      }
      // if( state.prevTypes === props.types) {
      //   return state;
      // } 
      console.log("check update passed");
      var newState = {
        ...state,
        prevTypes : props.types
      }
      props.types.map((type)=>{
        newState[(type.m_type+"_isOpen").trim()] = false
      })

      return newState;
  }
  
  static getOrderTypeListCSV(typeList){
    var sortedTypeList = sortObjectArrayByKey(typeList,"m_type");
    var csv = "";
    sortedTypeList.map((type) => {
      csv+=type.m_type + ","
    })
    return csv;
  }

  setStateVariable = (varName, varValue) => {
      this.setState({
        [varName]: varValue
      })
  }

  
  followToSearch = (type, subtype) => {
      var filterObject = {
          filterBaseCode: "",
          filterType: type,
          filterSubtype: subtype,
          filterTag: "",
      }
      this.props.changeSearch(filterObject);
      this.setState({
        _isOpen: false
      })
  }

  render() {
    return (
      
    <div 
    onMouseEnter = {()=> this.setStateVariable( "_isOpen" , true)}>
      <Dropdown className="d-flex btn btn-lg btn-info mx-0 p-0 bg-info"
        
        isOpen={ this.state._isOpen }
        toggle={()=> this.setStateVariable( "_isOpen" , !this.state._isOpen)}
      >
        <DropdownToggle caret>
        </DropdownToggle>
        {this.props.types.map( (type)=> {
          return (
          <div key={type.m_type} className=" mx-0 my-0 px-0 py-0 col border border-dark"
             onMouseEnter =  {()=> this.setStateVariable( "currentType" , type)}
             onClick={() => this.followToSearch(type.m_type,"")}
          >
            {type.m_type}
          </div>
          )
        })}
        <DropdownMenu className="col-sm-12 border border-dark" 
          onMouseLeave = {()=> this.setStateVariable( "_isOpen" , false)}>
            <div className="row"> 
            
              {getSubtypeFromType(this.state.currentType, this.props.subtypes).map( (subtype)=> (
                  <DropdownItem className="col" key={subtype.m_subtype}>
                    
                    <Link  key={subtype.m_subtype} to="/search" name={subtype.m_subtype} onClick={() => this.followToSearch(this.state.currentType.m_type,subtype.m_subtype)}>
                      <img src={subtype.m_url} alt="Not Found"/>
                      <div className="text-center"> {subtype.m_subtype}</div>
                    </Link>
                  </DropdownItem>
              ))}
            </div>
        </DropdownMenu>

      </Dropdown>
      
      
      {/* {this.props.types.map( (type)=> {
          return (
          <div key={type.m_type} className=" mx-0 my-0 px-0 py-0 col">
              <Dropdown
                className=" bg-info"
                onMouseEnter = {()=> this.setStateVariable( (type.m_type+"_isOpen").trim() , true) }
                onMouseLeave = {()=> this.setStateVariable( (type.m_type+"_isOpen").trim() , false)}
                isOpen={ isValid(this.state[(type.m_type+"_isOpen").trim()]) &&  this.state[(type.m_type+"_isOpen").trim()] }
                toggle={ () => this.doNothing() }
              >
                <div className="border border-dark">
                  
                  <DropdownToggle className=" border-0 bg-info " >
                    {type.m_type}
                  </DropdownToggle>
                </div>
                <DropdownMenu className="">
                  {getSubtypeFromType(type, this.props.subtypes).map( (subtype)=> (
                      
                    <DropdownItem key={subtype.m_subtype}>{subtype.m_subtype}</DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>

          </div>
          )
        })} */}
    {/* <Link  style={linkStyle}  className="brightLink" to='/information'>Information</Link> */}
    
    
    </div>
    )
  }
}


const headerStyle= {
  background: '#333',
  color: '#FFFF00',
  textAlign: 'center',
  padding: '5px'
}
const linkStyle = {
  color: '#FFFF00'
}


NavBar.propTypes = {

  types: PropTypes.array.isRequired,
  subtypes: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
  changeSearch: PropTypes.func.isRequired,
}


const mapStateToProps = (state) => {
  return { 
  products: state.productReducer.products,
  types: state.typeReducer.types,
  subtypes: state.typeReducer.subtypes,
  }
};

export default connect(mapStateToProps, {changeSearch} )(NavBar);



