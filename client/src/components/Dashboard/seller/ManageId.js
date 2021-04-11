import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Alert from 'react-s-alert';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { Button } from '@material-ui/core';

import axios from 'axios';
import { BASE_URL } from './../../../apibase';

import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';

registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize,
);

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

const IdTypeList = [
  {
    text: 'Birth Certificate',
    value: 'Birth Certificate',
  },
  {
    text: 'Driver Licence',
    value: 'Driver Licence',
  },
  {
    text: 'Medicare',
    value: 'Medicare',
  },
  {
    text: 'Passport',
    value: 'Passport',
  },
  {
    text: 'Photo Card',
    value: 'Photo Card',
  },
  {
    text: 'Other',
    value: 'Other',
  },
];

class ManageId extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pictures: {},
      idType: '',
      nameOnId: '',
      idNumber: '',
      idBack: null,
      idFront: [],
      dataSending: false,
    };
  }

  componentDidMount() {
    const {
      sellerData: { idInformation },
    } = this.props;

    if (idInformation.length > 0) {
      let recentInfo = idInformation.length - 1;

      this.setState({
        idType: idInformation[recentInfo].idType,
        nameOnId: idInformation[recentInfo].nameOnId,
        idNumber: idInformation[recentInfo].idNumber,
        // idFront: idInformation[recentInfo].idFrntImg.data,
        // idBack: idInformation[recentInfo].idBckImg,
      });
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleSelectChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  submitId = () => {
    this.setState({ dataSending: true });

    const { sellerData } = this.props;
    let status = 'unverified';

    if (sellerData.status === 'approved') {
      status = 'updateInfo';
    }

    let bodyFormData = new FormData();
    bodyFormData.set('idType', this.state.idType);
    bodyFormData.set('nameOnId', this.state.nameOnId);
    bodyFormData.set('idNumber', this.state.idNumber);
    bodyFormData.set('sellerStatus', status);
    bodyFormData.set('idFrntImg', this.state.idFront ? this.state.idFront[0] : null);
    bodyFormData.set('idBckImg', this.state.idBack ? this.state.idBack[0] : null);

    // bodyFormData.forEach(element => {
    //   console.log(element);
    // });

    axios
      .post(BASE_URL + 'seller/add-idInfo', bodyFormData, { withCredentials: true })
      .then(response => {
        this.setState({ dataSending: false });

        if (response.data.status === 'success') {
          Alert.success('Id information added successfully!', {
            position: 'bottom-right',
            effect: 'slide',
          });

          this.props.history.push('/sell/todo/bank');
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
              <CardHeader title='Verify ID Information' />
              <CardContent className={classes.cardContent}>
                <Grid container spacing={40}>
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <TextField
                      label='ID Type'
                      margin='normal'
                      variant='outlined'
                      className={classes.textField}
                      SelectProps={{
                        MenuProps: {
                          className: classes.menu,
                        },
                      }}
                      value={this.state.idType}
                      onChange={this.handleSelectChange('idType')}
                      required
                      fullWidth
                      select>
                      {IdTypeList.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.text}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <TextField
                      label='Name On ID'
                      margin='normal'
                      variant='outlined'
                      className={classes.textField}
                      value={this.state.nameOnId}
                      onChange={this.handleChange('nameOnId')}
                      required
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <TextField
                      label='ID Number'
                      margin='normal'
                      variant='outlined'
                      className={classes.textField}
                      value={this.state.idNumber}
                      onChange={this.handleChange('idNumber')}
                      required
                      fullWidth
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={40}>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <Typography variant='body1'>
                      {/* Upload ID - Front Side * */}
                      Picture One
                    </Typography>
                    <FilePond
                      files={this.state.idFront}
                      onupdatefiles={fileItems => {
                        this.setState({
                          idFront: fileItems.map(fileItem => fileItem.file),
                        });
                      }}
                      allowFileSizeValidation={true}
                      maxFileSize='10MB'
                      allowFileTypeValidation={true}
                      acceptedFileTypes={['image/*']}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <Typography variant='body1'>
                      {/* Upload ID - Back Side * */}
                      Picture Two
                    </Typography>
                    <FilePond
                      ref={ref => (this.pondBack = ref)}
                      files={this.state.idBack}
                      onupdatefiles={fileItems => {
                        this.setState({
                          idBack: fileItems.map(fileItem => fileItem.file),
                        });
                      }}
                      allowFileSizeValidation={true}
                      allowFileTypeValidation={true}
                      maxFileSize='10MB'
                      acceptedFileTypes={['image/*']}
                    />
                  </Grid>
                </Grid>
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
                      onClick={this.submitId}>
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

ManageId.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ManageId);
