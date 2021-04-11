import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import ThumbsUp from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbsDown from '@material-ui/icons/ThumbDownAltOutlined';

import StarRatings from 'react-star-ratings';

const styles = theme => ({
  root: {
    padding: 40,
    paddingBottom: 60,
    borderBottomColor: 'rgba(0,0,0,0.3)',
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
  },
  buttonType1: {
    backgroundColor: 'rgb(39,44,48)',
    boxShadow: 'none',
    color: 'rgb(236,239,234)',
    borderRadius: 0,
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
    borderWidth: 3,
    borderColor: 'rgb(39,44,48)',
  },
});

class CommentCard extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Typography body align='justify'>
          {this.props.comment}
        </Typography>
        <Typography align='left' style={{ fontSize: 15, marginTop: 12 }}>
          By
          <span style={{ fontWeight: 'bold' }} className='px-1'>
            {this.props.writer}
          </span>
          on
          <span className='pl-1'>{this.props.date}</span>
        </Typography>
        <div style={{ textAlign: 'left', marginTop: '4px', marginBottom: '6px' }}>
          <StarRatings
            rating={this.props.ratings}
            numberOfStars={5}
            starRatedColor='#3F51B5'
            starDimension='22px'
            starSpacing='3px'
            name='rating'
          />
        </div>
        {/* <Typography align='left' style={{ marginTop: 1, marginBottom: 3 }}>
          <img
            src='https://cdn4.iconfinder.com/data/icons/finance-banking-2/32/star2-512.png'
            style={{ height: 16, marginTop: 2 }}
          />
          <img
            src='https://cdn4.iconfinder.com/data/icons/finance-banking-2/32/star2-512.png'
            style={{ height: 16, marginTop: 2 }}
          />
          <img
            src='https://cdn4.iconfinder.com/data/icons/finance-banking-2/32/star2-512.png'
            style={{ height: 16, marginTop: 2 }}
          />
          <img
            src='https://cdn4.iconfinder.com/data/icons/finance-banking-2/32/star2-512.png'
            style={{ height: 16, marginTop: 2 }}
          />
          <img
            src='https://cdn4.iconfinder.com/data/icons/finance-banking-2/32/star2-512.png'
            style={{ height: 16, marginTop: 2 }}
          />
        </Typography> */}

        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Button variant='contained' className={classes.buttonType1} style={{ marginRight: 10 }}>
            <ThumbsUp style={{ paddingRight: 5 }} />
            Helpful
          </Button>

          <Button variant='outlined' className={classes.buttonType2}>
            <ThumbsDown style={{ paddingRight: 5 }} />
            Not Helpful
          </Button>
        </div>
      </div>
    );
  }
}

CommentCard.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(CommentCard);
