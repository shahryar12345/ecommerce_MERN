import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import './../../../style.css';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Alert from 'react-s-alert';
import { Button } from '@material-ui/core';

const axios = require('axios');
const { BASE_URL } = require('./../../../apibase');

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
  card: {
    marginTop: 30,
  },
  menu: {
    width: 200,
  },
  cardContent2: {
    marginBottom: 0,
  },
  buttonType1: {
    backgroundColor: 'rgb(39,44,48)',
    boxShadow: 'none',
    color: 'rgb(236,239,234)',
    '&:hover': {
      backgroundColor: 'rgb(48,54,58)',
    },
    '&:focus': {
      boxShadow: 'none',
    },
  },
  buttonType2: {
    color: 'rgb(39,44,48)',
  },
  root: {
    '&$checked': {
      color: 'rgb(53,60,66)',
    },
  },
  checked: {},
  link: {
    color: '#272C30',
    '&:hover': {
      color: '#272C30',
      textDecoration: 'none',
    },
  },
});

const StateList = [
  {
    text: 'ACT',
    value: 'ACT',
  },
  {
    text: 'NSW',
    value: 'NSW',
  },
  {
    text: 'NT',
    value: 'NT',
  },
  {
    text: 'QLD',
    value: 'QLD',
  },
  {
    text: 'SA',
    value: 'SA',
  },
  {
    text: 'TAS',
    value: 'TAS',
  },
  {
    text: 'VIC',
    value: 'VIC',
  },
  {
    text: 'WA',
    value: 'WA',
  },
];

class ManageAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sameBusinessAddress: false,
      sameReturnAddress: false,
      warehouseAddress: '',
      warehouseCountry: '',
      warehouseState: '',
      warehouseArea: '',
      businessAddress: '',
      businessCountry: '',
      businessState: '',
      businessArea: '',
      returnAddress: '',
      returnCountry: '',
      returnState: '',
      returnArea: '',
      dataSending: false,
    };
  }

  componentDidMount() {
    const {
      sellerData: { sellerAddresses },
    } = this.props;

    if (sellerAddresses.length > 0) {
      let recentAddress = sellerAddresses.length - 1;

      this.setState({
        warehouseAddress: sellerAddresses[recentAddress].warehouse_address.address,
        warehouseCountry: sellerAddresses[recentAddress].warehouse_address.country,
        warehouseState: sellerAddresses[recentAddress].warehouse_address.state,
        warehouseArea: sellerAddresses[recentAddress].warehouse_address.area,

        businessAddress: sellerAddresses[recentAddress].business_address.address,
        businessCountry: sellerAddresses[recentAddress].business_address.country,
        businessState: sellerAddresses[recentAddress].business_address.state,
        businessArea: sellerAddresses[recentAddress].business_address.area,
      });
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleChangeCheckbox = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  submitAddress = () => {
    this.setState({ dataSending: true });

    const { sellerData } = this.props;
    let status = 'unverified';

    if (sellerData.status === 'approved') {
      status = 'updateInfo';
    }

    const json = {
      bus_address: this.state.sameBusinessAddress
        ? this.state.warehouseAddress
        : this.state.businessAddress,
      bus_country: this.state.sameBusinessAddress
        ? this.state.warehouseCountry
        : this.state.businessCountry,
      bus_state: this.state.sameBusinessAddress
        ? this.state.warehouseState
        : this.state.businessState,
      bus_area: this.state.sameBusinessAddress ? this.state.warehouseArea : this.state.businessArea,
      war_address: this.state.warehouseAddress,
      war_country: this.state.warehouseCountry,
      war_state: this.state.warehouseState,
      war_area: this.state.warehouseArea,
      sellerStatus: status,
    };

    axios
      .post(BASE_URL + 'seller/add-address', json, { withCredentials: true })
      .then(response => {
        this.setState({ dataSending: false });

        if (response.data.status === 'success') {
          Alert.success('Address added successfully', {
            position: 'bottom-right',
            effect: 'slide',
          });

          this.props.history.push('/sell/todo/id');
        }
      })
      .catch(error => {
        this.setState({ dataSending: false });

        Alert.error(
          error.response
            ? error.response.data.data
            : 'Unable to connect with the server, please check your internet connection.',
          {
            position: 'bottom-right',
            effect: 'slide',
          },
        );
      });
  };

  getAddress = type => {
    return (
      <div>
        <TextField
          label='Street Address'
          fullWidth
          margin='normal'
          variant='outlined'
          value={type === 'business' ? this.state.businessAddress : this.state.returnAddress}
          onChange={this.handleChange(type + 'Address')}
          required
        />

        <Grid container spacing={40}>
          <Grid item xs={12} sm={4} md={4} lg={4}>
            <TextField
              label='Suburb'
              margin='normal'
              variant='outlined'
              className={this.props.classes.textField}
              value={type === 'business' ? this.state.businessCountry : this.state.returnCountry}
              onChange={this.handleChange(type + 'Country')}
              required
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={4} md={4} lg={4}>
            <TextField
              id='model-input'
              label='State'
              margin='normal'
              variant='outlined'
              className={this.props.classes.textField}
              SelectProps={{
                MenuProps: {
                  //className: classes.menu
                },
              }}
              value={type === 'business' ? this.state.businessState : this.state.returnState}
              onChange={this.handleChange(type + 'State')}
              fullWidth
              required
              select>
              {StateList.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.text}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={4} md={4} lg={4}>
            <TextField
              label='Post Code'
              margin='normal'
              variant='outlined'
              className={this.props.classes.textField}
              value={type === 'business' ? this.state.businessArea : this.state.returnArea}
              onChange={this.handleChange(type + 'Area')}
              required
              fullWidth
            />
          </Grid>
        </Grid>
      </div>
    );
  };

  render() {
    const { classes } = this.props;

    return (
      <div className='root'>
        <form>
          <Grid item sm={12} md={12} lg={12}>
            <Card className={classes.card}>
              <CardHeader title='Address Book' />
              <CardContent className={classes.cardContent}>
                <Typography variant='body2'>Warehouse Address</Typography>

                <TextField
                  label='Street Address'
                  fullWidth
                  margin='normal'
                  variant='outlined'
                  value={this.state.warehouseAddress}
                  onChange={this.handleChange('warehouseAddress')}
                  required
                />

                <Grid container spacing={40}>
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <TextField
                      label='Suburb'
                      margin='normal'
                      variant='outlined'
                      className={classes.textField}
                      value={this.state.warehouseCountry}
                      onChange={this.handleChange('warehouseCountry')}
                      required
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <TextField
                      label='State'
                      margin='normal'
                      variant='outlined'
                      className={classes.textField}
                      value={this.state.warehouseState}
                      onChange={this.handleChange('warehouseState')}
                      fullWidth
                      SelectProps={{
                        MenuProps: {
                          //className: classes.menu
                        },
                      }}
                      required
                      select>
                      {StateList.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.text}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <TextField
                      label='Post Code'
                      margin='normal'
                      variant='outlined'
                      className={classes.textField}
                      value={this.state.warehouseArea}
                      onChange={this.handleChange('warehouseArea')}
                      required
                      fullWidth
                    />
                  </Grid>
                </Grid>

                <div className='spacing30'></div>

                <Typography variant='body2'>Business Address</Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.sameBusinessAddress}
                      onChange={this.handleChangeCheckbox('sameBusinessAddress')}
                      classes={{
                        root: classes.root,
                        checked: classes.checked,
                      }}
                    />
                  }
                  label={'Same as Warehouse Address'}
                />

                {this.state.sameBusinessAddress ? <span></span> : this.getAddress('business')}

                {/* <div className="spacing30"></div>
                                <Typography variant="body2" >
                                    Return Address
                                </Typography>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={this.state.sameReturnAddress}
                                            onChange={this.handleChangeCheckbox("sameReturnAddress")}
                                            classes={{
                                                root: classes.root,
                                                checked: classes.checked,
                                            }}
                                        />
                                    }
                                    label={"Same as Warehouse Address"}
                                />
                                {this.state.sameReturnAddress ? (<span></span>) : this.getAddress('return')}
 */}
              </CardContent>
            </Card>

            <Card className={classes.card}>
              <CardContent className={classes.cardContent2}>
                <Grid container spacing={40}>
                  <Grid item sm={6} md={8} lg={7}></Grid>
                  <Grid item sm={3} md={2} lg={2}>
                    {/* TODO: Add back code react router */}
                    <Button variant='outlined' fullWidth className={classes.buttonType2}>
                      <Link to='/sell/dashboard' className={classes.link}>
                        Back
                      </Link>
                    </Button>
                  </Grid>
                  <Grid item sm={3} md={2} lg={2}>
                    <Button
                      disabled={this.state.dataSending}
                      variant='contained'
                      fullWidth
                      className={classes.buttonType1}
                      onClick={this.submitAddress}>
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </form>
      </div>
    );
  }
}

ManageAddress.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(ManageAddress);
