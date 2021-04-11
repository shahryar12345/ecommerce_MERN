import React, { Component } from 'react';

import StarRatings from 'react-star-ratings';
import Alert from 'react-s-alert';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import Loader from '../components/Common/Loader';

import { BASE_URL } from '../apibase';
import axios from 'axios';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgb(227,231,232)',
  },
  pageBody: {
    margin: 20,
    marginTop: 130,
    marginBottom: 50,
  },
});

class AddReview extends Component {
  state = {
    productRatings: 0,
    sellerRatings: 0,
    productReviewText: '',
    sellerReviewText: '',
    loading: false,
  };

  productRatingChange = (newRating, name) => {
    this.setState({ productRatings: newRating, error: '' });
  };

  sellerRatingChange = (newRating, name) => {
    this.setState({ sellerRatings: newRating, error: '' });
  };

  reviewChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  performValidation = () => {
    const { productRatings, sellerRatings, productReviewText, sellerReviewText } = this.state;
    let error;

    if (productRatings < 1 || sellerRatings < 1) {
      error = 'Please select product and seller ratings by selecting stars!';
      return error;
    }

    if (productReviewText.length < 1 || sellerReviewText.length < 1) {
      error = 'Please provide review text for product and seller!';
      return error;
    }

    if (productReviewText.length < 3 || sellerReviewText.length < 3) {
      error = 'Length of review text must be greater than 3!';
      return error;
    }

    if (
      !productReviewText.replace(/\s/g, '').length ||
      !sellerReviewText.replace(/\s/g, '').length
    ) {
      error = 'Review text must have something!';
      return error;
    }

    return null;
  };

  editOrder = async (productReview, sellerReview) => {
    const { product, order } = this.props.location.state;

    for (let i in order.product) {
      if (order.product[i].productId === product._id) {
        var val = i;
      }
    }

    const editOrder = {
      _id: order._id,
      date: order.date,
      buyerId: order.buyerId,
      addressId: order.addressId,
      product: order.product,
    };

    editOrder.product[val].productReviewed = true;
    editOrder.product[val].productReviewId = productReview._id;
    editOrder.product[val].productReviewDate = new Date(productReview.date);
    editOrder.product[val].sellerReviewed = true;
    editOrder.product[val].sellerReviewId = sellerReview._id;
    editOrder.product[val].sellerReviewDate = new Date(sellerReview.date);

    const res = await axios.post(BASE_URL + 'buyer/place-order', editOrder);
    if (res) {
      console.log(res);
      if (res.data.status === 'success') {
        Alert.success('Review has been added successfully', {
          position: 'top-right',
          effect: 'slide',
          offset: 130,
        });
        this.props.history.push('/buy/myreviews');
      } else {
        this.setState({ loading: false });
      }
    }
  };

  submitReview = async () => {
    const { product, order, seller } = this.props.location.state;
    const { productRatings, productReviewText, sellerRatings, sellerReviewText } = this.state;

    const user = JSON.parse(localStorage.getItem('local-buyer'));

    this.setState({ loading: true });

    if (this.performValidation() !== null) {
      this.setState({ loading: false });
      Alert.error(this.performValidation(), {
        position: 'top-right',
        effect: 'slide',
        offset: 130,
      });
    } else {
      if (user) {
        const newReview = {
          buyerId: user.id,
          productId: product._id,
          sellerId: seller._id,
          orderId: order._id,
          productReview: productReviewText,
          sellerReview: sellerReviewText,
          productRatings: productRatings,
          sellerRatings: sellerRatings,
        };
        console.log(newReview);

        const res = await axios.post(`${BASE_URL}buyer/add-review`, newReview);

        if (res) {
          console.log(res);
          if (res.data.status === 'failed') {
            this.setState({ loading: false });
            Alert.error('Review did not add!', {
              position: 'top-right',
              effect: 'slide',
              offset: 130,
            });
          } else if (res.data.status === 'success') {
            this.editOrder(res.data.productReview, res.data.sellerReview);
          }
        }
      }
    }
  };

  displayRatingText = id => {
    const { productRatings, sellerRatings } = this.state;
    const ratingDetail = ['Poor', 'Average', 'Good', 'Very Good', 'Excellent'];

    if (id === 'product') {
      return <h6>{ratingDetail[productRatings - 1]}</h6>;
    } else if (id === 'seller') {
      return <h6>{ratingDetail[sellerRatings - 1]}</h6>;
    } else {
      return null;
    }
  };

