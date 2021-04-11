import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Alert from 'react-s-alert';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';

import axios from 'axios';
import { BASE_URL } from './../../../apibase';

// import { FilePond, registerPlugin } from 'react-filepond';
// import 'filepond/dist/filepond.min.css';
// import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
// import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
// import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
// import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

// registerPlugin(FilePondPluginFileValidateType);
// registerPlugin(FilePondPluginFileValidateSize);
// registerPlugin(FilePondPluginImagePreview);

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

class ManageBankAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountName: '',
      accountNumber: '',
      bankName: '',
      branchCode: '',
      //   chequeCopy: [],
      dataSending: false,
    };
  }

  componentDidMount() {
    const {
      sellerData: { bankDetails },
    } = this.props;

    if (bankDetails.length > 0) {
      let recentDetails = bankDetails.length - 1;

      this.setState({
        accountName: bankDetails[recentDetails].accountName,
        accountNumber: bankDetails[recentDetails].accountNumber,
        bankName: bankDetails[recentDetails].bankName,
        branchCode: bankDetails[recentDetails].branchCode,
      });
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  submitBankDetails = () => {
    this.setState({ dataSending: true });

    const { sellerData } = this.props;
    let status = 'unverified';

    if (sellerData.status === 'approved') {
      status = 'updateInfo';
    }

    // var bodyFormData = new FormData();
    // bodyFormData.set('acctTitle', this.state.accountName);
    //bodyFormData.set('acctType', "TO BE REMOVED");
    // bodyFormData.set('bankName', this.state.bankName);
    // bodyFormData.set('branchCode', this.state.branchCode);
    // bodyFormData.set('acctNum', this.state.accountNumber);
    //bodyFormData.set('chequeCopy', this.state.chequeCopy[0]);

    const bankDetails = {
      accountName: this.state.accountName,
      bankName: this.state.bankName,
      branchCode: this.state.branchCode,
      accountNumber: this.state.accountNumber,
      sellerStatus: status,
    };

    axios
      .post(BASE_URL + 'seller/add-bankDetails', bankDetails, { withCredentials: true })
      .then(response => {
        this.setState({ dataSending: false });

        console.log(response);

        if (response.data.status === 'success') {
          Alert.success('Bank information added successfully!', {
            position: 'bottom-right',
            effect: 'slide',
          });

          // this.props.history.push('/sell/todo/request');

          this.props.history.push({
            pathname: '/sell/todo/request',
            sellerDataFromLocation: response.data.data,
          });
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

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <form>
          <Grid item sm={12} md={12} lg={12}>
            <Card className={classes.card}>
              <CardHeader title='Verify Bank Account' />
              <CardContent className={classes.cardContent}>
                <Grid container spacing={40}>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <TextField
                      label='Bank Name'
                      margin='normal'
                      variant='outlined'
                      className={classes.textField}
                      value={this.state.bankName}
                      onChange={this.handleChange('bankName')}
                      required
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <TextField
                      label='Account Name'
                      margin='normal'
                      variant='outlined'
                      className={classes.textField}
                      value={this.state.accountName}
                      onChange={this.handleChange('accountName')}
                      required
                      fullWidth
                    />
                  </Grid>
                  {/* TODO: Change db variable for IBAN Number after consultation with client */}
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <TextField
                      label='BSB'
                      margin='normal'
                      variant='outlined'
                      className={classes.textField}
                      value={this.state.branchCode}
                      onChange={this.handleChange('branchCode')}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <TextField
                      label='Account Number'
                      margin='normal'
                      variant='outlined'
                      className={classes.textField}
                      value={this.state.accountNumber}
                      onChange={this.handleChange('accountNumber')}
                      required
                      fullWidth
                    />
                  </Grid>
                </Grid>

                {/* <Grid container spacing={40}>


                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                        <Typography variant="body1">
                                            Upload Cheque Copy *
                                    </Typography>
                                        <FilePond
                                            files={this.state.chequeCopy}
                                            onupdatefiles={fileItems => {
                                                this.setState({
                                                    chequeCopy: fileItems.map(fileItem => fileItem.file)
                                                });
                                            }}
                                            allowFileSizeValidation={true}
                                            allowFileTypeValidation={true}
                                            maxFileSize="10MB"
                                            acceptedFileTypes={['image/*']}
                                        />
                                    </Grid>
                                </Grid> */}
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
                      onClick={this.submitBankDetails}>
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

ManageBankAccount.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ManageBankAccount);
