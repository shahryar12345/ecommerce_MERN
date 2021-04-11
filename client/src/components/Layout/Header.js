import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import '../../style.css';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
// import SearchIcon from '@material-ui/icons/Search';
// import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
// import { ShoppingCart, List as ListIcon, Send } from '@material-ui/icons';
import { ShoppingCart } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import Popover from '@material-ui/core/Popover';
import { addToCart } from './../../buyer-dashboard/helper';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

import Submenu from './Submenu';
import SearchBar from '../Search/SearchBar';
import Loader from '../Common/Loader';

const baseURL = '/buy/';
const { BASE_URL } = require('../../apibase');
const logo = require('../../assets/logo.png');
const axios = require('axios');

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    color: 'white',
    backgroundColor: 'rgb(227,231,232)',
    marginBottom: 20,
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
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
  drawer: {
    width: 350,
    padding: 10,
  },
  cartDrawer: {
    width: 450,
    padding: 10,
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
  userDetails: {
    marginLeft: 40,
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 25,
  },
  popover: {
    padding: 20,
    paddingTop: 10,
    marginTop: 7,
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
});

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leftDrawer: false,
      anchorEl: null,
      cartProducts: [],
    };
    this.checkUserLoggedIn();
  }

  componentDidMount() {
    const logged_user_detail = JSON.parse(localStorage.getItem('local-buyer'));
    if (logged_user_detail) {
      this.getUserCart();
    }
  }
  getUserCart = async () => {
    var user = localStorage.getItem('local-buyer');
    user = JSON.parse(user);
    if (user) {
      const res = await axios.get(BASE_URL + `buyer/getUserCart?buyerID=${user.id}`, {
        withCredentials: true,
      });
      console.log('USER CART', res);
      if (res.data.cart) {
        this.setState({
          CartProducts: res.data.cart.products,
        });
        console.log('Cart Length ');
        console.log(this.state.CartProducts.length);

      }
    }
  };

  addQuantity = (PID, quantity, index) => {
    console.log(PID, quantity, index);

    // try{
    //     var user = localStorage.getItem('local-buyer')
    //     user = JSON.parse(user)
    //     var quantity=quantity;
    //     console.log("USER " , user)
    //     console.log("PID" , PID)
    //     const res = await axios.get(BASE_URL  + `buyer/addCartItem?buyerID=${user.id}&productID=${PID}&quantity=${quantity}` , {withCredentials: true})

    //     console.log("RESPONSe" ,res.data)
    //     this.getUserCart()
    //    }
    //    catch(err){
    //        console.log(err)
    //    }
    // this.state.CartProducts[index]
    // this.setState({
    // "CartProducts.quantity":
    // })

    var Carts = this.state.CartProducts;
    if (quantity >= 1) {
      Carts[index].quantity = quantity;
      const res = addToCart(PID, quantity);
      if (res) {
        this.setState({ CartProducts: Carts });
      }
    }
  };


  cartItemRemove = async id => {
    var user = localStorage.getItem('local-buyer');
    user = JSON.parse(user);
    if (user) {
      const res = await axios.get(
        BASE_URL + `buyer/removeItemFromCart?buyerId=${user.id}&productId=${id}`,
      );
      console.log('Removal response', res);
    }
    this.getUserCart();
  };

  toggleDrawer = (side, open) => () => {
    if (open) {
      this.getUserCart();
    }
    this.setState({
      [side]: open,
    });
  };

  checkUserLoggedIn = () => {
    const logged_user_detail = JSON.parse(localStorage.getItem('local-buyer'));
    if (logged_user_detail) {
      console.log("New Logging to check user logged IN");
      console.log(logged_user_detail);
      
      this.state = {
        buyerName: logged_user_detail.name,
        buyerEmail: logged_user_detail.email,
        buyerLogedIn: true,
      };
    } else {
      this.state = {
        buyerLogedIn: false,
      };
    }
  };

  getBuyerDetail = () => {
    axios
      .get(BASE_URL + 'buyer/', { withCredentials: true })
      .then(response => {
        this.setState({
          buyerName: response.data.ownerName ? response.data.ownerName : 'Shahry',
        });
      })
      .catch(error => {
        console.log(error.response);
      });
  };

  // getUserCart = async () => {
  //   var user = localStorage.getItem('local-buyer');
  //   user = JSON.parse(user);
  //   if (user) {
  //     const res = await axios.get(BASE_URL + `buyer/getUserCart?buyerID=${user.id}`, {
  //       withCredentials: true,
  //     });
  //     if (res.data.cart) {
  //       this.setState({
  //         cartProducts: res.data.cart.products,
  //       });
  //     }
  //   }
  // };

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

  // cartItemRemove = async id => {
  //   var user = localStorage.getItem('local-buyer');
  //   user = JSON.parse(user);
  //   if (user) {
  //     const res = await axios.get(
  //       BASE_URL + `buyer/removeItemFromCart?buyerID=${user.id}&productID=${id}`,
  //     );
  //     console.log('Removal response', res);
  //   }
  //   this.getUserCart();
  // };

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

  logout = () => {
    // loguout user
    // Clear local storage
    localStorage.removeItem('local-buyer');
  };

  render() {
    const { classes } = this.props;
    const { anchorEl, cartProducts } = this.state;
    const popoverOpen = Boolean(anchorEl);

    const sideList = (
      <div className={classes.drawer}>
        <Grid container style={{ padding: 15 }}>
          <Grid item xs={12} sm={10} md={9} lg={8}>
            <Typography variant='title'>Categories</Typography>
          </Grid>
          <Grid item xs={12} sm={2} md={3} lg={4}>
            <Typography variant='subtitle' align='center'>
              see all
            </Typography>
          </Grid>
        </Grid>

        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </div>
    );

    let cartList;
    if (cartProducts) {
      cartList = (
        <div className={classes.cartDrawer}>
          <Grid container style={{ padding: 15 }}>
            <Grid item xs={12} sm={10} md={9} lg={8}>
              <Typography variant='title' className='pt-1'>
                Shopping Cart
              </Typography>
            </Grid>
            <Grid item xs={12} sm={2} md={3} lg={4}>
              <Typography variant='subtitle1' align='right'>
                <Link to='/checkout'>
                  <button className='btn btn-dark'>
                    <i className='far fa-calendar-check mr-2' style={{ fontSize: '15px' }}></i>
                    Checkout
                  </button>
                </Link>
              </Typography>
            </Grid>
          </Grid>
          <Grid></Grid>
          {cartProducts &&
            cartProducts.map((product, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: '#ececec',
                  padding: 20,
                  marginBottom: 20,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  position: 'relative',
                }}>
                <i
                  className='fas fa-times cart-remove'
                  onClick={() => this.cartItemRemove(product._id)}></i>
                <Grid>
                  {product.productId ? (
                    <img
                      style={{ width: 100, height: 100 }}
                      src={`data:image/png;base64,${product.productId.productImage[0].buffer}`}
                      alt='product'
                    />
                  ) : (
                    <img style={{ width: 100, height: 100 }} src='' alt='other' />
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
                  <div className='cart-quantity-box'>
                    <div>
                      <p className='m-0'>{product.productId.name}</p>
                    </div>
                    <div>
                      <h4
                        onClick={() =>
                          this.quantityAddSubtract(
                            product.productId._id,
                            product.quantity - 1,
                            product.productId.SKU[0].quantity,
                          )
                        }>
                        <span>-</span>
                      </h4>
                      <p className='px-3'>{product.quantity}</p>
                      <h4
                        onClick={() =>
                          this.quantityAddSubtract(
                            product.productId._id,
                            product.quantity + 1,
                            product.productId.SKU[0].quantity,
                          )
                        }>
                        <span>+</span>
                      </h4>
                    </div>
                    <div>
                      <p>Only {product.productId.SKU[0].quantity} items(s) in stock</p>
                    </div>
                  </div>
                </Grid>
              </div>
            ))}
        </div>
      );
    } else {
      cartList = <Loader />;
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
              {/* Sell On  */}
              LASH<b>CART</b>
            </Typography>

            <Typography>
              <Link
                style={{ marginLeft: 15, marginRight: 15, color: '#000' }}
                // className={classes.logoutButtonPopover}
                // onClick={this.refreshPage}
                to={`${'/login'}`}
                // style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {/* <Typography
                  style={{ marginLeft: 15, marginRight: 15 }}
                  variant='subtitle2'
                  align='left'
                  // style={{ fontSize: 17, paddingTop: 8 }}
                > */}
                Login/Signup
                {/* </Typography> */}
              </Link>
            </Typography>
            {/* <Typography style={{ marginLeft: 15, marginRight: 15 }}>
              Signup
            </Typography> */}
          </div>
        );
        // {/* */}
        // return <div style={{ height: 35, display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
        // <Typography style={{ marginLeft: 15, marginRight: 15 }}>
        //     Welcome <b> {props.buyerName} </b>
        // </Typography>
        // <Typography style={{ marginLeft: 15, marginRight: 15 }}>
        //     Logout
        // </Typography>
        // </div>
      } else {
        return null;
        //   return  <div style={{ height: 35, display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
        //     <Typography style={{ marginLeft: 15, marginRight: 15 }}>
        //         Sell On LASH<b>CART</b>
        //     </Typography>
        //     <Typography style={{ marginLeft: 15, marginRight: 15 }}>
        //         Login
        // </Typography>
        //     <Typography style={{ marginLeft: 15, marginRight: 15 }}>
        //         Signup
        // </Typography>
        // </div>
        // {/* */}
      }
    }

    return (
      <div className={classes.root}>
        <CssBaseline />
        {/* <AppBar position='sticky' color='primary' className={classes.appBar}>
          <Toolbar
            style={{ backgroundColor: 'white', color: 'black', minHeight: 10 }}
            align='right'>
            <UserLoggedInOrNot
              buyerLogedIn={this.state.buyerLogedIn}
              buyerName={this.state.buyerName}
            />
          </Toolbar>
          <Toolbar>
            <img src={logo} height={35} width='auto' alt='LashCart Logo' />

            <Typography variant='h6' color='inherit' noWrap className={classes.toolbarTitle}>
              LASH<b>CART</b>
            </Typography>
             <IconButton color='inherit' onClick={this.toggleDrawer('leftDrawer', true)}> }
              <ListIcon />
            </IconButton>

            <SearchBar />

            <div
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <IconButton color='inherit' onClick={this.toggleDrawer('rightDrawer', true)}>
                <Badge badgeContent={17} color='primary'>
                  <ShoppingCart />
                </Badge>
              </IconButton>

              {this.state.buyerLogedIn ? (
                <Button
                  variant='text'
                  className={classes.userDetails}
                  aria-owns={popoverOpen ? 'mouse-click-popover' : undefined}
                  aria-haspopup='true'
                  onClick={this.handlePopoverOpen}>
                  <Avatar className={classes.avatar}>U</Avatar>
                  <Typography className={classes.userName}>{this.state.buyerName}</Typography>
                </Button>
              ) : null}
            </div>
          </Toolbar>
        </AppBar> */}
        <AppBar position='sticky' color='primary' className={classes.appBar}>
          <Toolbar
            style={{ backgroundColor: 'white', color: 'black', minHeight: 10 }}
            align='right'>
            <UserLoggedInOrNot
              buyerLogedIn={this.state.buyerLogedIn}
              buyerName={this.state.buyerName}
            />
          </Toolbar>
          <Toolbar>
            {/* <Link to="/buy">  */}
            <img src={logo} height={35} width='auto' alt='LashCart Logo' />
            {/* </Link> */}

            {/* <Link to="/buy" style={{ textDecoration: 'none', color: 'white' }} >  */}
            <Typography variant='h6' color='inherit' noWrap className={classes.toolbarTitle}>
              <Link to='/buy' style={{ textDecoration: 'none', color: 'white' }}>
                LASH<b>CART</b>
              </Link>
            </Typography>
            {/* </Link> */}
            {/* <IconButton color="inherit" onClick={this.toggleDrawer('leftDrawer', true)} >
                            <ListIcon />
                        </IconButton> */}

            <SearchBar />

            {/* <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder='Search…'
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput
                }}
              />
            </div> */}
            <div
              style={{
                flex: 1,
                justifyContent: 'center',

                alignItems: 'center',
              }}>
              <IconButton color='inherit' onClick={this.toggleDrawer('rightDrawer', true)}>
                <Badge
                  badgeContent={this.state.CartProducts ? this.state.CartProducts.length : 0}
                  color='primary'>

                  <ShoppingCart />
                </Badge>
              </IconButton>

              {this.state.buyerLogedIn ? (
                <Button
                  variant='text'
                  className={classes.userDetails}
                  aria-owns={popoverOpen ? 'mouse-click-popover' : undefined}
                  aria-haspopup='true'
                  onClick={this.handlePopoverOpen}>
                  <Avatar className={classes.avatar}>U</Avatar>
                  <Typography className={classes.userName}>{this.state.buyerName}</Typography>
                </Button>
              ) : null}
            </div>
          </Toolbar>

          <Submenu> </Submenu>
        </AppBar>

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
              <Link
                className={classes.logoutButtonPopover}
                onClick={this.refreshPage}
                to={`${'/login'}`}
                style={{ textDecoration: 'none', color: 'inherit' }}>
                <Typography
                  variant='body'
                  align='left'
                  style={{ fontSize: 15, paddingLeft: 8, marginTop: -10 }}>
                  Logout
                </Typography>
              </Link>
            </Button>
            <Divider />
            {/* <Button
              className={classes.logoutButtonPopover}
              onClick={() => {
                this.logout();
              }}
            >
              My Reviews
            </Button> */}

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
          anchor='left'
          open={this.state.leftDrawer}
          onClose={this.toggleDrawer('leftDrawer', false)}>
          <div
            tabIndex={0}
            role='button'
            onClick={this.toggleDrawer('leftDrawer', false)}
            onKeyDown={this.toggleDrawer('leftDrawer', false)}>
            {/* {sideList} */}
          </div>
        </Drawer>

        <Drawer
          anchor='right'
          open={this.state.rightDrawer}
          onClose={this.toggleDrawer('rightDrawer', false)}>
          {}
          <div
            tabIndex={0}
            role='button'
            onClick={this.toggleDrawer('rightDrawer', true)}
            onKeyDown={this.toggleDrawer('rightDrawer', false)}>
            {cartList}
          </div>
        </Drawer>
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Header);
