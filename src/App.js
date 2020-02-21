import React from 'react';
import { BrowserRouter as Router, Route, Redirect} from 'react-router-dom';
import './App.css';
import About from './components/pages/About';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Inventory from './components/Inventory';
import  MessageBox  from './components/MessageBox';
import { useAuth0 } from "./react-auth0-spa";
import { NavBar } from './components/layout/NavBar';

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
          <Header>       </Header>
          {loading? <div>Loading...</div> : <NavBar></NavBar> }
          <Route exact path="/" render={props => (
            <React.Fragment>
              <p>Home page source stuff</p>
            </React.Fragment>
          )} />
          <Route path="/about" component={About} />
          <PrivateRoute path="/inventory" component={Inventory} />
          <MessageBox></MessageBox>
          <Footer></Footer>
        </div>
      </Router>
  );
}

export default App;