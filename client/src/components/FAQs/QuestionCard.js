import React from 'react';
import Flippy, { FrontSide, BackSide } from 'react-flippy';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

const styles = theme => ({
  card: {
    minWidth: 230,
    minHeight: 250,
    backgroundColor: '#3E454B',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

let questionClicked = text => {
  console.log('Question is clicked!', text);
};

let classSelection = cardType => {
  if (cardType === 'Order Issues') {
    return <i className='fas fa-cube'></i>;
  } else if (cardType === 'Payments, Promos & Gift Vouchers') {
    return <i className='far fa-credit-card'></i>;
  } else if (cardType === 'Returns & Refunds') {
    return <i className='fas fa-reply-all'></i>;
  } else if (cardType === 'Delivery') {
    return <i className='fas fa-truck-loading'></i>;
  } else if (cardType === 'Product & Stock') {
    return <i className='fas fa-store'></i>;
  } else if (cardType === 'Techincal') {
    return <i className='fas fa-cogs'></i>;
  } else {
    return <i className='fas fa-spinner'></i>;
  }
};

function QuestionCard(props) {
  const { classes, cardType, questions } = props;

  let quesDisplay;

  if (questions.length > 0) {
    quesDisplay = (
      <ul>
        <li key='0' onClick={() => questionClicked(cardType)} className='text-white h5 mb-4'>
          <Link component='button' color='inherit'>
            <b>{cardType}</b>
          </Link>
        </li>
        {questions.map((item, key) => (
          <li key={key} onClick={() => questionClicked(item)} className='text-white h6 mb-3'>
            <Link component='button' color='inherit'>
              {item}
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className='col col-lg-4 mb-5'>
      <Flippy flipOnHover={true} flipOnClick={false} flipDirection='horizontal'>
        <FrontSide style={{ padding: 0 }}>
          <Card className={classes.card}>
            <CardContent>
              <div>
                {classSelection(cardType)}
                <h5 className='text-white mt-5'>{cardType}</h5>
              </div>
            </CardContent>
          </Card>
        </FrontSide>

        <BackSide style={{ padding: 0 }}>
          <Card className={classes.card}>
            <CardContent>
              <div>{quesDisplay}</div>
            </CardContent>
            <CardActions>
              <Button size='small' className='text-white'>
                See all
              </Button>
            </CardActions>
          </Card>
        </BackSide>
      </Flippy>
    </div>
  );
}

export default withStyles(styles, { withTheme: true })(QuestionCard);
