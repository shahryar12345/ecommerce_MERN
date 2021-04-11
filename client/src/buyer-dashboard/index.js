import React, { Component } from 'react';
import './../style.css';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
// import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { Send } from '@material-ui/icons';
import Grid from '@material-ui/core/Grid';
import withWidth from '@material-ui/core/withWidth';
import toRenderProps from 'recompose/toRenderProps';
import Drawer from '@material-ui/core/Drawer';
import { Route, Link, Switch } from 'react-router-dom';
import Popover from '@material-ui/core/Popover';
import { TransitionGroup } from 'react-transition-group';

import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { IoLogoFacebook, IoLogoInstagram, IoLogoTwitter } from 'react-icons/io';
import MyReviews from './myreviews';
import TestPage from '../components/Dashboard/TestPage';
// import ProductPage from './product';
import HomePage from './home';
import { addToCart } from './helper';
import Header from '../components/Layout/Header';
const baseURL = '/buy/';
const { BASE_URL } = require('./../apibase');
toRenderProps(withWidth());

const axios = require('axios');

const styles = theme => ({
  // margin: {

  // },
  root: {
    display: 'flex',
    flexDirection: 'column',
    color: 'white',
    backgroundColor: 'rgb(227,231,232)',
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

    textDecoration: 'none',
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
  pageBody: {
    margin: 30,
    marginTop: 130,
    flexGrow: 1,
  },
  paperCustom: {
    borderRadius: 0,
  },
  paperCustomSlider: {
    borderRadius: 0,
    boxShadow: 'none',
    height: 500,
  },
  paperCustomTypes: {
    borderRadius: 0,
    height: 500,
    boxShadow: 'none',
  },
  paperCustomSmallBoxes: {
    borderRadius: 0,
    height: 300,
    boxShadow: 'none',
    color: 'black',
    padding: 25,
  },
  paperProductBox: {
    borderRadius: 0,

    boxShadow: 'none',
    padding: 20,
  },
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

  buttonType2: {
    color: 'rgb(39,44,48)',
    borderRadius: 0,
    borderWidth: 3,
    borderColor: 'rgb(39,44,48)',
  },
  buttonType1: {
    backgroundColor: 'white',
    boxShadow: 'none',
    borderRadius: 0,
    paddingTop: 15,
    paddingBottom: 15,
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

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leftDrawer: false,
      rightDrawer: false,
      abc: 'Hello',
      //buyerName: "",
      //buyerEmail : "",
      //buyerLogedIn : false
    };

    this.checkUserLoggedIn();
  }

  logout = () => {
    // loguout user
    // Clear local storage
    localStorage.removeItem('local-buyer');
  };

  refreshPage() {
    // window.location.reload(false);
  }
  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  componentDidMount() {
    const logged_user_detail = JSON.parse(localStorage.getItem('local-buyer'));
    if (logged_user_detail) {
      this.getUserCart();
    }
  }

  checkUserLoggedIn = () => {
    // Get getBuyerDetail() , call only for login buyer
    const logged_user_detail = JSON.parse(localStorage.getItem('local-buyer'));
    if (logged_user_detail) {
      this.state = {
        buyerName: logged_user_detail.name,
        buyerEmail: logged_user_detail.email,
        buyerLogedIn: true,
      };

      console.log('Loged in true: ' + this.state.buyerLogedIn);
      //console.log('HEllloo . User Logged');
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
  };

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

  state = {
    //open: false,
    anchorEl: null,
    //submenuOpen: false,
    //notificationMenuOpen: false
  };

  handlePopoverOpen = event => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };
  // })
  // .catch(error => {
  //   console.log(error.response);
  //   // console.log(error.response.data.statusCode)
  //   //this.props.history.push(`/seller/login`)
  // });

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
        BASE_URL + `buyer/removeItemFromCart?buyerID=${user.id}&productID=${id}`,
      );
      console.log('Removal response', res);
    }
    this.getUserCart();
  };

  render() {
    const { classes } = this.props;
    const { anchorEl, buyerLogedIn } = this.state;
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

    const cartList = (
      <div className={classes.cartDrawer}>
        <Grid container style={{ padding: 15 }}>
          <Grid item xs={12} sm={10} md={9} lg={8}>
            <Typography variant='title' className='pt-1'>
              Shopping Cart
            </Typography>
          </Grid>
          <Grid item xs={12} sm={2} md={3} lg={4}>
            <Typography variant='subtitle' align='right'>
              <Link to='/checkout'>
                <button className='btn btn-dark'>Checkout</button>
              </Link>
            </Typography>
          </Grid>
        </Grid>
        <Grid></Grid>
        {this.state.CartProducts &&
          this.state.CartProducts.map((product, index) => (
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
                {product.productId && <p> {product.productId.name} </p>}
                <Grid className='flexer' style={{ width: '50%' }}>
                  <h4
                    className={classes.btn}
                    onClick={() => {
                      this.addQuantity(product.productId._id, product.quantity - 1, index);
                    }}>
                    -
                  </h4>
                  <p> {product.quantity} </p>
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
    // {this.state.CartProducts[3].productId.productImage[0].buffer}
    //SS-CHANGES

    // function ShowLoggedUserAvater(props)
    // {
    //     if(props.buyerLogedIn)
    //     {
    //         return <Button variant="text" className={classes.userDetails}
    //                         aria-owns={props.popoverOpen ? 'mouse-click-popover' : undefined}
    //                         aria-haspopup="true"
    //                         onClick={props.popoverOpen ? this.handlePopoverOpen : undefined}>
    //                         <Avatar className={classes.avatar}>U</Avatar>
    //                         <Typography className={classes.userName}>
    //                             {props.buyerName}
    //                         </Typography>

    //         </Button>
    //     }else
    //     {
    //         return null
    //     }
    // }

    var ShowLoggedUserAvater = ({ buyerLogedIn }) => (
      <div></div>
      // if(buyerLogedIn)
      // {
      //     return <Button variant="text" className={classes.userDetails}
      //                     aria-owns={popoverOpen ? 'mouse-click-popover' : undefined}
      //                     aria-haspopup="true"
      //                     onClick={ this.handlePopoverOpen}>

      //                     <Avatar className={classes.avatar}>U</Avatar>
      //                     <Typography className={classes.userName}>
      //                         {this.state.buyerName}
      //                     </Typography>

      //     </Button>
      // }else
      // {
      //     return null
      // }
    );

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
                // className={classes.logoutButtonPopover}
                // onClick={this.refreshPage}
                to={`${'/login'}`}
                // style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Typography
                  style={{ marginLeft: 15, marginRight: 15 }}
                  variant='subtitle2'
                  align='left'
                  // style={{ fontSize: 17, paddingTop: 8 }}
                >
                  Login/Signup
                </Typography>
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

        <Header />

        <div className={classes.pageBody}>
          <TransitionGroup>
            <Switch location={this.props.location}>
              <Route path={`${baseURL}test`} component={TestPage} />
              <Route path={``} component={HomePage} />
              <Route path={`${baseURL}`} component={HomePage} />
              <Route path={`${baseURL}myreviews`} component={MyReviews} />

              {/* <Route path={`${baseURL}product/:ProdID`} component={ProductPage} /> */}
              {/* <Route
                exact
                path={`${baseURL}product/:ProdID`}
                render={props => (
                  <ProductPage {...props} getUserCart={this.getUserCart} />
                )}
              /> */}
            </Switch>
          </TransitionGroup>
        </div>

        <div className={classes.footer}>
          <div className={classes.moveToTop}>Move To Top</div>
          <div className={classes.footerSocials}>
            <Grid container spacing={32}>
              <Grid item sm={12} md={6} lg={6}>
                <Typography variant='h6' align='left' style={{ color: 'white' }}>
                  Get Exclusive Deals And Offers
                </Typography>

                {/* <div className={classes.subscribeInput}>
                                    <InputBase
                                        placeholder="Search…"
                                        classes={{
                                            root: classes.inputRoot,
                                            input: classes.inputInput,
                                        }}
                                    />
                                </div>
                                <div className={classes.searchIcon}>
                                    {/* <SearchIcon /> */}
                {/* </div>  */}
                <div
                  style={{
                    padding: 0,
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    width: '100%',
                    marginTop: 10,
                    display: 'flex',
                  }}>
                  <InputBase
                    className={classes.margin}
                    style={{
                      width: '100%',
                      marginLeft: 10,
                      padding: 5,
                      color: 'white',
                    }}
                    placeholder='Enter your email address'
                  />
                  <Button
                    variant='outlined'
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.5)',
                      borderWidth: 0,
                      borderRadius: 0,
                    }}
                    className={classes.button}>
                    <Send
                      style={{
                        height: '100%',
                        color: 'white',
                      }}
                    />
                  </Button>
                </div>
              </Grid>
              <Grid
                item
                sm={12}
                md={6}
                lg={6}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Typography variant='h6' style={{ color: 'white', marginBottom: 10 }}>
                  Follow Us On
                </Typography>
                <div>
                  <IoLogoFacebook style={{ fontSize: 28, marginRight: 8 }} />
                  <IoLogoTwitter style={{ fontSize: 28, marginRight: 8 }} />
                  <IoLogoInstagram style={{ fontSize: 28 }} />
                </div>
              </Grid>
            </Grid>
          </div>
          <div className={classes.webMap}>
            <Grid
              container
              spacing={32}
              justify='center'
              style={{
                paddingTop: 10,
                paddingBottom: 10,
                backgroundColor: 'rgb(62,69,75)',
              }}>
              <Grid lg={2} md={4} sm={6} item>
                <Typography variant='h6' align='left' className={classes.footerHeading}>
                  About Us
                </Typography>
                <Typography variant='subheading' align='left' className={classes.footerOption}>
                  Option 1
                </Typography>
              </Grid>

              <Grid lg={2} md={4} sm={6} item>
                <Typography variant='h6' align='left' className={classes.footerHeading}>
                  Buy
                </Typography>
                <Typography variant='subheading' align='left' className={classes.footerOption}>
                  Option 1
                </Typography>
              </Grid>

              <Grid lg={2} md={4} sm={6} item>
                <Typography variant='h6' align='left' className={classes.footerHeading}>
                  Sell
                </Typography>
                <Typography variant='subheading' align='left' className={classes.footerOption}>
                  Option 1
                </Typography>
              </Grid>

              <Grid lg={2} md={4} sm={6} item>
                <Typography variant='h6' align='left' className={classes.footerHeading}>
                  Help/FAQs
                </Typography>
                <Typography variant='subheading' align='left' className={classes.footerOption}>
                  Option 1
                </Typography>
              </Grid>

              <Grid lg={2} md={4} sm={6} item>
                <Typography variant='h6' align='left' className={classes.footerHeading}>
                  Contact Us
                </Typography>
                <Typography variant='subheading' align='left' className={classes.footerOption}>
                  Option 1
                </Typography>
              </Grid>
            </Grid>
          </div>
        </div>

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

        {/* <Drawer anchor="left" open={this.state.leftDrawer} onClose={this.toggleDrawer('leftDrawer', false)}>
                    <div
                        tabIndex={0}
                        role="button"
                        onClick={this.toggleDrawer('leftDrawer', false)}
                        onKeyDown={this.toggleDrawer('leftDrawer', false)}
                    >
                        {sideList}
                    </div>
                </Drawer> */}

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

Index.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Index);
