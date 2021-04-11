import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Link } from 'react-router-dom';
import classNames from 'classnames';
import Check from '@material-ui/icons/CheckOutlined';

const styles = theme => ({
  cardInner: {
    padding: 0,
  },
  cardHeader: {
    backgroundColor: 'rgb(245,245,245)',
    color: 'rgb(53,60,66)',
    padding: 3,
  },
  cardHeaderCurrent: {
    backgroundColor: 'rgb(237,238,250)',
    color: 'rgb(30,67,89)',
    padding: 3,
  },

  cardContent: {
    paddingTop: 12,
    fontSize: 14,
    paddingLeft: 10,
    paddingRight: 10,
  },
  cardHeaderDescription: {
    paddingTop: 10,
  },
  gridItem: {
    padding: 70,

    [theme.breakpoints.down('lg')]: {
      padding: 35,
    },
    [theme.breakpoints.down('md')]: {
      padding: 20,
    },
    [theme.breakpoints.down('sm')]: {
      padding: 10,
      paddingTop: 15,
    },
    paddingTop: 30,
    paddingBottom: 20,
  },
  checkIcon: {
    color: 'rgba(76,175,80)',
    fontSize: 18,
    paddingLeft: 5,
  },
});

class ApprovalTodo extends Component {
  render() {
    const { classes } = this.props;

    return (
      <Grid item sm={3} md={3} lg={3} className={classes.gridItem}>
        <Link to={this.props.redirectURL} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Card>
            <CardContent className={classes.cardInner}>
              <Typography
                variant='subheading'
                className={classNames({
                  [classes.cardHeader]: !this.props.current,
                  [classes.cardHeaderCurrent]: this.props.current,
                })}>
                {this.props.icon} {this.props.heading}
                {this.props.done ? (
                  <Check className={classes.checkIcon} />
                ) : (
                  <span style={{ display: 'none' }}>To be done</span>
                )}
              </Typography>
              <Typography variant='body1' className={classes.cardContent}>
                {this.props.content}
              </Typography>
            </CardContent>
          </Card>
        </Link>
      </Grid>
    );
  }
}
ApprovalTodo.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(ApprovalTodo);
