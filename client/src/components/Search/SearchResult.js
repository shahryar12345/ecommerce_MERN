import React, { Component } from 'react'
import PropTypes from 'prop-types';
import toRenderProps from 'recompose/toRenderProps';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import withWidth from '@material-ui/core/withWidth';

import '../../style.css';
import ProductCard from '../Dashboard/buyer/ProductCard';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import Loader from '../Common/Loader';

import axios from 'axios';

const { BASE_URL } = require('../../apibase');
const WithWidth = toRenderProps(withWidth());

const styles = theme => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'rgb(227,231,232)'
    },
    pageBody: {
      margin: 30,
      marginTop: 130,
      flexGrow: 1,
      marginLeft: 'auto', 
      marginRight: 'auto'
    },
    productDisplay: {
      justifySelf: "left"
    }
});

class SearchResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: null,
      total: null,
      per_page: null,
      current_page: null,
      loading: false
    }
  }

  componentDidMount() {
    this.getProducts(this.props.location.search, this.props.match.params.pageNumber);
  }

  componentWillReceiveProps(nextProps) {
    this.getProducts(nextProps.location.search, nextProps.match.params.pageNumber);
  }

  getProducts = (query, number) => {
    this.setState({ loading: true });

    axios.get(`${BASE_URL}buyer/search${query}&page=${number}`)
      .then((res) => {
          this.setState({
              products : res.data.products,
              total: res.data.total,
              per_page: res.data.per_page,
              current_page: res.data.page,
              loading: false
          })
      })
      .catch((error) => {
          console.log(error.response);
      });
  }

  loadData = (number) => {
    const { search } = this.props.location;

    this.props.history.push(`/search/${number}${search}`)
  }

  render() {
    const { classes } = this.props;
    const { search} = this.props.location;
    const { pageNumber } = this.props.match.params;
    const { products, total, per_page, current_page, loading } = this.state;
    const lastPage = Math.ceil(total/per_page);
    let data, renderPageNumbers, firstPageItem, lastPageItem;
    const pageNumbers = [];

    if (total) {
      for (let i=1; i<=Math.ceil(total/per_page); i++) {
        pageNumbers.push(i)
      }

      renderPageNumbers = pageNumbers.map(number => {
        return (
            <li key={number} className={Number(pageNumber) === number ? 'page-item active-page' : ''}>
                <a className='page-link' onClick={() => this.loadData(number)}>{number}</a>
            </li>
        )
      })

      firstPageItem = (
        <li key={0} className='page-item'>
            <a className='page-link' onClick={() => this.loadData(1)}>&laquo;</a>
        </li>
      )

      lastPageItem = (
        <li key={lastPage + 1} className='page-item'>
            <a className='page-link' onClick={() => this.loadData(lastPage)}>&raquo;</a>
        </li>
      )
    }

    if (!loading && products) {
      if (products.length === 0) {
        data = (
          <Grid container>
            <p>No product found!</p>
          </Grid>
        )
      } else {
        data = (
            <Grid container>
              {products.map((item, key) =>
              <ProductCard key={item._id} productName={'Shahryar'} ProductObject={item}/>)}
            </Grid>
        )
      }
    } else {
      data = (
          <div>
              <Loader width='160px' />
          </div>
      )
    }

    return (
      <div className={classes.root}>
        <Header />

        <div className={classes.pageBody}>
          <div>Search result for "{search.slice(13, search.length)}":</div>
          
          <div>
            <Grid container>
                { data }
            </Grid>

            <Grid container>
                <ul style={{marginLeft: 'auto', marginRight: 'auto', marginTop: '2%'}} className="pagination">
                    {firstPageItem}
                    {renderPageNumbers}
                    {lastPageItem}
                </ul>
            </Grid>
          </div>
        </div>

        <Footer />                
      </div>
    )
  }
}

SearchResult.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(SearchResult);