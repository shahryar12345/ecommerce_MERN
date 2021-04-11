import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  paperCustom: {
    borderRadius: 0,
    marginTop: 10,
    backgroundColor: 'rgb(232, 231, 230)',
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
  buttonType2: {
    color: 'rgb(39,44,48)',
    borderRadius: 0,
    borderWidth: 3,
    borderColor: 'rgb(39,44,48)',
    marginTop: 30,
  },
  productName: {
    color: 'black',
    marginTop: 30,
    marginLeft: -15,
  },
  productImage: {
    margin: 15,
    marginLeft: 20,
    marginRight: 0,
  },
});

class ProductForReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: this.props.productObject, // contains single product object
      order: this.props.orderObject,
      seller: this.props.sellerObject,
    };
  }

  render() {
    const { classes } = this.props;
    const { product, order, seller } = this.state;

    return (
      <Paper className={classes.paperCustom}>
        <Grid container spacing={0}>
          <Grid item sm={12} md={4} lg={2} className={classes.productImage}>
            <img
              style={{ width: 80, height: 80 }}
              src={`data:image/png;base64,${product ? product.productImage[0].buffer : ''}`}
              alt='product'
            />
          </Grid>
          <Grid item sm={12} md={4} lg={6} className={classes.productName}>
            <Grid container spacing={0}>
              <Grid item sm={12} md={12} lg={12}>
                {product ? product.name : 'No name of Product'}
              </Grid>
              <Grid item sm={12} md={12} lg={12}>
                <Typography
                  align='justify'
                  style={{ paddingRight: 35 }}
                  dangerouslySetInnerHTML={{
                    __html: product ? product.description : 'No description of Product',
                  }}></Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={12} md={3} lg={3}>
            <Link
              to={{
                pathname: `/buy/add-review/${product._id}`,
                state: { product, order, seller },
              }}>
              <Button variant='outlined' className={classes.buttonType2}>
                Review Product
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

ProductForReview.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(ProductForReview);
