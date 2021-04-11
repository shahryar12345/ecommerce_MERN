import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import MUIDataTable from 'mui-datatables';
const axios = require('axios');
const { BASE_URL } = require('./../../apibase');

const styles = theme => ({
  card: {
    marginTop: 30,
  },
});

const columns = [
  'Business Name',
  'Owner Name',
  'Email',
  'Contact Number',
  { name: 'Location', options: { sort: false } },
  { name: 'Status', options: { sort: false } },
];

const options = {
  filterType: 'checkbox',
  downloadOptions: { filename: 'SellersList.csv', separator: ',' },
  selectableRows: false,
  responsive: 'scroll',
};

class ViewSellers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    this.getSellers();
  }

  getSellers() {
    let sellersList = [];
    //TODO:Add pagination
    axios
      .get(BASE_URL + 'admin/sellers', { withCredentials: true })
      .then(response => {
        response.data.map((seller, index) => {
          let sellerData = [
            seller.shopName === undefined ? '' : seller.shopName,
            seller.ownerName === undefined ? '' : seller.ownerName,
            seller.email === undefined ? '' : seller.email,
            seller.phoneNo === undefined ? '' : seller.phoneNo,
            seller.shopLocation === undefined ? '' : seller.shopLocation,
            seller.status === undefined ? '' : seller.status,
          ];

          console.log(sellerData);
          sellersList.push(sellerData);
        });

        this.setState({
          data: sellersList,
        });
      })
      .catch(error => {
        console.log(error.response);
      });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className='root'>
        <Typography variant='h5' align='left' className={classes.pageTitle}>
          View Sellers
        </Typography>

        <Grid item sm={12} md={12} lg={12}>
          <div style={{ margin: 20, marginTop: 30 }}>
            <MUIDataTable
              title={'Sellers Overview'}
              data={this.state.data}
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

ViewSellers.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(ViewSellers);
