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


const columns = ["Date", "Transaction Type", "Transaction Number", "Order Number", "Details", "Amount", "VAT", "Statement"];

const data = [
    // ["23-2-2019", "Paypal", "3142132133", "2312", "1 * Product1", "2000", "132", ""],
    // ["23-2-2019", "Alipay", "332132133", "2313", "2 * Product1", "4000", "132", ""],
    // ["23-2-2019", "Paypal", "3142132133", "2312", "1 * Product1", "2000", "132", ""],
    // ["23-2-2019", "Alipay", "332132133", "2313", "2 * Product1", "4000", "132", ""],
    // ["23-2-2019", "Mastercard", "3142132133", "2312", "1 * Product1", "2000", "132", ""],
    // ["23-2-2019", "Alipay", "332132133", "2313", "2 * Product1", "4000", "132", ""],
    // ["23-2-2019", "Paypal", "3142132133", "2312", "1 * Product1", "2000", "132", ""],
    // ["23-2-2019", "Alipay", "332132133", "2313", "2 * Product1", "4000", "132", ""],
    // ["23-2-2019", "Paypal", "3142132133", "2312", "1 * Product1", "2000", "132", ""],
    // ["23-2-2019", "Alipay", "332132133", "2313", "2 * Product1", "4000", "132", ""],
    // ["23-2-2019", "Paypal", "3142132133", "2312", "1 * Product1", "2000", "132", ""],
    // ["23-2-2019", "Alipay", "332132133", "2313", "2 * Product1", "4000", "132", ""],

];

const options = {
    filterType: 'checkbox',
    downloadOptions: { filename: 'TransactionOverview.csv', separator: ',' },
    selectableRows: false,
    responsive: 'scroll'

};



class TransactionOverview extends Component {
    render() {
        const { classes } = this.props;

        return (
            <div className="root">
                <Typography variant="h5" align="left" className={classes.pageTitle}>
                    Transaction Overview
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


TransactionOverview.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(TransactionOverview);
