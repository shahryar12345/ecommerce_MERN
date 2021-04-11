import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import LineGraph from '../components/Dashboard/graphs/LineGraph';
import BarChart from '../components/Dashboard/graphs/BarChart';
import PieChart from '../components/Dashboard/graphs/PieChart';

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
        marginRight: 10
    },
    card: {
        marginTop: 30
    },
    menu: {
        width: 200,
    },
    cardContent2: {
        marginBottom: 0
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
    },

    root: {
        '&$checked': {
            color: 'rgb(53,60,66)',
        },
    },
    checked: {},
    rightBlock: {
        height: '50%',
        position: 'relative'
    }
});



class DashboardGraphs extends Component {
    constructor(props) {
        super(props)
        this.state = {
            inputVariant: 'outlined',
            cardHeight: 400


        }
    }




    render() {
        const { classes } = this.props;


        return (
            <div className="root">

                <Grid container spacing={40} style={{ overflowX: 'hidden' }}>

                    <Grid item xs={12} sm={12} md={7} lg={8}>

                        <Card className={classes.card} style={{ height: this.state.cardHeight }}>

                            <CardContent className={classes.cardContent2} style={{ margin: 30, marginTop: 10 }}>
                                <Typography variant="h6" align="left" style={{ marginBottom: 10 }}>Sales</Typography>
                                <LineGraph height={window.innerWidth < 580 ? this.state.cardHeight / 1.5 : this.state.cardHeight / 3.5} />

                            </CardContent>
                        </Card>

                    </Grid>

                    <Grid item xs={12} sm={12} md={5} lg={4}>

                        <div className={classes.card} style={{ height: this.state.cardHeight }}>

                            <Grid container spacing={16}>
                                <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <div className={classes.rightBlock}
                                        style={{ backgroundColor: 'rgb(34,161,150)', height: (this.state.cardHeight / 2) - 10 }}>

                                        <div style={{ position: 'absolute', bottom: 0, width: '100%' }}>
                                            <BarChart height={this.state.cardHeight / 3.2} />
                                        </div>
                                        <div style={{ position: 'absolute', top: 0, padding: 20, width: '100%' }}>
                                            <Typography style={{ color: 'white', textAlign: 'left' }} variant="h6" >
                                                Sales
                                            </Typography>
                                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginTop: 20 }}>
                                                <Typography style={{ color: 'white', textAlign: 'left' }} variant="caption" >
                                                    Today
                                                </Typography>
                                                <Typography style={{ color: 'white', textAlign: 'right' }} variant="caption" >
                                                    0 AUD
                                                </Typography>

                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: 'center' }}>
                                                <Typography style={{ color: 'white', textAlign: 'left' }} variant="caption" >
                                                    Last 7 Days
                                                </Typography>
                                                <Typography style={{ color: 'white', textAlign: 'right' }} variant="caption" >
                                                    0 AUD
                                                </Typography>

                                            </div>
                                        </div>


                                    </div>
                                </Grid>

                                <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <div className={classes.rightBlock}
                                        style={{ backgroundColor: 'rgb(255,178,0)', height: (this.state.cardHeight / 2) - 10 }}>
                                        <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <PieChart height={this.state.cardHeight / 3.2} style={{ paddingTop: 50 }} />
                                        </div>
                                        <div style={{ position: 'absolute', top: 0, padding: 20, width: '100%' }}>
                                            <Typography style={{ color: 'white', textAlign: 'left' }} variant="h6" >
                                                Order Status
                                            </Typography>
                                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginTop: 20 }}>
                                                <Typography style={{ color: 'white', textAlign: 'left' }} variant="caption" >
                                                    Delivered
                                                </Typography>
                                                <Typography style={{ color: 'white', textAlign: 'right' }} variant="caption" >
                                                    0
                                                </Typography>

                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', }}>
                                                <Typography style={{ color: 'white', textAlign: 'left' }} variant="caption" >
                                                    Pending Delivery
                                                </Typography>
                                                <Typography style={{ color: 'white', textAlign: 'right' }} variant="caption" >
                                                    0
                                                </Typography>

                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', }}>
                                                <Typography style={{ color: 'white', textAlign: 'left' }} variant="caption" >
                                                    Pending Confirmation
                                                </Typography>
                                                <Typography style={{ color: 'white', textAlign: 'right' }} variant="caption" >
                                                    0
                                                </Typography>

                                            </div>
                                        </div>
                                    </div>
                                </Grid>

                                <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <div className={classes.rightBlock}
                                        style={{ backgroundColor: 'rgb(244,66,54)', height: (this.state.cardHeight / 2) - 10 }}>
                                        <div style={{ position: 'absolute', top: 0, padding: 20, width: '100%' }}>
                                            <Typography style={{ color: 'white', textAlign: 'left' }} variant="h6" >
                                                Reviews
                                            </Typography>
                                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginTop: 20 }}>
                                                <Typography style={{ color: 'white', textAlign: 'left' }} variant="caption" >
                                                    Popular Product
                                                </Typography>
                                                <Typography style={{ color: 'white', textAlign: 'right' }} variant="caption" >
                                                    None
                                                </Typography>

                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', }}>
                                                <Typography style={{ color: 'white', textAlign: 'left' }} variant="caption" >
                                                    Most Sold Product
                                                </Typography>
                                                <Typography style={{ color: 'white', textAlign: 'right' }} variant="caption" >
                                                    None
                                                </Typography>

                                            </div>
                                        </div>
                                    </div>
                                </Grid>

                                <Grid item xs={12} sm={6} md={6} lg={6}>
                                    <div className={classes.rightBlock}
                                        style={{ backgroundColor: 'rgb(148,62,163)', height: (this.state.cardHeight / 2) - 10 }}>
                                        <div style={{ position: 'absolute', bottom: 0, width: '100%' }}>
                                            <BarChart height={this.state.cardHeight / 3.7} secondary />
                                        </div>
                                        <div style={{ position: 'absolute', top: 0, padding: 20, width: '100%' }}>
                                            <Typography style={{ color: 'white', textAlign: 'left' }} variant="h6" >
                                                Earnings
                                            </Typography>
                                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', marginTop: 20 }}>
                                                <Typography style={{ color: 'white', textAlign: 'left' }} variant="caption" >
                                                    Today
                                                </Typography>
                                                <Typography style={{ color: 'white', textAlign: 'right' }} variant="caption" >
                                                    0 AUD
                                                </Typography>

                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: 'center' }}>
                                                <Typography style={{ color: 'white', textAlign: 'left' }} variant="caption" >
                                                    Last 7 Days
                                                </Typography>
                                                <Typography style={{ color: 'white', textAlign: 'right' }} variant="caption" >
                                                    0 AUD
                                                </Typography>

                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>

                        </div>

                    </Grid>

                </Grid>




            </div>
        )
    }
}

DashboardGraphs.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DashboardGraphs);