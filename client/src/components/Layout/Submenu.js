import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../../style.css';
import toRenderProps from 'recompose/toRenderProps';

import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
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
import withWidth from '@material-ui/core/withWidth';
import Drawer from '@material-ui/core/Drawer';
import Popover from '@material-ui/core/Popover';

import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import SearchBar from '../Search/SearchBar';

const { BASE_URL } = require('../../apibase');
const logo = require('../../assets/logo.png');
const axios = require('axios');
const baseURL = '/buy/';

const styles = theme => ({
  subMenu: {
    display: 'flex',
    flexDirection: 'column',
    color: 'white',
    backgroundColor: 'rgb(227,231,232)',
    zIndex: '-1',
  },
});

function Submenu(props) {
  const { classes } = props;
  return (
    <div className={classes.subMenu}>
      <Toolbar style={{ backgroundColor: 'white', color: 'black', minHeight: 10 }} align='right'>
        <div
          style={{
            height: 35,
            display: 'flex',
            flex: 1,
            alignItems: 'center',
          }}>       
        <Link
                //onClick={this.refreshPage}
                to={`${'/login/'}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Typography style={{ marginLeft: 15, marginRight: 15 }}>
                  Sell On LASH<b>CART</b>
                </Typography>
              </Link>
              <Link
                //onClick={this.refreshPage}
                to={`${'/products/1'}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Typography style={{ marginLeft: 15, marginRight: 15 }}>
                  Buy Products
                </Typography>
              </Link>
              <Link
                //onClick={this.refreshPage}
                to={`${'/order-status/'}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Typography style={{ marginLeft: 15, marginRight: 15 }}>
                  Track Your Order
                </Typography>
              </Link>
              <Link
                //onClick={this.refreshPage}
                to={`${'/faqs/'}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Typography style={{ marginLeft: 15, marginRight: 15 }}>
                  FAQs
                </Typography>
              </Link>
              <Link
                //onClick={this.refreshPage}
                to={`${'/contact/'}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Typography style={{ marginLeft: 15, marginRight: 15 }}>
                  Contact US
                </Typography>
              </Link>
        </div>
      </Toolbar>
    </div>
  );
}

Submenu.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Submenu);
