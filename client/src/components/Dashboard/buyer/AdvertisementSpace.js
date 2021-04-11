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

const axios = require('axios');

const styles = theme => ({
    // margin: {

    // },  
    root: {
        display: 'flex',
        flexDirection: 'column',
        color: 'white'
    },

    paperCustomTypes: {
        borderRadius: 0,
        height: 200,
        boxShadow: 'none',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 30,
        paddingBottom: 30,
    },

    overlay: {
        height: '100%',
        width: '96%',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderStyle: 'dashed',
        borderWidth: 3,
        borderColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

class AdvertisementSpace extends Component {

    render() {

        const { classes } = this.props;

        return (

            <Grid item sm={12} md={12} lg={12} >
                <Paper className={classes.paperCustomTypes}>
                    <div className={classes.overlay}>
                        <Typography variant="title" style={{ color: 'rgba(0,0,0,0.5)' }}>
                            Optional Advertisement
                        </Typography>
                    </div>
                </Paper>
            </Grid>

        )
    }
}

AdvertisementSpace.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(AdvertisementSpace);