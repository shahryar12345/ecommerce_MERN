import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import MUIDataTable from "mui-datatables";
import { Button } from '@material-ui/core';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';

const axios = require('axios');
const { BASE_URL } = require('./../../apibase');


const styles = theme => ({
    card: {
        marginTop: 30
    },
});


const columns = [
    "Business Name",
    "Seller Name",
    { name: "Business Address", options: { sort: false, filter: false } },
    { name: "ID Information", options: { sort: false, filter: false } },
    { name: "Bank Details", options: { sort: false, filter: false } },
    { name: "Status", options: { sort: false } },
    { name: "Actions", options: { filter: false, sort: false } },

];


const options = {
    filterType: 'checkbox',
    downloadOptions: { filename: 'AdminsList.csv', separator: ',' },
    selectableRows: false,
    responsive: 'scroll'

};


class ManageSellers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            data: [],
            frontImage: '',
            backImage: '',
            sellerData: null
        }

        this.modifyAccount = this.modifyAccount.bind(this);
    }



    componentDidMount() {
        this.getSellers();

    }

    getSellers() {
        let sellersList = [];
        //TODO:Add pagination
        axios.get(BASE_URL + "admin/sellers", { withCredentials: true })
            .then((response) => {
                response.data.map((seller, index) => {
                    let sellerData =
                        [seller.shopName === undefined ? '' : seller.shopName,
                        seller.ownerName === undefined ? '' : seller.ownerName,
                        seller.shopLocation === undefined ? '' : seller.shopLocation,
                        seller.email === undefined ? '' : seller.email,
                        seller.phoneNo === undefined ? '' : seller.phoneNo,
                        seller.status === undefined ? '' : seller.status,
                        (<div><Button variant="outlined" onClick={() => this.modifyAccount(seller.email === undefined ? '' : seller.email)}>Modify Account Status</Button></div>)
                        ];

                    console.log(sellerData)
                    sellersList.push(sellerData)

                });

                this.setState({
                    data: sellersList
                })

            })
            .catch((error) => {
                console.log(error.response);
            })



    }

    modifyAccount = (email) => {
        console.log(email);
        const json = {
            email: email
        }


        axios.post(BASE_URL + "admin/sellers/detail", json, { withCredentials: true })
            .then((response) => {
                console.log(response);
                this.setState(
                    {
                        sellerData: response.data[0],
                        frontImage: response.data[0].idInfo.length > 0 ? "data:" + response.data[0].idInfo[0].idFrntImg.contentType + ";base64," + response.data[0].idInfo[0].idFrntImg.data : '',
                        backImage: response.data[0].idInfo.length > 0 ? "data:" + response.data[0].idInfo[0].idBckImg.contentType + ";base64," + response.data[0].idInfo[0].idBckImg.data : '',
                    },
                    () => { this.setState({ open: true }); console.log(this.state.backImage) })
            })
            .catch((error) => {
                console.log(error);

                console.log(error.response);

            })


    }
    handleClose = (status) => {
        this.setState({ open: false });
        console.log(status);
        if (status === 'approve') {
            this.approveAccount();
        }
        else if (status === 'reject') {
            this.rejectAccount();
        }
    };


    approveAccount = () => {

        const json = {

            email: this.state.sellerData.email

        }
        axios.post(BASE_URL + "admin/pendingsellers/approved", json, { withCredentials: true })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error.response);
            })
            .then(() => {
                this.setState({
                    sellerData: null,
                    frontImage: '',
                    backImage: ''
                })
                this.getSellers();

            })

    }

    rejectAccount = () => {

        const json = {
            email: this.state.sellerData.email
        }
        axios.post(BASE_URL + "admin/pendingsellers/rejected", json, { withCredentials: true })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error.response);
            })
            .then(() => {
                this.setState({
                    sellerData: null,
                    frontImage: '',
                    backImage: ''
                })
                this.getSellers();

            })

    }




    render() {
        const { classes, fullScreen } = this.props;
        const { sellerData } = this.state;

        return (
            <div className="root">
                <Typography variant="h5" align="left" className={classes.pageTitle}>
                    Manage Sellers
                    </Typography>

                <Grid item sm={12} md={12} lg={12}>

                    <div style={{ margin: 20, marginTop: 30 }}>
                        <MUIDataTable
                            title={"Sellers Overview"}
                            data={this.state.data}
                            columns={columns}
                            options={options}
                            className={classes.card}
                        />
                    </div>

                </Grid>



                <Dialog
                    fullScreen={fullScreen}
                    open={this.state.open}
                    onClose={() => this.handleClose("no-action")}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">{sellerData ? sellerData.shopName : ''}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <Typography variant="subheading">
                                Owner Name:
                            </Typography>
                            {sellerData ? sellerData.ownerName : ''}

                            <Typography variant="subheading">
                                Email:
                            </Typography>
                            {sellerData ? sellerData.email : ''}
                            <Typography variant="subheading">
                                Contact Number
                            </Typography>
                            {sellerData ? sellerData.phoneNo : ''}
                            <br />
                            <Typography variant="subheading">
                                ID Details
                            </Typography>
                            Name: {sellerData && sellerData.idInfo[0] ? sellerData.idInfo[0].nameOnId : ''}<br />
                            {/* Add ID Number */}
                            ID Type: {sellerData && sellerData.idInfo[0] ? sellerData.idInfo[0].idType : ''}<br />
                            <img src={sellerData && sellerData.idInfo[0] ? this.state.frontImage : ''} alt="ID Front" width="70%" />
                            <br />
                            <img src={sellerData && sellerData.idInfo[0] ? this.state.backImage : ''} alt="ID Back" width="70%" />

                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.handleClose("reject")} color="primary">
                            Reject Seller
            </Button>
                        <Button onClick={() => this.handleClose("approve")} color="primary" autoFocus>
                            Approve Seller
            </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}


ManageSellers.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    fullScreen: PropTypes.bool.isRequired,

};

export default withStyles(styles)(ManageSellers);
