import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';
import About from './components/pages/About';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Inventory from './components/Inventory';
import {Provider} from 'react-redux';
import store from './store';
import  MessageBox  from './components/MessageBox';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App ml-5 mr-5">
          <Header></Header>
          <Route exact path="/" render={props => (
            <React.Fragment>
              <p>Home page source stuff</p>
            </React.Fragment>
          )} />
          <Route path="/about" component={About} />
          <Route path="/inventory" component={Inventory} />
          <MessageBox></MessageBox>
          <Footer></Footer>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
   