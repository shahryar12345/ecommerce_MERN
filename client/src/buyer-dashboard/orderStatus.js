import React, { Component } from 'react';
import toRenderProps from 'recompose/toRenderProps';

import withWidth from '@material-ui/core/withWidth';
import { withStyles } from '@material-ui/core/styles';

import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

import axios from 'axios';

const { BASE_URL } = require('../apibase');
toRenderProps(withWidth());

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgb(227,231,232)',
    overflow: 'auto',
  },
  pageBody: {
    marginBottom: 50,
    marginTop: 130,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: '12%',
    marginLeft: '12%',
  },
});

class orderStatus extends Component {
  state = {
    orderId: '',
    error: '',
  };

  handleChange = event => {
    const { orderId } = this.state;
    if (orderId.length > 0) {
      this.setState({ error: '' });
    }
    this.setState({ orderId: event.target.value });
  };

  handleSubmit = async () => {
    const { orderId } = this.state;

    let user = localStorage.getItem('local-buyer');
    user = JSON.parse(user);

    if (orderId.length > 0) {
      const res = await axios.get(
        `${BASE_URL}buyer/order-status?orderId=${orderId}&buyerId=${user.id}`,
      );

      if (res.data._id) {
        this.props.history.push({
          pathname: `/order-status-info/${res.data._id}`,
          state: { order: res.data },
        });
      } else {
        this.setState({ error: 'Order id is not correct!' });
      }
    } else {
      this.setState({ error: 'Order id length must be greater than 0' });
    }
  };

  render() {
    const { classes } = this.props;
    const { orderId, error } = this.state;

    return (
      <div className={classes.root}>
        <Header />

        <div className={classes.pageBody}>
          <div className='order-status-box container bg-white'>
            <p>
              To track your order please enter your Order ID in the box below and press the "Track"
              button. This was given to you on your receipt and in the confirmation email you should
              have received.
            </p>

            <div className='order-id-box' style={{ marginTop: 0 }}>
              <p>Order ID</p>
              <input
                type='text'
                placeholder='Found in your confirmation email'
                name='order-id'
                value={orderId}
                onChange={this.handleChange}
              />
              {error.length > 0 ? (
                <div style={{ height: '20px', color: 'red', paddingLeft: '1px' }}>{error}</div>
              ) : (
                <div style={{ height: '20px' }}></div>
              )}
            </div>

            <button onClick={this.handleSubmit}>Track</button>
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(orderStatus);
