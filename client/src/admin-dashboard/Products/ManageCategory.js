import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Button } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
const axios = require('axios');
const { BASE_URL } = require('./../../apibase');


const styles = theme => ({
    card: {
        marginTop: 30
    },
    root: {
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    level1Expansion: {
        backgroundColor: 'rgb(248,248,248)'
    },
    level2Expansion: {
        backgroundColor: 'rgb(253,253,253)'
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




class ManageCategory extends Component {
    state = {
        expanded: null,
        expanded2: null,
        expanded3: null,
        inputVariant: 'outlined',
        categoriesResponse: [],
        categoryName: '',
        commission: '',
        subcategoryName: '',
        subsubcategoryName: ''

    };

    constructor(props) {
        super(props);
        this.getAllCategories();
    }

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

    getAllCategories = () => {
        axios.get(BASE_URL + "admin/category", { withCredentials: true })
            .then((response) => {
                console.log(response.data[0]);
                this.setState({ categoriesResponse: response.data })
            })
            .catch((error) => {
                console.log(error.response);
            })

    }

    addCategory = () => {
        const json = {
            catName: this.state.categoryName,
            commission: this.state.commission
        }

        console.log("My json:")
        console.log(json);

        axios.post(BASE_URL + "admin/addcategory", json, { withCredentials: true })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error.response);
            })
            .then(() => {
                this.getAllCategories();
                this.setState({
                    categoryName: '',
                    commission: ''
                })

            });
    }


    addSubCategory = (parent) => {
        const json = {
            catName: parent,
            subCatName: this.state.subcategoryName
        }

        console.log("My json:")
        console.log(json);

        axios.post(BASE_URL + "admin/addsubcategory", json, { withCredentials: true })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error.response);
            })
            .then(() => {
                this.getAllCategories();
                this.setState({
                    subcategoryName: ''
                })
            });
    }

    addSubSubCategory = (grandparent, parent) => {
        const json = {
            catName: grandparent,
            subCatName: parent,
            subSCatName: this.state.subsubcategoryName

        }

        console.log("My json:")
        console.log(json);


        axios.post(BASE_URL + "admin/addsubcategory", json, { withCredentials: true })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error.response);
            })
            .then(() => {
                this.getAllCategories();
                this.setState({
                    subsubcategoryName: ''
                })
            });
    }


    render() {
        const { classes } = this.props;
        const { expanded, expanded2, expanded3 } = this.state;

        return (
            <div className="root">
                <Typography variant="h5" align="left" className={classes.pageTitle}>
                    Manage Categories
                    </Typography>

                <Grid item sm={12} md={12} lg={12}>

                    <Card className={classes.card}>

                        <CardContent className={classes.cardContent}>

                            <div className={classes.root}>
                                <ExpansionPanel className={classes.level1Expansion} expanded={expanded === 'newCategory'} onChange={this.handleChange('newCategory')}>
                                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography className={classes.heading}>Add New Category</Typography>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>

                                        <Grid container spacing={40}>
                                            <Grid item xs={6} sm={6} md={6} lg={7}>
                                                <TextField
                                                    label="Category Name"
                                                    margin="normal"
                                                    variant={this.state.inputVariant}
                                                    className={classes.textField}
                                                    value={this.state.categoryName}
                                                    onChange={this.handleValueChange('categoryName')}
                                                    required
                                                    fullWidth
                                                />
                                            </Grid>

                                            <Grid item xs={6} sm={6} md={6} lg={5}>

                                                <TextField
                                                    label="Category Commission (%)"
                                                    type="number"
                                                    margin="normal"
                                                    variant={this.state.inputVariant}
                                                    className={classes.textField}
                                                    value={this.state.commission}
                                                    onChange={this.handleValueChange('commission')}
                                                    fullWidth
                                                />
                                            </Grid>


                                            <Grid item xs={6} sm={6} md={6} lg={9}>
                                            </Grid>
                                            <Grid item xs={6} sm={6} md={6} lg={3}>

                                                <Button variant="contained" fullWidth className={classes.buttonType1} onClick={this.addCategory}>Add Category</Button>
                                            </Grid>
                                        </Grid>

                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                                {this.state.categoriesResponse.map((category, index) => (
                                    <ExpansionPanel className={classes.level1Expansion} expanded={expanded === index} onChange={this.handleChange(index)}>
                                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                            <Typography className={classes.heading}>{category.name}</Typography>
                                            <Typography className={classes.secondaryHeading}>
                                                {category.commission}% commission
  </Typography>
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails>
                                            <div className={classes.root}>
                                                <ExpansionPanel className={classes.level2Expansion} expanded={expanded2 === "newCategoryChild"} onChange={this.handleChange2("newCategoryChild")}>
                                                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                                        <Typography className={classes.heading}>Add New Sub-category</Typography>
                                                    </ExpansionPanelSummary>
                                                    <ExpansionPanelDetails>
                                                        <Grid container spacing={40}>
                                                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                                                <TextField
                                                                    label="Sub-category Name"
                                                                    margin="normal"
                                                                    variant={this.state.inputVariant}
                                                                    className={classes.textField}
                                                                    value={this.state.subcategoryName}
                                                                    onChange={this.handleValueChange('subcategoryName')}
                                                                    required
                                                                    fullWidth
                                                                />
                                                            </Grid>




                                                            <Grid item xs={6} sm={6} md={6} lg={7}>
                                                            </Grid>
                                                            <Grid item xs={6} sm={6} md={6} lg={5}>

                                                                <Button variant="contained" fullWidth className={classes.buttonType1} onClick={() => this.addSubCategory(category.name)}>Add new subcategory</Button>
                                                            </Grid>
                                                        </Grid>
                                                    </ExpansionPanelDetails>
                                                </ExpansionPanel>
                                                {category.subCategories.map((category2, index2) => (

                                                    <ExpansionPanel className={classes.level2Expansion} expanded={expanded2 === index2} onChange={this.handleChange2(index2)}>
                                                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                                            <Typography className={classes.heading}>{category.name} > {category2.name}</Typography>

                                                        </ExpansionPanelSummary>
                                                        <ExpansionPanelDetails>


                                                            <div className={classes.root}>

                                                                <ExpansionPanel className={classes.level1Expansion} expanded={expanded3 === "newCategoryChildChild"} onChange={this.handleChange3("newCategoryChildChild")}>
                                                                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                                                        <Typography className={classes.heading}>Add New Sub-Category</Typography>
                                                                    </ExpansionPanelSummary>
                                                                    <ExpansionPanelDetails>
                                                                        <Grid container spacing={40}>
                                                                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                                                                <TextField
                                                                                    label="Sub-category Name"
                                                                                    margin="normal"
                                                                                    variant={this.state.inputVariant}
                                                                                    className={classes.textField}
                                                                                    value={this.state.subsubcategoryName}
                                                                                    onChange={this.handleValueChange('subsubcategoryName')}
                                                                                    required
                                                                                    fullWidth
                                                                                />
                                                                            </Grid>




                                                                            <Grid item xs={0} sm={4} md={5} lg={6}>
                                                                            </Grid>
                                                                            <Grid item xs={12} sm={8} md={7} lg={6}>

                                                                                <Button variant="contained" fullWidth className={classes.buttonType1} onClick={() => this.addSubSubCategory(category.name, category2.name)}>Add new subcategory</Button>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </ExpansionPanelDetails>
                                                                </ExpansionPanel>
                                                                {category2.subCategories.map((category3, index3) => (

                                                                    <ExpansionPanel className={classes.level1Expansion} expanded={expanded3 === index3} onChange={this.handleChange3(index3)}>
                                                                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                                                            <Typography className={classes.heading}>{category.name} > {category2.name} > {category3.name}</Typography>

                                                                        </ExpansionPanelSummary>
                                                                        <ExpansionPanelDetails>
                                                                            <Grid container spacing={40}>
                                                                                <Grid item sm={12} md={6} lg={6} >
                                                                                    <Button variant="outlined" fullWidth className={classes.buttonType2}>Modify Category</Button>
                                                                                </Grid>
                                                                                <Grid item sm={12} md={6} lg={6} >
                                                                                    <Button variant="contained" fullWidth className={classes.buttonType1} onClick={this.createAdmin}>Delete Category</Button>
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
                            </div>

                        </CardContent>
                    </Card>



                </Grid>
            </div>
        )
    }
}


ManageCategory.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(ManageCategory);
