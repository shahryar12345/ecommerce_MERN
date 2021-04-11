import React, { Component } from 'react'
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { ShoppingCart } from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ProductCard from './ProductCard'
import Carousel from 'nuka-carousel';
import withWidth from '@material-ui/core/withWidth';
import toRenderProps from 'recompose/toRenderProps';

const axios = require('axios');
const WithWidth = toRenderProps(withWidth());
const { BASE_URL } = require('./../../../apibase');

const styles = theme => ({
    // margin: {

    // },  
    root: {
        display: 'flex',
        flexDirection: 'column',
        color: 'white'
    },
    appBar: {
        boxShadow: 'none',
        backgroundColor: 'rgb(39,44,48)',
        zIndex: theme.zIndex.drawer + 1,
        position: 'fixed'


    },
    toolbarTitle: {
        flex: 1,
        textAlign: 'left',
        paddingLeft: 20,

    },
    search: {
        position: 'relative',
        borderRadius: 0,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing.unit * 2,
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing.unit * 3,
            width: 'auto',
        },
        flexGrow: 1
    },
    searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
    },
    pageBody: {
        backgroundColor: 'orange',
        margin: 15,
        marginTop: 140,
        flexGrow: 1
    },
    paperCustom: {
        borderRadius: 0
    },

    paperCustomTypes: {
        borderRadius: 0,
        height: 200,
        boxShadow: 'none',
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center'
    },
    paperCustomSmallBoxes: {
        borderRadius: 0,
        height: 300,
        boxShadow: 'none'
    }
});


    


class TodaysDeals extends Component {

// SS-Chnaged

constructor(props) {
    super(props);
    this.state = {
        leftDrawer: false,
        rightDrawer: false,
        abc: "Hello",
        Products : null
        //buyerName: "",
        //buyerEmail : "",
        //buyerLogedIn : false
    };

    if (props.categoryTitle === "Trending Products"){
        this.getTrendingProducts();
        //this.checkUserLoggedIn();
    } 
       
}

async componentDidMount()
    {
        if (this.props.categoryTitle === "Trending Products"){
            await this.getTrendingProducts();
            //this.checkUserLoggedIn();
        }
    }
async componentWillReceiveProps(nextProps)
{
//     const { match: { params } } = nextProps;
//     const productId = params.ProdID;
    //  console.log('componentWillReceiveProps In => Product Card : ' + nextProps.ProductObject)
    //  this.setState({
    //     Product : nextProps.ProductObject
    //  })
//     await this.getProductDetail(productId);
            if (nextProps.categoryTitle === "Trending Products"){
                await this.getTrendingProducts();
                //this.checkUserLoggedIn();
            }
 }

    getTrendingProducts = ()  =>
    {
        axios.get(BASE_URL + "buyer/trendingproduct", { withCredentials: true })
            .then((response) => {
                 console.log("getTrendingProducts() called")
                 console.log(response);
                //console.log(response.data.email)

                // const arr = [];

                // response.data.map((product, index) => {
                // // console.log(JSON.stringify(product))
                // })

                this.setState({
                    Products : response.data
                })
                
                //console.log("console.log(this.state.newProducts)")
                //console.log(this.state.Products)
                //console.log(this.state.Products[0].products[0])
                
            })
            .catch((error) => {
                console.log('Error While Fetching Trending Product')
                console.log(error)
                
                console.log(error.response);
                // console.log(error.response.data.statusCode)
                //this.props.history.push(`/seller/login`)
            });
    } 



    render() {

        const { classes } = this.props;

        return (

            <Grid item sm={12} md={12} lg={12}>
                {
                this.state.Products ? 
                <Typography variant="h6" align="left">
                    {this.props.categoryTitle} T<span style={{ textTransform: 'uppercase', fontSize: 16 }}>odays</span> D<span style={{ textTransform: 'uppercase', fontSize: 16 }}>eals</span>
                </Typography> : null
                }
                <div>


                    <WithWidth>
                        {({ width }) => (
                            <Carousel style={{ height: '350px' }}
                                slidesToShow={
                                    width == 'xl' ? 7 :
                                        (width == 'lg' ? 5 :
                                            (width == 'md' ? 4 :
                                                (width == 'sm' ? 3 : 2)))}
                                withoutControls cellSpacing={30} framePadding="15px 5px">
                                {
                                        this.state.Products ?  
                                            this.state.Products.map((item, key) =>
                                            <ProductCard productName={'Shahryar'} ProductObject={item.products[0]}/>
                                                                    )
                                        : null
                                }
                                
                                {/* <ProductCard />
                                <ProductCard />
                                <ProductCard />
                                <ProductCard />
                                <ProductCard />
                                <ProductCard />
                                <ProductCard />
                                <ProductCard />
                                <ProductCard />
                                <ProductCard />
                                <ProductCard />
                                <ProductCard />
                                <ProductCard />
                                <ProductCard /> */}


                            </Carousel>
                        )}
                    </WithWidth>


                </div>

            </Grid>


        )
    }
}

TodaysDeals.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(TodaysDeals);