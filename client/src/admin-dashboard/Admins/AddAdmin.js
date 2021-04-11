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
import CheckboxesGroup from '../../components/Dashboard/CheckboxesGroup';
const axios = require('axios');
const { BASE_URL } = require('./../../apibase');

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
    }
});



class AddAdmin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            contactNum: '',
            email: '',
            inputVariant: 'outlined',
            adminCrudPrivilege: true,
            adminViewPrivilege: true,
            productCrudPrivilege: true,
            productViewPrivilege: true,
            sellerCrudPrivilege: true,
            sellerViewPrivilege: true
        }
        this.goBack = this.goBack.bind(this);

    }

    goBack = () => {
        console.log("Go back called")
        this.props.history.goBack();
    }

    handleChange = name => event => {
        this.setState({ [name]: event.target.value });
        //   console.log(name + ':' + event.target.value)
    };


    createAdmin = () => {

        const json = {
            adminName: this.state.name,
            phoneNo: this.state.contactNum,
            email: this.state.email,
            adminCrudPrivilege: this.state.adminCrudPrivilege,
            adminViewPrivilege: this.state.adminViewPrivilege,
            productCrudPrivilege: this.state.productCrudPrivilege,
            productViewPrivilege: this.state.productViewPrivilege,
            sellerCrudPrivilege: this.state.sellerCrudPrivilege,
            sellerViewPrivilege: this.state.sellerViewPrivilege
        }

        console.log("My json:")
        console.log(json);

        axios.post(BASE_URL + "admin/signup", json, { withCredentials: true })
            .then(function (response) {
                console.log(response);
                //redirect to dashboard
            })
            .catch(function (error) {
                console.log(error.response);
            });
    }


    updateCheckboxes(checkboxes) {
        this.setState(checkboxes)
    }


    render() {
        const { classes } = this.props;


        return (
            <div className="root">
                <Typography variant="h5" align="left" className={classes.pageTitle}>
                    Add Admin
                    </Typography>
                <form>
                    <Grid item sm={12} md={12} lg={12}>
                        <Card className={classes.card}>
                            <CardHeader
                                title="Create New Admin"
                            />
                            <CardContent className={classes.cardContent}>



                                <Grid container spacing={40}>
                                    <Grid item xs={6} sm={6} md={6} lg={6}>
                                        <TextField
                                            id="brand-input"
                                            label="Name"
                                            margin="normal"
                                            variant={this.state.inputVariant}
                                            className={classes.textField}
                                            value={this.state.name}
                                            onChange={this.handleChange('name')}
                                            required
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid item xs={6} sm={6} md={6} lg={6}>

                                        <TextField
                                            id="model-input"
                                            label="Contact Number"
                                            type="number"
                                            margin="normal"
                                            variant={this.state.inputVariant}
                                            className={classes.textField}
                                            value={this.state.contactNum}
                                            onChange={this.handleChange('contactNum')}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>


                                <Grid container spacing={40}>
                                    <Grid item xs={6} sm={6} md={6} lg={6}>
                                        <TextField
                                            id="brand-input"
                                            label="Email"
                                            type="email"
                                            helperText=""
                                            margin="normal"
                                            variant={this.state.inputVariant}
                                            className={classes.textField}
                                            value={this.state.email}
                                            onChange={this.handleChange('email')}
                                            required
                                            fullWidth
                                        />
                                    </Grid>

                                </Grid>
                                <br />
                                <Typography variant="h6" >
                                    User Priveleges
                                    </Typography>


                                <CheckboxesGroup
                                    heading="Admin Privileges"
                                    boxes={[
                                        { id: 'adminViewPrivilege', label: 'Allow user to view all Admins Details', value: true },
                                        { id: 'adminCrudPrivilege', label: 'Allow user to create & modify Admins', value: true },
                                    ]}
                                    updateValues={this.updateCheckboxes.bind(this)}
                                />


                                <CheckboxesGroup
                                    heading="Seller Privileges"

                                    boxes={[
                                        { id: 'sellerViewPrivilege', label: 'Allow user to view all Sellers Details', value: true },
                                        { id: 'sellerCrudPrivilege', label: 'Allow user to manage Sellers', value: true },

                                    ]}
                                    updateValues={this.updateCheckboxes.bind(this)}
                                />


                                <CheckboxesGroup
                                    heading="Products Privileges"

                                    boxes={[
                                        { id: 'productViewPrivilege', label: 'Allow user to view all Products Details', value: true },
                                        { id: 'productCrudPrivilege', label: 'Allow user to manage Products', value: true },

                                    ]}
                                    updateValues={this.updateCheckboxes.bind(this)}
                                />


                            </CardContent>
                        </Card>







                        <Card className={classes.card}>

                            <CardContent className={classes.cardContent2}>

                                <Grid container spacing={40}>
                                    <Grid item sm={6} md={8} lg={7}></Grid>
                                    <Grid item sm={3} md={2} lg={2} >
                                        {/* TODO: Add back code react router */}
                                        <Button
                                            onClick={this.goBack}
                                            variant="outlined" fullWidth className={classes.buttonType2}>Cancel</Button>
                                    </Grid>
                                    <Grid item sm={3} md={2} lg={2} >
                                        <Button variant="contained" fullWidth className={classes.buttonType1} onClick={this.createAdmin}>Create Admin</Button>
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

AddAdmin.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddAdmin);