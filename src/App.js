import React from 'react';
import { BrowserRouter as Router, Route, Redirect} from 'react-router-dom';
import './App.css';
import About from './components/pages/About';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Inventory from './components/Inventory';
import  MessageBox  from './components/MessageBox';
import  Search  from './components/view/Search';
import  Information  from './components/view/Information';
import { useAuth0 } from "./react-auth0-spa";
import { NavBar } from './components/layout/NavBar';
import ExternalApi from './components/view/ExternalApi';
import ProductPicker from './components/view/ProductPicker';
import AppInit from './AppInit'

function App() {
  
  
  const { loading } = useAuth0();

      
  const PrivateRoute = ({ component: Component, ...rest }) => {
    const { isAuthenticated } = useAuth0();

    return <Route {...rest} render={(props) => (
      isAuthenticated === true
        ? <Component {...props} />
        : <Redirect to='/login' />
    )} />
  }

  return (
      
      
      <Router>
        <div className="App ml-5 mr-5">
          <AppInit></AppInit>
          <Header>       </Header>
          {loading? <div>Loading...</div> : <NavBar></NavBar> }
          <Route exact path="/" render={props => (
            <React.Fragment>
              <p>Home page source stuff</p>
              <ProductPicker></ProductPicker>
            </React.Fragment>
          )} />
          <Route path="/search" component={Search} />
          <Route path="/about" component={About} />
          <Route path="/information" component={Information} />
          {/* <PrivateRoute path="/inventory" component={Inventory} /> */}
          <Route path="/inventory" component={Inventory} />
          <PrivateRoute path="/external_api" component={ExternalApi} />
          <MessageBox></MessageBox>
          <Footer></Footer>
        </div>
      </Router>
  );
}

export default App;
