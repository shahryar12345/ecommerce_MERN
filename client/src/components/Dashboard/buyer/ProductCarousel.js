import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Carousel from 'nuka-carousel';
// import { KeyboardArrowUp, KeyboardArrowDown } from '@material-ui/icons';

const styles = theme => ({
  // margin: {

  // },
  root: {
    display: 'flex',
    flexDirection: 'column',
    color: 'white',
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

  image: {
    width: '100%',
    height: 'auto',
  },
});

class ProductCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mainImg: this.props.productImages ? this.props.productImages[0] : '',
    };

    console.log('console.log(mainImg)');

    console.log(this.state.mainImg);
  }

  // async componentDidMount()
  // {
  //     const { match: { params } } = this.props;
  //     const productId = params.ProdID;
  //     await this.getProductDetail(productId);
  // }

  componentWillReceiveProps(nextProps) {
    // const { match: { params } } = nextProps;
    // const productId = params.ProdID;
    // console.log('productId : ' + productId)
    //await this.getProductDetail(productId);
    this.setState({
      mainImg: nextProps.productImages[0],
    });
    this.changeImage(nextProps.productImages[0]);
  }

  changeImage(img) {
    console.log(img);
    this.setState({
      mainImg: img,
    });
  }

  render() {
    const { classes } = this.props;

    // const listOfData = [
    //   { url: 'https://images.yoox.com/50/50011674jr_14_f.jpg' },
    //   { url: 'https://images.yoox.com/50/50011674jr_14_f.jpg' },
    //   { url: 'https://images.yoox.com/50/50011674jr_14_f.jpg' },
    //   { url: 'https://images.yoox.com/50/50011674jr_14_f.jpg' },
    //   { url: 'https://images.yoox.com/50/50011674jr_14_f.jpg' },
    //   { url: 'https://images.yoox.com/50/50011674jr_14_f.jpg' },
    //   { url: 'https://images.yoox.com/50/50011674jr_14_f.jpg' },
    //   { url: 'https://images.yoox.com/50/50011674jr_14_f.jpg' },
    // ];

    // function CarouselContainer(props) {
    //     // render the carousel structure
    // }

    // function renderCard(index, modIndex, cursor) {
    //     const item = listOfData[modIndex]
    //     // render the item
    //     return (
    //         <div style={{ height: 100, width: 100, borderColor: 'black', borderWidth: 1.5, borderStyle: 'solid', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    //             <img src="https://images.yoox.com/50/50011674jr_14_f.jpg" style={{ width: '70%', height: 'auto' }} />
    //         </div>
    //     )

    // }

    return (
      <Grid container spacing={24}>
        <Grid item sm={12} md={7} lg={8}>
          <img
            src={`${
              this.state.mainImg
                ? 'data:' + this.state.mainImg.mimetype + ';base64,' + this.state.mainImg.buffer
                : ''
            }`}
            className={classes.image}
            alt='carousel'
          />
        </Grid>
        <Grid item sm={0} md={5} lg={4}>
          {/* <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'space-between' }}>

                        <KeyboardArrowUp style={{ fontSize: 90, opacity: 0.4 }} />

                        <div style={{ opacity: 0.6, height: 90, width: 90, marginBottom: 10, borderColor: 'black', borderWidth: 1.5, borderStyle: 'solid', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <img src="https://images.yoox.com/50/50011674jr_14_f.jpg" style={{ width: '70%', height: 'auto' }} />
                        </div>
                        <div style={{ opacity: 0.6, height: 90, width: 90, marginBottom: 10, borderColor: 'black', borderWidth: 1.5, borderStyle: 'solid', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <img src="https://images.yoox.com/50/50011674jr_14_f.jpg" style={{ width: '70%', height: 'auto' }} />
                        </div>
                        <div style={{ height: 90, width: 90, marginBottom: 10, borderColor: 'black', borderWidth: 1.5, borderStyle: 'solid', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <img src="https://images.yoox.com/50/50011674jr_14_f.jpg" style={{ width: '70%', height: 'auto' }} />
                        </div>
                        <div style={{ opacity: 0.6, height: 90, width: 90, borderColor: 'black', borderWidth: 1.5, borderStyle: 'solid', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <img src="https://images.yoox.com/50/50011674jr_14_f.jpg" style={{ width: '70%', height: 'auto' }} />
                        </div>

                        <KeyboardArrowDown style={{ fontSize: 90, opacity: 0.4 }} />
                    </div> */}

          {/* <TouchCarousel
                        component={CarouselContainer}
                        cardCount={listOfData.length}
                        cardSize={375}
                        renderCard={renderCard}
                        loop
                        autoplay={3000}
                    /> */}

          <Carousel
            style={{ height: '100%' }}
            slidesToShow={5}
            // cellAlign="center"
            vertical={true}
            withoutControls
            cellSpacing={110}>
            {this.props.productImages
              ? this.props.productImages.map((item, key) => (
                  <div
                    onClick={() => this.changeImage(item)}
                    style={{
                      height: 100,
                      width: 100,
                      borderColor: 'black',
                      borderWidth: 1.5,
                      borderStyle: 'solid',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <img
                      src={`${'data:' + item.mimetype + ';base64,' + item.buffer}`}
                      style={{ width: '70%', height: 'auto' }}
                      alt='product'
                    />
                  </div>
                ))
              : null}
            {/* <div onClick={() => this.changeImage('https://images.yoox.com/50/50011674jr_14_f.jpg')} style={{ height: 100, width: 100, borderColor: 'black', borderWidth: 1.5, borderStyle: 'solid', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <img src="https://images.yoox.com/50/50011674jr_14_f.jpg" style={{ width: '70%', height: 'auto' }} />
                        </div>
                        <div style={{ height: 100, width: 100, borderColor: 'black', borderWidth: 1.5, borderStyle: 'solid', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <img src="https://images.yoox.com/50/50011674jr_14_f.jpg" style={{ width: '80%', height: 'auto' }} />
                        </div>
                        <div style={{ height: 100, width: 100, borderColor: 'black', borderWidth: 1.5, borderStyle: 'solid', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <img src="https://images.yoox.com/50/50011674jr_14_f.jpg" style={{ width: '80%', height: 'auto' }} />
                        </div>
                        <div style={{ height: 100, width: 100, borderColor: 'black', borderWidth: 1.5, borderStyle: 'solid', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <img src="https://images.yoox.com/50/50011674jr_14_f.jpg" style={{ width: '80%', height: 'auto' }} />
                        </div>
                        <div style={{ height: 100, width: 100, borderColor: 'black', borderWidth: 1.5, borderStyle: 'solid', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <img src="https://images.yoox.com/50/50011674jr_14_f.jpg" style={{ width: '80%', height: 'auto' }} />
                        </div>
                        <div style={{ height: 100, width: 100, borderColor: 'black', borderWidth: 1.5, borderStyle: 'solid', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <img src="https://images.yoox.com/50/50011674jr_14_f.jpg" style={{ width: '80%', height: 'auto' }} />
                        </div> */}
          </Carousel>
        </Grid>
      </Grid>
    );
  }
}

ProductCarousel.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(ProductCarousel);
