import React, { Component } from 'react';
import PropTypes from 'prop-types';
import toRenderProps from 'recompose/toRenderProps';
import clsx from 'clsx';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import withWidth from '@material-ui/core/withWidth';
import { withStyles } from '@material-ui/core/styles';

import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import Loader from '../components/Common/Loader';

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
    marginBottom: 30,
    marginTop: 130,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Cart Table CSS
  EnhancedTableRoot: {
    minHeight: '300px',
    width: '100%',
    alignItems: 'left',
  },
  EnhancedTableToolbarRoot: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  highlight: {
    color: 'white',
    backgroundColor: '#343A40',
  },
  title: {
    flex: '1 1 100%',
  },
  paper: {
    width: '100%',
    marginBottom: 2,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  tableCellPadding: {
    paddingTop: '12px',
    paddingBottom: '12px',
  },
  priceBox: {
    fontSize: '18px',
    color: '#3f51b5',
  },
});

class checkout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      headCells: [
        { id: 'item', numeric: false, disablePadding: true, label: 'ITEM(S)' },
        { id: 'price', numeric: true, disablePadding: false, label: 'PRICE' },
        { id: 'quantity', numeric: true, disablePadding: false, label: 'QUANTITY' },
      ],
      selected: [],
      selectedBrands: [],
      shippingFee: '339',
      address: null,
      error: { status: null, message: null },
      loading: true,
    };
  }

  componentDidMount() {
    this.getUserCart();
    this.getUserAddress();
  }

  // Grid Column 2 - Cart Table Box Functions
  getUserCart = async () => {
    var user = localStorage.getItem('local-buyer');
    user = JSON.parse(user);
    if (user) {
      const res = await axios.get(BASE_URL + `buyer/getUserCart?buyerID=${user.id}`, {
        withCredentials: true,
      });

      if (res) {
        if (res.data.cart.products.length === 0) {
          this.setState({ products: false, loading: false });
        } else if (res.data.cart.products.length > 0) {
          this.setState({ products: res.data.cart.products, loading: false });
        }
      }
    }
  };

  handleSelectAllClick = event => {
    const { products } = this.state;

    this.setState({ error: null });

    if (event.target.checked) {
      const newSelecteds = products.map(n => n._id);
      this.setState({ selected: newSelecteds });
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;

    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    this.setState(prevState => ({
      selected: newSelected,
      error: {
        ...prevState.error,
        status: null,
        message: null,
      },
    }));
  };

  brandBasedRows = () => {
    const { products } = this.state;
    let brandBasedArray = [],
      brandNames = [];

    if (products.length > 0) {
      for (let i in products) {
        if (!brandNames.includes(products[i].productId.brand))
          brandNames.push(products[i].productId.brand);
      }

      for (let i in brandNames) {
        brandBasedArray.push({
          brandID: i,
          brandName: brandNames[i],
          products: [],
        });
        for (let j in products) {
          if (products[j].productId.brand === brandNames[i]) {
            brandBasedArray[i].products.push(products[j]);
          }
        }
      }
    }

    return brandBasedArray;
  };

  quantityAddSubtract = async (productID, newQuantity, databaseQuantity) => {
    var user = localStorage.getItem('local-buyer');
    user = JSON.parse(user);

    if (user) {
      if (newQuantity > 0 && newQuantity <= databaseQuantity) {
        this.setState({ loading: true });

        const res = await await axios.get(
          BASE_URL +
            `buyer/addCartItem?buyerID=${user.id}&productID=${productID}&quantity=${newQuantity}`,
        );
        if (res) {
          if (res.status === 200) {
            this.getUserCart();
          }
        }
      }
    }
  };

  removeItemFromCart = async () => {
    const { selected } = this.state;
    this.setState({ loading: true });

    if (selected.length > 0) {
      var user = localStorage.getItem('local-buyer');
      user = JSON.parse(user);
      if (user) {
        let res = {};
        if (selected.length === 1) {
          res = await axios.get(
            BASE_URL + `buyer/removeItemFromCart?buyerId=${user.id}&productId=${selected[0]}`,
          );
        } else {
          let allID = '';
          for (let i in selected) {
            allID = allID.concat(`productId=${selected[i]}&`);
          }

          res = await axios.get(
            BASE_URL + `buyer/removeMultipleItemFromCart?buyerId=${user.id}&${allID.slice(0, -1)}`,
          );
        }

        if (res) {
          if (res.data.status === 'success') {
            this.setState({ selected: [] });
            this.getUserCart();
          }
        }
      }
    }
  };

  // Grid Column 3 - Checkout Box Functions
  getUserAddress = async () => {
    let user = localStorage.getItem('local-buyer');
    user = JSON.parse(user);
    if (user) {
      const res = await axios.get(BASE_URL + `buyer/buyer-address?buyerID=${user.id}`, {
        withCredentials: true,
      });

      if (res) {
        if (res.data.length > 0) {
          this.setState({ address: res.data });
        }
      }
    }
  };

  subTotalAmount = () => {
    const { selected, products } = this.state;
    let amount = 0;
    for (let i in selected) {
      for (let j in products) {
        if (selected[i] === products[j]._id) {
          amount += products[j].quantity * products[j].productId.SKU[0].price;
        }
      }
    }
    return amount;
  };

  numberWithCommas = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  placeOrder = async () => {
    const { address, products, selected } = this.state;
    this.setState({ loading: true });

    let orderData = {};

    let user = localStorage.getItem('local-buyer');
    user = JSON.parse(user);
    orderData.buyerId = user.id;

    if (address != null) {
      orderData.addressId = address[0]._id;
    }

    orderData.product = [];
    if (selected.length > 0) {
      for (let i in selected) {
        for (let j in products) {
          if (selected[i] === products[j]._id) {
            orderData.product.push({
              productId: products[j].productId._id,
              productPrice: products[j].productId.SKU[0].price.toString(),
              quantity: products[j].quantity,
              sellerId: products[j].productId.sellerId,
            });
          }
        }
      }
      console.log(orderData);

      const res = await axios.post(BASE_URL + 'buyer/place-order', orderData);
      if (res) {
        console.log(res);
        if (res.data.status === 'success') {
          this.removeItemFromCart();
          this.setState(prevState => ({
            error: {
              ...prevState.error,
              status: 'success',
              message: res.data.message,
            },
          }));
        } else if (res.data.status === 'failed') {
          this.setState(prevState => ({
            loading: false,
            error: {
              ...prevState.error,
              status: 'failed',
              message: res.data.message,
            },
          }));
        }
      }
    } else {
      this.setState(prevState => ({
        loading: false,
        error: {
          ...prevState.error,
          status: 'failed',
          message: 'Please select some products!',
        },
      }));
    }
  };

  render() {
    const { classes } = this.props;
    const { selected, headCells, products, shippingFee, address, error, loading } = this.state;

    // Grid Column 1 - Delivery Box Object
    let tomorrowDate = new Date();
    let dateAfterSevenDays = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    dateAfterSevenDays.setDate(dateAfterSevenDays.getDate() + 7);

    // Grid Column 2 - Cart Table Box
    const isSelected = id => selected.indexOf(id) !== -1;

    return (
      <div className={classes.root}>
        <Header />

        {loading ? (
          <div className='loading'>
            <Loader />
          </div>
        ) : null}

        <div className={classes.pageBody}>
          <div className='grid-box'>
            {/* Grid Column 1 - Delivery Box */}
            <div className='grid-box-1'>
              <div className='bg-white text-left pt-1 pb-3 px-2'>
                <p className='m-1'>Preferred Delivery Option</p>
                {selected.length > 0 ? (
                  <div className='px-2 py-1 ml-1 item-selected'>
                    <div className='mr-3'>
                      <i className='fas fa-check'></i>
                    </div>
                    <div>
                      <p className='mb-0'>
                        <i className='fas fa-truck-loading mr-2'></i>
                        Standard
                      </p>
                      <p className='mb-0 text-secondary'>
                        Get by {tomorrowDate.getDate()}-
                        {dateAfterSevenDays.toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                      <p className='mb-0'>Rs. 35</p>
                    </div>
                  </div>
                ) : (
                  <div className='px-3 py-1 ml-1 item-not-selected'>
                    <p className='p-0 m-0'>Please select item(s)</p>
                    <p className='p-0 m-0'>Availability and promotions will be shown here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Grid Column 2 - Cart Table Box */}
            <div className='grid-box-2'>
              <div className={classes.EnhancedTableRoot}>
                <Paper className={classes.paper}>
                  <Toolbar
                    className={clsx(classes.EnhancedTableToolbarRoot, {
                      [classes.highlight]: selected.length > 0,
                    })}>
                    {selected.length > 0 ? (
                      <Typography className={classes.title} color='inherit' variant='subtitle1'>
                        {selected.length} selected
                      </Typography>
                    ) : null
                    // <Typography
                    //   className={classes.title}
                    //   variant='h6'
                    //   id='tableTitle'></Typography>
                    }

                    {selected.length > 0 ? (
                      <Tooltip title='Delete'>
                        <IconButton onClick={this.removeItemFromCart} aria-label='delete'>
                          <DeleteIcon style={{ color: 'white' }} />
                        </IconButton>
                      </Tooltip>
                    ) : null}
                  </Toolbar>
                  {products.length > 0 ? (
                    <div className={classes.tableWrapper}>
                      <Table
                        className={classes.table}
                        aria-labelledby='tableTitle'
                        size={'medium'}
                        aria-label='enhanced table'>
                        <TableHead style={{ backgroundColor: '#E3E7E8' }}>
                          <TableRow>
                            <TableCell padding='checkbox'>
                              {/* <Checkbox
                                color='primary'
                                indeterminate={
                                  selected.length > 0 && selected.length < products.length
                                }
                                checked={selected.length === products.length}
                                onChange={this.handleSelectAllClick}
                                inputProps={{ 'aria-label': 'select all desserts' }}
                              /> */}
                            </TableCell>
                            {headCells.map(headCell => (
                              <TableCell key={headCell.id} align={'center'} padding='default'>
                                <TableSortLabel active={false} style={{ cursor: 'text' }}>
                                  {headCell.label}
                                </TableSortLabel>
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {/* {this.brandBasedRows().map((brandRow, brandIndex) => {
                            return (
                              <TableBody key={brandRow.brandID}>
                                <TableRow>
                                  <TableCell></TableCell>
                                  <TableCell
                                    align='left'
                                    style={{ fontSize: '14px', fontWeight: 'bold' }}>
                                    {brandRow.brandName}
                                  </TableCell>
                                  <TableCell align='left'></TableCell>
                                  <TableCell align='left'></TableCell>
                                </TableRow>
                          */}
                          {products.map((row, index) => {
                            const isItemSelected = isSelected(row._id);
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                              <TableRow
                                hover
                                role='checkbox'
                                aria-checked={isItemSelected}
                                tabIndex={-1}
                                key={row._id}
                                selected={isItemSelected}
                                className={classes.tableCellPadding}>
                                <TableCell padding='checkbox'>
                                  <Checkbox
                                    color='primary'
                                    onClick={event => this.handleClick(event, row._id)}
                                    checked={isItemSelected}
                                    inputProps={{ 'aria-labelledby': labelId }}
                                  />
                                </TableCell>
                                <TableCell
                                  align='left'
                                  component='th'
                                  id={labelId}
                                  scope='row'
                                  padding='none'
                                  className={classes.tableCellPadding}>
                                  <div className='item-box'>
                                    <div>
                                      <img
                                        src={`data:image/png;base64,${row.productId.productImage[0].buffer}`}
                                        alt='product'
                                      />
                                    </div>
                                    <div>
                                      <p>{row.productId.name}</p>
                                      <p>
                                        <span>OWNER: {row.productId.brand}</span>
                                        <span> MODEL: {row.productId.model}</span>
                                      </p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell align='left' className={classes.priceBox}>
                                  Rs. {this.numberWithCommas(row.productId.SKU[0].price)}
                                </TableCell>
                                <TableCell align='left'>
                                  <div className='quantity-box'>
                                    <div>
                                      <h4
                                        onClick={() =>
                                          this.quantityAddSubtract(
                                            row.productId._id,
                                            row.quantity - 1,
                                            row.productId.SKU[0].quantity,
                                          )
                                        }>
                                        <span>-</span>
                                      </h4>
                                      <p className='px-3'>{row.quantity}</p>
                                      <h4
                                        onClick={() =>
                                          this.quantityAddSubtract(
                                            row.productId._id,
                                            row.quantity + 1,
                                            row.productId.SKU[0].quantity,
                                          )
                                        }>
                                        <span>+</span>
                                      </h4>
                                    </div>
                                    <div>
                                      <p>Only {row.productId.SKU[0].quantity} items(s) in stock</p>
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                          {/* </TableBody>
                            );
                          })}  */}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className='pb-4'>No Product in your cart</div>
                  )}
                </Paper>
              </div>
            </div>

            {/* Grid Column 3 - Checkout Box */}
            <div className='grid-box-3'>
              <div>
                <div>
                  <p className='text-secondary'>Location</p>
                  <div>
                    <i
                      className='fas fa-map-marker-alt text-dark pr-2'
                      style={{ fontSize: '14px' }}></i>
                    {address != null ? <p>{address[0].address}</p> : null}
                    <button>Change</button>
                  </div>
                </div>
                <div className='pt-4'>
                  <h5>Order Summary</h5>
                  <div>
                    <p>Subtotal (1 items)</p>
                    <p>Rs. {this.numberWithCommas(this.subTotalAmount())}</p>
                  </div>
                  <div>
                    <p>Shipping Fee</p>
                    <p>Rs. {this.numberWithCommas(shippingFee)}</p>
                  </div>
                  <div>
                    <input type='text' placeholder='Enter Voucer Code' />
                    <button className='bg-dark text-white'>Apply</button>
                  </div>
                  <div>
                    <p className='pt-3'>Total</p>
                    <p className='pt-3' style={{ fontSize: '18px', color: '#3F51B5' }}>
                      Rs. {this.numberWithCommas(this.subTotalAmount() + parseInt(shippingFee))}
                    </p>
                  </div>
                  <div>
                    <button className='btn btn-block btn-dark' onClick={() => this.placeOrder()}>
                      PROCEED TO CHECKOUT
                    </button>
                    {error.status === null ? null : error.status === 'failed' ? (
                      <div className='error-failure'>{error.message}</div>
                    ) : (
                      <div className='error-success'>{error.message}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

checkout.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(checkout);
