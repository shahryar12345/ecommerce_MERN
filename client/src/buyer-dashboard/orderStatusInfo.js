import React, { Component } from 'react';
import toRenderProps from 'recompose/toRenderProps';

import withWidth from '@material-ui/core/withWidth';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import Loader from '../components/Common/Loader';

import axios from 'axios';

const { BASE_URL } = require('../apibase');
const WithWidth = toRenderProps(withWidth());

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
    textAlign: 'left',
    marginLeft:100
  },
});

class orderStatusInfo extends Component {
  state = {
    orderProducts: {},
    totalPrice: 0,
  };

  componentDidMount() {
    this.getOrderProducts();
  }

  getOrderProducts = async () => {
    const { product } = this.props.location.state.order;
    let productIds = '';

    if (product.length > 0) {
      let res = {};
      if (product.length > 1) {
        for (let i in product) {
          productIds = productIds.concat(`productArray=${product[i].productId}&`);
        }
        res = await axios.get(
          `${BASE_URL}seller/seller-product?${productIds.substring(0, productIds.length - 1)}`,
        );
      } else {
        productIds = product[0].productId;
        res = await axios.get(`${BASE_URL}seller/seller-product?productId=${productIds}`);
      }

      if (Object.keys(res).length > 0) {
        if (res.data.status === 'failed') {
          console.log('Failed', res);
        } else {
          this.setOrderProducts(res.data);
        }
      }
    }
  };

  setOrderProducts = products => {
    const { order } = this.props.location.state;

    if (products.length > 0) {
      const orderProducts = products.map(item => {
        return {
          productId: item._id,
          name: item.name,
          brand: item.brand,
          model: item.model,
          sellerId: item.sellerId,
          SKU: item.SKU,
          productImage: item.productImage,
        };
      });

      for (let i in order.product) {
        for (let j in orderProducts) {
          if (order.product[i].productId === orderProducts[j].productId) {
            orderProducts[j].quantity = order.product[i].quantity;
            orderProducts[j].price = order.product[i].productPrice;
            orderProducts[j].deliveryStatus = order.product[i].deliveryStatus;
          }
        }
      }

      this.setState({ orderProducts });
    }
  };

  displayStatus = status => {
    if (status === 'pending') {
      return <span className='badge badge-pill badge-danger'>Pending</span>;
    } else if (status === 'shipped') {
      return <span className='badge badge-pill badge-warning'>Shipped</span>;
    } else if (status === 'delivered') {
      return <span className='badge badge-pill badge-success'>Delivered</span>;
    }
  };

  totalPrice = () => {
    const { product } = this.props.location.state.order;
    let total = 0;
    for (let i in product) {
      total += product[i].quantity * product[i].productPrice;
    }

    return this.numberWithCommas(total);
  };

  styleDate = () => {
    const { order } = this.props.location.state;

    let styleDate = '';
    const newDate = new Date(order.date);
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'April',
      'May',
      'June',
      'July',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    styleDate = `${newDate.getDate()} ${
      months[newDate.getMonth()]
    } ${newDate.getFullYear()} ${newDate.toLocaleTimeString()}`;

    return styleDate;
  };

  numberWithCommas = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  render() {
    const { classes } = this.props;
    const { order } = this.props.location.state;
    const { orderProducts } = this.state;
    console.log(order, orderProducts);

    return (
      <div className={classes.root}>
        <Header />

        <div className={classes.pageBody}>
          <div className='order-status-info container' >
            <div className='pb-2'>
              <Typography variant='h5' align='left' style={{marginBottom: 20}}>
                Order Details
              </Typography>
            </div>

            {Object.keys(order).length > 0 ? (
              <div>
                <div>
                  <p>Order: #{order._id}</p>
                  <p className='text-secondary'>Placed on {this.styleDate()}</p>
                </div>
                <div>
                  <span className='text-secondary'>Total:</span>
                  <span>Rs. {this.totalPrice()}</span>
                </div>
              </div>
            ) : (
              <div>
                <Loader />
              </div>
            )}

            <table className='item-table'>
              <tbody>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
                {orderProducts.length > 0 ? (
                  orderProducts.map((item, key) => {
                    return (
                      <tr key={item.productId}>
                        <td className='flex-td'>
                          <div>
                            <img
                              src={`data:image/png;base64,${item.productImage[0].buffer}`}
                              alt='product-image'
                            />
                          </div>
                          <div>
                            <p>{item.name}</p>
                            <p>
                              <span>OWNER: {item.brand}</span>
                              <span> MODEL: {item.model}</span>
                            </p>
                          </div>
                        </td>
                        <td>{item.quantity}</td>
                        <td>{item.price}</td>
                        <td>{this.displayStatus(item.deliveryStatus)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td>
                      <Loader />
                    </td>
                    <td>
                      <Loader />
                    </td>
                    <td>
                      <Loader />
                    </td>
                    <td>
                      <Loader />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(orderStatusInfo);