  styleDate = () => {
    const { product, order } = this.props.location.state;

    let styleDate = '';

    for (let i in order.product) {
      if (product._id === order.product[i].productId) {
        var deliverDate = order.product[i].deliveryDate;
      }
    }

    const newDate = new Date(deliverDate);
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
    const { product, order, seller } = this.props.location.state;
    const {
      productRatings,
      sellerRatings,
      productReviewText,
      sellerReviewText,
      loading,
    } = this.state;
    console.log(order, product, seller);

    return (
      <div className={classes.root}>
        <Header />

        {loading ? (
          <div className='loading'>
            <Loader />
          </div>
        ) : null}

        <div className={classes.pageBody}>
          <div className='container'>
            <Typography variant='h5' align='left' className='mb-2'>
              Write Review
            </Typography>

            <div className='add-review'>
              <p className='text-secondary'>Delivered on {this.styleDate()}</p>
              <p>Rate and review purchased product:</p>
              <div className='product-div'>
                <div className='img-div mr-4'>
                  <img src={`data:image/png;base64,${product.productImage[0].buffer}`} />
                </div>

                <div className='desc-div'>
                  <p>{product.name}</p>
                  <p className='text-secondary'>
                    <span className='mr-2'>{product.brand}</span>
                    <span>{product.model}</span>
                  </p>

                  <div className='d-flex align-items-center my-2'>
                    <div>
                      <StarRatings
                        rating={productRatings}
                        starRatedColor='#3F51B5'
                        starHoverColor='#5D6164'
                        starDimension='30px'
                        starSpacing='5px'
                        numberOfStars={5}
                        changeRating={this.productRatingChange}
                        name='rating'
                      />
                    </div>
                    <div className='ml-2'>{this.displayRatingText('product')}</div>
                  </div>

                  <div className='d-flex flex-row text-left'>
                    <p className='w-75 mr-auto'>
                      Please share your product experience. Was the product as described? What is
                      the quality like? What did you like or dislike about the product?
                    </p>
                    <a href='#' className='pl-3'>
                      How to write a good review?
                    </a>
                  </div>

                  <div className='input-div w-100'>
                    <div className='form-group'>
                      <textarea
                        className='form-control w-100'
                        id='reviewTextArea'
                        name='productReviewText'
                        value={productReviewText}
                        onChange={this.reviewChange}
                        rows='6'
                        placeholder='What do you think of this product?'></textarea>
                      <input type='file' className='mt-3' />
                    </div>
                  </div>

                  {/* Seller Review */}
                  <div className='seller-review mt-4 text-left'>
                    <p>{seller.shopName}</p>
                    <p className='text-secondary'>
                      <span className='mr-2'>{seller.shopLocation}</span>
                      <span>{seller.phoneNo}</span>
                    </p>
                  </div>

                  <div className='d-flex align-items-center my-2'>
                    <div>
                      <StarRatings
                        rating={sellerRatings}
                        starRatedColor='#3F51B5'
                        starHoverColor='#5D6164'
                        starDimension='30px'
                        starSpacing='5px'
                        numberOfStars={5}
                        changeRating={this.sellerRatingChange}
                        name='rating'
                      />
                    </div>
                    <div className='ml-2'>{this.displayRatingText('seller')}</div>
                  </div>

                  <div className='input-div w-100'>
                    <div className='form-group'>
                      <textarea
                        className='form-control w-100'
                        id='reviewTextArea'
                        name='sellerReviewText'
                        value={sellerReviewText}
                        onChange={this.reviewChange}
                        rows='5'
                        placeholder='What do you think of this shop?'></textarea>
                    </div>
                  </div>

                  <div className='info-div'>
                    <h5>Important:</h5>
                    <p>Maximum 6 images can be uploaded.</p>
                    <p>
                      <span>-</span>
                      <span>Image size can be maximum 5mb.</span>
                    </p>
                    <p>
                      <span>-</span>
                      <span>It takes upto 24 hours for the image to be reviewed.</span>
                    </p>
                    <p>
                      <span>-</span>Please ensure you meet these
                      <a href='#' className='mx-1'>
                        Community Guideline
                      </a>
                      before uploading images.<span></span>
                    </p>
                  </div>

                  <button className='btn btn-block btn-dark my-3' onClick={this.submitReview}>
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(AddReview);
