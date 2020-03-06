import React from 'react';
import {Link} from 'react-router-dom';
import { useAuth0 } from "../../react-auth0-spa";

export const Header = () => {

    const { isAuthenticated, loginWithRedirect, logout } = useAuth0();


    return (
        <header className=" border-bottom border-dark mb-3" style={headerStyle}>
            <div className="App ml-5 mr-5">
                <div className="row">
                    <div className="col-sm-3">
                        <Link className="btn btn-sm btn-secondary" to='/contact'>Contact</Link>
                    </div>
                    <h5 className="col-sm-6 text-center">
                        <Link style={{ textDecoration: 'none', color: '#000000' }} to='/'>Metro Restaurant Furiture</Link>
                    </h5>
                    <div className="col-sm-3 d-flex justify-content-end">
                        {isAuthenticated && 
                          (<Link   className="btn btn-sm btn-secondary mr-2" to='/inventory'>Inventory</Link> )
                        }
                        {!isAuthenticated?
                            <div className="btn btn-sm btn-secondary" onClick={() => loginWithRedirect({})} >Login</div>    
                            :
                            <div className="btn btn-sm btn-secondary" onClick={() => logout({})} >Logout</div>    
                        }
                    </div>
                </div>
            </div>
        </header>
    )
}

const headerStyle= {
    background: '#D3D3D3',
    padding: '5px'
}
export const linkStyle = {
    color: '#FFFF00'
}
export default Header
