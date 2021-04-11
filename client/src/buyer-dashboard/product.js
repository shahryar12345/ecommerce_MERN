import React, { Component } from 'react';
import './../style.css';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';
// import SearchIcon from '@material-ui/icons/Search';
import { Button } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import { Send } from '@material-ui/icons';
import { fade } from '@material-ui/core/styles/colorManipulator';
import ProductCarousel from '../components/Dashboard/buyer/ProductCarousel';
import { IoLogoFacebook, IoLogoInstagram, IoLogoTwitter } from 'react-icons/io';
import CssBaseline from '@material-ui/core/CssBaseline';
// import CircularProgressbar from 'react-circular-progressbar';
import CommentCard from '../components/Dashboard/buyer/CommentCard';
import SimilarProductsCarousel from '../components/Dashboard/buyer/SimilarProductsCarousel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { addToCart } from './helper';
import Header from '../components/Layout/Header';
import Alert from 'react-s-alert';
import StarRatings from 'react-star-ratings';

const axios = require('axios');
const { BASE_URL } = require('./../apibase');

const styles = theme => ({
  // margin: {

  // },
  root: {
    display: 'flex',
    flexDirection: 'column',
    // color: 'white',
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

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      productName: '',
      Description: '',
      categoryLevels: '',
      level1Cat: '',
      level2Cat: '',
      level3Cat: '',
      productimages: null,
      brand: '',
      model: '',
      highlights: '',
      SKU: null,
      LoggedInBuyerDetails: null,
      leftDrawer: false,
      rightDrawer: false,
      productReviews: [],
    };
  }

  async componentDidMount() {
    const {
      match: { params },
    } = this.props;
    const productId = params.ProdID;
    await this.getProductDetail(productId);
    this.getProductReviews();
  }

  async componentWillReceiveProps(nextProps) {
    const {
      match: { params },
    } = nextProps;
    const productId = params.ProdID;
    console.log('productId : ' + productId);
    //await this.checkUserLoggedIn();
    await this.getProductDetail(productId);
  }

  getProductReviews = async () => {
    let productID = this.props.match.params.ProdID;

    const res = await axios.get(`${BASE_URL}buyer/productReviewsByProductId?id=${productID}`);

    if (res) {
      this.setState({ productReviews: res.data });
    }
  };

  getProductDetail(pID) {
    const {
      match: { params },
    } = this.props;
    //const productId = params.ProdID;
    const productId = pID;
    console.log('ProdID : ' + productId);
    let today = new Date();
    let ViewedDateTime =
      today.getFullYear() +
      '' +
      (today.getMonth() + 1) +
      '' +
      today.getDate() +
      '' +
      (today.getHours() + 1) +
      '' +
      (today.getMinutes() + 1) +
      '' +
      (today.getSeconds() + 1);
    const logged_user_detail = JSON.parse(localStorage.getItem('local-buyer'));
    if (logged_user_detail) {
      this.setState({
        LoggedInBuyerDetails: logged_user_detail,
      });
      var URL =
        BASE_URL +
        'buyer/product?productId=' +
        productId +
        '&buyerID=' +
        logged_user_detail.id +
        '&LastViwedDateTime=' +
        ViewedDateTime;
    } else {
      var URL =
        BASE_URL + 'buyer/product?productId=' + productId + '&LastViwedDateTime=' + ViewedDateTime;
    }
    // /product

    axios
      .get(URL, { withCredentials: true })
      .then(response => {
        console.log('Getting product');
        console.log(response);
        this.setState({
          id: response.data._id,
          productName: response.data.name,
          Description: response.data.description,
          categoryLevels: response.data.categoryLevels,
          productimages: response.data.productImage,
          brand: response.data.brand,
          model: response.data.model,
          highlights: response.data.highlights,
          SKU: response.data.SKU,
        });

        console.log('console.log(this.state.SKU)');
        console.log(this.state.SKU ? this.state.SKU : 'HELLO SKU');
        console.log(this.state.SKU ? this.state.productName : 'HELLO SKU');
        console.log(this.state.categoryLevels ? this.state.categoryLevels : ' heh');

        //Get Level 1 category Data
        axios
          .get(BASE_URL + 'buyer/GetCategoryDetail?level1=' + response.data.categoryLevels.level1, {
            withCredentials: true,
          })
          .then(responseCat1 => {
            console.log('Is axios Category 1');
            console.log(responseCat1);
            this.setState({
              level1Cat: responseCat1.data,
            });

            if (response.data.categoryLevels.level2 != undefined) {
              //Get Level 2 category Data
              var level1 = response.data.categoryLevels.level1;
              var level2 = response.data.categoryLevels.level2;
              axios
                .get(BASE_URL + 'buyer/GetCategoryDetail?level1=' + level1 + '&level2=' + level2, {
                  withCredentials: true,
                })
                .then(responseCat2 => {
                  console.log('Is axios Category 2');
                  console.log(responseCat2);
                  this.setState({
                    level2Cat: responseCat2.data,
                  });
                })
                .catch(error_2 => {
                  console.log('Error-2');
                  console.log(error_2);
                });
            }
          })
          .catch(error => {
            console.log('Error');
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error);
      });
  }

  addCart = async () => {
    const logged_user_detail = JSON.parse(localStorage.getItem('local-buyer'));

    if (logged_user_detail) {
      const {
        match: { params },
      } = this.props;
      const productId = params.ProdID;
      const res = await addToCart(productId, 1);
      console.log('RESPONSE', res);
      if (res) {
        //this.props.getUserCart();
        //this.getUserCart();

        Alert.success('Item Added In Cart Successfully', {
          position: 'top-right',
          effect: 'slide',
        });
      }
    } else {
      console.log('Please Login First');
      Alert.error('Please Login First', {
        position: 'top-right',
        effect: 'slide',
      });
    }
  };

  styleDate = date => {
    let styleDate = '';

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
    styleDate = `${newDate.getDate()} ${months[newDate.getMonth()]} ${newDate.getFullYear()}`;

    return styleDate;
  };

  render() {
    const { classes } = this.props;
    const { anchorEl, buyerLogedIn, productReviews } = this.state;
    const popoverOpen = Boolean(anchorEl);

    let productAvgRatings = 0,
      productAvgPercentage = 0;
    if (productReviews.length > 0) {
      let totalRatings = 0;
      for (let i in productReviews) {
        totalRatings += parseInt(productReviews[i].ratings);
      }
      productAvgRatings = totalRatings / productReviews.length;
      productAvgPercentage = (productAvgRatings / 5) * 100;

      productAvgRatings = Math.round((productAvgRatings + Number.EPSILON) * 100) / 100;
      productAvgPercentage = Math.round((productAvgPercentage + Number.EPSILON) * 100) / 100;
    }

    return (
      <div className={classes.root}>
        {/* <div style={{ marginBottom: 50 }} className={classes.root}></div> */}
        <CssBaseline />

        <Header />
        <div className={classes.pageBody}>
          {/* <Typography align='left' className={classes.categoryNameHolder}>
            {'Product Category : '}
            {`${
              'Product Category : ' + this.state.level1Cat
                ? this.state.level1Cat.name
                : ''
            }`}

            {`${this.state.level2Cat ? +'/' + this.state.level2Cat.name : ''}`}

            <span style={{ color: '#272c30' }}>
              {' '}
              {`${
                this.state.level3Cat ? +'/' + this.state.level3Cat.name : ''
              }`}{' '}
            </span>
          </Typography> */}

          <Grid container spacing='24'>
            <Grid item sm={12} md={12} lg={12}>
              <Paper className={classes.paperCustomTypes}>
                <div className={classes.headerColor}></div>
                <div style={{ paddingBottom: 35 }}>
                  <Grid
                    container
                    spacing={24}
                    style={{
                      color: 'black',
                      padding: 10,
                      textAlign: 'left',
                      paddingTop: 25,
                    }}>
                    <Grid item sm={12} md={6} lg={6}>
                      {this.state.productimages ? (
                        <ProductCarousel productImages={this.state.productimages} />
                      ) : null}
                    </Grid>
                    <Grid item sm={12} md={6} lg={6}>
                      <Typography variant='h4'>{this.state.productName}</Typography>
                      <Typography
                        body
                        style={{ paddingTop: 10 }}
                        dangerouslySetInnerHTML={{
                          __html: this.state.highlights,
                        }}>
                        {/* Product brief description would come here. */}
                        {/* {this.state.highlights} */}
                      </Typography>
                      <Typography align='left'>
                        <img
                          src='https://cdn4.iconfinder.com/data/icons/finance-banking-2/32/star2-512.png'
                          style={{ height: 14, marginTop: 2 }}
                        />
                        <img
                          src='https://cdn4.iconfinder.com/data/icons/finance-banking-2/32/star2-512.png'
                          style={{ height: 14, marginTop: 2 }}
                        />
                        <img
                          src='https://cdn4.iconfinder.com/data/icons/finance-banking-2/32/star2-512.png'
                          style={{ height: 14, marginTop: 2 }}
                        />
                        <img
                          src='https://cdn4.iconfinder.com/data/icons/finance-banking-2/32/star2-512.png'
                          style={{ height: 14, marginTop: 2 }}
                        />
                        <img
                          src='https://cdn4.iconfinder.com/data/icons/finance-banking-2/32/star2-512.png'
                          style={{ height: 14, marginTop: 2 }}
                        />
                        <span style={{ paddingLeft: 12 }}>127 reviews</span>
                      </Typography>

                      <Typography
                        style={{
                          paddingTop: 20,
                          paddingBottom: 20,
                          fontSize: 24,
                        }}>
                        {/* AUD 125.00 */}
                        AUD - {this.state.SKU ? +this.state.SKU[0].price : ''}
                      </Typography>

                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div
                          style={{
                            width: 5,
                            backgroundColor: '#272c30',
                            paddingTop: 19,
                            paddingBottom: 17,
                          }}></div>
                        <Typography
                          style={{
                            marginLeft: 20,
                            fontWeight: '600',
                            fontSize: 17,
                          }}>
                          Color
                        </Typography>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div
                          style={{
                            width: 5,
                            backgroundColor: '#e2e7e7',
                            paddingTop: 24,
                            paddingBottom: 24,
                          }}></div>
                        <FormControlLabel
                          style={{ marginLeft: 10 }}
                          control={
                            <Checkbox
                              //checked={this.state.boxes[index].value}
                              // onChange={this.handleChange(index)}
                              value={'Black Brown'}
                              classes={{
                                root: classes.rootCheckbox,
                                checked: classes.checked,
                              }}
                            />
                          }
                          label={'Black Brown'}
                        />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div
                          style={{
                            width: 5,
                            backgroundColor: '#e2e7e7',
                            paddingTop: 24,
                            paddingBottom: 24,
                          }}></div>
                        <FormControlLabel
                          style={{ marginLeft: 10 }}
                          control={
                            <Checkbox
                              //checked={this.state.boxes[index].value}
                              // onChange={this.handleChange(index)}
                              value={'Brown Blue'}
                              classes={{
                                root: classes.rootCheckbox,
                                checked: classes.checked,
                              }}
                            />
                          }
                          label={'Brown Blue'}
                        />
                      </div>

                      <Typography variant='h6' style={{ marginTop: 15 }}>
                        Description:
                      </Typography>
                      <Typography
                        body
                        align='justify'
                        style={{ paddingRight: 35 }}
                        dangerouslySetInnerHTML={{
                          __html: this.state.Description,
                        }}>
                        {/* Curabitur ultricies aliquam ipsum ac hendrerit. Phasellus porta dui ut mauris dictum faucibus. Pellentesque non nisl non ex malesuada dapibus. Fusce pellentesque magna neque, et volutpat nunc posuere id. Mauris nulla purus, hendrerit quis dolor in, consequat egestas magna. Sed enim sapien, mattis et augue dictum, pulvinar fringilla neque. Quisque rutrum porttitor mollis. Donec finibus risus vel magna tristique blandit. Etiam sit amet auctor sem. Nunc vulputate, mauris a lacinia rhoncus, lacus ex suscipit mauris, in molestie felis ex et urna. Nulla magna erat, condimentum sed porta sit amet, maximus id metus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. */}
                        {/* {this.state.Description} */}
                      </Typography>
                    </Grid>
                  </Grid>
                </div>
                <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', height: 1.5 }}></div>
                <div
                  style={{
                    padding: 13,
                    color: 'black',
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}>
                  <Button variant='outlined' className={classes.buttonType2}>
                    Add To Wishlist
                  </Button>
                  <Button
                    variant='contained'
                    className={classes.buttonType1}
                    style={{ marginLeft: 20 }}
                    onClick={this.addCart}>
                    Add To Cart
                  </Button>
                </div>
              </Paper>
            </Grid>
          </Grid>

          {this.state.level1Cat ? (
            <SimilarProductsCarousel
              level1CatId={this.state.level1Cat ? this.state.level1Cat._id : 'No-CatID'}
            />
          ) : null}

          <Grid container spacing='24'>
            <Grid item sm={12} md={12} lg={12}>
              <Paper className={classes.paperCustomTypes}>
                <div style={{ paddingBottom: 35 }}>
                  <Grid
                    container
                    spacing={24}
                    style={{
                      color: 'black',
                      padding: 10,
                      textAlign: 'left',
                      paddingTop: 25,
                    }}>
                    <Grid
                      item
                      sm={12}
                      md={7}
                      lg={7}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      {/* <CircularProgressbar
                                            percentage={64}
                                            text={`3.2`}
                                            styles={{
                                                // Customize the root svg element
                                                root: {
                                                    maxWidth: 200,
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                },
                                                // Customize the path, i.e. the "completed progress"
                                                path: {
                                                    // Path color
                                                    stroke: `rgba(39, 44, 48, ${64 / 100})`,
                                                    // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                                                    strokeLinecap: 'butt',
                                                    // Customize transition animation
                                                    transition: 'stroke-dashoffset 0.5s ease 0s',
                                                },
                                                // Customize the circle behind the path, i.e. the "total progress"
                                                trail: {
                                                    // Trail color
                                                    stroke: '#91989e',
                                                },
                                                // Customize the text
                                                text: {
                                                    // Text color
                                                    fill: '#272c30',
                                                    alignSelf: 'center',
                                                    // Text size
                                                    fontSize: '16px',
                                                },

                                            }}
                                        /> */}

                      <div
                        style={{
                          height: 180,
                          width: 180,
                          borderRadius: 90,
                          borderColor: '#91989e',
                          borderStyle: 'solid',
                          borderWidth: 8,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: 15,
                        }}>
                        <Typography variant='h3' style={{ fontWeight: 'bold', color: '#272c30' }}>
                          {productAvgRatings}
                        </Typography>
                      </div>
                      <Typography align='center'>
                        <StarRatings
                          rating={productAvgRatings}
                          name='rating'
                          starRatedColor='#3F51B5'
                          starHoverColor='#5D6164'
                          starDimension='40px'
                          starSpacing='5px'
                          numberOfStars={5}
                        />
                      </Typography>
                      <Typography style={{ fontSize: 23, fontWeight: '500' }} align='center'>
                        {productAvgRatings} out of 5
                      </Typography>
                      <Typography style={{ fontSize: 22, color: 'rgba(0,0,0,0.4)' }} align='center'>
                        {productReviews.length} ratings
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      sm={12}
                      md={5}
                      lg={5}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}>
                      <Typography style={{ fontSize: 21 }}>
                        {productAvgPercentage}% of users recommend this product a friend.
                      </Typography>

                      <Typography
                        style={{
                          fontSize: 22,
                          fontWeight: '500',
                          paddingTop: 30,
                          paddingBottom: 10,
                        }}>
                        Rate this product:
                      </Typography>

                      <Typography align='left'>
                        <img
                          src='https://cdn4.iconfinder.com/data/icons/finance-banking-2/32/star2-512.png'
                          style={{ height: 36 }}
                        />
                        <img
                          src='https://cdn4.iconfinder.com/data/icons/finance-banking-2/32/star2-512.png'
                          style={{ height: 36 }}
                        />
                        <img
                          src='https://cdn4.iconfinder.com/data/icons/finance-banking-2/32/star2-512.png'
                          style={{ height: 36 }}
                        />
                        <img
                          src='https://cdn4.iconfinder.com/data/icons/finance-banking-2/32/star2-512.png'
                          style={{ height: 36 }}
                        />
                        <img
                          src='https://cdn4.iconfinder.com/data/icons/finance-banking-2/32/star2-512.png'
                          style={{ height: 36 }}
                        />
                      </Typography>
                    </Grid>
                  </Grid>
                  <div
                    style={{
                      padding: 22,
                      paddingLeft: 40,
                      backgroundColor: '#ececec',
                      marginTop: 40,
                    }}>
                    <Typography align='left' variant='h5'>
                      ({productReviews.length}) Reviews
                    </Typography>
                  </div>

                  {productReviews.length > 0
                    ? productReviews.map((item, key) => (
                        <CommentCard
                          key={item._id}
                          comment={item.review}
                          ratings={item.ratings}
                          writer={item.buyer.fullName}
                          date={this.styleDate(item.date)}
                        />
                      ))
                    : null}
                </div>
              </Paper>
            </Grid>
          </Grid>
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
      </div>
    );
  }
}

Product.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Product);
