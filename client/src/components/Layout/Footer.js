import React, { Component } from 'react';
import '../../style.css';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import { Send } from '@material-ui/icons';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { IoLogoFacebook, IoLogoInstagram, IoLogoTwitter } from 'react-icons/io';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    color: 'white',
    backgroundColor: 'rgb(227,231,232)',
  },
  footer: {
    backgroundColor: 'rgb(62,69,75)',
  },
  moveToTop: {
    padding: 10,
    cursor: 'hand',
    cursor: 'pointer',
  },
  footerSocials: {
    padding: 20,
    backgroundColor: 'rgb(51,56,60)',
    paddingLeft: 50,
    paddingRight: 50,
  },
  webMap: {
    padding: 20,
  },
  footerHeading: {
    color: 'white',
  },
  footerOption: {
    color: 'white',
  },
  userDetails: {
    marginLeft: 40,
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 25,
  },
});

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leftDrawer: false,
      rightDrawer: false,
    };

    this.checkUserLoggedIn();
  }

  checkUserLoggedIn = () => {
    // Get getBuyerDetail() , call only for login buyer
    const logged_user_detail = JSON.parse(localStorage.getItem('local-buyer'));
    if (logged_user_detail) {
      this.state = {
        buyerName: logged_user_detail.name,
        buyerEmail: logged_user_detail.email,
        buyerLogedIn: true,
      };
    } else {
      this.state = {
        buyerLogedIn: false,
      };
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.footer}>
          <div className={classes.moveToTop}>Move To Top</div>
          <div className={classes.footerSocials}>
            <Grid container spacing={32}>
              <Grid item sm={12} md={6} lg={6}>
                <Typography variant='h6' align='left' style={{ color: 'white' }}>
                  Get Exclusive Deals And Offers
                </Typography>

                <div
                  style={{
                    padding: 0,
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    width: '100%',
                    marginTop: 10,
                    display: 'flex',
                  }}
                >
                  <InputBase
                    className={classes.margin}
                    style={{ width: '100%', marginLeft: 10, padding: 5, color: 'white' }}
                    placeholder='Enter your email address'
                  />
                  <Button
                    variant='outlined'
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.5)',
                      borderWidth: 0,
                      borderRadius: 0,
                    }}
                    className={classes.button}
                  >
                    <Send
                      style={{
                        height: '100%',
                        color: 'white',
                      }}
                    />
                  </Button>
                </div>
              </Grid>
              <Grid
                item
                sm={12}
                md={6}
                lg={6}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography variant='h6' style={{ color: 'white', marginBottom: 10 }}>
                  Follow Us On
                </Typography>
                <div>
                  <IoLogoFacebook style={{ fontSize: 28, marginRight: 8 }} />
                  <IoLogoTwitter style={{ fontSize: 28, marginRight: 8 }} />
                  <IoLogoInstagram style={{ fontSize: 28 }} />
                </div>
              </Grid>
            </Grid>
          </div>
          <div className={classes.webMap}>
            <Grid
              container
              spacing={32}
              justify='center'
              style={{
                paddingTop: 10,
                paddingBottom: 10,
                backgroundColor: 'rgb(62,69,75)',
              }}
            >
              <Grid lg={2} md={4} sm={6} item>
                <Typography variant='h6' align='left' className={classes.footerHeading}>
                  About Us
                </Typography>
                <Typography variant='subheading' align='left' className={classes.footerOption}>
                  Option 1
                </Typography>
              </Grid>

              <Grid lg={2} md={4} sm={6} item>
                <Typography variant='h6' align='left' className={classes.footerHeading}>
                  Buy
                </Typography>
                <Typography variant='subheading' align='left' className={classes.footerOption}>
                  Option 1
                </Typography>
              </Grid>

              <Grid lg={2} md={4} sm={6} item>
                <Typography variant='h6' align='left' className={classes.footerHeading}>
                  Sell
                </Typography>
                <Typography variant='subheading' align='left' className={classes.footerOption}>
                  Option 1
                </Typography>
              </Grid>

              <Grid lg={2} md={4} sm={6} item>
                <Typography variant='h6' align='left' className={classes.footerHeading}>
                  Help/FAQs
                </Typography>
                <Typography variant='subheading' align='left' className={classes.footerOption}>
                  Option 1
                </Typography>
              </Grid>

              <Grid lg={2} md={4} sm={6} item>
                <Typography variant='h6' align='left' className={classes.footerHeading}>
                  Contact Us
                </Typography>
                <Typography variant='subheading' align='left' className={classes.footerOption}>
                  Option 1
                </Typography>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    );
  }
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Footer);
