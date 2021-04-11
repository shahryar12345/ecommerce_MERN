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


const axios = require('axios');
const { BASE_URL } = require('./../../apibase');


const styles = theme => ({
    card: {
        marginTop: 30
    },
});


const columns = [
    "Name",
    "Brand",
    { name: "Model" },
    { name: "Category", options: { filter: false } },
    { name: "Actions", options: { filter: false, sort: false } },

];

const data = [
    ["Iphone", "Apple", "Iphone X", "Electronics", (<div><Button variant="outlined">Modify Product Status</Button></div>)],


];

const options = {
    filterType: 'checkbox',
    downloadOptions: { filename: 'PendingProducts.csv', separator: ',' },
    selectableRows: false,
    responsive: 'scroll'

};


class PendingProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            open: false,
            selectedProduct: null
        }
    }



    componentDidMount() {
        this.getProducts();

    }

    getProducts() {
        let productsList = [];

        //TODO:Add pagination
        axios.get(BASE_URL + "admin/pendingproducts", { withCredentials: true })
            .then((response) => {

                this.setState({
                    products: response.data
                })

                response.data.map((product, index) => {
                    let productData =
                        [
                            product.name === undefined ? '' : product.name,
                            product.brand === undefined ? '' : product.brand,
                            product.model === undefined ? '' : product.model,
                            product.categoryLevels === undefined || product.categoryLevels.level1 === undefined ? '' : product.categoryLevels.level1,
                            (<div><Button variant="outlined" onClick={() => this.modifyProductStatus(product._id, index)}>Modify Product Status</Button></div>)
                        ];

                    console.log(productData)
                    productsList.push(productData)

                });

                this.setState({
                    data: productsList
                })

            })
            .catch((error) => {
                console.log(error.response);
            })
    }


    modifyProductStatus = (productId, index) => {
        console.log(productId + "  " + index);

        this.setState({ open: true, selectedProduct: this.state.products[index] },
            () => {
                console.log(this.state.selectedProduct)

            });
    }

    handleClose = (status) => {
        this.setState({ open: false });
        console.log(status);
        if (status === 'approve') {
            this.approveProduct();
        }
        else if (status === 'reject') {
            this.rejectProduct();
        }
    };

    approveProduct = () => {
        const json = {
            productId: this.state.selectedProduct._id
        }
        console.log(json);


        axios.post(BASE_URL + "admin/productapprove", json, { withCredentials: true })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error.response);
            })
            .then(() => {
                this.setState({
                    selectedProduct: null,
                })
                this.getProducts();

            })

    }


    rejectProduct = () => {
        const json = {
            productId: this.state.selectedProduct._id
        }
        console.log(json);

        axios.post(BASE_URL + "admin/productreject", json, { withCredentials: true })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error.response);
            })
            .then(() => {
                this.setState({
                    selectedProduct: null,
                })
                this.getProducts();

            })
    }


    render() {
        const { classes, fullScreen } = this.props;
        const { selectedProduct } = this.state;
        return (
            <div className="root">
                <Typography variant="h5" align="left" className={classes.pageTitle}>
                    Pending Products
                    </Typography>

                <Grid item sm={12} md={12} lg={12}>

                    <div style={{ margin: 20, marginTop: 30 }}>
                        <MUIDataTable
                            title={"Products Overview"}
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
                    <DialogTitle id="responsive-dialog-title">                            {selectedProduct ? selectedProduct.name : ''}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <Typography variant="subheading">
                                Brand:
                            </Typography>
                            {selectedProduct ? selectedProduct.brand : ''}


                            <Typography variant="subheading">
                                Model:
                            </Typography>
                            {selectedProduct ? selectedProduct.model : ''}

                            <Typography variant="subheading">
                                Highlights:
                            </Typography>
                            {selectedProduct ? selectedProduct.highlights : ''}

                            <Typography variant="subheading">
                                Description:
                            </Typography>
                            {selectedProduct ? selectedProduct.description : ''}


                            <Typography variant="subheading">
                                Warranty Type:
                            </Typography>
                            {selectedProduct ? selectedProduct.warantyType : ''}


                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.handleClose("reject")} color="primary">
                            Reject Product
            </Button>
                        <Button onClick={() => this.handleClose("approve")} color="primary" autoFocus>
                            Approve Product
            </Button>
                    </DialogActions>
                </Dialog>


            </div>
        )
    }
}


PendingProducts.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    fullScreen: PropTypes.bool.isRequired,

};

export default withStyles(styles)(PendingProducts);
