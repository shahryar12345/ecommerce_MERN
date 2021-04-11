import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { ShoppingCart } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const axios = require('axios');

const baseURL = '/buys/';

const styles = theme => ({
  // margin: {

  // },
  root: {
    display: 'flex',
    flexDirection: 'column',
    color: 'white',
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
    backgroundColor: 'orange',
    margin: 15,
    marginTop: 140,
    flexGrow: 1,
  },
  paperCustom: {
    borderRadius: 0,
  },

  paperCustomTypes: {
    borderRadius: 0,
    height: 200,
    boxShadow: 'none',
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paperCustomSmallBoxes: {
    borderRadius: 0,
    height: 300,
    boxShadow: 'none',
  },
  paperProductBox: {
    borderRadius: 0,

    boxShadow: 'none',
    padding: 20,
  },
});

class ProductCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Product: this.props.ProductObject,
    };
  }
  refreshPage() {
    // window.location.reload(false);
  }
  async componentDidMount() {
    this.setState({
      Product: this.props.ProductObject,
    });
  }

  async componentWillReceiveProps(nextProps) {
    //     const { match: { params } } = nextProps;
    //     const productId = params.ProdID;

    console.log('componentWillReceiveProps In => Product Card : ' + nextProps.ProductObject);
    this.setState({
      Product: nextProps.ProductObject,
    });
    //     await this.getProductDetail(productId);
  }

  render() {
    const { classes, ProductObject } = this.props;
    const { image_src } = this.props.ProductObject
      ? this.props.ProductObject.productImage
        ? 'data:' +
          this.props.ProductObject.productImage[0].mimetype +
          ';base64,' +
          this.props.ProductObject.productImage[0].buffer
        : ''
      : '';

    console.log('From product card', this.props.ProductObject);

    return ProductObject ? (
      <Paper className={classes.paperProductBox}>
        {/* <div style={{ width: '100%', height: 200 }}> */}
        {/* {
                        console.log("Show Image Testing")} */}
        {/* {
                            console.log(this.props.ProductObject ? this.props.ProductObject.productImage ? this.props.ProductObject.productImage[0].buffer : null : null)   
                            
                        } */}
        {/* {
                            console.log("Image_src : " + image_src)
                        } */}

        {/* <img src= {`data:${this.props.ProductObject ? this.props.ProductObject.productImage ? this.props.ProductObject.productImage[0].mimetype : "" : ""};base64,${this.props.ProductObject ? this.props.ProductObject.productImage ? this.props.ProductObject.productImage[0].buffer : "" : ""}`}
                        
                        style={{ width: 'auto', height: 'auto', backgroundColor: 'red', maxWidth: '100%', maxHeight: '100%' }}
                        alt="Product Name"
                    /> */}

        {/* <img src= {`data:${this.state.Product ? this.state.Product.productImage ? this.state.Product.productImage[0].mimetype : "" : ""};base64,${this.state.Product ? this.state.Product.productImage ? this.state.Product.productImage[0].buffer : "" : ""}`}
                        
                        style={{ width: 'auto', height: 'auto', backgroundColor: 'red', maxWidth: '100%', maxHeight: '100%' }}
                        alt="Product Name"
                    /> */}

        {/* <img src="https://www.91-img.com/pictures/126849-v6-honor-10-mobile-phone-large-1.jpg"
                        style={{ width: 'auto', height: 'auto', backgroundColor: 'red', maxWidth: '100%', maxHeight: '100%' }}
                        alt="Product Name"

                    /> */}
        {/* </div> */}

        {this.props.type !== 'isSimilarProduct' ? (
          <Link
            onClick={this.refreshPage}
            to={`${baseURL}${'product/'}${
              this.props.ProductObject ? this.props.ProductObject._id : ''
            }`}
            style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ width: '100%', height: 200 }}>
              <img
                src={`data:${
                  this.props.ProductObject
                    ? this.props.ProductObject.productImage
                      ? this.props.ProductObject.productImage[0].mimetype
                      : ''
                    : ''
                };base64,${
                  this.props.ProductObject
                    ? this.props.ProductObject.productImage
                      ? this.props.ProductObject.productImage[0].buffer
                      : ''
                    : ''
                }`}
                style={{
                  width: 'auto',
                  height: 'auto',
                  // backgroundColor: 'red',
                  maxWidth: '100%',
                  maxHeight: '100%',
                }}
                alt='Product Name'
              />
            </div>
            <Typography variant='subtitle2' align='left' style={{ fontSize: 17, paddingTop: 8 }}>
              {/* {this.props.ProductObject ? this.props.ProductObject.name : null} P<span style={{ fontSize: 12, textTransform: 'uppercase' }}>RODUCT</span> N<span style={{ fontSize: 12, textTransform: 'uppercase' }}>ame</span> */}

              {/* {
                        console.log(this.props.ProductObject ? this.props.ProductObject.SKU ? this.props.ProductObject.SKU[0].price : null : null)}
                            */}
              {this.props.ProductObject ? this.props.ProductObject.name : null}
            </Typography>
          </Link>
        ) : (
          <Link
            onClick={this.refreshPage}
            to={`${baseURL}${'product/'}${
              this.props.ProductObject ? this.props.ProductObject._id : ''
            }`}
            style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ width: '100%', height: 200 }}>
              <img
                src={`data:${
                  this.props.ProductObject
                    ? this.props.ProductObject.productImage
                      ? this.props.ProductObject.productImage[0].mimetype
                      : ''
                    : ''
                };base64,${
                  this.props.ProductObject
                    ? this.props.ProductObject.productImage
                      ? this.props.ProductObject.productImage[0].buffer
                      : ''
                    : ''
                }`}
                style={{
                  width: 'auto',
                  height: 'auto',
                  // backgroundColor: 'red',
                  maxWidth: '100%',
                  maxHeight: '100%',
                }}
                alt='Product Name'
              />
            </div>
            <Typography
              onClick={this.refreshPage}
              variant='subtitle2'
              align='left'
              style={{ fontSize: 17, paddingTop: 8 }}>
              {this.props.ProductObject ? this.props.ProductObject.name : null}
            </Typography>
          </Link>
        )}

        <Typography align='left'>
          <img
            src='https://cdn4.iconfinder.com/data/icons/finance-banking-2/32/star2-512.png'
            style={{ height: 22 }}
          />
          <img
            src='https://cdn4.iconfinder.com/data/icons/finance-banking-2/32/star2-512.png'
            style={{ height: 22 }}
          />
          <img
            src='https://cdn4.iconfinder.com/data/icons/finance-banking-2/32/star2-512.png'
            style={{ height: 22 }}
          />
          <img
            src='https://cdn4.iconfinder.com/data/icons/finance-banking-2/32/star2-512.png'
            style={{ height: 22 }}
          />
          <img
            src='https://cdn4.iconfinder.com/data/icons/finance-banking-2/32/star2-512.png'
            style={{ height: 22 }}
          />
        </Typography>
        <Typography variant='subtitle2' align='left' style={{ color: '#a97b50', fontSize: 18 }}>
          {/* 1,350 AUD */}
          {this.props.ProductObject
            ? this.props.ProductObject.SKU
              ? this.props.ProductObject.SKU[0].price
              : null
            : null}
          - AUD
        </Typography>
      </Paper>
    ) : null;
  }
}

ProductCard.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(ProductCard);
