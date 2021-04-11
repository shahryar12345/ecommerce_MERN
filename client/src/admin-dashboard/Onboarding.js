import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import './../style.css';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';

const axios = require('axios');

const { BASE_URL } = require('./../apibase');

const styles = theme => ({
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
      email: '',
      password: '',
    };
  }

  loginAccount = () => {
    const json = {
      email: this.state.email,
      password: this.state.password,
    };
    console.log(json);

    axios
      .post(BASE_URL + 'admin', json, { withCredentials: true })
      .then(response => {
        console.log(response);
        //redirect to dashboard
        this.props.history.push(`/admin/dashboard`);
      })
      .catch(error => {
        console.log(error.response);
      });
  };

  getLogin = () => {
    return (
      <div
        style={{
          backgroundColor: 'rgba(37,37,37,0.57)',
          marginTop: 120,
          marginBottom: 10,
          paddingTop: 10,
          paddingBottom: 10,
          borderRadius: 15,
        }}>
        <div className='logo' />
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

  render() {
    return (
      <div className='root loginBG'>
        <Grid container justify='center'>
          <Grid item sm={6} md={4} lg={3}>
            {this.getLogin()}
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
