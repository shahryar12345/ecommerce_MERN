import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
// import Button from '@material-ui/core/Button';

import MUIDataTable from 'mui-datatables';

const styles = theme => ({
  card: {
    marginTop: 30,
  },
});

const columns = [
  'Order No.',
  'Order Date',
  'Order Item Id',
  'Seller SKU',
  'Unit Price',
  'Fees',
  'Payout Amount',
  'Operational Status',
  'Payout Status',
  'Action',
];

const data = [
  // ["1", "23/2/2019", "2", "2312", "1000", "100", "900", "Delivered", "To be received", <Button variant="outlined">Update Delivery Status</Button>],
  // ["1", "23/2/2019", "3", "2312", "1000", "100", "900", "Delivered", "To be received", <Button variant="outlined">Update Delivery Status</Button>],
  // ["1", "23/2/2019", "4", "2312", "1000", "100", "900", "Delivered", "To be received", <Button variant="outlined">Update Delivery Status</Button>],
  // ["1", "23/2/2019", "5", "2312", "1000", "100", "900", "Delivered", "To be received", <Button variant="outlined">Update Delivery Status</Button>],
  // ["1", "23/2/2019", "6", "2312", "1000", "100", "900", "Delivered", "To be received", <Button variant="outlined">Update Delivery Status</Button>],
  // ["1", "23/2/2019", "7", "2312", "1000", "100", "900", "Delivered", "To be received", <Button variant="outlined">Update Delivery Status</Button>],
  // ["1", "23/2/2019", "8", "2312", "1000", "100", "900", "Delivered", "To be received", <Button variant="outlined">Update Delivery Status</Button>],
  // ["2", "23/2/2019", "2", "2312", "1000", "100", "900", "Delivered", "To be received", <Button variant="outlined">Update Delivery Status</Button>],
  // ["2", "23/2/2019", "2", "2312", "1000", "100", "900", "Delivered", "To be received", <Button variant="outlined">Update Delivery Status</Button>],
  // ["2", "23/2/2019", "2", "2312", "1000", "100", "900", "Delivered", "To be received", <Button variant="outlined">Update Delivery Status</Button>],
  // ["2", "23/2/2019", "2", "2312", "1000", "100", "900", "Delivered", "To be received", <Button variant="outlined">Update Delivery Status</Button>],
  // ["2", "23/2/2019", "2", "2312", "1000", "100", "900", "Delivered", "To be received", <Button variant="outlined">Update Delivery Status</Button>],
  // ["2", "23/2/2019", "2", "2312", "1000", "100", "900", "Delivered", "To be received", <Button variant="outlined">Update Delivery Status</Button>],
];

const options = {
  filterType: 'checkbox',
  downloadOptions: { filename: 'OrderOverview.csv', separator: ',' },
  selectableRows: false,
  responsive: 'scroll',
};

class OrderOverview extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className='root'>
        <Typography variant='h5' align='left' className={classes.pageTitle}>
          Order Overview
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

OrderOverview.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrderOverview);
