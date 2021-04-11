import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import './../style.css';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
const axios = require('axios');

const { BASE_URL } = require('./../apibase');

const styles = theme => ({
  card: {
    marginTop: 30,
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
});

class VerifyAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputVariant: 'outlined',
      email: '',
      password: '',
      confirmPassword: '',
      userToken: '',
    };
  }
  componentDidMount() {
    this.getEmail();
  }

  getEmail = () => {
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let token = params.get('token');

    if (token === null || token === undefined || token === '') {
      // TODO:redirect from this page
      console.log('No token found');
    } else {
      this.setState({
        userToken: token,
      });
      axios
        .get(BASE_URL + 'admin/getadminemail?token=' + token, { withCredentials: true })
        .then(response => {
          console.log(response);
          console.log(response.data.email);
          if (
            response.data.email !== null &&
            response.data.email !== undefined &&
            response.data.email !== ''
          ) {
            this.setState({ email: response.data.email });
          }
        })
        .catch(error => {
          console.log(error.response);
        });
    }
  };

  setNewPassword = () => {
    const json = {
      token: this.state.userToken,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
    };

    console.log('My json:');
    console.log(json);

    axios
      .post(BASE_URL + 'admin/setpassword', json, { withCredentials: true })
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error.response);
      });
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className='root'>
        <Grid container justify='center'>
          <Grid item sm={7} md={5} lg={4}>
            <Grid item sm={12} md={12} lg={12}>
              <Card className={classes.card}>
                <CardHeader title='Setup your Account' />
                <CardContent className={classes.cardContent}>
                  <Grid container spacing={40}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <TextField
                        label='Email'
                        type='email'
                        margin='normal'
                        variant={this.state.inputVariant}
                        className={classes.textField}
                        value={this.state.email}
                        onChange={this.handleChange('email')}
                        fullWidth
                        disabled
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={0}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <TextField
                        label='Password'
                        type='password'
                        margin='normal'
                        variant={this.state.inputVariant}
                        className={classes.textField}
                        value={this.state.password}
                        onChange={this.handleChange('password')}
                        required
                        fullWidth
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={40}>
                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <TextField
                        label='Confirm Password'
                        type='password'
                        margin='normal'
                        variant={this.state.inputVariant}
                        className={classes.textField}
                        value={this.state.confirmPassword}
                        onChange={this.handleChange('confirmPassword')}
                        required
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                  <br />
                </CardContent>
              </Card>

              <Card className={classes.card}>
                <CardContent className={classes.cardContent2}>
                  <Grid container spacing={40}>
                    <Grid item sm={5} md={6} lg={7}></Grid>
                    <Grid item sm={7} md={6} lg={5}>
                      <Button
                        variant='contained'
                        fullWidth
                        className={classes.buttonType1}
                        onClick={this.setNewPassword}>
                        Set Your Password
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

VerifyAccount.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(VerifyAccount);
