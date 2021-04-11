import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import MUIDataTable from 'mui-datatables';

import Loader from '../../components/Common/Loader';

import axios from 'axios';
import { BASE_URL } from './../../apibase';

const styles = theme => ({
  card: {
    marginTop: 30,
  },
});

const columns = ['Rank', 'Shop Name', 'Points'];

const options = {
  filterType: 'checkbox',
  selectableRows: 'none',
  responsive: 'scrollMaxHeight',
  download: 'none',
  print: 'none',
};

class Rank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      rank: 0,
      sellerData: null,
      response: [
        // {
        //     "points": 70,
        //     "productsAdded": 0,
        //     "totalProducts": 0,
        //     "_id": "5cd48c85aa6ba52264dd1fa6",
        //     "ownerName": "Usama",
        //     "email": "cs142003@dsu.edu.pk",
        //     "phoneNo": 123344467,
        //     "password": "$2a$10$rKLzu.RmZ1yE1Z2R7IcG6.Cmusn.ZJbjcsMPjg.pt252Uf2tzoKR6",
        //     "accountType": "individual",
        //     "shopName": "Kazim ki dukan",
        //     "shopLocation": "Karachi",
        //     "role": "Seller",
        //     "emailVerified": false,
        //     "verified": false,
        //     "status": "unverified",
        //     "stepsToDo": 0,
        //     "token": "L7xBdvd1bOqTKbA3tvwlZqpexUWhl2",
        //     "priority": 3,
        //     "referralKey": "ae12ca33-b7a9-4158-93b4-2aa73a81bc41",
        //     "__v": 0,
        //     "rank": 1
        // },
        // {
        //     "points": 15,
        //     "productsAdded": 0,
        //     "totalProducts": 0,
        //     "_id": "5c6d870837542a73e0117e4c",
        //     "email": "testSeller@gmail.com",
        //     "phoneNo": 3011234567,
        //     "password": "$2a$10$SH9UtFhRLClhCq5laOI9EuM2uP3hBaB/aca0epMTAo8rgpJV50fGS",
        //     "accountType": "individual",
        //     "shopName": "seller shop",
        //     "shopLocation": "Pakistan",
        //     "role": "Seller",
        //     "__v": 0,
        //     "status": "approved",
        //     "verified": true,
        //     "stepsToDo": 0,
        //     "rank": 2
        // },
        // {
        //     "points": 5,
        //     "productsAdded": 26,
        //     "totalProducts": 26,
        //     "_id": "5cd48d17aa6ba52264dd1fa7",
        //     "ownerName": "Kazim",
        //     "email": "cs142014@dsu.edu.pk",
        //     "phoneNo": 123344467,
        //     "password": "$2a$10$nd/qlZW0iebJKpnodagN0eBGZCJGnDNUKwlFVKlPtvFw4SP7hZfAi",
        //     "accountType": "individual",
        //     "shopName": "Kazim ki dukan",
        //     "shopLocation": "Karachi",
        //     "role": "Seller",
        //     "emailVerified": false,
        //     "verified": true,
        //     "status": "approved",
        //     "stepsToDo": 0,
        //     "token": "kEaFcX2ilDFiiV4vKCkO7RdTrESea5",
        //     "priority": 3,
        //     "referralKey": "7c08a77b-7ce1-45a1-b767-d73095848eae",
        //     "referralBy": "ae12ca33-b7a9-4158-93b4-2aa73a81bc41",
        //     "__v": 0,
        //     "rank": 3
        // },
        // {
        //     "points": 5,
        //     "productsAdded": 0,
        //     "totalProducts": 7,
        //     "_id": "5c780af554faec1954cc5b3f",
        //     "ownerName": "Hassan Tester",
        //     "email": "humen1888@gmail.com",
        //     "phoneNo": 3011234567,
        //     "password": "$2a$10$HgPsN5YcVIwWnEtRB2uPsuXxTedDaOyajqtqsyxSq3rLbqmp4hzvW",
        //     "accountType": "individual",
        //     "shopName": "Humen",
        //     "shopLocation": "Pakistan",
        //     "role": "Seller",
        //     "emailVerified": false,
        //     "verified": false,
        //     "status": "approved",
        //     "stepsToDo": 2,
        //     "token": "e6Yc7YXL6bdax6Cm",
        //     "priority": 3,
        //     "__v": 0,
        //     "rank": 4
        // },
      ],
    };
  }

  componentDidMount() {
    this.getSellerRank();
    // console.log('User rank is');
    // console.log(this.state.rank);
    // axios
    //   .get(BASE_URL + 'preregistration/sellers', { withCredentials: true })
    //   .then(response => {
    //     console.log(response);
    //     this.setState(
    //       {
    //         response: response.data,
    //       },
    //       () => {
    //         //   this.getVouchers();
    //         this.getRank();
    //       },
    //     );
    //   })
    //   .catch(error => {
    //     console.log('Error fetching ranks');
    //     Alert.error(
    //       error.response
    //         ? error.response.data.message
    //         : 'Unable to connect with the server, please check your internet connection.',
    //       {
    //         position: 'top-right',
    //         effect: 'slide',
    //         offset: 55,
    //       },
    //     );
    //     console.log(error);
    //   });

    // this.getUserDetails();
  }

  // getRank = () => {
  //   const arr = [];

  //   this.state.response.map((user, index) => {
  //     let row = [user.rank, user.shopName, user.points];
  //     arr.push(row);
  //   });
  //   console.log(arr);
  //   arr.sort(function(a, b) {
  //     console.log(a);
  //     return a[0] - b[0];
  //   });

  //   this.setState({ data: arr });
  // };

  // getUserDetails = () => {
  //   axios
  //     .get(BASE_URL + 'seller/', { withCredentials: true })
  //     .then(response => {
  //       console.log('Logged user details last');
  //       this.setState({
  //         rank: response.data.rank,
  //       });
  //     })
  //     .catch(error => {
  //       console.log(error.response);
  //       // console.log(error.response.data.statusCode)
  //       //this.props.history.push(`/seller/login`)
  //     });
  // };

  getSellerRank = async () => {
    let user = localStorage.getItem('local-buyer');
    user = JSON.parse(user);
    if (user) {
      const res = await axios.get(
        `${BASE_URL}seller/seller-rank?sellerId=5d9e1e023ab1262b18ed566d`,
      );

      if (res) {
        this.setState({ sellerData: res.data });
      }
    }
  };

  render() {
    const { classes } = this.props;
    const { sellerData } = this.state;

    let data = [[]];
    if (sellerData !== null) {
      data[0].push(sellerData.rank, sellerData.shopName, sellerData.points);
    }

    return (
      <div className='root'>
        <Typography variant='h5' align='left' className={classes.pageTitle}>
          Ranking
        </Typography>

        {sellerData === null ? (
          <Loader />
        ) : (
          <Grid item sm={12} md={12} lg={12}>
            <div style={{ margin: 20, marginTop: 30 }}>
              <MUIDataTable
                title={'Your Rank : ' + sellerData.rank}
                data={data}
                columns={columns}
                options={options}
                className={classes.card}
              />
            </div>
          </Grid>
        )}
      </div>
    );
  }
}

Rank.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Rank);
// export default withStyles(styles)(Rank);
