
import {Link} from 'react-router-dom';
import React, { Component } from 'react'
import {connect} from 'react-redux' ;
import PropTypes from 'prop-types';
import {getSubtypeFromType } from '../../utils/standardization'
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
      var newState = {
        ...state,
        prevTypes : props.types
      }
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

    const dropdownTypeFragment = 
      <DropdownMenu className="col-sm-12 border border-dark bg-light shadow-lg" 
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

    const dropdownTypeOptionFragment = 
      <React.Fragment>
        {this.props.types.map( (type)=> {
          return (
          <Link key={type.m_type} to="/search" className=" mx-0 my-0 px-0 py-0 col border border-dark text-light"
            onMouseEnter =  {()=> this.setStateVariable( "currentType" , type)}
            onClick={() => this.followToSearch(type.m_type,"")}
          >
            {type.m_type}
          </Link>
          ) 
        })}
      </React.Fragment>


    return (
      <React.Fragment>
        <div className="d-flex flex-row my-2 p-2 align-items-end">
                <Link to="/" className="col-sm-3 col-md-2">
                  <img class="img-fluid" src="https://metro-furniture-resource-stash.s3.amazonaws.com/misc/logo-shrink.png" alt=".not found..." />
                </Link>
                <div className="col-sm-9 col-md-10 my-3">
                    <div className="input-group ">
                        <input type="text" className="shadow form-control  ml-0 align-items-stretch" aria-label="Small" aria-describedby="inputGroup-sizing-sm"></input>
                        <div className="input-group-append">
                            <span className="btn btn-sm btn-secondary border border-dark" id="base_code">Search</span>
                            <Link to="/search" className="btn btn-sm btn-secondary border border-dark" id="base_code">Advance</Link>
                        </div>
                    </div>
                </div>
        </div>
        <div className="" onMouseEnter = {()=> this.setStateVariable( "_isOpen" , true)}>
          <Dropdown className="d-flex btn btn-lg btn-info mx-0 p-0 bg-info"
            isOpen={ this.state._isOpen }
            toggle={()=> this.setStateVariable( "_isOpen" , !this.state._isOpen)}
          >
            <DropdownToggle caret>
            </DropdownToggle>
            
            {dropdownTypeOptionFragment}
            {dropdownTypeFragment}
          </Dropdown>
        {/* <Link  style={linkStyle}  className="brightLink" to='/information'>Information</Link> */}
        </div>

      </React.Fragment>
    
    )
  }
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



