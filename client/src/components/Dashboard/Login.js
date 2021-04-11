//import 'date-fns';
import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid';
//import React, { Fragment, useState  ,Component} from "react";
//import { DatePicker } from "@material-ui/pickers";
//import DateFnsUtils from '@date-io/date-fns';
//import { MuiPickersUtilsProvider  } from '@material-ui/pickers/MuiPickersUtilsProvider';
//import { KeyboardDatePicker } from '@material-ui/pickers/DatePicker';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import './../../style.css';
import DonutLarge from '@material-ui/icons/DonutLarge'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input'
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Alert from 'react-s-alert';
import MenuItem from '@material-ui/core/MenuItem';

const logo = require('./../../assets/logo.png');



const axios = require('axios');

const { BASE_URL } = require('./../../apibase');



const styles = theme => ({
    registerButton: {
        paddingTop: 17,
        paddingBottom: 17,
        backgroundColor: 'rgba(37,37,37,0.57)',
        borderRadius: 0,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        color: 'white',
        marginBottom: 120,
        '&:hover': {
            backgroundColor: 'rgba(37,37,37,0.57)',

        }
    },
    loginButton: {
        backgroundColor: 'rgb(151,151,152)',
        borderRadius: 0,
        '&:hover': {
            backgroundColor: 'rgb(163,163,164)'
        }

    },
    recoverPass: {
        fontSize: 12,
        marginTop: 10,
        cursor: 'pointer',
        textAlign: 'center'
    },
    inputFields: {
        marginTop: 10,
    },
    input: {
        color: 'white'
    },
    underline: {
        backgroundColor: 'white'
    },
    leftPanel: {
        flex: 1,
        backgroundColor: '#272c30',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    rightPanel: {
        flex: 2,
        backgroundColor: "white",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'auto',
        paddingTop: 50,
        paddingBottom: 50
    },
    buttonType1: {
        backgroundColor: 'rgb(39,44,48)',
        boxShadow: 'none',
        paddingTop: 13,
        paddingBottom: 13,
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
        paddingTop: 13,
        paddingBottom: 13,
    },
    avatar: {
        backgroundColor: 'white',
        alignSelf: 'center',
        width: 60,
        height: 60,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'white'
    },
    buttonType3: {
        backgroundColor: 'white',
        boxShadow: 'none',
        color: '#272c30',
        '&:hover': {
            backgroundColor: 'rgb(250,250,250)',
        },
        '&:focus': {
            boxShadow: 'none'
        }
    },
    paginationCircle: {
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: 'rgba(255,255,255,0.8)',
        height: 10,
        width: 10,
        borderRadius: 5,
        marginTop: 1,
        cursor: 'hand',
        cursor: 'pointer'
    },
    paginationCircleFocus: {

        marginLeft: 10,
        marginRight: 10,
        backgroundColor: 'white',
        height: 12,
        width: 12,
        borderRadius: 6,
        cursor: 'hand',
        cursor: 'pointer'
    },
    pagination: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10
    }

});

const discount_type = [
    {
        value: 'Male',
        label: 'Male',
    },
    {
        value: 'Female',
        label: 'Female',
    },

];



