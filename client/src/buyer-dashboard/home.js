import React, { Component } from 'react';
import './../style.css';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { ShoppingCart, List as ListIcon, Send } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Carousel from 'nuka-carousel';
import withWidth from '@material-ui/core/withWidth';
import toRenderProps from 'recompose/toRenderProps';
import Drawer from '@material-ui/core/Drawer';
import scrollToComponent from 'react-scroll-to-component';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Popover from '@material-ui/core/Popover';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import AdvertisementSpace from './../components/Dashboard/buyer/AdvertisementSpace';
import ProductCard from '../components/Dashboard/buyer/ProductCard';
import RecentlyViewedProducts from '../components/Dashboard/buyer/RecentlyViewedProducts';
import NewProducts from '../components/Dashboard/buyer/NewProducts';

import TodaysDeals from '../components/Dashboard/buyer/TodaysDeals';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { IoLogoFacebook, IoLogoInstagram, IoLogoTwitter } from 'react-icons/io';
import { connect } from 'react-redux';

import TestPage from '../components/Dashboard/TestPage';
import ProductPage from './product';
import CategoryList from './categoryList';

import { addToCart } from './helper';

const baseURL = '/buy/';
const { BASE_URL } = require('./../apibase');
const logo = require('./../assets/logo.png');
const placeholder = require('./../assets/product_placeholder.jpg');
const WithWidth = toRenderProps(withWidth());

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

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leftDrawer: false,
      rightDrawer: false,
      abc: 'Hello',
      //buyerName: "",
      //buyerEmail : "",
      buyerLogedIn : false
    };
    this.checkUserLoggedIn();
  }
  
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

  componentDidMount() {
    scrollToComponent(this.Blue, {
      offset: 0,
      align: 'middle',
      duration: 500,
      ease: 'inCirc',
    });
  }
  // checkUserLoggedIn = () => {
  //   // Get getBuyerDetail() , call only for login buyer
  //   const logged_user_detail = JSON.parse(localStorage.getItem('local-buyer'));
  //   if (logged_user_detail) {
  //     this.state = {
  //       buyerName: logged_user_detail.name,
  //       buyerEmail: logged_user_detail.email,
  //       buyerLogedIn: true,
  //     };

  //     console.log('Loged in true: ' + this.state.buyerLogedIn);
  //     //console.log('HEllloo . User Logged');
  //     console.log(this.state.buyerName);
  //     console.log(this.state.buyerEmail);
  //     console.log(logged_user_detail.email);
  //     console.log(logged_user_detail.name);
  //   } else {
  //     this.state = {
  //       buyerLogedIn: false,
  //     };
  //     console.log('Loged in fasle: ' + this.state.buyerLogedIn);
  //     console.log('No user Logged in');
  //   }
  // };

  render() {
    const { classes } = this.props;
    const { anchorEl, buyerLogedIn } = this.state;

    return (
      <Grid container spacing={24}>
        {/* SLIDER LAYER */}
        <Grid item sm={12} md={10} lg={12}>
          <div style={{ position: 'relative' }}>
            <Paper className={classes.paperCustomSlider}>
              <Carousel
                style={{ height: '100%' }}
                autoplay={true}
                autoplayInterval={3000}
                wrapAround={true}>
                <img src='https://images.pexels.com/photos/459225/pexels-photo-459225.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' />
                <img src='https://images.pexels.com/photos/1558732/pexels-photo-1558732.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940' />
                <img src='http://placehold.it/1000x400/ffffff/c0392b/&text=slide3' />
                <img src='http://placehold.it/1000x400/ffffff/c0392b/&text=slide4' />
                <img src='http://placehold.it/1000x400/ffffff/c0392b/&text=slide5' />
                <img src='http://placehold.it/1000x400/ffffff/c0392b/&text=slide6' />
              </Carousel>
            </Paper>
            {/* <CategoryList /> */}
          </div>
        </Grid>
        {/* <Grid item sm={12} md={2} lg={3}>
                            <Paper className={classes.paperCustomTypes}
                                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', paddingTop: 25, paddingBottom: 25 }}
                            >

                                <Button
                                    variant="contained"
                                    fullWidth
                                    className={classes.buttonType1}
                                    onClick={() => scrollToComponent(this.RecentlyViewedProducts)}
                                >
                                    Recently Viewed
                    </Button>

                                <Button
                                    variant="contained"
                                    fullWidth
                                    className={classes.buttonType1}
                                    onClick={() => scrollToComponent(this.TodaysDeals)}
                                >
                                    Today's Deal
                    </Button>

                                <Button
                                    variant="contained"
                                    fullWidth
                                    className={classes.buttonType1}
                                    onClick={() => scrollToComponent(this.DealsForYou)}
                                >
                                    Deals for you
                    </Button>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    className={classes.buttonType1}
                                    onClick={() => scrollToComponent(this.TrendingProducts)}

                                >
                                    Trending Products
                    </Button>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    className={classes.buttonType1}
                                    onClick={() => scrollToComponent(this.NewProducts)}

                                >
                                    New Products
                    </Button>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    className={classes.buttonType1}
                                    onClick={() => scrollToComponent(this.RecommendedSellers)}
                                >
                                    Recommended Sellers
                    </Button>
                            </Paper>
                        </Grid>
 */}

        {/* SECOND LAYER */}
        <Grid item sm={12} md={6} lg={3}>
          <Paper className={classes.paperCustomSmallBoxes} align='left'>
            <Typography variant='title'>Shop by Category</Typography>
            <div style={{ paddingLeft: 20, paddingRight: 20 }}>
              <Grid container style={{ marginTop: 5 }}>
                <Grid xs={6} item align='center'>
                  <div
                    style={{
                      paddingTop: 5,
                      paddingBottom: 5,
                      backgroundColor: '#f3fbfc',
                    }}>
                    <div style={{ height: 80 }}>
                      <img
                        src='http://pluspng.com/img-png/laptop-hd-png-laptop-notebook-png-image-1358.png'
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                        alt='Laptop'
                      />
                    </div>
                    <Typography variant='subtitle2'>Computers</Typography>
                  </div>
                </Grid>

                <Grid xs={6} item align='center'>
                  <div
                    style={{
                      marginLeft: 4,
                      paddingTop: 5,
                      paddingBottom: 5,
                      backgroundColor: '#f3fbfc',
                    }}>
                    <div style={{ height: 80 }}>
                      <img
                        src='http://pluspng.com/img-png/laptop-hd-png-laptop-notebook-png-image-1358.png'
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                        alt='Laptop'
                      />
                    </div>
                    <Typography variant='subtitle2'>Video Games</Typography>
                  </div>
                </Grid>

                <Grid xs={6} item align='center'>
                  <div
                    style={{
                      marginTop: 4,
                      paddingTop: 5,
                      paddingBottom: 5,
                      backgroundColor: '#f3fbfc',
                    }}>
                    <div style={{ height: 80 }}>
                      <img
                        src='http://pluspng.com/img-png/laptop-hd-png-laptop-notebook-png-image-1358.png'
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                        alt='Laptop'
                      />
                    </div>
                    <Typography variant='subtitle2'>Baby</Typography>
                  </div>
                </Grid>

                <Grid xs={6} item align='center'>
                  <div
                    style={{
                      marginTop: 4,
                      marginLeft: 4,
                      paddingTop: 5,
                      paddingBottom: 5,
                      backgroundColor: '#f3fbfc',
                    }}>
                    <div style={{ height: 80 }}>
                      <img
                        src='http://pluspng.com/img-png/laptop-hd-png-laptop-notebook-png-image-1358.png'
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                        alt='Laptop'
                      />
                    </div>
                    <Typography variant='subtitle2'>Toys & Games</Typography>
                  </div>
                </Grid>
              </Grid>
            </div>
          </Paper>
        </Grid>
        <Grid item sm={12} md={6} lg={3}>
          <Paper className={classes.paperCustomSmallBoxes} align='left'>
            <Typography variant='title'>Category Name</Typography>
            <div
              style={{
                width: '90%',
                height: 170,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 10,
                backgroundImage:
                  "url('https://o.aolcdn.com/images/dims3/GLOB/crop/3481x1741+215+412/resize/630x315!/format/jpg/quality/85/http%3A%2F%2Fo.aolcdn.com%2Fhss%2Fstorage%2Fmidas%2F6a9e5dd26a5d23711860a4a67b8fc971%2F204872692%2Fljnqxfyn7am-shanna-camilleri.jpg')",
                backgroundSize: '100% 100%',
              }}></div>

            <Typography body style={{ paddingLeft: '5%', paddingRight: '5%', paddingTop: 5 }}>
              Some One liner desciption here
            </Typography>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                paddingTop: 7,
              }}>
              <Button variant='text' style={{ marginBottom: 15, color: 'blue' }}>
                Shop Now
              </Button>
            </div>
          </Paper>
        </Grid>
        <Grid item sm={12} md={6} lg={3}>
          <Paper className={classes.paperCustomSmallBoxes} align='left'>
            <Typography variant='title'>Category Name</Typography>
            <div
              style={{
                width: '90%',
                height: 170,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 10,
                backgroundImage:
                  "url('https://o.aolcdn.com/images/dims3/GLOB/crop/3481x1741+215+412/resize/630x315!/format/jpg/quality/85/http%3A%2F%2Fo.aolcdn.com%2Fhss%2Fstorage%2Fmidas%2F6a9e5dd26a5d23711860a4a67b8fc971%2F204872692%2Fljnqxfyn7am-shanna-camilleri.jpg')",
                backgroundSize: '100% 100%',
              }}></div>
            <Typography body style={{ paddingLeft: '5%', paddingRight: '5%', paddingTop: 5 }}>
              Some One liner desciption here
            </Typography>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                paddingTop: 7,
              }}>
              <Button variant='text' style={{ marginBottom: 15, color: 'blue' }}>
                Shop Now
              </Button>
            </div>
          </Paper>
        </Grid>
        <Grid item sm={12} md={6} lg={3}>
          {this.state.buyerLogedIn ? (
            <Paper className={classes.paperCustomSmallBoxes} align='left'>
              <Typography variant='title'>Category Name</Typography>
              <div
                style={{
                  width: '90%',
                  height: 170,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  marginTop: 10,
                  backgroundImage:
                    "url('https://o.aolcdn.com/images/dims3/GLOB/crop/3481x1741+215+412/resize/630x315!/format/jpg/quality/85/http%3A%2F%2Fo.aolcdn.com%2Fhss%2Fstorage%2Fmidas%2F6a9e5dd26a5d23711860a4a67b8fc971%2F204872692%2Fljnqxfyn7am-shanna-camilleri.jpg')",
                  backgroundSize: '100% 100%',
                }}></div>
              <Typography body style={{ paddingLeft: '5%', paddingRight: '5%', paddingTop: 5 }}>
                Some One liner desciption here
              </Typography>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  paddingTop: 7,
                }}>
                <Button variant='text' style={{ marginBottom: 15, color: 'blue' }}>
                  Shop Now
                </Button>
              </div>
            </Paper>
          ) : (
            <Paper
              className={classes.paperCustomSmallBoxes}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
              <Typography variant='subtitle2'>
                Signin to get a complete LASH<b>CART</b> experience
              </Typography>
              <div>
              <Link
                      to={`${'/login'}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >                   
                    <Button
                      variant='outlined'
                      fullWidth
                      className={classes.buttonType2}
                      style={{ marginBottom: 15 }}
                    >
                          Signup                        
                    </Button>
                  </Link>
                <Link
                      to={`${'/login'}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                <Button
                  variant='outlined'
                  fullWidth
                  className={classes.buttonType2}

                >                
                    Login   
                </Button>
                </Link> 
              </div>
            </Paper>
          )}
        </Grid>

        <NewProducts
          ref={section => {
            this.NewProducts = section;
          }}
        />

        {/* <AdvertisementSpace /> */}
        {buyerLogedIn && (
          <RecentlyViewedProducts
            ref={section => {
              this.RecentlyViewedProducts = section;
            }}
          />
        )}

        {/* <AdvertisementSpace /> */}

        {/* <TodaysDeals ref={(section) => { this.TodaysDeals = section; }} /> */}

        {/* <AdvertisementSpace /> */}

        {/* <TodaysDeals categoryTitle="Deals For You" ref={(section) => { this.DealsForYou = section; }} /> */}

        {/* <AdvertisementSpace /> */}

        <TodaysDeals
          categoryTitle='Trending Products'
          ref={section => {
            this.TrendingProducts = section;
          }}
        />

        {/* <AdvertisementSpace /> */}

        {/* <TodaysDeals categoryTitle="New Products" ref={(section) => { this.NewProducts = section; }} /> */}

        {/* <AdvertisementSpace /> */}

        {/* <TodaysDeals categoryTitle="Products By Recommended Sellers" ref={(section) => { this.RecommendedSellers = section; }} /> */}
      </Grid>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Home);
