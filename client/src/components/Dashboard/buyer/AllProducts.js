import React, { Component } from 'react';
import PropTypes from 'prop-types';
import toRenderProps from 'recompose/toRenderProps';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import withWidth from '@material-ui/core/withWidth';

//import '../../../style.css';
import ProductCard from './ProductCard';
import Header from '../../Layout/Header';
import Footer from '../../Layout/Footer';
import Loader from '../../Common/Loader';
import { addToCart } from './../../../buyer-dashboard/helper';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import Popover from '@material-ui/core/Popover';
import SearchIcon from '@material-ui/icons/Search';
import { Button } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import SearchBar from './../../Search/SearchBar';
import { ShoppingCart, List as ListIcon, Send } from '@material-ui/icons';
import { fade } from '@material-ui/core/styles/colorManipulator';
//import ProductCarousel from '../components/Dashboard/buyer/ProductCarousel';
//import { IoLogoFacebook, IoLogoInstagram, IoLogoTwitter } from 'react-icons/io';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
// import TodaysDeals from './../components/Dashboard/buyer/TodaysDeals';
// import CircularProgressbar from 'react-circular-progressbar';
// import SimilarProductsCarousel from '../components/Dashboard/buyer/SimilarProductsCarousel';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
// import { param } from 'express-validator/check';
// import { addToCart } from './helper';
import AppBar from '@material-ui/core/AppBar';
//import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
const logo = require('./../../../assets/logo.png');
const axios = require('axios');
const { BASE_URL } = require('./../../../apibase');
const baseURL = '/buy/';

const WithWidth = toRenderProps(withWidth());

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    // color: 'white',
    backgroundColor: 'rgb(227,231,232)',
  },
  pageBody: {
    margin: 70,
    marginTop: 130,
    flexGrow: 1,
    // marginLeft: 'auto',
    // marginRight: 'auto'
  },
  productCards: {
    marginTop: 100,
    marginBottom: 100,
  },
  appBar: {
    boxShadow: 'none',
    backgroundColor: 'rgb(39,44,48)',
    zIndex: theme.zIndex.drawer + 1,
    position: 'fixed',
  },
  toolbarTitle: {
    flex: 1,
    textAlign: 'left',
    paddingLeft: 20,
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  search: {
    position: 'relative',
    borderRadius: 0,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
    flexGrow: 1,
  },
  headerColor: {
    height: 35,
    width: '100%',
    backgroundColor: '#272c30',
  },
  categoryNameHolder: {
    paddingBottom: 25,
    color: '#797979',
  },
  buttonType1: {
    backgroundColor: 'rgb(39,44,48)',
    boxShadow: 'none',
    color: 'rgb(236,239,234)',
    borderRadius: 0,
    paddingTop: 10,
    paddingBottom: 10,
    width: 220,
    '&:hover': {
      backgroundColor: 'rgb(48,54,58)',
    },
    '&:focus': {
      boxShadow: 'none',
    },
  },

  buttonType2: {
    color: 'rgb(39,44,48)',
    borderRadius: 0,
    paddingTop: 7,
    paddingBottom: 7,
    width: 214,
    borderWidth: 3,
    borderColor: 'rgb(39,44,48)',
  },
  rootCheckbox: {
    '&$checked': {
      color: 'rgb(53,60,66)',
    },
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  userDetails: {
    marginLeft: 40,
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 25,
  },
  checked: {},
  footer: {
    backgroundColor: 'rgb(62,69,75)',
  },
  moveToTop: {
    padding: 10,
    cursor: 'hand',
    cursor: 'pointer',
  },
  footerSocials: {
    padding: 20,
    backgroundColor: 'rgb(51,56,60)',
    paddingLeft: 50,
    paddingRight: 50,
  },
  webMap: {
    padding: 20,
  },
  drawer: {
    width: 350,
    padding: 10,
  },
  cartDrawer: {
    width: 450,
    padding: 10,
  },
  footerHeading: {
    color: 'white',
  },
  footerOption: {
    color: 'white',
  },
  pageBody: {
    margin: 30,
    marginTop: 130,
    flexGrow: 1,
  },
  popover: {
    padding: 20,
    paddingTop: 10,
    marginTop: 7,
    color: 'white',
  },
  logoutButtonPopover: {
    width: '100%',
    marginTop: 7,
  },
  btn: {
    border: '2px solid black',
    padding: '8px',
    cursor: 'pointer',
  },
  userName: {
    color: 'rgb(236,239,234)',
  },
  avatar: {
    marginRight: 10,
    width: 35,
    height: 35,
    color: 'rgb(39,44,48)',
    fontSize: 22,
    backgroundColor: 'white',
  },
  avatarPopover: {
    marginRight: 'auto',
    marginLeft: 'auto',
    width: 50,
    height: 50,
    color: 'rgb(236,239,234)',
    backgroundColor: 'rgb(39,44,48)',
    marginTop: 0,
    marginBottom: 10,
  },
});

class AllProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: null,
      total: null,
      per_page: null,
      current_page: null,
      loading: false,
      leftDrawer: false,
      rightDrawer: false,
    };
    this.checkUserLoggedIn();
  }

  async checkUserLoggedIn() {
    // Get getBuyerDetail() , call only for login buyer
    const logged_user_detail = JSON.parse(localStorage.getItem('local-buyer'));
    if (logged_user_detail) {
      this.state = {
        buyerName: logged_user_detail.name,
        buyerEmail: logged_user_detail.email,
        buyerLogedIn: true,
      };

      console.log('Loged in true on product Page: ' + this.state.buyerLogedIn);
      console.log('HEllloo . User Logged');
      console.log(this.state.buyerName);
      console.log(this.state.buyerEmail);
      console.log(logged_user_detail.email);
      console.log(logged_user_detail.name);
    } else {
      this.state = {
        buyerLogedIn: false,
      };
      console.log('Loged in fasle: ' + this.state.buyerLogedIn);
      console.log('No user Logged in');
    }
  }

  getBuyerDetail = () => {
    axios
      .get(BASE_URL + 'buyer/', { withCredentials: true })
      .then(response => {
        console.log('Logged user details');
        console.log(response);
        console.log(response.data.email);

        this.setState({
          buyerName: response.data.ownerName ? response.data.ownerName : 'Shahry',
          //stepsToDo: response.data.stepsToDo,
          //shopName: response.data.shopName,
          //rank: response.data.rank
        });
      })
      .catch(error => {
        console.log(error.response);
        // console.log(error.response.data.statusCode)
        //this.props.history.push(`/seller/login`)
      });
  };

  getUserCart = async () => {
    var user = localStorage.getItem('local-buyer');
    if (user) {
      user = JSON.parse(user);
      const res = await axios.get(BASE_URL + `buyer/getUserCart?buyerID=${user.id}`, {
        withCredentials: true,
      });
      console.log('USER CART', res);
      this.setState({
        CartProducts: res.data.cart ? res.data.cart.products : null,
      });
    }
  };

  async componentDidMount() {
    await this.checkUserLoggedIn();
    this.getProducts(this.props.match.params.pageNumber);
    this.getUserCart();
  }

  async componentWillReceiveProps(nextProps) {
    await this.checkUserLoggedIn();
    this.getProducts(nextProps.match.params.pageNumber);
    this.getUserCart();
  }

  getProducts = pageNumber => {
    this.setState({ loading: true });

    axios
      .get(`${BASE_URL}buyer/all-products?page=${pageNumber}`)
      .then(res => {
        this.setState({
          products: res.data.products,
          total: res.data.total,
          per_page: res.data.per_page,
          current_page: res.data.page,
          loading: false,
        });
      })
      .catch(error => {
        console.log(error.response);
      });
  };

  handlePopoverOpen = event => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handlePopoverClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  logout = () => {};
  addQuantity = (PID, quantity, index) => {
    var Carts = this.state.CartProducts;
    if (quantity >= 1) {
      Carts[index].quantity = quantity;
      const res = addToCart(PID, quantity);
      if (res) {
        this.setState({ CartProducts: Carts });
      }
    }
  };

  addCart = async () => {
    const {
      match: { params },
    } = this.props;
    const productId = params.ProdID;
    const res = await addToCart(productId, 1);
    console.log('RESPONSE', res);
    if (res) {
      //this.props.getUserCart();
      this.getUserCart();
    }
  };

  state = {
    //open: false,
    anchorEl: null,
    //submenuOpen: false,
    //notificationMenuOpen: false
  };

  loadData = number => {
    this.props.history.push(`/products/${number}`);
  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  render() {
    const { classes } = this.props;
    const { pageNumber } = this.props.match.params;
    const { products, total, per_page, current_page, loading } = this.state;
    const { anchorEl, buyerLogedIn } = this.state;
    const popoverOpen = Boolean(anchorEl);

    const lastPage = Math.ceil(total / per_page);
    let data, renderPageNumbers, firstPageItem, lastPageItem;
    const pageNumbers = [];

    const cartList = (
      <div className={classes.cartDrawer}>
        <Grid container style={{ padding: 15 }}>
          <Grid item xs={12} sm={10} md={9} lg={8}>
            <Typography variant='title'>Shopping Cart</Typography>
          </Grid>
          <Grid item xs={12} sm={2} md={3} lg={4}>
            <Typography variant='subtitle' align='center'>
              open in new page
            </Typography>
          </Grid>
        </Grid>
        <Grid></Grid>
        {this.state.CartProducts &&
          this.state.CartProducts.map((product, index) => (
            <div
              style={{
                backgroundColor: '#ececec',
                padding: 20,
                marginBottom: 20,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Grid>
                {product.productId ? (
                  <img
                    style={{ width: 100, height: 100 }}
                    src={`data:image/png;base64,${product.productId.productImage[0].buffer}`}
                  />
                ) : (
                  <img style={{ width: 100, height: 100 }} src='' />
                )}
              </Grid>

              <Grid
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                }}>
                {product.productId && <p>{product.productId.name}</p>}
                <Grid className='flexer' style={{ width: '50%' }}>
                  <h4
                    className={classes.btn}
                    onClick={() => {
                      this.addQuantity(product.productId._id, product.quantity - 1, index);
                    }}>
                    -
                  </h4>
                  <p>{product.quantity}</p>
                  <h4
                    className={classes.btn}
                    onClick={() => {
                      this.addQuantity(product.productId._id, product.quantity + 1, index);
                    }}>
                    +
                  </h4>
                </Grid>
              </Grid>
            </div>
          ))}
      </div>
    );

    if (total) {
      for (let i = 1; i <= Math.ceil(total / per_page); i++) {
        pageNumbers.push(i);
      }

      renderPageNumbers = pageNumbers.map(number => {
        return (
          <li key={number} className={Number(pageNumber) === number ? 'page-item active-page' : ''}>
            <a className='page-link' onClick={() => this.loadData(number)}>
              {number}
            </a>
          </li>
        );
      });

      firstPageItem = (
        <li key={0} className='page-item'>
          <a className='page-link' onClick={() => this.loadData(1)}>
            &laquo;
          </a>
        </li>
      );

      lastPageItem = (
        <li key={lastPage + 1} className='page-item'>
          <a className='page-link' onClick={() => this.loadData(lastPage)}>
            &raquo;
          </a>
        </li>
      );
    }

    if (!loading && products) {
      data = (
        <Grid container>
          {products.map((item, key) => (
            <ProductCard
              className={classes.productCards}
              key={item._id}
              productName={'Shahryar'}
              ProductObject={item}
            />
          ))}
        </Grid>
      );
    } else {
      data = (
        <div>
          <Loader width='160px' />
        </div>
      );
    }

    function UserLoggedInOrNot(props) {
      if (!props.buyerLogedIn) {
        return (
          <div
            style={{
              height: 35,
              display: 'flex',
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
            <Typography style={{ marginLeft: 15, marginRight: 15 }}>
              Sell On LASH<b>CART</b>
            </Typography>
            <Typography style={{ marginLeft: 15, marginRight: 15 }}>Login</Typography>
            <Typography style={{ marginLeft: 15, marginRight: 15 }}>Signup</Typography>
          </div>
        );
      } else {
        return null;
      }
    }

    return (
      <div className={classes.root}>
        <Header />
        <CssBaseline />

        <div className={classes.pageBody}>
          <Grid container spacing>
            {data}
          </Grid>

          <Grid container>
            <ul
              style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: '2%' }}
              className='pagination'>
              {firstPageItem}
              {renderPageNumbers}
              {lastPageItem}
            </ul>
          </Grid>
        </div>

        <Footer />

        <Popover
          id='mouse-click-popover'
          classes={{
            paper: classes.paper,
          }}
          open={popoverOpen}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          onClose={this.handlePopoverClose}
          disableRestoreFocus>
          <div style={{ margin: 10 }}>
            <Typography className={classes.popover}>
              <Avatar className={classes.avatarPopover}>{/* {this.state.buyerName} */}</Avatar>
              {this.state.buyerName}
            </Typography>
            <Divider />
            <Button
              className={classes.logoutButtonPopover}
              onClick={() => {
                this.logout();
              }}>
              Logout
            </Button>
            <Divider />

            <Divider />
            <Link
              className={classes.logoutButtonPopover}
              onClick={this.refreshPage}
              to={`${baseURL}${'myreviews/'}`}
              style={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography variant='subtitle2' align='left' style={{ fontSize: 17, paddingTop: 8 }}>
                My Reviews
              </Typography>
            </Link>
          </div>
        </Popover>

        <Drawer
          anchor='right'
          open={this.state.rightDrawer}
          onClose={this.toggleDrawer('rightDrawer', false)}>
          <div
            tabIndex={0}
            role='button'
            //onClick={this.toggleDrawer('rightDrawer', false)}
            onKeyDown={this.toggleDrawer('rightDrawer', false)}>
            {cartList}
          </div>
        </Drawer>
      </div>
    );
  }
}

AllProducts.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(AllProducts);
