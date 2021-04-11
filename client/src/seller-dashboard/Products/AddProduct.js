import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import './../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import WYSIWYGEditor from '../../components/Dashboard/WYSIWYGEditor';
import { Button } from '@material-ui/core';
import CheckboxesGroup from '../../components/Dashboard/CheckboxesGroup';
import MUIDataTable from 'mui-datatables';
import Switch from '@material-ui/core/Switch';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

import Alert from 'react-s-alert';

import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

registerPlugin(FilePondPluginFileValidateType);
registerPlugin(FilePondPluginFileValidateSize);
registerPlugin(FilePondPluginImagePreview);

const axios = require('axios');
const { BASE_URL } = require('./../../apibase');
var errors = require('../../errors');

function Transition(props) {
  return <Slide direction='down' {...props} />;
}

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
    marginRight: 10,
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
  iOSSwitchBase: {
    '&$iOSChecked': {
      color: theme.palette.common.white,
      '& + $iOSBar': {
        backgroundColor: '#52d869',
      },
    },
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.sharp,
    }),
  },
  iOSChecked: {
    transform: 'translateX(15px)',
    '& + $iOSBar': {
      opacity: 1,
      border: 'none',
    },
  },
  iOSBar: {
    borderRadius: 13,
    width: 42,
    height: 26,
    marginTop: -13,
    marginLeft: -21,
    border: 'solid 1px',
    borderColor: theme.palette.grey[400],
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  iOSIcon: {
    width: 24,
    height: 24,
  },
  iOSIconChecked: {
    boxShadow: theme.shadows[1],
  },

  level1Expansion: {
    backgroundColor: 'rgb(248,248,248)',
  },
  level2Expansion: {
    backgroundColor: 'rgb(253,253,253)',
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '45.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  root: {
    width: '100%',
  },
});

const warranty_values = [
  {
    value: 'Brand Warranty',
    label: 'Brand Warranty',
  },
  {
    value: 'International Manufacturer Warranty',
    label: 'International Manufacturer Warranty',
  },
  {
    value: 'International Seller Warranty',
    label: 'International Seller Warranty',
  },
  {
    value: 'Local Warranty',
    label: 'Local Warranty',
  },
  {
    value: 'Local Seller Warranty',
    label: 'Local Seller Warranty',
  },
  {
    value: 'No Warranty',
    label: 'No Warranty',
  },
];

const columns = [
  'Availability',
  'Variation Type',
  'Variation Value',
  'Seller SKU',
  'Quantity',
  'Price',
  'Special Price',
];

const options = {
  filterType: 'checkbox',
  downloadOptions: { filename: 'ProductsList.csv', separator: ',' },
  selectableRows: false,
  responsive: 'scroll',
};

class AddProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: 'Test Product',
      brand: 'Test Brand',
      model: 'Test model',
      productHighlight: '',
      productDescription: '',
      dangBattery: false,
      dangFlamable: false,
      dangLiquid: false,
      whatsInBox: '',
      weight: 0,
      dimensionLength: 0,
      dimensionWidth: 0,
      dimensionHeight: 0,
      categoryValue: 'Click to select category',
      inputVariant: 'outlined',
      warrantyType: '',
      productImage: [],
      variationsAvailable: [true],
      variationValues: [],
      variations: [],
      modalOpen: false,
      expanded: null,
      expanded2: null,
      expanded3: null,
      categoryLevel: {
        l1: null,
        l2: null,
        l3: null,
      },
      categoriesResponse: [
        // {
        //   _id: "5c80cad562d40226d82e2955",
        //   name: "newCategory",
        //   commission: 2.5,
        //   subCategories: [],
        //   __v: 0
        // },
        // {
        //   _id: "5c80cae562d40226d82e2956",
        //   name: "bed",
        //   commission: 2.5,
        //   subCategories: [],
        //   __v: 0
        // },
        // {
        //   _id: "5c80cb1562d40226d82e2957",
        //   name: "new",
        //   commission: 2.5,
        //   subCategories: [
        //     {
        //       subCategories: [
        //         {
        //           _id: "5c80cc4262d40226d82e295a",
        //           name: "new3"
        //         },
        //         {
        //           _id: "5c814335ad360148941f7be4",
        //           name: "new5"
        //         }
        //       ],
        //       _id: "5c80cc1a62d40226d82e2958",
        //       name: "new2"
        //     },
        //     {
        //       subCategories: [],
        //       _id: "5c814312ad360148941f7be2",
        //       name: "new4"
        //     }
        //   ],
        //   __v: 0
        // },
        // {
        //   _id: "5c80cceb62d40226d82e295d",
        //   name: "bags and travels",
        //   commission: 2.5,
        //   subCategories: [],
        //   __v: 0
        // },
        // {
        //   _id: "5c80fdf34ac252384843d23d",
        //   name: "Test Category",
        //   commission: 1.2,
        //   subCategories: [
        //     {
        //       subCategories: [
        //         {
        //           _id: "5c80fe0d4ac252384843d240",
        //           name: "Test-child-child"
        //         }
        //       ],
        //       _id: "5c80fe004ac252384843d23e",
        //       name: "Test Child"
        //     }
        //   ],
        //   __v: 0
        // },
        // {
        //   _id: "5c82c6004481154218a2c64c",
        //   name: "Electronics",
        //   commission: 2.7,
        //   subCategories: [
        //     {
        //       subCategories: [],
        //       _id: "5c82c60c4481154218a2c64d",
        //       name: "Laptops"
        //     }
        //   ],
        //   __v: 0
        // }
      ],
    };
    this.addNewSKU();
    this.getAllCategories();
  }

  goBack = () => {
    console.log('Go back called');
    this.props.history.goBack();
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  handleChange2 = panel => (event, expanded2) => {
    this.setState({
      expanded2: expanded2 ? panel : false,
    });
  };

  handleChange3 = panel => (event, expanded3) => {
    this.setState({
      expanded3: expanded3 ? panel : false,
    });
  };

  handleValueChange = name => event => {
    this.setState({ [name]: event.target.value });
    //   console.log(name + ':' + event.target.value)
  };

  addCategory = () => {
    console.log('test');
  };

  addSubCategory = (parent, id1) => {
    console.log(parent);
    console.log(id1);

    let categoryLevel = this.state.categoryLevel;
    categoryLevel.l1 = id1;

    this.setState(
      {
        categoryValue: parent,
        modalOpen: false,
        categoryLevel: categoryLevel,
      },
      () => {
        console.log(this.state);
      },
    );
  };

  addSubSubCategory = (grandparent, parent, id1, id2) => {
    console.log(grandparent + ' ' + parent);
    console.log(id1 + ' ' + id2);

    let categoryLevel = this.state.categoryLevel;
    categoryLevel.l1 = id1;
    categoryLevel.l2 = id2;

    this.setState(
      {
        categoryValue: grandparent + ' > ' + parent,
        modalOpen: false,
        categoryLevel: categoryLevel,
      },
      () => {
        console.log(this.state);
      },
    );
  };

  add3rdLevelCategory = (grandgrandparent, grandparent, parent, id1, id2, id3) => {
    console.log(grandgrandparent + ' ' + grandparent + ' ' + parent);
    console.log(id1 + ' ' + id2 + ' ' + id3);

    let categoryLevel = this.state.categoryLevel;
    categoryLevel.l1 = id1;
    categoryLevel.l2 = id2;
    categoryLevel.l3 = id3;

    this.setState(
      {
        categoryValue: grandgrandparent + ' > ' + grandparent + ' > ' + parent,
        modalOpen: false,
        categoryLevel: categoryLevel,
      },
      () => {
        console.log(this.state);
      },
    );
  };

  performValidation=()=>{
    const json={
      productName:this.state.productName,
      brand:this.state.brand,
      model:this.state.model,
      highlights:this.state.productHighlight,
      description:this.state.productDescription,
      warrantyType:this.state.warrantyType,
      whatsInTheBox:this.state.whatsInBox,
      packageWeight:this.state.weight,
      productImage:this.state.productImage,
      length:this.state.dimensionLength,
      width:this.state.dimensionWidth,
      height:this.state.dimensionHeight,
      battery:this.state.dangBattery,
      flamable:this.state.dangFlamable,
      liquid:this.state.dangLiquid,
      level1:this.state.categoryLevel.l1,
    }
    
    console.log("model Value");
    console.log(json.model);
        
    console.log("json.packageWeight");    
    console.log(json.packageWeight.length);
    console.log(json.packageWeight);

    if (json.productName.length < 4) {
      return errors.PRODUCT_NAME;
    } else if (json.brand.length < 2) {
      return errors.BRAND_NAME;
    }
    else if(json.model.length<2)
    {
      return errors.MODEL_NAME;
    }
    else if(json.productImage.length<1){
      return errors.PRODUCT_IMAGE;
    } else if (json.highlights.length < 9) {
      return errors.HIGHLIGHT;
    } else if (json.warrantyType === '') {
      return errors.WARRANTY_TYPE;
    }
    // else if(json.whatsInTheBox.length<2){
    //   return errors.WHATS_IN_THE_BOX;
    // }
    // else if(json.packageWeight.length === 'undefined' || json.packageWeight == 0){
    //   return errors.PACKAGE_WEIGHT;
    // }
    // else if(json.length.length === 'undefined' || json.length == 0){
    //   return errors.LENGTH;
    // }
    // else if(json.width.length === 'undefined' || json.width == 0){
    //   return errors.WIDTH;
    // }
    // else if(json.height.length=== 'undefined' || json.height == 0){
    //   return errors.HEIGHT;
    // }
    else if (json.level1 === null) {
      return errors.CATEGORY_MISSING;
    }

    for (let i = 0; i < this.state.variationValues.length; i++) {
      //SS-Changed
      //variationType: "",
      //variationValue: "",
      if (this.state.variationValues[i].variationType.length < 1) {
        return errors.VARIATION_TYPE;
      }
      if (this.state.variationValues[i].variationValue.length < 1) {
        return errors.VARIATION_VALUE;
      }

      if (this.state.variationValues[i].price.length < 1) {
        return errors.SKU_PRICE;
      }
      if (this.state.variationValues[i].quantity.length < 1) {
        return errors.SKU_QUANTIY;
      }
      if (this.state.variationValues[i].sellerSKU.length < 1) {
        return errors.SKU_SELLER;
      }
    }

    return null;
  };

  // addProduct() start
  addProduct = () => {
    //alert("Perform Validation and show error in case there is empty data")
    if (this.performValidation() !== null) {
      Alert.error(this.performValidation(), {
        position: 'top-right',
        effect: 'slide',
        offset: 55,
      });
      return;
    }
    //return;
    let today = new Date();
    const json = {
      productName: this.state.productName,
      brand: this.state.brand,
      model: this.state.model,
      highlights: this.state.productHighlight,
      description: this.state.productDescription,
      warrantyType: this.state.warrantyType,
      whatsInTheBox: this.state.whatsInBox,
      packageWeight: this.state.weight,
      productImage: this.state.productImage,
      length: this.state.dimensionLength,
      width: this.state.dimensionWidth,
      height: this.state.dimensionHeight,
      battery: this.state.dangBattery,
      flamable: this.state.dangFlamable,
      liquid: this.state.dangLiquid,
      level1: this.state.categoryLevel.l1,
      creationDate:
        today.getFullYear() +
        '' +
        (today.getMonth() + 1) +
        '' +
        today.getDate() +
        '' +
        (today.getHours() + 1) +
        '' +
        (today.getMinutes() + 1) +
        '' +
        (today.getSeconds() + 1),
    };
    if (this.state.variationValues.length > 0) {
      json.sku = [];
    }
    if (this.state.categoryLevel.l2 !== null) {
      json.level2 = this.state.categoryLevel.l2;
    }
    if (this.state.categoryLevel.l3 !== null) {
      json.level3 = this.state.categoryLevel.l3;
    }
    for (let i = 0; i < this.state.variationValues.length; i++) {
      json.sku.push({
        availability: this.state.variationValues[i].availability,
        price: this.state.variationValues[i].price,
        specialPrice: this.state.variationValues[i].specialPrice,
        quantity: this.state.variationValues[i].quantity,
        sellerSKU: this.state.variationValues[i].sellerSKU,
      });
      const variationType = this.state.variationValues[i].variationType;
      let obj = {};
      obj[variationType] = this.state.variationValues[i].variationValue;
      json.sku[i].variation = obj;
    }

    console.log('In AddProduct.js');
    console.log(json);

    var bodyFormData = new FormData();
    bodyFormData.set('productName', json.productName);
    bodyFormData.set('brand', json.brand);
    bodyFormData.set('model', json.model);
    bodyFormData.set('highlights', json.highlights);
    bodyFormData.set('description', json.description);
    bodyFormData.set('warrantyType', json.warrantyType);
    bodyFormData.set('whatsInTheBox', json.whatsInTheBox);
    bodyFormData.set('packageWeight', json.packageWeight);
    //bodyFormData.set('productImage', json.productImage);
    bodyFormData.set('length', json.length);
    bodyFormData.set('width', json.width);
    bodyFormData.set('height', json.height);
    bodyFormData.set('flammable', json.flamable);
    bodyFormData.set('liquid', json.liquid);
    bodyFormData.set('battery', json.battery);
    bodyFormData.set('level1', json.level1);
    if (json.level2 !== null && json.level3 !== undefined) {
      bodyFormData.set('level2', json.level2);
    }
    if (json.level3 !== null && json.level3 !== undefined) {
      bodyFormData.set('level3', json.level3);
    }
    bodyFormData.set('sku', JSON.stringify(json.sku));
    bodyFormData.set('creationDate', json.creationDate);

    for (let i = 0; i < this.state.productImage.length; i++) {
      bodyFormData.append('productImage', this.state.productImage[i]);
    }

    console.log(bodyFormData.get('productImage'));
    console.log(bodyFormData.getAll('productImage'));
    console.log(bodyFormData);
    console.log(bodyFormData.getAll('sku'));

    // axios.post(BASE_URL + "seller/bankdetails", bodyFormData)
    // .then(function (response) {
    //     console.log(response);
    //     //redirect to dashboard
    // })
    // .catch(function (error) {
    //     console.log(error.response);
    // });

    axios
      .post(BASE_URL + 'seller/product', bodyFormData, { withCredentials: true })
      .then(function(response) {
        console.log(response);
        Alert.success(response.data.message, {
          position: 'top-right',
          effect: 'slide',
          offset: 55,
        });
      })
      .catch(function(error) {
        console.log(error);
        Alert.error(
          error.response
            ? error.response.data.data
            : 'Unable to connect with the server, please check your internet connection.',
          {
            position: 'top-right',
            effect: 'slide',
            offset: 55,
          },
        );
      });
  };

  componentDidMount() {
    document.getElementById('category-input').addEventListener('click', this.selectCategory);

    //     let arr=[]
    //     let values=[false,'','','','','','']
    // arr.push(values)
    //     this.setState({
    //     variationValues:arr
    // })
  }

  updateCheckboxes(checkboxes) {
    console.log(checkboxes);
    this.setState(checkboxes);
  }

  updateHighlight = val => {
    console.log('Highlight new value=' + val);
    this.setState({
      productHighlight: val,
    });
  };

  updateDescription = val => {
    console.log('Description new value=' + val);
    this.setState({
      productDescription: val,
    });
  };

  selectCategory = () => {
    console.log('this is:', this);
  };
  handleSelectChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  addNewSKU = () => {
    console.log(this.state.variations.length);
    console.log('current length is ' + this.state.variations.length);
    const arr = [];
    const vals = this.state.variationValues;

    //let values = [false, "", "", "", "", "", ""];

    let values = {
      availability: true,
      variationType: '',
      variationValue: '',
      sellerSKU: '',
      quantity: '',
      price: '',
      specialPrice: '',
    };
    vals.push(values);
    this.setState({
      variationValues: vals,
    });
  };

  getCategories = () => {
    console.log('working');
    this.setState({
      modalOpen: true,
    });
  };

  handleModalClose = () => {
    this.setState({
      modalOpen: false,
    });
  };

  getAllCategories = () => {
    console.log('API URL is ' + BASE_URL + 'admin/category');
    axios
      .get(BASE_URL + 'admin/category')
      .then(response => {
        console.log('Categories list:');
        console.log(response.data);
        this.setState({ categoriesResponse: response.data });
      })
      .catch(error => {
        console.log(error.response);
      });
  };

  render() {
    const { classes } = this.props;
    const { expanded, expanded2, expanded3 } = this.state;

    return (
      <div className='root'>
        <Typography variant='h5' align='left' className={classes.pageTitle}>
          Add Product
        </Typography>
        <form>
          <Grid item sm={12} md={12} lg={12}>
            <Card className={classes.card}>
              <CardHeader title='What are You Selling?' />
              <CardContent className={classes.cardContent}>
                <TextField
                  id='product-name-input'
                  label='Product Name'
                  // placeholder=""
                  helperText=''
                  fullWidth
                  margin='normal'
                  variant={this.state.inputVariant}
                  value={this.state.productName}
                  onChange={event => {
                    this.setState({ productName: event.target.value });
                  }}
                  required
                />

                <TextField
                  id='category-input'
                  label='Category'
                  // placeholder=""
                  helperText=''
                  fullWidth
                  margin='normal'
                  variant={this.state.inputVariant}
                  defaultValue={this.state.categoryValue}
                  required
                  disabled
                  value={this.state.categoryValue}
                  onClick={this.getCategories}
                />

                <Grid container spacing={40}>
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    <TextField
                      id='brand-input'
                      label='Brand'
                      helperText=''
                      margin='normal'
                      value={this.state.brand}
                      variant={this.state.inputVariant}
                      className={classes.textField}
                      onChange={event => {
                        this.setState({ brand: event.target.value });
                      }}
                      required
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    <TextField
                      id='model-input'
                      label='Model'
                      helperText=''
                      margin='normal'
                      value={this.state.model}
                      variant={this.state.inputVariant}
                      className={classes.textField}
                      onChange={event => {
                        this.setState({ model: event.target.value });
                      }}
                      required
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <FilePond
                      files={this.state.productImage}
                      allowMultiple={true}
                      maxFiles={8}
                      allowFileSizeValidation={true}
                      allowFileTypeValidation={true}
                      maxFileSize='10MB'
                      acceptedFileTypes={['image/*']}
                      onupdatefiles={fileItems => {
                        this.setState(
                          {
                            productImage: fileItems.map(fileItem => fileItem.file),
                          },
                          () => {
                            console.log(this.state.productImage);
                          },
                        );
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card className={classes.card}>
              <CardHeader title='Basic Information' />
              <CardContent className={classes.cardContent}>
                <WYSIWYGEditor
                  heading='Product Highlights'
                  description='Enter a minimum of three short highlights of the product 
                                    to make the purchase decision easier for the customer. 
                                    Please format as a bulleted list.'
                  height={250}
                  editorId='productHighlight'
                  onChange={event => {
                    this.setState({ productHighlight: event.target.value });
                  }}
                  updateValues={this.updateHighlight.bind(this)}
                  required
                />

                <WYSIWYGEditor
                  heading='Product Description'
                  description='The product description should give the customer useful 
                                    information about the product to ensure a purchase.'
                  height={250}
                  editorId='productDescription'
                  onChange={event => {
                    this.setState({ productDescription: event.target.value });
                  }}
                  updateValues={this.updateDescription.bind(this)}
                />

                <TextField
                  id='warranty-type-input'
                  label='Warranty Type'
                  helperText=''
                  fullWidth
                  margin='normal'
                  variant={this.state.inputVariant}
                  value={this.state.warrantyType}
                  SelectProps={{
                    MenuProps: {
                      className: classes.menu,
                    },
                  }}
                  onChange={this.handleSelectChange('warrantyType')}
                  select
                  required>
                  {warranty_values.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>

                <CheckboxesGroup
                  heading='Dangerous Goods'
                  boxes={[
                    { id: 'dangBattery', label: 'Battery', value: false },
                    { id: 'dangFlamable', label: 'Flammable', value: false },
                    { id: 'dangLiquid', label: 'Liquid', value: false },
                  ]}
                  updateValues={this.updateCheckboxes.bind(this)}
                />

                <TextField
                  id='model-input'
                  label="What's in the box?"
                  helperText=''
                  variant={this.state.inputVariant}
                  className={classes.textField}
                  fullWidth
                  onChange={event => {
                    this.setState({ whatsInBox: event.target.value });
                  }}
                  //required
                />

                <Grid container spacing={40}>
                  <Grid item xs={12} sm={12} md={4} lg={6}>
                    <TextField
                      id='weight-input'
                      label='Package Weight(kg)'
                      helperText=''
                      margin='normal'
                      variant={this.state.inputVariant}
                      className={classes.textField}
                      type='number'
                      onChange={event => {
                        this.setState({ weight: event.target.value });
                      }}
                      fullWidth
                      //required
                    />
                  </Grid>

                  {/* Package Dimensions */}
                  <Grid item xs={12} sm={12} md={8} lg={6}>
                    <Grid container spacing={16}>
                      <Grid item xs={12} sm={12} md={3} lg={3}>
                        <Typography variant='body2' align='left' style={{ paddingTop: 33 }}>
                          Package Dimensions(cm)
                        </Typography>
                      </Grid>
                      <Grid item xs={4} sm={4} md={3} lg={3}>
                        <TextField
                          id='length-input'
                          label='Length'
                          helperText=''
                          margin='normal'
                          variant={this.state.inputVariant}
                          className={classes.textField}
                          onChange={event => {
                            this.setState({ dimensionLength: event.target.value });
                          }}
                          type='number'
                          fullWidth
                          //required
                        />
                      </Grid>

                      <Grid item xs={4} sm={4} md={3} lg={3}>
                        <TextField
                          id='width-input'
                          label='Width'
                          helperText=''
                          margin='normal'
                          variant={this.state.inputVariant}
                          className={classes.textField}
                          onChange={event => {
                            this.setState({ dimensionWidth: event.target.value });
                          }}
                          type='number'
                          fullWidth
                          //required
                        />
                      </Grid>

                      <Grid item xs={4} sm={4} md={3} lg={3}>
                        <TextField
                          id='height-input'
                          label='Height'
                          helperText=''
                          margin='normal'
                          variant={this.state.inputVariant}
                          className={classes.textField}
                          onChange={event => {
                            this.setState({ dimensionHeight: event.target.value });
                          }}
                          type='number'
                          fullWidth
                          //required
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card className={classes.card}>
              <CardHeader title='Variations' />
              <CardContent className={classes.cardContent}>
                <Grid container spacing={40} style={{ paddingBottom: 20 }}>
                  <Grid item sm={4} md={3} lg={2}>
                    <Button
                      variant='contained'
                      fullWidth
                      className={classes.buttonType1}
                      onClick={this.addNewSKU}>
                      Add New SKU
                    </Button>
                  </Grid>
                </Grid>

                {/* <MUIDataTable
                                title={"Product Variations"}
                                data={this.state.variations}
                                columns={columns}
                                options={options}
                                className={classes.card}
                            /> */}
                {/* <Grid container spacing={40} style={{ paddingBottom: 20 }}>
                  {this.state.variations.map((fields, index) => (
                    <Grid container spacing={40} style={{ paddingBottom: 20 }}>
                      {fields.map((innerField, index2) => {
                        return (
                          <Grid item sm={2} md={2} lg={2}>
                            {innerField}
                          </Grid>
                        );
                      })}
                    </Grid>
                  ))}
                </Grid> */}

                <Grid container spacing={40}>
                  {this.state.variationValues.length > 0 ? (
                    <Grid container spacing={40}>
                      <Grid item sm={1} md={1} lg={1}>
                        Availability
                      </Grid>
                      <Grid item sm={2} md={2} lg={2}>
                        Variation Type
                      </Grid>
                      <Grid item sm={2} md={2} lg={2}>
                        Variation Value
                      </Grid>
                      <Grid item sm={2} md={2} lg={2}>
                        Seller SKU
                      </Grid>

                      <Grid item sm={2} md={2} lg={2}>
                        Quantity
                      </Grid>

                      <Grid item sm={1} md={1} lg={1}>
                        Price
                      </Grid>

                      <Grid item sm={2} md={2} lg={2}>
                        Special Price
                      </Grid>
                    </Grid>
                  ) : null}

                  {this.state.variationValues.map((variation, index) => (
                    <Grid container spacing={40}>
                      <Grid
                        item
                        sm={1}
                        md={1}
                        lg={1}
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Switch
                          classes={{
                            switchBase: this.props.classes.iOSSwitchBase,
                            bar: this.props.classes.iOSBar,
                            icon: this.props.classes.iOSIcon,
                            iconChecked: this.props.classes.iOSIconChecked,
                            checked: this.props.classes.iOSChecked,
                          }}
                          disableRipple
                          checked={this.state.variationValues[index].availability}
                          onChange={() => {
                            let curr = this.state.variationValues;
                            curr[index].availability = !curr[index].availability;
                            this.setState({ variationValues: curr }, () => {
                              console.log(this.state.variationValues);
                            });
                          }}
                        />
                      </Grid>
                      <Grid item sm={2} md={2} lg={2}>
                        <TextField
                          id='category-input'
                          placeholder='Colour'
                          helperText=''
                          fullWidth
                          margin='normal'
                          onChange={event => {
                            let curr = this.state.variationValues;
                            curr[index].variationType = event.target.value;
                            this.setState({ variationValues: curr });
                          }}
                          variant={this.state.inputVariant}
                        />
                      </Grid>
                      <Grid item sm={2} md={2} lg={2}>
                        <TextField
                          id='category-input'
                          placeholder='Blue'
                          helperText=''
                          fullWidth
                          margin='normal'
                          onChange={event => {
                            let curr = this.state.variationValues;
                            curr[index].variationValue = event.target.value;
                            this.setState({ variationValues: curr });
                          }}
                          variant={this.state.inputVariant}
                        />
                      </Grid>

                      <Grid item sm={2} md={2} lg={2}>
                        <TextField
                          id='category-input'
                          placeholder='RC615LAB'
                          helperText=''
                          fullWidth
                          margin='normal'
                          onChange={event => {
                            let curr = this.state.variationValues;
                            curr[index].sellerSKU = event.target.value;
                            this.setState({ variationValues: curr });
                          }}
                          variant={this.state.inputVariant}
                        />
                      </Grid>
                      <Grid item sm={2} md={2} lg={2}>
                        <TextField
                          id='category-input'
                          placeholder='1000'
                          helperText='Number of pieces'
                          fullWidth
                          margin='normal'
                          type='number'
                          onChange={event => {
                            let curr = this.state.variationValues;
                            curr[index].quantity = event.target.value;
                            this.setState({ variationValues: curr });
                          }}
                          variant={this.state.inputVariant}
                        />
                      </Grid>
                      <Grid item sm={1} md={1} lg={1}>
                        <TextField
                          id='category-input'
                          placeholder='5.5'
                          helperText='AUD'
                          fullWidth
                          margin='normal'
                          type='number'
                          onChange={event => {
                            let curr = this.state.variationValues;
                            curr[index].price = event.target.value;
                            this.setState({ variationValues: curr });
                          }}
                          variant={this.state.inputVariant}
                        />
                      </Grid>
                      <Grid item sm={2} md={2} lg={2}>
                        <TextField
                          id='category-input'
                          placeholder='5'
                          helperText='AUD'
                          fullWidth
                          margin='normal'
                          type='number'
                          onChange={event => {
                            let curr = this.state.variationValues;
                            curr[index].specialPrice = event.target.value;
                            this.setState({ variationValues: curr });
                          }}
                          variant={this.state.inputVariant}
                        />
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            <Card className={classes.card}>
              <CardContent className={classes.cardContent2}>
                <Grid container spacing={40} direction='row-reverse'>
                  <Grid item sm={1} md={1} lg={1} />
                  {/* <Grid item sm={4} md={3} lg={2}>
                    <Button
                      variant="contained"
                      fullWidth
                      className={classes.buttonType1}
                      style={{display:'none'}}
                    >
                      Save Draft
                    </Button>
                  </Grid> */}
                  {/* <Grid item sm={2} md={5} lg={4} /> */}

                  <Grid item xs={12} sm={4} md={3} lg={2}>
                    <Button
                      variant='contained'
                      fullWidth
                      className={classes.buttonType1}
                      onClick={() => this.addProduct()}>
                      Publish
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={4} md={3} lg={2}>
                    <Button
                      variant='outlined'
                      fullWidth
                      className={classes.buttonType2}
                      onClick={() => this.goBack()}>
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </form>

        <Dialog
          open={this.state.modalOpen}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleModalClose}
          aria-labelledby='alert-dialog-slide-title'
          aria-describedby='alert-dialog-slide-description'>
          <DialogTitle id='alert-dialog-slide-title'>{'Select Category'}</DialogTitle>
          <DialogContent>
            {this.state.categoriesResponse.map((category, index) => (
              <ExpansionPanel
                className={classes.level1Expansion}
                expanded={expanded === index}
                onChange={this.handleChange(index)}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>{category.name}</Typography>
                  <Typography className={classes.secondaryHeading}>
                    {category.commission}% commission
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <div className={classes.root}>
                    <ExpansionPanel
                      className={classes.level2Expansion}
                      expanded={expanded2 === 'newCategoryChild'}
                      onChange={this.handleChange2('newCategoryChild')}>
                      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>Select this category</Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        <Grid container spacing={40}>
                          <Grid item xs={12} sm={12} md={12} lg={12}>
                            <Button
                              variant='contained'
                              fullWidth
                              className={classes.buttonType1}
                              onClick={() => this.addSubCategory(category.name, category._id)}>
                              Select this category
                            </Button>
                          </Grid>
                        </Grid>
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                    {category.subCategories.map((category2, index2) => (
                      <ExpansionPanel
                        className={classes.level2Expansion}
                        expanded={expanded2 === index2}
                        onChange={this.handleChange2(index2)}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography className={classes.heading}>
                            {category.name} > {category2.name}
                          </Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                          <div className={classes.root}>
                            <ExpansionPanel
                              className={classes.level1Expansion}
                              expanded={expanded3 === 'newCategoryChildChild'}
                              onChange={this.handleChange3('newCategoryChildChild')}>
                              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classes.heading}>
                                  Select this category
                                </Typography>
                              </ExpansionPanelSummary>
                              <ExpansionPanelDetails>
                                <Grid container spacing={40}>
                                  <Grid item xs={12} sm={12} md={12} lg={12}>
                                    <Button
                                      variant='outlined'
                                      fullWidth
                                      className={classes.buttonType2}
                                      onClick={() =>
                                        this.addSubSubCategory(
                                          category.name,
                                          category2.name,
                                          category._id,
                                          category2._id,
                                        )
                                      }>
                                      Select this category
                                    </Button>
                                  </Grid>
                                </Grid>
                              </ExpansionPanelDetails>
                            </ExpansionPanel>
                            {category2.subCategories.map((category3, index3) => (
                              <ExpansionPanel
                                className={classes.level1Expansion}
                                expanded={expanded3 === index3}
                                onChange={this.handleChange3(index3)}>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                  <Typography className={classes.heading}>
                                    {category.name} > {category2.name} > {category3.name}
                                  </Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                  <Grid container spacing={40}>
                                    <Grid item xs={12} sm={12} md={12} lg={12}>
                                      <Button
                                        variant='contained'
                                        fullWidth
                                        className={classes.buttonType1}
                                        onClick={() =>
                                          this.add3rdLevelCategory(
                                            category.name,
                                            category2.name,
                                            category3.name,
                                            category._id,
                                            category2._id,
                                            category3._id,
                                          )
                                        }>
                                        Select this Category
                                      </Button>
                                    </Grid>
                                  </Grid>
                                </ExpansionPanelDetails>
                              </ExpansionPanel>
                            ))}
                          </div>
                        </ExpansionPanelDetails>
                      </ExpansionPanel>
                    ))}
                  </div>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            ))}
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

AddProduct.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddProduct);
