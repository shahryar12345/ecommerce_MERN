import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import toRenderProps from 'recompose/toRenderProps';

import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import withWidth from '@material-ui/core/withWidth';
import Divider from '@material-ui/core/Divider';

import Tabs from 'muicss/lib/react/tabs';
import Tab from 'muicss/lib/react/tab';

import StarRatings from 'react-star-ratings';

import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import Loader from '../components/Common/Loader';
import ProductForReview from './productForReview';
import SellerForReview from './sellerForReview';

const { BASE_URL } = require('../apibase');
const WithWidth = toRenderProps(withWidth());

const axios = require('axios');

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgb(227,231,232)',
  },
  pageBody: {
    marginRight: '15%',
    marginLeft: '15%',
    marginTop: 130,
    marginBottom: 100,
  },
  TabGrid: {
    textAlign: 'left',
  },
});

class Myreviews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productToBeReviewed: {},
      productReviewHistory: {},
      loadingReview: false,
      loadingHistory: false,
    };
  }

  componentDidMount() {
    this.getProductsToBeReviwed();
    this.getProductReviewHistory();
  }

  getProductsToBeReviwed = async () => {
    this.setState({ loadingReview: true });
    const logged_user_detail = JSON.parse(localStorage.getItem('local-buyer'));
    if (logged_user_detail) {
      const res = await axios.get(
        BASE_URL + `buyer/productsForReview?buyerId=${logged_user_detail.id}`,
        {
          withCredentials: true,
        },
      );
      if (res) {
        this.setState({
          productToBeReviewed: res.data,
          loadingReview: false,
        });
      }
    }
  };

  getProductReviewHistory = async () => {
    this.setState({ loadingHistory: true });
    const logged_user_detail = JSON.parse(localStorage.getItem('local-buyer'));
    if (logged_user_detail) {
      const res = await axios.get(
        BASE_URL + `buyer/productReviewHistory?buyerId=${logged_user_detail.id}`,
        {
          withCredentials: true,
        },
      );
      if (res) {
        this.setState({
          productReviewHistory: res.data,
          loadingHistory: false,
        });
      }
    }
  };

  onChange(i, value, tab, ev) {
    console.log(arguments);
  }

  onActive(tab) {
    console.log(arguments);
  }

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

  displayRatingText = ratings => {
    const ratingDetail = ['Poor', 'Average', 'Good', 'Very Good', 'Excellent'];

    return <h6>{ratingDetail[ratings - 1]}</h6>;
  };

  displayReviewData = () => {
    const { productReview, orderReview, sellerReview } = this.state.productToBeReviewed;
    let data = [];

    if (Object.keys(this.state.productToBeReviewed).length > 0) {
      for (let i in orderReview) {
        for (let j in orderReview[i].product) {
          if (
            orderReview[i].product[j].deliveryStatus === 'delivered' &&
            orderReview[i].product[j].productReviewed === false
          ) {
            let halfData;
            for (let k in productReview) {
              if (orderReview[i].product[j].productId === productReview[k]._id) {
                halfData = { orderReview: orderReview[i], productReview: productReview[k] };
              }
            }
            for (let k in sellerReview) {
              if (orderReview[i].product[j].sellerId === sellerReview[k]._id) {
                data.push({
                  orderReview: halfData.orderReview,
                  productReview: halfData.productReview,
                  sellerReview: sellerReview[k],
                });
              }
            }
          }
        }
      }

      return data.map((item, key) => (
        <Grid container spacing={24} key={key}>
          <Grid item sm={12} md={12} lg={12}>
            <ProductForReview
              productObject={item.productReview}
              orderObject={item.orderReview}
              sellerObject={item.sellerReview}
            />
          </Grid>
        </Grid>
      ));
    } else {
      return (
        <Grid container spacing={24}>
          <Grid item sm={12} md={12} lg={12}>
            <p className='text-dark m-5'>No products to review!</p>
          </Grid>
        </Grid>
      );
    }
  };

  displayHistoryData = () => {
    const { productReviewHistory } = this.state;

    if (productReviewHistory.length > 0) {
      return productReviewHistory.map((item, key) => (
        <li className='review-history' key={item._id}>
          <p className='text-secondary mb-1'>Purchased on {this.styleDate(item.order.date)}</p>
          <p className='mb-0'>Your product rating & review: </p>
          <div className='d-flex flex-row mt-1'>
            <div className='img-div'>
              <img
                src={`data:image/png;base64,${item.product.productImage[0].buffer}`}
                alt='product'
              />
            </div>
            <div className='review-div'>
              <p className='mb-0'>{item.product.name}</p>
              <p className='text-secondary mb-0'>
                <span className='mr-1'>{item.product.brand}</span>
                <span>{item.product.model}</span>
              </p>
              <div className='d-flex flex-lg-row flex-md-row flex-sm-column my-2'>
                <div>
                  <StarRatings
                    rating={item.ratings}
                    starRatedColor='#3F51B5'
                    starHoverColor='#5D6164'
                    starDimension='30px'
                    starSpacing='5px'
                    numberOfStars={5}
                    name='rating'
                  />
                </div>
                <div className='ml-2 mt-1'>{this.displayRatingText(item.ratings)}</div>
              </div>
              <div className='review-history-box'>
                <p>{item.review}</p>
              </div>
            </div>
          </div>
        </li>
      ));
    } else {
      return (
        <Grid container spacing={24}>
          <Grid item sm={12} md={12} lg={12}>
            <p className='text-dark m-5'>No reviews in product history!</p>
          </Grid>
        </Grid>
      );
    }
  };

  render() {
    const { classes } = this.props;
    const { loadingReview, loadingHistory } = this.state;
    const { productReview, orderReview, sellerReview } = this.state.productToBeReviewed;
    console.log(this.state.productToBeReviewed);

    return (
      <div className={classes.root}>
        <Header />

        <div className={classes.pageBody}>
          <Grid container spacing={24}>
            <Grid item sm={12} md={10} lg={12} className={classes.TabGrid}>
              <Tabs onChange={this.onChange} defaultSelectedIndex={0}>
                <Tab value='pane-1' label='To Be Reviewed'>
                  {loadingReview ? <Loader /> : this.displayReviewData()}
                </Tab>
                <Tab value='pane-2' label='Reviews History' onActive={this.onActive}>
                  {loadingHistory ? <Loader /> : <ul>{this.displayHistoryData()}</ul>}
                </Tab>
              </Tabs>
            </Grid>
          </Grid>
        </div>

        <Footer />
      </div>
    );
  }
}

Myreviews.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Myreviews);
