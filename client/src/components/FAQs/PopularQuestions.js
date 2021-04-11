import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: 'bold',
  },
});

class PopularQuestions extends Component {
  state = {
    popularQuestions: [
      {
        question: 'What is your return policy?',
        answer:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse pulvinar venenatis libero, ut tincidunt urna. Morbi a faucibus mauris, at lacinia mi. Ut sit amet porta eros. Vivamus venenatis mauris eu molestie luctus. Suspendisse ligula dolor, tempus dictum est at, ultricies egestas dolor. Fusce luctus metus quis diam gravida, quis finibus erat tempor. Cras ullamcorper lorem a lobortis ullamcorper. Integer sodales hendrerit odio, quis mattis sem aliquam sit amet. In consequat vestibulum lorem, ac finibus ipsum egestas id. Nunc auctor scelerisque dapibus. Etiam in dui vel quam laoreet faucibus. Quisque gravida ex erat, eu sagittis eros dapibus quis. Curabitur facilisis ligula nibh, ac sagittis eros semper non.',
      },
      {
        question: 'Do you need help with your promo code?',
        answer:
          'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Praesent posuere pulvinar interdum. Mauris sagittis erat vel enim accumsan, et cursus mi faucibus. Praesent tempus felis non tincidunt suscipit. Pellentesque vel fermentum erat, porttitor sollicitudin lectus. Fusce molestie, lorem nec pulvinar egestas, magna ipsum lacinia tellus, ut bibendum ante leo vitae orci. Fusce at ipsum id diam mollis lobortis.',
      },
      {
        question: 'How can I return my items back to LashCart from Pakistan?',
        answer:
          'Suspendisse vitae lacus elit. Duis lacus nibh, dapibus eget commodo vel, rutrum et lorem. Maecenas nec condimentum tellus, non commodo lorem. Phasellus et ultrices nisi, vel aliquam tortor. Sed vel sollicitudin libero, ac volutpat elit. Vivamus eget nulla at est vulputate euismod ac ut arcu. Etiam blandit, erat quis posuere accumsan, diam tortor imperdiet sapien, a tincidunt orci arcu at urna. Cras mi odio, semper id sapien et, elementum consectetur neque.',
      },
      {
        question: 'Can I return an item and exchange it for something else?',
        answer:
          'Morbi eget iaculis elit. Integer tincidunt metus et orci eleifend, quis fermentum purus molestie. Nam ac lorem ligula. Nunc in posuere est, a efficitur ante. Integer eu purus leo. Vestibulum quis lorem non tortor blandit feugiat. Maecenas id aliquam justo, vel vestibulum neque. Vivamus maximus lectus et faucibus consectetur. Phasellus sodales felis non nibh viverra consectetur.',
      },
      {
        question: 'How does your Pakistan Standard Delivery service work?',
        answer:
          'Sed non molestie dui. Morbi placerat nisl massa, vitae elementum nunc mattis sed. Quisque tristique ligula vel nisi pulvinar, eu dignissim neque gravida. Pellentesque congue viverra massa ac consectetur. Proin volutpat porttitor efficitur. Vestibulum eget odio ut ipsum laoreet iaculis. Integer at leo in neque aliquet tincidunt. Duis vitae tincidunt libero. Donec tristique aliquam est, vitae posuere massa tempus vel. Ut faucibus eu mauris vel blandit. Quisque tincidunt sit amet nisl quis tincidunt. Nulla tempor porta nunc aliquam molestie. Nam finibus nibh ac tortor egestas tristique. Fusce eu tempor massa.',
      },
    ],
  };

  render() {
    const { classes } = this.props;
    const { popularQuestions } = this.state;

    let data;

    if (popularQuestions.length > 0) {
      data = popularQuestions.map((item, key) => (
        <ExpansionPanel key={key} className='mb-2'>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'
          >
            <Typography className={classes.heading}>{item.question}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography className='text-left'>{item.answer}</Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ));
    }

    return (
      <div className='conatiner mt-2 popular-questions'>
        <h4 className='text-white mb-3'>Popular Questions</h4>
        {data}
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(PopularQuestions);
