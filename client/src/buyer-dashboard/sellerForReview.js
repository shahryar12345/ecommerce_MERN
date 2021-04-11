import React, { Component, useState } from 'react';
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

import AdvertisementSpace from '../components/Dashboard/buyer/AdvertisementSpace';
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
import HomePage from './home';

import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import ReactDOM from 'react-dom';
import Tabs from 'muicss/lib/react/tabs';
import Tab from 'muicss/lib/react/tab';
//import './../muicss.css';
import { addToCart } from './helper';

const baseURL = '/buy/';
const { BASE_URL } = require('../apibase');
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
    backgroundColor: 'rgb(227,231,232)'
  },
  appBar: {
    boxShadow: 'none',
    backgroundColor: 'rgb(39,44,48)',
    zIndex: theme.zIndex.drawer + 1,
    position: 'fixed'
  },
  toolbarTitle: {
    flex: 1,
    textAlign: 'left',
    paddingLeft: 20
  },
  search: {
    position: 'relative',
    borderRadius: 0,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto'
    },
    flexGrow: 1
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit',
    width: '100%'
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200
    }
  },
  pageBody: {
    margin: 30,
    marginTop: 130,
    flexGrow: 1
  },
  paperCustom: {
    borderRadius: 0,
    marginTop: 10
  },
  paperCustomSlider: {
    borderRadius: 0,
    boxShadow: 'none',
    height: 500
  },
  paperCustomTypes: {
    borderRadius: 0,
    height: 500,
    boxShadow: 'none'
  },
  paperCustomSmallBoxes: {
    borderRadius: 0,
    height: 300,
    boxShadow: 'none',
    color: 'black',
    padding: 25
  },
  paperProductBox: {
    borderRadius: 0,

    boxShadow: 'none',
    padding: 20
  },
  footer: {
    backgroundColor: 'rgb(62,69,75)'
  },
  moveToTop: {
    padding: 10,
    cursor: 'hand',
    cursor: 'pointer'
  },
  footerSocials: {
    padding: 20,
    backgroundColor: 'rgb(51,56,60)',
    paddingLeft: 50,
    paddingRight: 50
  },
  webMap: {
    padding: 20
  },
  drawer: {
    width: 350,
    padding: 10
  },
  cartDrawer: {
    width: 450,
    padding: 10
  },
  footerHeading: {
    color: 'white'
  },
  footerOption: {
    color: 'white'
  },

  buttonType2: {
    color: 'rgb(39,44,48)',
    borderRadius: 0,
    borderWidth: 3,
    borderColor: 'rgb(39,44,48)'
  },
  buttonType1: {
    backgroundColor: 'white',
    boxShadow: 'none',
    borderRadius: 0,
    paddingTop: 15,
    paddingBottom: 15
  },
  userName: {
    color: 'rgb(236,239,234)'
  },
  avatar: {
    marginRight: 10,
    width: 35,
    height: 35,
    color: 'rgb(39,44,48)',
    fontSize: 22,
    backgroundColor: 'white'
  },
  avatarPopover: {
    marginRight: 'auto',
    marginLeft: 'auto',
    width: 50,
    height: 50,
    color: 'rgb(236,239,234)',
    backgroundColor: 'rgb(39,44,48)',
    marginTop: 0,
    marginBottom: 10
  },
  userDetails: {
    marginLeft: 40,
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 25
  },
  popover: {
    padding: 20,
    paddingTop: 10,
    marginTop: 7
  },
  logoutButtonPopover: {
    width: '100%',
    marginTop: 7
  },
  btn: {
    border: '2px solid black',
    padding: '8px',
    cursor: 'pointer'
  },
  TabGrid: {
    textAlign: 'left'
  }
});

class SellerForReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Seller: this.props.SellerObject // contain single Seller object
    };
  }

  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.paperCustom}>
        <Typography variant='h5' component='h3'>
          This is a sheet of paper.
        </Typography>
        <Typography component='p'>
          Paper can be used to build surface or other elements for your
          application.
        </Typography>
      </Paper>
    );
  }
}

SellerForReview.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(SellerForReview);
