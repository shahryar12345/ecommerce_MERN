import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import MUIDataTable from 'mui-datatables';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import axios from 'axios';

const { BASE_URL } = require('../../apibase');

const styles = theme => ({
  card: {
    marginTop: 30,
    cursor: 'pointer',
  },
});

class ManageOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headCells: [
        'Order ID',
        'Order Date',
        { name: 'Payment Method', options: { sort: false } },
        'Selling Price/Unit',
        'Unit(s)',
        'Total Price',
        { name: 'Status', options: { sort: false } },
      ],
      options: {
        filterType: 'checkbox',
        downloadOptions: { filename: 'OrderReviews.csv', separator: ',' },
        selectableRows: 'none',
        responsive: 'scrollMaxHeight',
        onRowClick: element => this.rowClick(element),
      },
      orders: [],
    };
  }

  componentDidMount() {
    this.getSellerOrders();
  }

  rowClick = row => {
    const { orders } = this.state;
    let sendOrder = orders.find(item => item._id === row[0]);
    let totalPrice = 0;

    if (sendOrder) {
      for (let i in this.getArrayBasedOrders()) {
        if (this.getArrayBasedOrders()[i][0] === row[0]) {
          totalPrice = this.getArrayBasedOrders()[i][5];
        }
      }

      sendOrder.subTotal = totalPrice;

      this.props.history.push({
        pathname: `/sell/orders/manage/${row[0]}`,
        state: { order: sendOrder },
      });
    }
  };

  getSellerOrders = async () => {
    let user = localStorage.getItem('local-seller_temp');
    user = JSON.parse(user);
    if (user) {
      //const res = await axios.get(`${BASE_URL}seller/seller-orders?sellerId=5d9e1e023ab1262b18ed566d`,);
      const res = await axios.get(`${BASE_URL}seller/seller-orders?sellerId=${user.id}`);

      if (res) {
        console.log(res);
        if (!res.data.status) {
          this.setState({ orders: res.data });
        }
      }
    }
  };

  getArrayBasedOrders = () => {
    const { orders } = this.state;
    let modifiedData = [];

    if (orders.length > 0) {
      for (let i in orders) {
        let totalPrice = 0,
          status = 'Pending',
          singleData = [];

        for (let j in orders[i].product) {
          totalPrice += parseInt(orders[i].product[j].productPrice * orders[i].product[j].quantity);
        }

        if (
          orders[i].product.every((val, a, arr) => val.deliveryStatus === arr[0].deliveryStatus)
        ) {
          if (orders[i].product[0].deliveryStatus === 'delivered') {
            status = 'Delivered';
          }
        }

        singleData.push(
          orders[i]._id,
          orders[i].date.substring(0, 10),
          'Cash on Delivery',
          342,
          3,
          totalPrice,
          status,
        );

        modifiedData.push(singleData);
      }
      return modifiedData;
    }
  };

  render() {
    const { classes } = this.props;
    const { headCells, options } = this.state;

    return (
      <div>
        <Typography variant='h5' align='left' className={classes.pageTitle}>
          Orders Overview
        </Typography>

        <Grid item sm={12} md={12} lg={12}>
          <div style={{ margin: 20, marginTop: 30 }}>
            <MUIDataTable
              title={''}
              data={this.getArrayBasedOrders()}
              columns={headCells}
              options={options}
              className={classes.card}
            />
          </div>
        </Grid>
      </div>
    );
  }
}

ManageOrders.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

// export default withStyles(styles, { withTheme: true })(ManageOrders);
export default withRouter(withStyles(styles, { withTheme: true })(ManageOrders));

// import React, { Component } from 'react';
// import { withRouter, Link } from 'react-router-dom';
// import PropTypes from 'prop-types';

// import { withStyles } from '@material-ui/core/styles';
// import MUIDataTable from 'mui-datatables';
// import Typography from '@material-ui/core/Typography';
// import Grid from '@material-ui/core/Grid';
// import { Button } from '@material-ui/core';

// import EachOrder from './EachOrder';

// import axios from 'axios';

// const { BASE_URL } = require('../../apibase');
// const baseURL = '/sell/';

// const styles = theme => ({
//   card: {
//     marginTop: 30,
//     cursor: 'pointer',
//   },
// });

// class ManageOrders extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       headCells: [
//         'Order ID',
//         'Order Date',
//         { name: 'Payment Method', options: { sort: false } },
//         'Selling Price/Unit',
//         'Unit(s)',
//         'Total Price',
//         { name: 'Status', options: { sort: false } },
//       ],
//       options: {
//         filterType: 'checkbox',
//         downloadOptions: { filename: 'OrderReviews.csv', separator: ',' },
//         selectableRows: 'none',
//         responsive: 'scrollMaxHeight',
//         onRowClick: element => this.rowClick(element),
//       },
//       orders: [],
//     };
//   }

//   componentDidMount() {
//     this.getSellerOrders();
//   }

//   rowClick = row => {
//     const { orders } = this.state;
//     let sendOrder = orders.find(item => item._id === row[0]);
//     let totalPrice = 0;

//     if (sendOrder) {
//       for (let i in this.getArrayBasedOrders()) {
//         if (this.getArrayBasedOrders()[i][0] === row[0]) {
//           totalPrice = this.getArrayBasedOrders()[i][5];
//         }
//       }

//       sendOrder.subTotal = totalPrice;

//       this.props.history.push({
//         pathname: `/sell/orders/manage/${row[0]}`,
//         state: { order: sendOrder },
//       });
//     }
//   };

//   getSellerOrders = async () => {
//     let user = localStorage.getItem('local-buyer');
//     user = JSON.parse(user);
//     if (user) {
//       const res = await axios.get(
//         `${BASE_URL}seller/seller-orders?sellerId=5d9e1e023ab1262b18ed566d`,
//       );

//       if (res) {
//         if (!res.data.status) {
//           this.setState({ orders: res.data });
//         }
//       }
//     }
//   };

//   getArrayBasedOrders = () => {
//     const { orders } = this.state;
//     let modifiedData = [];

//     if (orders.length > 0) {
//       for (let i in orders) {
//         let totalPrice = 0,
//           singleData = [];
//         for (let j in orders[i].product) {
//           totalPrice += parseInt(orders[i].product[j].productPrice * orders[i].product[j].quantity);
//         }
//         singleData.push(
//           orders[i]._id,
//           orders[i].date.substring(0, 10),
//           'Cash on Delivery',
//           342,
//           3,
//           totalPrice,
//           'Pending',
//         );

//         modifiedData.push(singleData);
//       }
//       return modifiedData;
//     }
//   };

//   render() {
//     const { classes } = this.props;
//     const { headCells, options, orders } = this.state;

//     return (
//       <div>
//         <Typography variant='h5' align='left' className={classes.pageTitle}>
//           Orders Overview
//         </Typography>

//         <Grid item sm={12} md={12} lg={12}>
//           <div style={{ margin: 20, marginTop: 30 }}>
//             <MUIDataTable
//               title={''}
//               data={this.getArrayBasedOrders()}
//               columns={headCells}
//               options={options}
//               className={classes.card}
//             />
//           </div>
//         </Grid>
//       </div>
//     );
//   }
// }

// ManageOrders.propTypes = {
//   classes: PropTypes.object.isRequired,
//   theme: PropTypes.object.isRequired,
// };

// // export default withStyles(styles, { withTheme: true })(ManageOrders);
// export default withRouter(withStyles(styles, { withTheme: true })(ManageOrders));