class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputVariant: 'outlined',
            login: true,
            email: '',
            password: '',
            gender : 'Male',
            confirmPassword: '',
            phoneNo: '',
            contactNumber: '',
            accountType: 'Individual',
            shopName: '',
            shopLocation: '',
            name: '',
            abnNumber: '',
            refKey: '',
            width: 0,
            height: 0,
            pagination: [
                {
                    selected: true,
                    content: 'Some Seller Description would be displayed here, Clicking on the pagination below would switch login type to admin or buyer',
                    buttonContent: 'LOGIN AS SELLER',
                    icon: <AssignmentIcon color="primary" />
                },
                {
                    selected: false,
                    content: 'Some Buyer Description would be displayed here, Clicking on the pagination below would switch login type to admin or buyer',
                    buttonContent: 'LOGIN AS BUYER',
                    icon: <AssignmentIcon color="primary" />
                },
                {
                    selected: false,
                    content: 'Some Admin Description would be displayed here, Clicking on the pagination below would switch login type to admin or buyer',
                    buttonContent: 'LOGIN AS ADMIN',
                    icon: <AssignmentIcon color="primary" />
                },
            ],
            selectedPage: 0,
            currentLogin: 'seller',
            isLogin: true
        }

        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);

        setInterval(
            function () {
                let selectedPage = this.state.selectedPage;
                let obj = this.state.pagination;
                obj[selectedPage].selected = false;
                selectedPage++;
                if (selectedPage > 2) {
                    selectedPage = 0;
                }
                obj[selectedPage].selected = true;

                this.setState({
                    pagination: obj,
                    selectedPage: selectedPage
                });
            }
                .bind(this),
            6000
        );
    }


    componentDidMount() {
        let params = new URLSearchParams(this.props.location.search);
        let refKey = params.get('ref');
        console.log(refKey)
        if (refKey !== null) {
            this.setState({
                refKey: refKey
            })
        }

        this.updateWindowDimensions();

        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
        console.log(this.state.height)
    }

    
    

    handleChange(event, varName) {
        console.log(varName)
        //console.log(event.target.name)
        //const value=event.target.name:event.target.value;
        //this.setState(event.target.name:event.target.value)
        //console.log(this.state)
    }


    switchLogin = () => {
        console.log("Function called")
        this.setState({
            currentLogin: this.state.selectedPage == 0 ? 'seller' : this.state.selectedPage == 1 ? 'buyer' : 'admin'
        }, () => {
            console.log(this.state.currentLogin)
        })
    }

    getRegister = () => {
        console.log("Get register form called")
        this.setState({
            isLogin: false
        })
    }

    getLogin = () => {
        console.log("Get login form called")
        this.setState({
            isLogin: true
        })
    }

    loginSeller = () => {

        const json = {
            email: this.state.email,
            password: this.state.password,
        }

        console.log(json)
        console.log("BASE URL IS " + BASE_URL)

        axios.post(BASE_URL + "seller", json, { withCredentials: true })
            .then((response) => {
                console.log(response);
                //redirect to dashboard
                const Logged_user_Detail = 
                {
                    "email" : response.data.data.email , 
                    "Ownername" :  response.data.data.ownerName,
                    "id" : response.data.data._id
                }
                //localStorage.setItem('local-seller_temp' , JSON.stringify(Logged_user_Detail));

                this.props.history.push(`/sell/dashboard`)

            })
            .catch((error) => {
                console.log(error.response);
                Alert.error(error.response ? error.response.data.message : "Unable to connect with the server, please check your internet connection.", {
                    position: 'top-right',
                    effect: 'slide',
                });
            });
    }

    getSellerLogin = () => {
        const { classes } = this.props;

        return (
            <Grid container justify="center" >
                <Grid item sm={12} md={10} lg={8}>
                    <Typography variant="h6" style={{ textAlign: 'left' }} >
                        ALREADY HAVE AN ACCOUNT?
        </Typography>

                    <TextField
                        id="email"
                        label="Email"
                        margin="normal"
                        variant={this.state.inputVariant}
                        className={classes.textField}
                        value={this.state.email}
                        onChange={(event) => this.setState({ email: event.target.value })}

                        required
                        fullWidth
                    />


                    <TextField
                        id="password"
                        label="Password"
                        margin="normal"
                        type="password"
                        variant={this.state.inputVariant}
                        className={classes.textField}
                        value={this.state.password}
                        onChange={(event) => this.setState({ password: event.target.value })}

                        required
                        fullWidth
                    />

                    <Button variant="contained" fullWidth className={classes.buttonType1} onClick={this.loginSeller}>LOGIN</Button>


                    <div style={{ paddingTop: 50 }}>
                        <Typography variant="h6" style={{ textAlign: 'left' }} >
                            NEW TO LASHCART?
            </Typography>
                        <Typography variant="subheading" style={{ textAlign: 'left', marginBottom: 20 }} >
                            Signup now to start selling products on LASHCART
            </Typography>
                        <Button variant="outlined" fullWidth className={classes.buttonType2} onClick={this.getRegister}>
                            CREATE NEW ACCOUNT
            </Button>

                    </div>

                </Grid>
            </Grid>
        )

    }

    getSellerRegister = () => {
        const { classes } = this.props;

        let contentPadding = 35;
        if (this.state.height > 780) {
            contentPadding = 240;
        }
        else if (this.state.height > 730) {
            contentPadding = 280;

        }
        else if (this.state.height > 640) {
            contentPadding = 350;

        }
        else if (this.state.height > 520) {
            contentPadding = 480;

        }
        else if (this.state.height > 420) {
            contentPadding = 570;

        }
        else if (this.state.height > 300) {
            contentPadding = 700;

        }

        console.log(contentPadding)
        console.log("this.state.height - Seller" )
        console.log(this.state.height)


        return (
            <Grid container justify="center" style={{ paddingTop: contentPadding, oveflow: 'auto' }}>
                <Grid item sm={12} md={10} lg={8}>
                    <Typography variant="h6" style={{ textAlign: 'left' }} >
                        NEW TO LASHCART?
        </Typography>


                    <TextField
                        id="name"
                        label="Name"
                        margin="normal"
                        variant={this.state.inputVariant}
                        className={classes.textField}
                        value={this.state.name}
                        onChange={(event) => this.setState({ name: event.target.value })}

                        required
                        fullWidth
                    />


                    <TextField
                        id="shopName"
                        label="Shop Name"
                        margin="normal"
                        variant={this.state.inputVariant}
                        className={classes.textField}
                        value={this.state.shopName}
                        onChange={(event) => this.setState({ shopName: event.target.value })}

                        required
                        fullWidth
                    />


                    <TextField
                        id="shopLocation"
                        label="Shop Location"
                        margin="normal"
                        variant={this.state.inputVariant}
                        className={classes.textField}
                        value={this.state.shopLocation}
                        onChange={(event) => this.setState({ shopLocation: event.target.value })}

                        required
                        fullWidth
                    />

                    <TextField
                        id="abnNumber"
                        label="ABN Number"
                        margin="normal"
                        variant={this.state.inputVariant}
                        className={classes.textField}
                        value={this.state.abnNumber}
                        onChange={(event) => this.setState({ abnNumber: event.target.value })}
                        fullWidth
                    />

                    <TextField
                        id="contactNumber"
                        label="Contact Number"
                        margin="normal"
                        variant={this.state.inputVariant}
                        className={classes.textField}
                        value={this.state.contactNumber}
                        onChange={(event) => this.setState({ contactNumber: event.target.value })}
                        required
                        fullWidth
                    />


                    {/* <TextField
                        id="accountType"
                        label="Account Type"
                        margin="normal"
                        variant={this.state.inputVariant}
                        className={classes.textField}
                        value={this.state.accountType}
                        onChange={(event) => this.setState({ accountType: event.target.value })}

                        required
                        fullWidth
                    /> */}

                    <TextField
                        id="email"
                        label="Email"
                        margin="normal"
                        variant={this.state.inputVariant}
                        className={classes.textField}
                        value={this.state.email}
                        onChange={(event) => this.setState({ email: event.target.value })}

                        required
                        fullWidth
                    />


                    <TextField
                        id="password"
                        label="Password"
                        margin="normal"
                        type="password"
                        variant={this.state.inputVariant}
                        className={classes.textField}
                        value={this.state.password}
                        onChange={(event) => this.setState({ password: event.target.value })}
                        required
                        fullWidth
                    />

                    <TextField
                        id="confirmPassword"
                        label="Confirm Password"
                        margin="normal"
                        type="password"
                        variant={this.state.inputVariant}
                        className={classes.textField}
                        value={this.state.confirmPassword}
                        onChange={(event) => this.setState({ confirmPassword: event.target.value })}
                        required
                        fullWidth
                    />

                    <Button variant="contained" fullWidth className={classes.buttonType1} onClick={this.registerSeller}>CREATE NEW ACCOUNT</Button>


                    <div style={{ paddingTop: 50 }}>
                        <Typography variant="h6" style={{ textAlign: 'left' }} >
                            ALREADY HAVE AN ACCOUNT?
            </Typography>
                        <Typography variant="subheading" style={{ textAlign: 'left', marginBottom: 20 }} >
                            Signin now to start selling products on LASHCART
            </Typography>
                        <Button variant="outlined" fullWidth className={classes.buttonType2} onClick={this.getLogin}>
                            LOGIN
            </Button>

                    </div>

                </Grid>
            </Grid>
        )
    }

    handleSelectChange = gender => event => {
        this.setState({
            [gender]: event.target.value,
        });
    };

    


    registerSeller = () => {

        const json = {
            ownerName: this.state.name,
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            phoneNo: this.state.contactNumber,
            accountType: this.state.accountType,
            shopName: this.state.shopName,
            shopLocation: this.state.shopLocation,
            abnNumber: this.state.abnNumber,
            refKey: this.state.refKey
        }
        //console.log(json);

        axios.post(BASE_URL + "seller/signup", json, { withCredentials: true })
            .then((response) => {
                console.log(response);
                Alert.success(response.data.message, {
                    position: 'top-right',
                    effect: 'slide',
                });
                this.setState({
                    isLogin: true
                })
            })
            .catch((error) => {
                console.log(error);
                console.log(error.status)
                console.log(error.message)

                Alert.error(error.response ? error.response.data.data : "Unable to connect with the server, please check your internet connection.", {
                    position: 'top-right',
                    effect: 'slide',
                });
            });
    }




    getBuyerLogin = () => {
        console.log("Get Buyer login called")
        const { classes } = this.props;

        return (
            <Grid container justify="center" >
                <Grid item sm={12} md={10} lg={8}>
                    <Typography variant="h6" style={{ textAlign: 'left' }} >
                        ALREADY HAVE AN ACCOUNT?(BUYER)
        </Typography>

                    <TextField
                        id="email"
                        label="Email"
                        margin="normal"
                        variant={this.state.inputVariant}
                        className={classes.textField}
                        value={this.state.email}
                        onChange={(event) => this.setState({ email: event.target.value })}
                        required
                        fullWidth
                    />


                    <TextField
                        id="password"
                        label="Password"
                        margin="normal"
                        type="password"
                        variant={this.state.inputVariant}
                        className={classes.textField}
                        value={this.state.password}
                        onChange={(event) => this.setState({ password: event.target.value })}
                        required
                        fullWidth
                    />

                    <Button variant="contained" fullWidth className={classes.buttonType1}  onClick={this.loginBuyer}>LOGIN</Button>


                    <div style={{ paddingTop: 50 }}>
                        <Typography variant="h6" style={{ textAlign: 'left' }} >
                            NEW TO LASHCART?
            </Typography>
                        <Typography variant="subheading" style={{ textAlign: 'left', marginBottom: 20 }} >
                            Signup now to start buying products on LASHCART
            </Typography>
                        <Button variant="outlined" fullWidth className={classes.buttonType2} onClick={this.getRegister}>
                            CREATE NEW ACCOUNT
            </Button>
                    </div>
                </Grid>
            </Grid>
        )
    }
    // SS_CHANGED    
    loginBuyer = () => {

        const json = {
            email: this.state.email,
            password: this.state.password,
        }

        console.log(json)
        console.log("BASE URL IS " + BASE_URL)

        axios.post(BASE_URL + "buyer", json, { withCredentials: true })
            .then((response) => {
                //console.log(response);
                //console.log(response.data.data.fullName);
 
                //redirect to dashboard
                const Logged_user_Detail = 
                {
                    "email" : response.data.data.email , 
                    "name" :  response.data.data.fullName,
                    "id" : response.data.data._id
                }
                localStorage.setItem('local-buyer' , JSON.stringify(Logged_user_Detail));
                //localStorage.setItem('local-buyer-Email' , JSON.stringify(response));
                
                this.props.history.push(`/buy/dashboard`)

            })
            .catch((error) => {
                console.log(error.response);
                Alert.error(error.response ? error.response.data.message : "Unable to connect with the server, please check your internet connection.", {
                    position: 'top-right',
                    effect: 'slide',
                });
            });
    }

    getBuyerRegister = () => {
        console.log("Get Buyer registered called")

        //const [selectedDate, handleDateChange] = useState(new Date());
        // const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));
        //   const handleDateChange = date => {
        //     setSelectedDate(date);
        //     };



        const { classes } = this.props;

        let contentPadding = -500;
        if (this.state.height > 780) {
            contentPadding = 100;
            
        }
        else if (this.state.height > 730) {
            contentPadding = 140;

        }
        else if (this.state.height > 640) {
            contentPadding = 210;

        }
        else if (this.state.height > 520) {
            contentPadding = 340;

        }
        else if (this.state.height > 420) {
            contentPadding = 430;

        }
        else if (this.state.height > 300) {
            contentPadding = 560;

        }
        
        console.log(contentPadding)
        console.log("this.state.height" )
        console.log(this.state.height)
        return (
            <Grid container justify="center"  style={{ paddingTop: contentPadding, oveflow: 'auto'}}>
                <Grid item sm={12} md={10} lg={8}>
                    <Typography variant="h6" style={{ textAlign: 'left'}} >
                        NEW TO LASHCART?
        </Typography>
 
                     <TextField
                        id="name"
                        label="Name"
                        margin="normal"
                        variant={this.state.inputVariant}
                        className={classes.textField}
                        value={this.state.name}
                        onChange={(event) => this.setState({ name: event.target.value })}
                        required
                        fullWidth
                    />

                    <TextField
                        id="contactNumber"
                        label="Contact Number"
                        margin="normal"
                        variant={this.state.inputVariant}
                        className={classes.textField}
                        value={this.state.contactNumber}
                        onChange={(event) => this.setState({ contactNumber: event.target.value })}
                        required
                        fullWidth
                    />
                    <TextField
                                            id="gender-input"
                                            label="Gender"
                                            helperText=""
                                            fullWidth
                                            margin="normal"
                                            variant={this.state.inputVariant}
                                            value={this.state.gender}
                                            SelectProps={{
                                                MenuProps: {
                                                    className: classes.menu,
                                                },
                                            }}
                                            onChange={this.handleSelectChange('gender')}
                                            select
                                            required
                                        >
                                            {discount_type.map(option => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>

                                        {/* <DatePicker
                                            disableFuture
                                            openTo="year"
                                            format="dd/MM/yyyy"
                                            label="Date of birth"
                                            views={["year", "month", "date"]}
                                            value={selectedDate}
                                            onChange={handleDateChange}
                                        /> */}

                                {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                    disableToolbar
                                    variant="inline"
                                    format="MM/dd/yyyy"
                                    margin="normal"
                                    id="date-picker-inline"
                                    label="Date picker inline"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change date',
                                    }}
                                    />
                                </MuiPickersUtilsProvider> */}


                    <TextField
                        id="email"
                        label="Email"
                        margin="normal"
                        variant={this.state.inputVariant}
                        className={classes.textField}
                        value={this.state.email}
                        onChange={(event) => this.setState({ email: event.target.value })}
                        required
                        fullWidth
                    />


                    <TextField
                        id="password"
                        label="Password"
                        margin="normal"
                        type="password"
                        variant={this.state.inputVariant}
                        className={classes.textField}
                        value={this.state.password}
                        onChange={(event) => this.setState({ password: event.target.value })}
                        required
                        fullWidth
                    />

                    <TextField
                        id="confirmPassword"
                        label="Confirm Password"
                        margin="normal"
                        type="password"
                        variant={this.state.inputVariant}
                        className={classes.textField}
                        value={this.state.confirmPassword}
                        onChange={(event) => this.setState({ confirmPassword: event.target.value })}
                        required
                        fullWidth
                    />
                    <Button variant="contained" fullWidth className={classes.buttonType1} onClick={this.regiterBuyer}>CREATE NEW ACCOUNT</Button>
                    

                    <div style={{ paddingTop: 50 }}>
                        <Typography variant="h6" style={{ textAlign: 'left' }} >
                            ALREADY HAVE AN ACCOUNT?
            </Typography>
                        <Typography variant="subheading" style={{ textAlign: 'left', marginBottom: 20 }} >
                            Signin now to start buying products on LASHCART
            </Typography>
                        <Button variant="outlined" fullWidth className={classes.buttonType2} onClick={this.getLogin}>
                            LOGIN
            </Button>

                    </div>

                </Grid>
            </Grid>
        )
    }
    
    regiterBuyer = () => {
        const json = {
            fullName: this.state.name,
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            phoneNo: this.state.contactNumber,
            gender: this.state.gender,
            //refKey: this.state.refKey
        }
        console.log(json);

        axios.post(BASE_URL + "buyer/signup", json, { withCredentials: true })
            .then((response) => {
                console.log(response);
                Alert.success(response.data.message, {
                    position: 'top-right',
                    effect: 'slide',
                });
                this.setState({
                    isLogin: true
                })
            })
            .catch((error) => {
                console.log(error);
                console.log(error.status)
                console.log(error.message)

                Alert.error(error.response ? error.response.data.message : "Unable to connect with the server, please check your internet connection.", {
                    position: 'top-right',
                    effect: 'slide',
                });
            });
    } 
    //SS_CHANGED

    loginAdmin = () => {

        const json = {
            email: this.state.email,
            password: this.state.password,
        }

        console.log(json)
        console.log("BASE URL IS " + BASE_URL)

        axios.post(BASE_URL + "admin", json, { withCredentials: true })
            .then((response) => {
                console.log(response);
                //redirect to dashboard
               
                this.props.history.push(`/admin/dashboard`)

            })
            .catch((error) => {
                
                console.log(error.response);
                Alert.error(error.response ? error.response.data.message : "Unable to connect with the server, please check your internet connection.", {
                    position: 'top-right',
                    effect: 'slide',
                });
            });
    }

    getAdmin = () => {
        console.log("Get Admin called")
        const { classes } = this.props;

        return (
            <Grid container justify="center" >
                <Grid item sm={12} md={10} lg={8}>
                    <Typography variant="h6" style={{ textAlign: 'left' }} >
                        ALREADY HAVE AN ACCOUNT?(ADMIN)
        </Typography>

                    <TextField
                        id="email"
                        label="Email"
                        margin="normal"
                        variant={this.state.inputVariant}
                        className={classes.textField}
                        value={this.state.email}
                        ///onChange={this.handleChange('email')}
                        onChange={(event) => this.setState({ email: event.target.value })}
                        required
                        fullWidth
                    />


                    <TextField
                        id="password"
                        label="Password"
                        margin="normal"
                        type="password"
                        variant={this.state.inputVariant}
                        className={classes.textField}
                        value={this.state.password}
                        //onChange={this.handleChange('password')}
                        onChange={(event) => this.setState({ password: event.target.value })}
                        required
                        fullWidth
                    />

                    <Button variant="contained" fullWidth className={classes.buttonType1}  onClick={this.loginAdmin}>LOGIN</Button>



                </Grid>
            </Grid>
        )
    }



    render() {
        const { classes } = this.props;

        return (
            <div style={{ height: this.state.height, backgroundColor: 'red', flexDirection: 'row', display: 'flex' }}>
                <div className={classes.leftPanel} >
                    <Grid container justify="center" >
                        <Grid item sm={12} md={10} lg={8}>
                            <img src={logo} height={90} width="auto" alt="LashCart Logo"></img>
                        </Grid>
                    </Grid>

                    <Grid container justify="center" >
                        <Grid item sm={12} md={11} lg={9}>
                            <div style={{ padding: 10, borderRadius: 10, borderColor: 'white', borderStyle: 'solid', borderWidth: 1 }}>
                                {this.state.pagination.map((page, index) => {
                                    if (page.selected) {
                                        return (
                                            <div>
                                                <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', top: -40 }}>
                                                    <Avatar alt="LashCart Logo" className={classes.avatar} >
                                                        {page.icon}
                                                    </Avatar>
                                                </div>
                                                <Typography style={{ color: 'white', marginBottom: 10 }}>
                                                    {page.content}
                                                </Typography>
                                                <Button variant="contained" fullWidth className={classes.buttonType3} onClick={this.switchLogin}  >
                                                    {page.buttonContent}
                                                </Button>
                                            </div>
                                        )
                                    }

                                })}
                            </div>
                            <div className={classes.pagination}>
                                {this.state.pagination.map((page, index) => {
                                    return (
                                        <div className={page.selected ? classes.paginationCircleFocus : classes.paginationCircle}></div>
                                    )
                                })}

                            </div>

                        </Grid>
                    </Grid>

                </div>
                <div className={classes.rightPanel} >
                    {this.state.currentLogin === 'seller' ?
                        (this.state.isLogin === true ?
                            this.getSellerLogin() : this.getSellerRegister()
                        )
                        : null
                    }

                    {this.state.currentLogin === 'buyer' ?
                        (this.state.isLogin === true ?
                            this.getBuyerLogin() : this.getBuyerRegister()
                        )
                        : null}

                    {this.state.currentLogin === 'admin' ?
                        this.getAdmin()
                        : null}

                </div>
            </div>
        )
    }
}

Login.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);