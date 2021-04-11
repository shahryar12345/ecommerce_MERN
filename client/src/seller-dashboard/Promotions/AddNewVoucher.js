import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import './../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import { Button } from '@material-ui/core';

import classNames from 'classnames';
import MUIDataTable from "mui-datatables";

import Alert from 'react-s-alert';

const axios = require("axios");
const { BASE_URL } = require("./../../apibase");



const styles = theme => ({

    cardContent: {
        marginLeft: 50,
        marginRight: 50,
        marginBottom: 20,
        [theme.breakpoints.down('md')]: {
            marginLeft: 30,
            marginRight: 30,
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: 20,
            marginRight: 20,
        },
        [theme.breakpoints.down('xs')]: {
            marginLeft: 10,
            marginRight: 10,
        },
    },
    textFieldMulti: {
        marginLeft: 10,
        marginRight: 10
    },
    card: {
        marginTop: 30
    },
    menu: {
        width: 200,
    },
    cardContent2: {
        marginBottom: 0
    },
    buttonType1: {
        backgroundColor: 'rgb(39,44,48)',
        boxShadow: 'none',
        color: 'rgb(236,239,234)',
        '&:hover': {
            backgroundColor: 'rgb(48,54,58)',
        },
        '&:focus': {
            boxShadow: 'none'
        }
    },

    buttonType2: {
        color: 'rgb(39,44,48)',
    },
    hidden: {
        display: 'none'
    }
});

const discount_type = [
    {
        value: 'MVV',
        label: 'Money Value Voucher',
    },
    {
        value: 'PVV',
        label: 'Percentage Value Voucher',
    },

];

const apply_to = [
    {
        value: 'All Items',
        label: 'All Items',
    },
    {
        value: 'SKU',
        label: 'SKU',
    },

];



