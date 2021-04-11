import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';

import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import QuestionCard from './QuestionCard';
import PopularQuestions from './PopularQuestions';

//import './../style.css';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import Popover from '@material-ui/core/Popover';
import { Button } from '@material-ui/core';
import { ShoppingCart, List as ListIcon, Send } from '@material-ui/icons';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import { addToCart } from './../../buyer-dashboard/helper';
import SearchBar from './../Search/SearchBar';
import AppBar from '@material-ui/core/AppBar';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
const logo = require('./../../assets/logo.png');
const axios = require('axios');
const { BASE_URL } = require('./../../apibase');
const baseURL = '/buy/';

const styles = theme => ({
  pageBody: {
    margin: 30,
    marginTop: 150,
    flexGrow: 1
  },
  faq_search_div: {
    backgroundColor: '#3E454B',
    textAlign: 'left',
    padding: '2% 0%',

    '& > h4': {
      marginLeft: theme.spacing.unit * 3,
      marginBottom: '2vw',
      color: '#ffffff'
    }
  },
  search: {
    position: 'relative',
    borderRadius: 0,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    color: '#ffffff',
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
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    // color: 'white',
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
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
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
  headerColor: {
    height: 35,
    width: '100%',
    backgroundColor: '#272c30'
  },
  categoryNameHolder: {
    paddingBottom: 25,
    color: '#797979'
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
      backgroundColor: 'rgb(48,54,58)'
    },
    '&:focus': {
      boxShadow: 'none'
    }
  },

  buttonType2: {
    color: 'rgb(39,44,48)',
    borderRadius: 0,
    paddingTop: 7,
    paddingBottom: 7,
    width: 214,
    borderWidth: 3,
    borderColor: 'rgb(39,44,48)'
  },
  rootCheckbox: {
    '&$checked': {
      color: 'rgb(53,60,66)'
    }
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
  userDetails: {
    marginLeft: 40,
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 25
  },
  checked: {},
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
  pageBody: {
    margin: 30,
    marginTop: 150,
    flexGrow: 1
  },
  popover: {
    padding: 20,
    paddingTop: 10,
    marginTop: 7,
    color: 'white'
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
  }
});

class FAQ extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [
        {
          cardType: 'Order Issues',
          questions: ['Faulty Item', 'Missing Item', 'Wrong item received']
        },
        {
          cardType: 'Payments, Promos & Gift Vouchers',
          questions: ['Payment types', 'Promo codes', 'When will I be charged?']
        },
        {
          cardType: 'Returns & Refunds',
          questions: [
            'Have you got it back?',
            'How do I return something?',
            'Our returns policy'
          ]
        },
        {
          cardType: 'Delivery',
          questions: [
            'Standard Delievery',
            'Express Delivery',
            'Parcel Locker Delivery'
          ]
        },
        {
          cardType: 'Product & Stock',
          questions: [
            'Sizing and care guide',
            'Will an item be back in stock?',
            'Find a brand'
          ]
        },
        {
          cardType: 'Techincal',
          questions: [
            'Trouble with the website',
            'Trouble signing into account',
            'What is `Save for later`?'
          ]
        }
      ],
      leftDrawer: false,
      rightDrawer: false,
      LoggedInBuyerDetails: null
    };
  
  }

  async componentDidMount() {
    this.setState({
      cards: [
        {
          cardType: 'Order Issues',
          questions: ['Faulty Item', 'Missing Item', 'Wrong item received']
        },
        {
          cardType: 'Payments, Promos & Gift Vouchers',
          questions: ['Payment types', 'Promo codes', 'When will I be charged?']
        },
        {
          cardType: 'Returns & Refunds',
          questions: [
            'Have you got it back?',
            'How do I return something?',
            'Our returns policy'
          ]
        },
        {
          cardType: 'Delivery',
          questions: [
            'Standard Delievery',
            'Express Delivery',
            'Parcel Locker Delivery'
          ]
        },
        {
          cardType: 'Product & Stock',
          questions: [
            'Sizing and care guide',
            'Will an item be back in stock?',
            'Find a brand'
          ]
        },
        {
          cardType: 'Techincal',
          questions: [
            'Trouble with the website',
            'Trouble signing into account',
            'What is `Save for later`?'
          ]
        }
      ]
    });
    this.getUserCart();
  }

  async componentWillReceiveProps(nextProps) {
    this.setState({
      cards: [
        {
          cardType: 'Order Issues',
          questions: ['Faulty Item', 'Missing Item', 'Wrong item received']
        },
        {
          cardType: 'Payments, Promos & Gift Vouchers',
          questions: ['Payment types', 'Promo codes', 'When will I be charged?']
        },
        {
          cardType: 'Returns & Refunds',
          questions: [
            'Have you got it back?',
            'How do I return something?',
            'Our returns policy'
          ]
        },
        {
          cardType: 'Delivery',
          questions: [
            'Standard Delievery',
            'Express Delivery',
            'Parcel Locker Delivery'
          ]
        },
        {
          cardType: 'Product & Stock',
          questions: [
            'Sizing and care guide',
            'Will an item be back in stock?',
            'Find a brand'
          ]
        },
        {
          cardType: 'Techincal',
          questions: [
            'Trouble with the website',
            'Trouble signing into account',
            'What is `Save for later`?'
          ]
        }
      ]
    });
    this.getUserCart();
  }

  displayAllQuestionCards = () => {
    const { cards } = this.state;

    let allCards;
    if (cards) {
      if (cards.length > 0) {
        allCards = cards.map((item, key) => (
          <QuestionCard
            key={key}
            cardType={item.cardType}
            questions={item.questions}
          />
        ));
      }
    }
    return allCards;
  };

  getUserCart = async () => {
    var user = localStorage.getItem('local-buyer');
    if (user) {
      user = JSON.parse(user);
      const res = await axios.get(
        BASE_URL + `buyer/getUserCart?buyerID=${user.id}`,
        { withCredentials: true }
      );
      console.log('USER CART', res);
      this.setState({
        CartProducts: res.data.cart.products
      });
    }
  };

  render() {
    const { classes } = this.props;
    const { anchorEl, buyerLogedIn } = this.state;
    
    return (
      <div>
         <Header />

        <div className={classes.pageBody}>
          {/* Help section search bar */}
          <div className={classes.faq_search_div}>
            <h4>How can we help you today?</h4>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder='Search LashCart Help…'
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput
                }}
              />
            </div>
          </div>

          {/* All 6 Question Cards */}
          <div className='conatiner mt-5'>
            <div className='row'>{this.displayAllQuestionCards()}</div>
          </div>

          {/* Popular Question Panel */}
          <PopularQuestions />
        </div>

        <Footer />
      </div>
    );
  }
}

FAQ.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(FAQ);
