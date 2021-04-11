import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import './../style.css';
// // import DonutLarge from '@material-ui/icons/DonutLarge'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';

const axios = require('axios');

const { BASE_URL } = require('./../apibase');

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
    },
  },
  loginButton: {
    backgroundColor: 'rgb(151,151,152)',
    borderRadius: 0,
    '&:hover': {
      backgroundColor: 'rgb(163,163,164)',
    },
  },
  recoverPass: {
    fontSize: 12,
    marginTop: 10,
    cursor: 'pointer',
    textAlign: 'center',
  },
  inputFields: {
    marginTop: 10,
  },
  input: {
    color: 'white',
  },
  underline: {
    backgroundColor: 'white',
  },
});

class Onboarding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputVariant: 'outlined',
      login: true,
      email: '',
      password: '',
      confirmPassword: '',
      phoneNo: '',
      accountType: '',
      shopName: '',
      shopLocation: '',
      ownerName: '',
    };
  }

  registerAccount = () => {
    const json = {
      ownerName: this.state.ownerName,
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      phoneNo: this.state.phoneNo,
      accountType: this.state.accountType,
      shopName: this.state.shopName,
      shopLocation: this.state.shopLocation,
    };
    console.log(json);

    axios
      .post(BASE_URL + 'seller/signup', json, { withCredentials: true })
      .then(function(response) {
        console.log(response);
        this.setState({
          login: true,
        });
      })
      .catch(function(error) {
        console.log(error.response);
      });
  };

  loginAccount = () => {
    const json = {
      email: this.state.email,
      password: this.state.password,
    };

    axios
      .post(BASE_URL + 'seller', json, { withCredentials: true })
      .then(response => {
        console.log(response);
        //redirect to dashboard
        this.props.history.push(`/sell/dashboard`);
      })
      .catch(error => {
        console.log(error.response);
      });
  };

  handleChange(event, varName) {
    console.log(varName);
    //console.log(event.target.name)
    //const value=event.target.name:event.target.value;
    //  this.setState(event.target.name:event.target.value)
    //console.log(this.state)
  }

  getLogin = () => {
    return (
      <div
        style={{
          backgroundColor: 'rgba(37,37,37,0.57)',
          marginTop: 120,
          marginBottom: 10,
          paddingTop: 10,
          paddingBottom: 10,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        }}>
        <div className='logo' />

        {/* 
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    // <DonutLarge style={{ position: 'absolute', left: 0, top: 10, width: 20, height: 20 }} />
                    <TextField
                        hintText="Search by Name"
                        style={{paddingLeft:25}}
                    />
                </div>
         */}
        <div style={{ paddingLeft: 40, paddingRight: 40, marginBottom: 20 }}>
          <TextField
            id='email-input'
            label='Email'
            name='email'
            onChange={e =>
              this.setState({
                email: e.target.value,
              })
            }
            fullWidth
            className={this.props.classes.inputFields}
            InputProps={{
              className: this.props.classes.input,
            }}
            InputLabelProps={{
              style: { color: '#fff' },
            }}
          />
          <TextField
            id='password-input'
            label='Password'
            type='password'
            onChange={e =>
              this.setState({
                password: e.target.value,
              })
            }
            fullWidth
            className={this.props.classes.inputFields}
            InputProps={{
              className: this.props.classes.input,
            }}
            InputLabelProps={{
              style: { color: '#fff' },
            }}
            input={
              <Input
                classes={{
                  underline: this.props.classes.underline,
                }}
              />
            }
          />
          <div style={{ marginTop: 25 }}>
            <Grid container spacing={16}>
              <Grid item xs={6} sm={6} md={6} lg={6}>
                <Button
                  fullWidth
                  className={this.props.classes.loginButton}
                  onClick={this.loginAccount}>
                  Login
                </Button>
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6}>
                <Typography className={this.props.classes.recoverPass}>
                  Recover Password?
                </Typography>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    );
  };

  getRegister = () => {
    return (
      <div
        style={{
          backgroundColor: 'rgba(37,37,37,0.57)',
          marginTop: 120,
          marginBottom: 10,
          paddingTop: 10,
          paddingBottom: 10,
          borderTopLeftRadius: 15,
          borderTopRightRadius: 15,
        }}>
        <div className='logo' />

        {/* 
        <div style={{ position: 'relative', display: 'inline-block' }}>
            // <DonutLarge style={{ position: 'absolute', left: 0, top: 10, width: 20, height: 20 }} />
            <TextField
                hintText="Search by Name"
                style={{paddingLeft:25}}
            />
        </div> */}
        <div style={{ paddingLeft: 40, paddingRight: 40, marginBottom: 20 }}>
          <TextField
            id='name-input'
            label='Name'
            fullWidth
            onChange={e =>
              this.setState({
                ownerName: e.target.value,
              })
            }
            value={this.state.ownerName}
            className={this.props.classes.inputFields}
            InputProps={{
              className: this.props.classes.input,
            }}
            InputLabelProps={{
              style: { color: '#fff' },
            }}
          />
          <TextField
            id='shop-name-input'
            label='Shop Name'
            fullWidth
            onChange={e =>
              this.setState({
                shopName: e.target.value,
              })
            }
            value={this.state.shopName}
            className={this.props.classes.inputFields}
            InputProps={{
              className: this.props.classes.input,
            }}
            InputLabelProps={{
              style: { color: '#fff' },
            }}
          />

          <TextField
            id='shop-location-input'
            label='Shop Location'
            fullWidth
            onChange={e =>
              this.setState({
                shopLocation: e.target.value,
              })
            }
            className={this.props.classes.inputFields}
            InputProps={{
              className: this.props.classes.input,
            }}
            InputLabelProps={{
              style: { color: '#fff' },
            }}
          />

          <TextField
            id='contact-number-input'
            label='Contact Number'
            fullWidth
            //type="number"
            onChange={e =>
              this.setState({
                phoneNo: e.target.value,
              })
            }
            className={this.props.classes.inputFields}
            InputProps={{
              className: this.props.classes.input,
            }}
            InputLabelProps={{
              style: { color: '#fff' },
            }}
          />

          <TextField
            id='account-type-input'
            label='Account Type'
            fullWidth
            onChange={e =>
              this.setState({
                accountType: e.target.value,
              })
            }
            className={this.props.classes.inputFields}
            InputProps={{
              className: this.props.classes.input,
            }}
            InputLabelProps={{
              style: { color: '#fff' },
            }}
          />

          <TextField
            id='email-input'
            label='Email'
            fullWidth
            onChange={e =>
              this.setState({
                email: e.target.value,
              })
            }
            type='email'
            className={this.props.classes.inputFields}
            InputProps={{
              className: this.props.classes.input,
            }}
            InputLabelProps={{
              style: { color: '#fff' },
            }}
          />
          <TextField
            id='password-input'
            label='Password'
            type='password'
            fullWidth
            onChange={e =>
              this.setState({
                password: e.target.value,
              })
            }
            className={this.props.classes.inputFields}
            InputProps={{
              className: this.props.classes.input,
            }}
            InputLabelProps={{
              style: { color: '#fff' },
            }}
            input={
              <Input
                classes={{
                  underline: this.props.classes.underline,
                }}
              />
            }
          />

          <TextField
            id='password-input'
            label='Confirm Password'
            type='password'
            fullWidth
            onChange={e =>
              this.setState({
                confirmPassword: e.target.value,
              })
            }
            className={this.props.classes.inputFields}
            InputProps={{
              className: this.props.classes.input,
            }}
            InputLabelProps={{
              style: { color: '#fff' },
            }}
            input={
              <Input
                classes={{
                  underline: this.props.classes.underline,
                }}
              />
            }
          />

          <div style={{ marginTop: 25 }}>
            <Grid container spacing={16}>
              <Grid item xs={6} sm={6} md={6} lg={6}>
                <Button
                  fullWidth
                  className={this.props.classes.loginButton}
                  onClick={this.registerAccount}>
                  Register
                </Button>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { classes } = this.props;

    return (
      <div className='root loginBG'>
        <Grid container justify='center'>
          <Grid item sm={6} md={4} lg={3}>
            {this.state.login === true ? this.getLogin() : this.getRegister()}

            <Button
              className={classes.registerButton}
              fullWidth
              onClick={() =>
                this.setState({
                  login: !this.state.login,
                })
              }>
              {this.state.login ? 'Register' : 'Login'}
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Onboarding.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(Onboarding);
