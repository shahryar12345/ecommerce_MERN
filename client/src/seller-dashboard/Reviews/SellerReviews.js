import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import MUIDataTable from "mui-datatables";

const styles = theme => ({
    card: {
        marginTop: 30
    },
});


const columns = ["Order No.", "Review", "Comments", "Reply"];

const data = [
    // ["1", "2/5", "Comment Here", "Not Given"],
    // ["1", "2/5", "Comment Here", "Not Given"],
    // ["1", "2/5", "Comment Here", "Not Given"],
    // ["1", "2/5", "Comment Here", "Not Given"],
    // ["1", "2/5", "Comment Here", "Sorry for inconvinience caused."],
    // ["1", "2/5", "Comment Here", "Not Given"],
    // ["1", "2/5", "Comment Here", "Not Given"],
    // ["1", "2/5", "Comment Here", "Not Given"],
    // ["1", "2/5", "Comment Here", "Not Given"],
    // ["1", "2/5", "Comment Here", "Not Given"],
    // ["1", "2/5", "Comment Here", "Not Given"],
    // ["1", "2/5", "Comment Here", "Not Given"],
    // ["1", "2/5", "Comment Here", "Not Given"],
    // ["1", "2/5", "Comment Here", "Not Given"],
    // ["1", "2/5", "Comment Here", "Not Given"],



];

const options = {
    filterType: 'checkbox',
    downloadOptions: { filename: 'OrderReviews.csv', separator: ',' },
    selectableRows: false,
    responsive: 'scroll'


};


class SellerReviews extends Component {
    render() {
        const { classes } = this.props;

        return (
            <div className="root">
                <Typography variant="h5" align="left" className={classes.pageTitle}>
                    Seller Reviews
                    </Typography>

                <Grid item sm={12} md={12} lg={12}>

                    <div style={{ margin: 20, marginTop: 30 }}>
                        <MUIDataTable
                            title={""}
                            data={data}
                            columns={columns}
                            options={options}
                            className={classes.card}
                        />
                    </div>

                </Grid>
            </div>
        )
    }
}


SellerReviews.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(SellerReviews);
