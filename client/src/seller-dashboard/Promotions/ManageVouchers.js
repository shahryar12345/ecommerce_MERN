import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import MUIDataTable from "mui-datatables";
import { Button } from '@material-ui/core';

import Alert from 'react-s-alert';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import TextField from '@material-ui/core/TextField';
import classNames from 'classnames';
import MenuItem from '@material-ui/core/MenuItem';



import { Twitter, Facebook, Tumblr, Pinterest, Linkedin, Whatsapp } from 'react-social-sharing'


const axios = require("axios");
const { BASE_URL } = require("./../../apibase");


const styles = theme => ({
    card: {
        marginTop: 30
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
    hidden: {
        display: 'none'
    }
});


const columns =
    [{
        name: "Seller ID",
        options: {
            display: false,
            filter: false,
            viewColumns: false
        }
    },
    {
        name: "Voucher ID",
        options: {
            display: false,
            filter: false,
            viewColumns: false
        }
    },
        "Voucher Name",
        "Voucher Code",
        "Applied to",
        "Discount (off)",
        "Status",
    { name: "Actions", options: { filter: false, sort: false } },
    { name: "Fast Share", options: { filter: false, sort: false } }
    ];



const options = {
    filterType: 'checkbox',
    downloadOptions: { filename: 'OrderReviews.csv', separator: ',' },
    selectableRows: false,
    responsive: 'scroll'

};


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

let deepDiffMapper = function () {
    return {
        VALUE_CREATED: 'created',
        VALUE_UPDATED: 'updated',
        VALUE_DELETED: 'deleted',
        VALUE_UNCHANGED: 'unchanged',
        map: function (obj1, obj2) {
            if (this.isFunction(obj1) || this.isFunction(obj2)) {
                throw 'Invalid argument. Function given, object expected.';
            }
            if (this.isValue(obj1) || this.isValue(obj2)) {
                return {
                    type: this.compareValues(obj1, obj2),
                    data: obj1 === undefined ? obj2 : obj1
                };
            }

            var diff = {};
            for (var key in obj1) {
                if (this.isFunction(obj1[key])) {
                    continue;
                }

                var value2 = undefined;
                if (obj2[key] !== undefined) {
                    value2 = obj2[key];
                }

                diff[key] = this.map(obj1[key], value2);
            }
            for (var key in obj2) {
                if (this.isFunction(obj2[key]) || diff[key] !== undefined) {
                    continue;
                }

                diff[key] = this.map(undefined, obj2[key]);
            }

            return diff;

        },
        compareValues: function (value1, value2) {
            if (value1 === value2) {
                return this.VALUE_UNCHANGED;
            }
            if (this.isDate(value1) && this.isDate(value2) && value1.getTime() === value2.getTime()) {
                return this.VALUE_UNCHANGED;
            }
            if (value1 === undefined) {
                return this.VALUE_CREATED;
            }
            if (value2 === undefined) {
                return this.VALUE_DELETED;
            }
            return this.VALUE_UPDATED;
        },
        isFunction: function (x) {
            return Object.prototype.toString.call(x) === '[object Function]';
        },
        isArray: function (x) {
            return Object.prototype.toString.call(x) === '[object Array]';
        },
        isDate: function (x) {
            return Object.prototype.toString.call(x) === '[object Date]';
        },
        isObject: function (x) {
            return Object.prototype.toString.call(x) === '[object Object]';
        },
        isValue: function (x) {
            return !this.isObject(x) && !this.isArray(x);
        }
    }
}();


class ManageVouchers extends Component {

    constructor(props) {
        super(props)
        this.state = {
            applyTo: 'All Items',
            shareModalOpen: false,
            deactivateModalOpen: false,
            editModalOpen: false,
            inputVariant: 'outlined',
            emails: "",
            selectedShareIndex: 0,
            selectedIndex: 0,
            selectedEditIndex: 0,
            rerender: true,
            editName: '',
            editDiscountType: 'MVV',
            editMinimumValue: 0,
            editMaximumDiscount: 0,
            editDiscountValue: 0,
            editTotalVouchers: 0,
            editUsagePerCustomer: 0,
            vouchers: [

            ],
            response: [
                {
                    "items": [],
                    "status": "Active",
                    "_id": "5cf49919e3d1347a8d8540ec",
                    "name": "Voucher Name",
                    "code": "Unique Code",
                    "discountType": "Money Value Voucher",
                    "minimumValue": 123,
                    "totalVouchers": 300,
                    "discountValue": 30,
                    "usagePerCustomer": 5,
                    "applyTo": "All Items",
                    "maximumDiscount": 300,
                    "sellerId": "5ce4617940972b65438b11a2",
                    "__v": 0
                },
                {
                    "items": [],
                    "status": "Inactive",
                    "_id": "5cf4a808cdbc1a8aa689c49d",
                    "name": "Voucher1",
                    "code": "V1-231",
                    "discountType": "MVV",
                    "minimumValue": 1000,
                    "totalVouchers": 10000,
                    "discountValue": 50,
                    "usagePerCustomer": 2,
                    "applyTo": "All Items",
                    "maximumDiscount": 0,
                    "sellerId": "5ce4617940972b65438b11a2",
                    "__v": 0
                },
                {
                    "items": [],
                    "status": "Active",
                    "_id": "5cf4a8bd6b5afd8befb0c409",
                    "name": "MVVV",
                    "code": "MV-1",
                    "discountType": "MVV",
                    "minimumValue": 1000,
                    "totalVouchers": 10000,
                    "discountValue": 100,
                    "usagePerCustomer": 1,
                    "applyTo": "All Items",
                    "maximumDiscount": 0,
                    "sellerId": "5ce4617940972b65438b11a2",
                    "__v": 0
                },
                {
                    "items": [],
                    "status": "Active",
                    "_id": "5cf4a9156b5afd8befb0c40b",
                    "name": "MVVV",
                    "code": "PV-2",
                    "discountType": "PVV",
                    "minimumValue": 1000,
                    "totalVouchers": 10000,
                    "discountValue": 20,
                    "usagePerCustomer": 1,
                    "applyTo": "All Items",
                    "maximumDiscount": 500,
                    "sellerId": "5ce4617940972b65438b11a2",
                    "__v": 0
                },
                {
                    "items": [
                        "5cec9b3070b0ac087d4f69af"
                    ],
                    "status": "Active",
                    "_id": "5cf513a9a22f9b984b573940",
                    "name": "Test",
                    "code": "C121",
                    "discountType": "MVV",
                    "minimumValue": 1000,
                    "totalVouchers": 500,
                    "discountValue": 100,
                    "usagePerCustomer": 1,
                    "applyTo": "SKU",
                    "maximumDiscount": 0,
                    "sellerId": "5ce4617940972b65438b11a2",
                    "__v": 0
                },
                {
                    "items": [
                        "5cec9363ba3256035b92ba81",
                        "5cec96d9a8cba8052f20465a",
                        "5cec9b3070b0ac087d4f69af"
                    ],
                    "status": "Active",
                    "_id": "5cf513cba22f9b984b573941",
                    "name": "Test",
                    "code": "C1212",
                    "discountType": "MVV",
                    "minimumValue": 1000,
                    "totalVouchers": 500,
                    "discountValue": 100,
                    "usagePerCustomer": 1,
                    "applyTo": "SKU",
                    "maximumDiscount": 0,
                    "sellerId": "5ce4617940972b65438b11a2",
                    "__v": 0
                }
            ]
        }

    }

    componentDidMount() {
        axios.get(BASE_URL + "seller/voucher", { withCredentials: true })
            .then((response) => {
                console.log()
                this.setState({
                    response: response.data
                }, () => {
                    this.getVouchers();
                })


            })
            .catch(error => {
                console.log("Error fetching products")
                Alert.error(error.response ? error.response.data.message : "Unable to connect with the server, please check your internet connection.", {
                    position: 'top-right',
                    effect: 'slide',
                    offset: 55
                });
                console.log(error)
            })
        //this.getVouchers();
    }



    getVouchers = () => {
        const arr = [];

        this.state.response.map((voucher, index) => {
            let discountValue = voucher.discountValue.toString() + (voucher.discountType === "MVV" ? " AUD" : "%")

            let row = [voucher.sellerId, voucher._id, voucher.name, voucher.code, voucher.applyTo,
                discountValue,
            voucher.status,
            (<div><Button variant="outlined" onClick={() => this.openEditModal(index)} fullWidth>Edit</Button><span />
                <Button variant="outlined" onClick={() => this.openDeactivateModal(index)} fullWidth>
                    {/* {voucher.status === "Active" ? "Deactivate" : "Activate"} */}
                    Change Status
                </Button></div>),
            (<Button variant="outlined" onClick={() => this.openShareModal(index)}>Click to Share</Button>)
            ];
            arr.push(row);
        })
        console.log(arr)



        this.setState({ vouchers: arr })


    }

    openShareModal = (index) => {
        this.setState({
            shareModalOpen: true,
            selectedShareIndex: index
        })
    }

    closeShareModal = () => {
        this.setState({
            shareModalOpen: false
        })
    }


    openEditModal = (index) => {
        this.setState({
            editModalOpen: true,
            selectedEditIndex: index,
            editDiscountType: this.state.response[this.state.selectedEditIndex].discountType
        }, () => {
            console.log(this.state.editDiscountType)
        })
    }

    closeEditModal = (status) => {
        console.log("edit closed")
        if (status === 'update') {
            console.log("Updatecalled")
            this.setState({
                editModalOpen: false
            })


            console.log("Selected Index is " + this.state.selectedEditIndex);
            console.log(this.state.response[this.state.selectedEditIndex])
            const initialjson = JSON.parse(JSON.stringify(this.state.response[this.state.selectedEditIndex]))
            const json = this.state.response[this.state.selectedEditIndex];


            if (this.state.editName !== "") {
                console.log("Name changed")
                json['name'] = this.state.editName
            }
            if (this.state.editDiscountType !== "") {
                json['discountType'] = this.state.editDiscountType
            }
            if (this.state.editMinimumValue > 0) {
                json['minimumValue'] = this.state.editMinimumValue
            }
            if (this.state.editMaximumDiscount > 0) {
                json['maximumDiscount'] = this.state.editMaximumDiscount
            }
            if (this.state.editDiscountValue > 0) {
                json['discountValue'] = this.state.editDiscountValue
            }
            if (this.state.editTotalVouchers > 0) {
                json['totalVouchers'] = this.state.editTotalVouchers
            }
            if (this.state.editUsagePerCustomer > 0) {
                json['usagePerCustomer'] = this.state.editUsagePerCustomer
            }
            console.log(json)

            var result = deepDiffMapper.map(initialjson, json);
            console.log(result);







            axios.post(BASE_URL + "seller/voucher/edit", json, { withCredentials: true })
                .then((response) => {
                    console.log(response);
                    Alert.success(response.data.message, {
                        position: 'top-right',
                        effect: 'slide',
                        offset: 55
                    });

                    this.setState({
                        editModalOpen: false,
                        editDiscountType: "MVV",
                        editName: "",
                        editMinimumValue: 0,
                        editMaximumDiscount: 0,
                        editDiscountValue: 0,
                        editTotalVouchers: 0,
                        editUsagePerCustomer: 0
                    })
                })
                .catch(error => {
                    console.log(error)
                    Alert.error(error.response ? error.response.data.message : "Unable to connect with the server, please check your internet connection.", {
                        position: 'top-right',
                        effect: 'slide',
                        offset: 55
                    });
                })








        }
        else {
            this.setState({
                editModalOpen: false,
                editDiscountType: "MVV",
                editName: "",
                editMinimumValue: 0,
                editMaximumDiscount: 0,
                editDiscountValue: 0,
                editTotalVouchers: 0,
                editUsagePerCustomer: 0
            })
        }

    }


    openDeactivateModal = (index) => {
        this.setState({
            deactivateModalOpen: true,
            selectedIndex: index
        })
    }

    closeDeactivateModal = (status) => {
        if (status === 'deactivate') {

            console.log(this.state.vouchers[this.state.selectedIndex][6])
            const json = {
                status: this.state.vouchers[this.state.selectedIndex][6] === "Inactive" ? 'Active' : 'Inactive',
                voucherId: this.state.vouchers[this.state.selectedIndex][1]
            }
            console.log(json)

            axios.post(BASE_URL + "seller/voucher/status", json, { withCredentials: true })
                .then((response) => {
                    console.log(response);
                    let voucher = this.state.vouchers;
                    voucher[this.state.selectedIndex][6] = voucher[this.state.selectedIndex][6] === "Inactive" ? 'Active' : 'Inactive'
                    // voucher[this.state.selectedIndex][7] = voucher[this.state.selectedIndex][6] === "Inactive" ?
                    //     (<div><Button variant="outlined" fullWidth>Edit</Button><span />
                    //         <Button variant="outlined" onClick={() => this.openDeactivateModal(this.state.selectedIndex)} fullWidth>
                    //             Activate
                    //         </Button></div>)
                    //     :
                    //     (<div><Button variant="outlined" fullWidth>Edit</Button><span />
                    //         <Button variant="outlined" onClick={() => this.openDeactivateModal(this.state.selectedIndex)} fullWidth>
                    //             Deactivate
                    // </Button></div>)
                    this.setState({
                        vouchers: voucher,
                        rerender: this.state.rerender === true ? false : true
                    }, () => {
                        console.log(this.state.vouchers)
                        // this.forceUpdate();

                    })

                    Alert.success(response.data.message, {
                        position: 'top-right',
                        effect: 'slide',
                        offset: 55
                    });
                })
                .catch((error) => {
                    console.log(error.response);
                    Alert.error(error.response ? error.response.data.message : "Unable to connect with the server, please check your internet connection.", {
                        position: 'top-right',
                        effect: 'slide',
                        offset: 55
                    });
                });

        }
        this.setState({
            deactivateModalOpen: false,
        })
    }

    shareVoucher = () => {
        console.log("Index is " + this.state.selectedShareIndex)
        console.log(this.state.vouchers[this.state.selectedShareIndex][3])
        console.log(this.state.emails)
        console.log("Voucher shared")

        const json = {
            email: this.state.emails,
            code: this.state.vouchers[this.state.selectedShareIndex][3]
        }

        console.log(json)

        axios.post(BASE_URL + "seller/voucher/share", json, { withCredentials: true })
            .then((response) => {
                console.log(response);
                Alert.success(response.data.message, {
                    position: 'top-right',
                    effect: 'slide',
                    offset: 55
                });
                this.setState({
                    emails: ''
                })
                this.closeShareModal();

            })
            .catch(error => {
                console.log(error)
                Alert.error(error.response ? error.response.data.message : "Unable to connect with the server, please check your internet connection.", {
                    position: 'top-right',
                    effect: 'slide',
                    offset: 55
                });
            })



    }

    handleSelectChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };





    render() {
        const { classes, fullScreen } = this.props;
        const sellerId = this.state.vouchers.length > 0 ? this.state.vouchers[this.state.selectedShareIndex][0] : "hello"
        const voucherStatus = this.state.vouchers.length > 0 ?
            (this.state.vouchers[this.state.selectedIndex][6] === "Active" ? "Deactivate" : "Activate")
            : "Deactivate"

        let editVoucherObj = this.state.response.length > 0 ? this.state.response[this.state.selectedEditIndex] : null;
        let selectedVoucherCode = this.state.vouchers.length > 0 ? this.state.vouchers[this.state.selectedShareIndex][3] : ""
        selectedVoucherCode = selectedVoucherCode.replace(/\s+/g, '-').toLowerCase();

        return (
            <div className="root">
                <Typography variant="h5" align="left" className={classes.pageTitle}>
                    Voucher List
                    </Typography>

                <Grid item sm={12} md={12} lg={12}>

                    <div style={{ margin: 20, marginTop: 30 }}>
                        <MUIDataTable
                            title={""}
                            data={this.state.vouchers}
                            columns={columns}
                            options={options}
                            className={classes.card}
                            key={this.state.rerender}
                        />
                    </div>

                </Grid>





                {/* Share Voucher Modal */}
                <Dialog
                    fullScreen={fullScreen}
                    open={this.state.shareModalOpen}
                    onClose={() => this.closeShareModal("no-action")}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">Share Voucher</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {/* <Typography variant="subheading">
                                Enter Email Addresses to share voucher with (seperated by commas)
                            </Typography> */}
                            <TextField
                                id="email-input"
                                label="Email Addressess"
                                helperText="seperated by comma"
                                variant={this.state.inputVariant}
                                fullWidth
                                margin="normal"
                                variant={this.state.inputVariant}
                                onChange={event => {
                                    this.setState({ emails: event.target.value });
                                }}
                                required
                            />
                            <Grid container spacing={40}
                                justify="center"
                                alignItems="center">
                                <Grid item xs={12} sm={10} md={8} lg={5}>
                                    <Button variant="contained" align="center" className={classes.buttonType1} fullWidth onClick={() => this.shareVoucher()}>Share</Button>

                                </Grid>
                            </Grid>
                            <Typography variant="subheading" align="center" style={{ paddingTop: 30 }}>
                                or share on social networks
                            </Typography>
                            <Typography align="center" style={{ paddingLeft: 60, paddingRight: 60 }}>
                                <Twitter solid small message="I am so cool" link={"http://roundcubelabs.com/" + sellerId + "/" + selectedVoucherCode} />
                                <Facebook solid small link={"http://roundcubelabs.com/" + sellerId + "/" + selectedVoucherCode} />
                                <Tumblr solid small link={"http://roundcubelabs.com/" + sellerId + "/" + selectedVoucherCode} />
                                <Pinterest solid small message="I am so cool" link={"http://roundcubelabs.com/" + sellerId + "/" + selectedVoucherCode} />
                                <Linkedin solid small message="I am so cool" link={"http://roundcubelabs.com/" + sellerId + "/" + selectedVoucherCode} />
                                <Whatsapp solid small message="Share on Whatsapp" link={"http://roundcubelabs.com/" + sellerId + "/" + selectedVoucherCode} />
                            </Typography>



                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.closeShareModal()} color="primary" autoFocus>
                            Close
            </Button>
                    </DialogActions>
                </Dialog>




                {/* CHANGE STATUS POPUP */}
                <Dialog
                    fullScreen={fullScreen}
                    open={this.state.deactivateModalOpen}
                    onClose={() => this.closeDeactivateModal("no-action")}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">{voucherStatus} Voucher</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <Typography variant="subheading">
                                Are you sure that you want to {voucherStatus.toLowerCase()} this voucher?
                            </Typography>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.closeDeactivateModal("no-action")} color="primary" autoFocus>
                            No
                        </Button>
                        <Button onClick={() => this.closeDeactivateModal('deactivate')} color="primary" autoFocus>
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>









                {/* Edit Voucher Popup */}
                <Dialog
                    fullScreen={fullScreen}
                    open={this.state.editModalOpen}
                    onClose={() => this.closeEditModal("no-action")}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">Edit Voucher</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <Typography align="center" variant="h6">Voucher Details</Typography>
                            <TextField
                                id="voucher-name-input"
                                label="Voucher Name"
                                // placeholder=""
                                helperText=""
                                fullWidth
                                margin="normal"
                                variant={this.state.inputVariant}
                                required
                                defaultValue={editVoucherObj.name}
                                onChange={event => {
                                    this.setState({ editName: event.target.value });
                                }}
                            />


                            <Typography align="center" variant="h6" style={{ marginTop: 30 }}>Voucher Settings</Typography>

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
                                value={this.state.editDiscountType}
                                onChange={this.handleSelectChange('editDiscountType')}
                                select
                                required
                            >
                                {discount_type.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>



                            <TextField
                                id="discount-value-input"
                                label="Discount Value(off in %) "
                                helperText=""
                                variant={this.state.inputVariant}
                                margin="normal"
                                type="number"
                                className={classNames(classes.textField, {
                                    [classes.hidden]: this.state.editDiscountType === "MVV",
                                })}
                                onChange={event => {
                                    this.setState({ editDiscountValue: event.target.value });
                                }}
                                defaultValue={editVoucherObj.discountValue}
                                fullWidth
                                required
                            />


                            <TextField
                                id="discount-value-input"
                                label="Minimum order value to apply voucher (PKR)"
                                helperText=""
                                variant={this.state.inputVariant}
                                className={classes.textField}
                                margin="normal"
                                type="number"
                                fullWidth
                                defaultValue={editVoucherObj.minimumValue}
                                onChange={event => {
                                    this.setState({ editMinimumValue: event.target.value });
                                }}
                            />


                            <TextField
                                id="discount-value-input"
                                label="Maximum discount (PKR)"
                                helperText=""
                                variant={this.state.inputVariant}
                                margin="normal"
                                type="number"

                                className={classNames(classes.textField, {
                                    [classes.hidden]: this.state.editDiscountType === "MVV",
                                })}
                                defaultValue={editVoucherObj.maximumDiscount}
                                fullWidth
                                onChange={event => {
                                    this.setState({ editMaximumDiscount: event.target.value });
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
                                    [classes.hidden]: this.state.editDiscountType !== "MVV",
                                })}
                                defaultValue={editVoucherObj.discountValue}
                                onChange={event => {
                                    this.setState({ editDiscountValue: event.target.value });
                                }}
                                fullWidth
                                required
                            />
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
                                defaultValue={editVoucherObj.totalVouchers}
                                onChange={event => {
                                    this.setState({ editTotalVouchers: event.target.value });
                                }}
                            />

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

                                defaultValue={editVoucherObj.usagePerCustomer}
                                onChange={event => {
                                    this.setState({ editUsagePerCustomer: event.target.value });
                                }}
                            />


                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.closeEditModal("no-action")} color="primary" autoFocus>
                            Cancel
                        </Button>
                        <Button onClick={() => this.closeEditModal('update')} color="primary" autoFocus>
                            Update
                        </Button>
                    </DialogActions>
                </Dialog>



            </div>
        )
    }
}


ManageVouchers.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(ManageVouchers);
