import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';

import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import Form from './Form';

const styles = theme => ({
  pageBody: {
    margin: '150px 2vw 30px 2vw',
    flexGrow: 1,
  },
});

class ContactUs extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Header />
        <div className={classes.pageBody}>
          <div className='contact-boxes mb-4'>
            <div className='box-1 py-4 px-2 bg-dark text-white'>
              <h5 className='h5 mb-4'>Phone Hours</h5>
              <p className='phone-hours-p'>
                Monday to Friday <strong>7:30am</strong> to <strong>6:00pm</strong> Australian
                Eastern Daylight Time
              </p>
              <p className='phone-hours-p mb-5'>
                Exludes:
                <Link to='/contact'> NSW Public Holidays </Link>except for Boxing Day
              </p>
              <p className='phone-hours-p'>
                Australia: <strong>1234 567 899</strong>
              </p>
              <p className='phone-hours-p'>
                New Zealand: <strong>1234 567 899</strong>
              </p>
            </div>

            <div className='box-2 py-4 px-2 bg-dark text-white'>
              <h5 className='h5'>Connect with us</h5>
              <div className='social-1'>
                <Link to='/faqs' className='faq-btn'>
                  <i class='far fa-question-circle'></i>
                  <span>FAQs</span>
                </Link>
                <Link to='/contact' className='linkedin-btn'>
                  <i class='fab fa-linkedin'></i>
                  <span>Linkedin</span>
                </Link>
              </div>

              <div className='social-2'>
                <Link to='/contact' className='instagram-btn'>
                  <i class='fab fa-instagram'></i>
                  <span>Instagram</span>
                </Link>
                <Link to='/contact' className='facebook-btn'>
                  <i class='fab fa-facebook'></i>
                  <span>Facebook</span>
                </Link>
              </div>
            </div>
          </div>
          <Form />
        </div>
        <Footer />
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ContactUs);
