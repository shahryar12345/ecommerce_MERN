import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import Loader from '../../components/Common/Loader';

import axios from 'axios';
import Alert from 'react-s-alert';

import { BASE_URL } from '../../apibase';

const styles = theme => ({
  root: {
    color: 'rgba(0, 0, 0, 0.87)',
    width: '1320px',
    marginBottom: 30,
  },

  table: {
    width: '100%',
    fontSize: '15px',
    backgroundColor: '#fff',

    '& > thead': {
      '& > tr': {
        '& > td': {
          padding: '5px 0px',
          border: '2px solid #e2e2e2',
        },
      },
    },
  },
});

class EachOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: {},
      orderItems: {},
      deliveredProducts: [],
      pendingProducts: [],
      editEnable: false,
      error: {},
    };
  }

  componentDidMount() {
    this.setState({ order: this.props.location.state.order });
    this.getOrderProducts();
  }

  getOrderProducts = async () => {
    const {
      order: { product },
      order,
    } = this.props.location.state;
    let productIds = '';

    if (product) {
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
          console.log(res);
          let setOrderItems = order;

          let deliveredProducts = [],
            pendingProducts = [];

          for (let k in setOrderItems.product) {
            for (let l in res.data) {
              if (setOrderItems.product[k].productId === res.data[l]._id) {
                setOrderItems.product[k].product = res.data[l];
              }
            }
          }
          this.setState({ orderItems: setOrderItems });

          for (let j in order.product) {
            if (order.product[j].deliveryStatus === 'delivered') {
              deliveredProducts.push(order.product[j]);
            } else {
              pendingProducts.push(order.product[j]);
            }
          }
          this.setState({
            deliveredProducts: deliveredProducts,
            pendingProducts: pendingProducts,
          });
        }
      }
    }
  };

  enableEdit = () => {
    this.setState(prevState => ({
      editEnable: !prevState.editEnable,
    }));
  };

  statusChange = e => {
    const { orderItems } = this.state;

    for (let i in orderItems.product) {
      if (orderItems.product[i]._id === e.target.name) {
        orderItems.product[i].deliveryStatus = e.target.value;
      }
    }

    this.setState({ orderItems: orderItems });
  };

  dateChange = e => {
    const { orderItems } = this.state;

    for (let i in orderItems.product) {
      if (orderItems.product[i]._id === e.target.name) {
        orderItems.product[i].deliveryDate = e.target.value;
      }
    }

    this.setState({ orderItems: orderItems });
  };

  styleDate = (date, type) => {
    let styleDate = '';

    if (!date) {
      return null;
    }

    const newDate = new Date(date);
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

    if (type === 'order') {
      styleDate = `${newDate.getDate()} ${
        months[newDate.getMonth()]
      } ${newDate.getFullYear()} ${newDate.toLocaleTimeString().substring(0, 4)}`;
    } else if (type === 'deliver') {
      styleDate = `${newDate.getDate()} ${months[newDate.getMonth()]} ${newDate.getFullYear()}`;
    }

    return styleDate;
  };

  displayStatus = (status, id) => {
    let options = [
      { label: 'Pending', value: 'pending' },
      { label: 'Shipped', value: 'shipped' },
      { label: 'Delivered', value: 'delivered' },
    ];

    return (
      <select name={id} value={status} onChange={this.statusChange}>
        {options.map((item, key) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    );
  };

  performValidation = () => {
    const { order } = this.state;
    let error;

    for (let i in order.product) {
      if (order.product[i].deliveryDate && order.product[i].deliveryStatus !== 'delivered') {
        error = 'You can not set date of not delivered product!';
        return error;
      }

      if (order.product[i].deliveryStatus === 'delivered' && !order.product[i].deliveryDate) {
        error = 'You can not set status as delivered without deliver date!';
        return error;
      }

      if (order.product[i].deliveryDate) {
        let sendingDate = new Date(order.product[i].deliveryDate);
        let orderDate = new Date(order.date);
        let todayDate = new Date();

        if (
          sendingDate.getDate() > todayDate.getDate() ||
          sendingDate.getDate() < orderDate.getDate()
        ) {
          error = `${order.product[i].product.name}'s deliver date must be greater than your order date and less than today's date!`;
          return error;
        }
      }
    }
    return null;
  };

  updateOrder = async () => {
    const { order } = this.state;

    if (this.performValidation() !== null) {
      Alert.error(this.performValidation(), {
        position: 'top-right',
        effect: 'slide',
        offset: 55,
      });
    } else {
      const editOrder = {
        _id: order._id,
        date: order.date,
        buyerId: order.buyerId,
        addressId: order.addressId,
        product: [],
      };
      for (let i in order.product) {
        editOrder.product.push({
          _id: order.product[i]._id,
          deliveryStatus: order.product[i].deliveryStatus,
          deliveryDate: order.product[i].deliveryDate,
          productReviewed: order.product[i].productReviewed,
          productReviewId: order.product[i].productReviewId,
          sellerReviewed: order.product[i].sellerReviewed,
          productId: order.product[i].productId,
          productPrice: order.product[i].productPrice,
          quantity: order.product[i].quantity,
          sellerId: order.product[i].sellerId,
        });
      }

      const res = await axios.post(`${BASE_URL}buyer/place-order`, editOrder);

      if (res) {
        console.log(res);
        if (res.data.status === 'success') {
          Alert.success('Your order has been edited successfully!', {
            position: 'top-right',
            effect: 'slide',
            offset: 55,
          });
          this.setState({ editEnable: false });
        }
      }
    }
  };

  render() {
    const { classes } = this.props;
    const {
      order,
      order: { buyer, address },
      deliveredProducts,
      pendingProducts,
      orderItems,
      editEnable,
      error,
    } = this.state;

    let displayAddress;
    if (Object.keys(order).length > 0) {
      displayAddress = (
        <div>
          <div>
            <span>{buyer.fullName}</span>
          </div>
          <div>
            <span>{address.address}</span>
          </div>
          <div>
            <span>{address.province}</span>
          </div>
          <div>
            <span>
              {address.city} - {address.area}
            </span>
          </div>
          <div>
            <span>Pakistan</span>
          </div>
        </div>
      );
    }

    return (
      <div className={classes.root}>
        <div className='pb-4'>
          <Typography variant='h5' align='left'>
            Order Detail for Order No: {order._id}
          </Typography>
        </div>

        {Object.keys(order).length > 0 ? (
          <div>
            {/* Information Box */}
            <div className='info-box'>
              {/* Customer Information */}
              <div className='customer-info'>
                <div>
                  <Typography variant='h6'>Customer Information</Typography>
                </div>

                <div>
                  {/* Left Flex */}
                  <div className='left-flex'>
                    <div>
                      <span className='pr-2 text-secondary'>Date</span>
                      <span>{this.styleDate(order.date, 'order')}</span>
                    </div>
                    <div>
                      <span className='pr-2 text-secondary'>Customer</span>
                      <span>{buyer.fullName}</span>
                    </div>
                    <div>
                      <span className='pr-2 text-secondary'>Phone Number</span>
                      <span>{buyer.phoneNo}</span>
                    </div>
                    <div>
                      <span className='pr-2 text-secondary'>Payment Method</span>
                      <span>COD</span>
                    </div>
                  </div>

                  {/* Right Flex */}
                  <div className='right-flex'>
                    <div>
                      <span className='pr-2 text-secondary'>Subtotal</span>
                      <span>{order.subTotal}.00</span>
                    </div>
                    <div>
                      <span className='pr-2 text-secondary'>Shipping Fee</span>
                      <span>+35.00</span>
                    </div>
                    <div>
                      <span className='pr-2 text-secondary'>Lashcart Discount Total</span>
                      <span>-0.00</span>
                    </div>
                    <div>
                      <span className='pr-2 text-secondary'>Seller Discount Total</span>
                      <span>-0.00</span>
                    </div>
                    <div>
                      <span className='pr-2 text-secondary'>Grand Total</span>
                      <span>{order.subTotal + 35}.00</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction Information */}
              <div className='transaction-info'>
                <div>
                  <Typography variant='h6'>Transaction Information</Typography>
                </div>

                {order.deliveryStatus === false ? (
                  <div></div>
                ) : (
                  <div>
                    <div>
                      <span className='pr-2 text-secondary'>Automatic Shipping Fee</span>
                      <span>-39.55</span>
                    </div>
                    <div>
                      <span className='pr-2 text-secondary'>Comission</span>
                      <span>-120.84</span>
                    </div>
                    <div>
                      <span className='pr-2 text-secondary'>Shipping Fee (Paid by Customer)</span>
                      <span>35.00</span>
                    </div>
                    <div>
                      <span className='pr-2 text-secondary'>Payment Fee</span>
                      <span>-9.37</span>
                    </div>
                    <div>
                      <span className='pr-2 text-secondary'>Item Price Credit</span>
                      <span>829.00</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Billing Address */}
              <div className='billing-address-info'>
                <div>
                  <Typography variant='h6'>Billing Address</Typography>
                </div>
                {displayAddress}
              </div>

              {/* Shipping Address */}
              <div className='shipping-address-info'>
                <div>
                  <Typography variant='h6'>Shipping Address</Typography>
                </div>
                {displayAddress}
              </div>
            </div>

            {/* Items Box */}
            <div className='table-box'>
              <Grid item sm={12} md={12} lg={12}>
                <div className='table-heading'>
                  {editEnable ? (
                    <div>
                      <Typography variant='h6' align='left'>
                        Items
                      </Typography>
                      <i className='fas fa-times' onClick={this.enableEdit}></i>
                      <button className='btn btn-dark ml-auto' onClick={this.updateOrder}>
                        Update
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Typography variant='h6' align='left'>
                        Items
                      </Typography>
                      <i className='fas fa-pencil-alt' onClick={this.enableEdit}></i>
                    </div>
                  )}
                </div>

                <table className='item-table'>
                  <tbody>
                    <tr>
                      <td>Item ID</td>
                      <td>Seller SKU</td>
                      <td>Product</td>
                      <td>Shipment</td>
                      <td>Retail Price</td>
                      <td>Refunds</td>
                      <td>Promotion</td>
                      <td>Voucher</td>
                      <td>Shipping</td>
                      <td>Status</td>
                      <td>Delivery Date</td>
                    </tr>

                    {/* Pending Products */}
                    {Object.keys(orderItems).length > 0 ? (
                      pendingProducts.map((item, key) => {
                        return (
                          <tr key={item._id}>
                            <td>{item.product._id}</td>
                            <td>{item.product.SKU[0].sellerSKU}</td>
                            <td>{item.product.name}</td>
                            <td>Dropshipping Standard</td>
                            <td>{item.product.SKU[0].price}.00</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>35.00</td>
                            <td>
                              {editEnable ? (
                                <div className='status-box'>
                                  {this.displayStatus(item.deliveryStatus, item._id)}
                                </div>
                              ) : (
                                <div className='status-box'>{item.deliveryStatus}</div>
                              )}
                            </td>
                            <td>
                              {editEnable ? (
                                item.deliveryDate === null ? (
                                  <input
                                    type='date'
                                    name={item._id}
                                    value=''
                                    placeholder='Delivered Date'
                                    onChange={this.dateChange}
                                  />
                                ) : (
                                  <input
                                    type='date'
                                    name={item._id}
                                    value={item.deliveryDate}
                                    placeholder='Delivered Date'
                                    onChange={this.dateChange}
                                  />
                                )
                              ) : (
                                this.styleDate(item.deliveryDate, 'deliver')
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr></tr>
                    )}

                    {/* Delivered Products */}
                    {Object.keys(orderItems).length > 0 ? (
                      deliveredProducts.map((item, key) => {
                        return (
                          <tr key={item._id}>
                            <td>{item.product._id}</td>
                            <td>{item.product.SKU[0].sellerSKU}</td>
                            <td>{item.product.name}</td>
                            <td>Dropshipping Standard</td>
                            <td>{item.product.SKU[0].price}.00</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>35.00</td>
                            <td>{item.deliveryStatus}</td>
                            <td>{this.styleDate(item.deliveryDate, 'deliver')}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr></tr>
                    )}
                  </tbody>
                </table>
              </Grid>
            </div>
          </div>
        ) : (
          <Loader />
        )}
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(EachOrder);
