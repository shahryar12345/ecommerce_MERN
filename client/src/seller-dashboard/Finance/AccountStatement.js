import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import MUIDataTable from 'mui-datatables';

const styles = theme => ({
  card: {
    marginTop: 30,
  },
});

const columns = [
  'Transaction Date',
  'Transaction Type',
  'Transaction Number',
  { name: 'Seller SKU' },
  'Amount',
  'Order No.',
  'Payment Status',
  { name: 'Shipping ID' },
  'Delivery Status',
];

const data = [
  // ["24/2/2019", "Type here", "31231", "98412", 3123, 1234, "Recieved", "XCAS2312", "Delivered"],
  // ["24/2/2019", "Type here", "31231", "98412", 3123, 1234, "Not Recieved", "XCAS2312", "Not Delivered"],
  // ["24/2/2019", "Type here", "31231", "98412", 3123, 1234, "Recieved", "XCAS2312", "Delivered"],
  // ["24/2/2019", "Type here", "31231", "98412", 3123, 1234, "Recieved", "XCAS2312", "Delivered"],
];

const options = {
  filterType: 'checkbox',
  downloadOptions: { filename: 'OrderReviews.csv', separator: ',' },
  selectableRows: false,
  responsive: 'scroll',
};

class AccountStatement extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className='root'>
        <Typography variant='h5' align='left' className={classes.pageTitle}>
          Orders Overview
        </Typography>

        <Grid item sm={12} md={12} lg={12}>
          <div style={{ margin: 20, marginTop: 30 }}>
            <MUIDataTable
              title={''}
              data={data}
              columns={columns}
              options={options}
              className={classes.card}
            />
          </div>
        </Grid>
      </div>
    );
  }
}

AccountStatement.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(AccountStatement);
