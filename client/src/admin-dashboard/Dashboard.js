import React, { Component } from 'react'
import classNames from 'classnames';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';



const cards = []// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];

const styles = theme => ({
    // margin: {

    // },  
    root: {
        display: 'flex',
        flexDirection: 'column',
        color: 'white'
    },
});

class Dashboard extends Component {

    render() {
        const { classes } = this.props;


        return (
            <div className={classNames(classes.layout, classes.cardGrid)}>
                <Grid container spacing={40}>
                    {cards.map(card => (
                        <Grid item key={card} sm={6} md={4} lg={3}>
                            <Card className={classes.card}>
                                <CardMedia
                                    className={classes.cardMedia}
                                    image="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_164edaf95ee%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_164edaf95ee%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.32500076293945%22%20y%3D%22118.8%22%3EThumbnail%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" // eslint-disable-line max-len
                                    title="Image title"
                                />
                                <CardContent className={classes.cardContent}>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        Heading
    </Typography>
                                    <Typography>
                                        This is a media card. You can use this section to describe the content.
    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" color="primary">
                                        View
    </Button>
                                    <Button size="small" color="primary">
                                        Edit
    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

            </div>
        )
    }
}


Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);