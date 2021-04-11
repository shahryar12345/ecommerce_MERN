import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import ShoppingBasket from '@material-ui/icons/ShoppingBasketOutlined';
import Lock from '@material-ui/icons/LockOutlined';
import Money from '@material-ui/icons/MoneyOutlined';
import Check from '@material-ui/icons/CheckBoxOutlined';

import ApprovalTodo from './ApprovalTodo';

const styles = theme => ({
  cardHeaderIcon: {
    fontSize: 18,
    marginRight: 7,
    marginTop: 1,
  },

  cardHeaderDescription: {
    paddingTop: 10,
  },
});

class ApprovalTasks extends Component {
  render() {
    const { classes, sellerData } = this.props;
    console.log('From Approval Task', sellerData);

    return (
      <div>
        <Grid container spacing={40}>
          <Grid item sm={12} md={12} lg={12}>
            <Card className={classes.card}>
              <div className='backgroundSteps'>
                <CardContent className={classes.cardContent}>
                  <Typography variant='body2' className={classes.cardHeaderDescription}>
                    Welcome! Complete the to-do list to start your selling journey!
                  </Typography>
                  <Grid container justify='center'>
                    <ApprovalTodo
                      heading='Start to sell'
                      content='Manage Address Book'
                      redirectURL='/sell/todo/address'
                      icon={<ShoppingBasket className={classes.cardHeaderIcon} />}
                      done={sellerData.sellerAddresses.length > 0 ? true : false}
                      current={sellerData.sellerAddresses.length < 1 ? true : false}
                    />
                    <ApprovalTodo
                      heading='Safeguard your account'
                      content='Verify ID Information'
                      redirectURL='/sell/todo/id'
                      icon={<Lock className={classes.cardHeaderIcon} />}
                      done={sellerData.idInformation.length > 0 ? true : false}
                      current={sellerData.idInformation.length < 1 ? true : false}
                    />
                    <ApprovalTodo
                      heading='To Recieve your money'
                      content='Fill In Bank Information'
                      redirectURL='/sell/todo/bank'
                      icon={<Money className={classes.cardHeaderIcon} />}
                      done={sellerData.bankDetails.length > 0 ? true : false}
                      current={sellerData.bankDetails.length < 1 ? true : false}
                    />
                    <ApprovalTodo
                      heading='Get your account approved'
                      content='Submit Your Account For Approval'
                      redirectURL='/sell/todo/request'
                      icon={<Check className={classes.cardHeaderIcon} />}
                      // done={this.props.stepsToDo > 3 ? true : false}
                      // current={this.props.stepsToDo === 3 ? true : false}
                    />
                  </Grid>
                </CardContent>
              </div>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }
}

ApprovalTasks.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(ApprovalTasks);
