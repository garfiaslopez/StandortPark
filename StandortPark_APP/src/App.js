import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './reset.css';
import 'antd/dist/antd.css';
import Login from './components/login/login';
import Home from './components/Home/Home';
import Card from './components/card/card';
import Order from './components/Order/Order';
import InOrder from './components/InOrder/InOrder';
import { Router, Route, Switch } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

const history = createBrowserHistory();

class Redirect extends Component {
    render() {
        const user = localStorage.getItem('user');
        if (user) {
            return <Home {...this.props} />
        } else {
            return <Login  {...this.props} />
        }
    }
}

class App extends Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path='/' component={Redirect}/>
          <Route path='/login' component={Login}/>
          <Route path='/card' component={Card}/>
          <Route path='/home' component={Redirect}/>
          <Route path='/order' component={Order}/>
          <Route path='/inorder' component={InOrder}/>

        </Switch>
      </Router>
      
    );
  }
}

export default App;