class AddNewVoucher extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            code: '',
            minimumValue: '0',
            totalVouchers: '0',
            discountValue: '',
            usagePerCustomer: '0',
            minimumDiscount: '0',
            maximumDiscount: '0',
            categoryValue: 'hello',
            inputVariant: 'outlined',
            discountType: 'MVV',
            applyTo: 'All Items',
            response: [
                {
                    "_id": "5ce4617940972b65438b11a2",
                    "email": "test@account.com",
                    "pendingproducts": [
                        {
                            "_id": "5cec9266ba3256035b92ba7f",
                            "dangerousGoods": {
                                "battery": true,
                                "famable": false,
                                "liquid": true
                            },
                            "productImage": [],
                            "name": "sdasd",
                            "brand": "rqwe",
                            "model": "23123",
                            "highlights": "<p>Highlight</p>\n",
                            "description": "<p>Description</p>\n",
                            "whatsInTheBox": "dabba",
                            "packageWeight": 123,
                            "packageDimensions": {
                                "length": 1,
                                "width": 2,
                                "height": 3
                            },
                            "categoryLevels": {
                                "level1": "5c80cceb62d40226d82e295d"
                            },
                            "status": "pending",
                            "sellerId": "5ce4617940972b65438b11a2",
                            "SKU": [],
                            "__v": 0
                        },
                        {
                            "_id": "5cec9363ba3256035b92ba81",
                            "dangerousGoods": {
                                "battery": true,
                                "famable": false,
                                "liquid": true
                            },
                            "productImage": [],
                            "name": "sdasd",
                            "brand": "rqwe",
                            "model": "23123",
                            "highlights": "<p>Highlight</p>\n",
                            "description": "<p>Description</p>\n",
                            "whatsInTheBox": "dabba",
                            "packageWeight": 123,
                            "packageDimensions": {
                                "length": 1,
                                "width": 2,
                                "height": 3
                            },
                            "categoryLevels": {
                                "level1": "5c80cceb62d40226d82e295d"
                            },
                            "status": "pending",
                            "sellerId": "5ce4617940972b65438b11a2",
                            "SKU": [
                                {
                                    "variation": [
                                        {
                                            "Color": "Yellow"
                                        }
                                    ],
                                    "_id": "5cec9363ba3256035b92ba82",
                                    "availability": true,
                                    "price": 6,
                                    "specialPrice": 5,
                                    "quantity": 120
                                }
                            ],
                            "__v": 0
                        },
                        {
                            "_id": "5cec96d9a8cba8052f20465a",
                            "dangerousGoods": {
                                "battery": true,
                                "famable": false,
                                "liquid": false
                            },
                            "productImage": [],
                            "name": "PRODUCT NAME",
                            "brand": "BRAND",
                            "model": "MODEL",
                            "highlights": "<p>Higgghl</p>\n",
                            "description": "<p>Dessccr</p>\n",
                            "whatsInTheBox": "daba",
                            "packageWeight": 3123,
                            "packageDimensions": {
                                "length": 5,
                                "width": 4,
                                "height": 3
                            },
                            "categoryLevels": {
                                "level1": "5c82c6004481154218a2c64c"
                            },
                            "status": "pending",
                            "sellerId": "5ce4617940972b65438b11a2",
                            "SKU": [
                                {
                                    "variation": [
                                        {
                                            "Color": " Blue"
                                        }
                                    ],
                                    "_id": "5cec96d9a8cba8052f20465b",
                                    "availability": true,
                                    "price": 100,
                                    "specialPrice": 99.4,
                                    "quantity": 332
                                }
                            ],
                            "__v": 0
                        },
                        {
                            "_id": "5cec99c8305f860778059d4c",
                            "dangerousGoods": {
                                "battery": false,
                                "famable": false,
                                "liquid": false
                            },
                            "productImage": [],
                            "name": "dsadasd",
                            "brand": "Brands",
                            "model": "Models",
                            "highlights": "<p>highlig</p>\n",
                            "description": "<p>desc</p>\n",
                            "whatsInTheBox": "boxx",
                            "packageWeight": 44,
                            "packageDimensions": {
                                "length": 8,
                                "width": 7,
                                "height": 6
                            },
                            "categoryLevels": {
                                "level1": "5c80cb1562d40226d82e2957"
                            },
                            "status": "pending",
                            "sellerId": "5ce4617940972b65438b11a2",
                            "SKU": [],
                            "__v": 0
                        },
                        {
                            "_id": "5cec9b3070b0ac087d4f69af",
                            "dangerousGoods": {
                                "battery": false,
                                "famable": false,
                                "liquid": true
                            },
                            "productImage": [],
                            "name": "jhjkh",
                            "brand": "brand",
                            "model": "modl",
                            "highlights": "<p>highl</p>\n",
                            "description": "<p>das</p>\n",
                            "whatsInTheBox": "2313",
                            "packageWeight": 423,
                            "packageDimensions": {
                                "length": 4,
                                "width": 4,
                                "height": 4
                            },
                            "categoryLevels": {
                                "level1": "5c80cb1562d40226d82e2957"
                            },
                            "status": "pending",
                            "sellerId": "5ce4617940972b65438b11a2",
                            "SKU": [
                                {
                                    "variation": [
                                        {
                                            "2": "hello"
                                        }
                                    ],
                                    "_id": "5cec9b3070b0ac087d4f69b0",
                                    "availability": true,
                                    "price": 7,
                                    "specialPrice": 6,
                                    "quantity": 14213
                                }
                            ],
                            "__v": 0
                        }
                    ],
                    "products": [],
                    "rejectedproducts": []
                }
            ],
            products: []
        }
    }

    componentDidMount() {
        this.getProducts();
    }

    addVoucher = (selectedSKU) => {
        console.log(selectedSKU)
        let json = {
            name: this.state.name,
            code: this.state.code,
            discountType: this.state.discountType,
            minimumValue: parseInt(this.state.minimumValue),
            totalVouchers: parseInt(this.state.totalVouchers),
            discountValue: parseInt(this.state.discountValue),
            usagePerCustomer: parseInt(this.state.usagePerCustomer),
            applyTo: this.state.applyTo,
            maximumDiscount: parseInt(this.state.maximumDiscount),
            items: selectedSKU
        }

        console.log(json.maximumDiscount)


        console.log(json)

        axios.post(BASE_URL + "seller/voucher/add", json, { withCredentials: true })
            .then(function (response) {
                console.log(response);
                Alert.success(response.data.message, {
                    position: 'top-right',
                    effect: 'slide',
                    offset: 55
                });

            })
            .catch(function (error) {
                console.log(error.response);
                Alert.error(error.response ? error.response.data.message : "Unable to connect with the server, please check your internet connection.", {
                    position: 'top-right',
                    effect: 'slide',
                    offset: 55
                });
            });
    }

    getProducts = () => {
        const arr = [];

        this.state.response[0].products.map((product, index) => {
            console.log(JSON.stringify(product))

            product.SKU.map((sku, index2) => {
                console.log(JSON.stringify(sku))
                let row = [product._id, product.name, product.brand, "", "", "", "", "", ""]
                arr.push(row);
            })

        })

        this.state.response[0].pendingproducts.map((product, index) => {
            console.log(JSON.stringify(product))

            product.SKU.map((sku, index2) => {
                console.log(JSON.stringify(sku))
                let row = [product._id, product.name, product.brand, "", "", "", "", "", ""]
                arr.push(row);
            })

        })
        this.setState({ products: arr })


    }


    handleSelectChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    render() {
        const { classes } = this.props;
        const columns = [{
            name: "id",
            options: {
                display: false,
                filter: false,
                viewColumns: false
            }
        }, "Name", "SKU", "Created", "Retail Price", "Sale Price", "Lowest Price", "Available", "Active"];

        let selectedSKU = []

        const options = {
            filterType: 'checkbox',
            print: false,
            download: false,
            onRowsSelect: (rowsSelected, allRows) => {
                console.log(allRows);
                console.log(this.state.products)
                selectedSKU = []
                allRows.map((row) => {
                    console.log(row.dataIndex + " " + this.state.products[row.dataIndex][0] + " " + this.state.products[row.dataIndex][1])
                    selectedSKU.push(this.state.products[row.dataIndex][0]);
                })
                // this.setState({
                //     selectedSKU: selectedSKU
                // })

            },
            customToolbarSelect: (selectedRows, displayData, setSelectedRows) => {
                return (<div />)
            },
            responsive: 'scroll'
        };

        return (
            <div className="root" >
                <Typography variant="h5" align="left" className={classes.pageTitle}>
                    Add New Voucher
                    </Typography>
                <form>
                    <Grid item sm={12} md={12} lg={12}>
                        <Card className={classes.card}>
                            <CardHeader
                                title="Voucher Details"
                            />
                            <CardContent className={classes.cardContent}>

                                <TextField
                                    id="voucher-name-input"
                                    label="Voucher Name"
                                    // placeholder=""
                                    helperText=""
                                    fullWidth
                                    margin="normal"
                                    variant={this.state.inputVariant}
                                    required
                                    onChange={event => {
                                        this.setState({ name: event.target.value });
                                    }}
                                />

                                <TextField
                                    id="voucher-code-input"
                                    label="Voucher Code"
                                    // placeholder=""
                                    helperText=""
                                    fullWidth
                                    margin="normal"
                                    variant={this.state.inputVariant}
                                    onChange={event => {
                                        this.setState({ code: event.target.value });
                                    }}
                                    required
                                />





                            </CardContent>
                        </Card>




                        <Card className={classes.card}>
                            <CardHeader
                                title="Voucher Settings"
                            />
                            <CardContent className={classes.cardContent}>



                                <Grid container spacing={40}>

                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <TextField
                                            id="discount-type-input"
                                            label="Discount Type"
                                            helperText=""
                                            fullWidth
                                            margin="normal"
                                            variant={this.state.inputVariant}
                                            value={this.state.discountType}
                                            SelectProps={{
                                                MenuProps: {
                                                    className: classes.menu,
                                                },
                                            }}
                                            onChange={this.handleSelectChange('discountType')}
                                            select
                                            required
                                        >
                                            {discount_type.map(option => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>



                                    <Grid item xs={12} sm={6} md={6} lg={6}>

                                        <TextField
                                            id="discount-value-input"
                                            label="Discount Value(off in %) "
                                            helperText=""
                                            variant={this.state.inputVariant}
                                            margin="normal"
                                            type="number"
                                            className={classNames(classes.textField, {
                                                [classes.hidden]: this.state.discountType === "MVV",
                                            })}
                                            onChange={event => {
                                                this.setState({ discountValue: event.target.value });
                                            }}

                                            fullWidth
                                            required
                                        />
                                    </Grid>




                                </Grid>

                                <Grid container spacing={40}>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <TextField
                                            id="discount-value-input"
                                            label="Minimum order value to apply voucher (PKR)"
                                            helperText=""
                                            variant={this.state.inputVariant}
                                            className={classes.textField}
                                            margin="normal"
                                            type="number"
                                            fullWidth
                                            onChange={event => {
                                                this.setState({ minimumValue: event.target.value });
                                            }}
                                        />
                                    </Grid>



                                    <Grid item xs={12} sm={6} md={6} lg={6}>

                                        <TextField
                                            id="discount-value-input"
                                            label="Maximum discount (PKR)"
                                            helperText=""
                                            variant={this.state.inputVariant}
                                            margin="normal"
                                            type="number"

                                            className={classNames(classes.textField, {
                                                [classes.hidden]: this.state.discountType === "MVV",
                                            })}

                                            fullWidth
                                            onChange={event => {
                                                this.setState({ maximumDiscount: event.target.value });
                                            }}
                                        />


                                        <TextField
                                            id="discount-value-input"
                                            label="Discount Value(off in PKR) "
                                            helperText=""
                                            variant={this.state.inputVariant}
                                            margin="normal"
                                            type="number"
                                            className={classNames(classes.textField, {
                                                [classes.hidden]: this.state.discountType !== "MVV",
                                            })}
                                            onChange={event => {
                                                this.setState({ discountValue: event.target.value });
                                            }}
                                            fullWidth
                                            required
                                        />

                                    </Grid>




                                </Grid>




                                <Grid container spacing={40}>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <TextField
                                            id="discount-value-input"
                                            label="Total vouchers to be issued "
                                            helperText=""
                                            variant={this.state.inputVariant}
                                            className={classes.textField}
                                            margin="normal"
                                            type="number"
                                            fullWidth
                                            required
                                            onChange={event => {
                                                this.setState({ totalVouchers: event.target.value });
                                            }}
                                        />
                                    </Grid>



                                    <Grid item xs={12} sm={6} md={6} lg={6}>

                                        <TextField
                                            id="discount-value-input"
                                            label="Usage Limit Per Customer"
                                            helperText=""
                                            variant={this.state.inputVariant}
                                            className={classes.textField}
                                            margin="normal"
                                            type="number"
                                            fullWidth
                                            required
                                            onChange={event => {
                                                this.setState({ usagePerCustomer: event.target.value });
                                            }}
                                        />
                                    </Grid>




                                </Grid>



                                <Grid container spacing={40}>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <TextField
                                            id="discount-type-input"
                                            label="Apply To"
                                            helperText=""
                                            fullWidth
                                            margin="normal"
                                            variant={this.state.inputVariant}
                                            value={this.state.applyTo}
                                            SelectProps={{
                                                MenuProps: {
                                                    className: classes.menu,
                                                },
                                            }}
                                            onChange={this.handleSelectChange('applyTo')}
                                            select
                                            required
                                        >
                                            {apply_to.map(option => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                </Grid>


                            </CardContent>
                        </Card>



                        <Grid container spacing={40}
                            className={classNames({
                                [classes.hidden]: this.state.applyTo !== "SKU",
                            })}
                        >
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <div style={{ margin: 0, marginTop: 30 }}>
                                    <MUIDataTable
                                        title={"Select items to apply voucher to"}
                                        data={this.state.products}
                                        columns={columns}
                                        options={options}
                                        className={classes.card}

                                    />
                                </div>
                            </Grid>

                        </Grid>



                        <Card className={classes.card}>

                            <CardContent className={classes.cardContent2}>

                                <Grid container spacing={40}>
                                    <Grid item sm={4} md={3} lg={3}></Grid>
                                    <Grid item sm={2} md={5} lg={4}></Grid>
                                    <Grid item sm={3} md={2} lg={2} >
                                        <Button variant="outlined" fullWidth className={classes.buttonType2}>Cancel</Button>
                                    </Grid>
                                    <Grid item sm={3} md={2} lg={2} >
                                        <Button variant="contained" fullWidth
                                            onClick={() => this.addVoucher(selectedSKU)}
                                            className={classes.buttonType1}>Submit</Button>
                                    </Grid>
                                </Grid>


                            </CardContent>
                        </Card>


                    </Grid>




                </form>
            </div>
        )
    }
}

//const columns = ["Product Name", "SKU", "Category", "Brand", "Retail Price", "Available Stock"];



AddNewVoucher.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddNewVoucher);