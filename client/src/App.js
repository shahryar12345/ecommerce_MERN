import React, { Component } from 'react';
import './App.css';

import Alert from 'react-s-alert';
// import MetaTags from 'react-meta-tags';
import AppRoutes from './config/AppRoutes';

import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';

class App extends Component {
  render() {
    return (
      <div>     
      {/* <MetaTags>
        <meta name="_globalsign-domain-verification" 
        content="0XKrk6ha6P5oHWYzTF5LL2vymPwSUFOzuCW3E42hwb" />
      </MetaTags> */}
      <div className='App'>
        <AppRoutes />
        <Alert stack={{ limit: 2 }} timeout={5000} />
      </div>
      </div>
    );
  }
}

export default App;
