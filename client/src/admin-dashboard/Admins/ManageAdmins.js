import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import MUIDataTable from "mui-datatables";
import { Button } from '@material-ui/core';
const axios = require('axios');
const { BASE_URL } = require('./../../apibase');

const styles = theme => ({
    card: {
        marginTop: 30
    },
});


const columns = [
    "Name",
    "Email",
    "Contact Number",
    { name: "Priviliges", options: { sort: false } },
    { name: "Actions", options: { filter: false, sort: false } },

];



const options = {
    filterType: 'checkbox',
    downloadOptions: { filename: 'AdminsList.csv', separator: ',' },
    selectableRows: false,
    responsive: 'scroll'

};


class ManageAdmins extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }


    componentDidMount() {
        this.getAdmins();

    }

    getAdmins = () => {
        const adminList = [];



        axios.get(BASE_URL + "admin/admins", { withCredentials: true })
            .then((response) => {
                console.log(response);
                response.data.map((admin, index) => {
                    let adminRw = '', sellersRw = '', productRw = '';
                    if (admin.adminCrudPrivilege !== false &&
                        admin.adminCrudPrivilege !== undefined &&
                        admin.adminViewPrivilege !== false &&
                        admin.adminViewPrivilege !== undefined) {
                        adminRw =
                            (admin.adminViewPrivilege ? 'R' : '')
                            +
                            (admin.adminViewPrivilege ? '/W' : '')
                            +
                            " Admins "
                    }


                    if (admin.sellerCrudPrivilege !== false &&
                        admin.sellerCrudPrivilege !== undefined &&
                        admin.sellerViewPrivilege !== false &&
                        admin.sellerViewPrivilege !== undefined) {
                        sellersRw =
                            (admin.sellerViewPrivilege ? 'R' : '')
                            +
                            (admin.sellerViewPrivilege ? '/W' : '')
                            +
                            " Sellers "
                    }


                    if (admin.productCrudPrivilege !== false &&
                        admin.productCrudPrivilege !== undefined &&
                        admin.productViewPrivilege !== false &&
                        admin.productViewPrivilege !== undefined) {
                        productRw =
                            (admin.productViewPrivilege ? 'R' : '')
                            +
                            (admin.productViewPrivilege ? '/W' : '')
                            +
                            " Products"
                    }


                    let adminData =
                        [admin.adminName === undefined ? '' : admin.adminName,
                        admin.email === undefined ? '' : admin.email,
                        admin.phoneNo === undefined ? '' : admin.phoneNo,
                        adminRw + sellersRw + productRw,
                        (<div><Button variant="outlined">Modify Account</Button><br /><br /><Button variant="outlined" color="secondary">Delete Account</Button></div>)
                        ];
                    adminList.push(adminData);
                })
                this.setState({
                    data: adminList
                })
            })
            .catch((error) => {
                console.log(error.response);
            })

    }


    render() {
        const { classes } = this.props;

        return (
            <div className="root">
                <Typography variant="h5" align="left" className={classes.pageTitle}>
                    Manage Admins
                    </Typography>

                <Grid item sm={12} md={12} lg={12}>

                    <div style={{ margin: 20, marginTop: 30 }}>
                        <MUIDataTable
                            title={"Admins Overview"}
                            data={this.state.data}
                            columns={columns}
                            options={options}
                            className={classes.card}
                        />
                    </div>

                </Grid>
            </div>
        )
    }
}


ManageAdmins.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(ManageAdmins);
