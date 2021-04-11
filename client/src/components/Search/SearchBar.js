import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';

import '../../App.css';
import Loader from '../Common/Loader';

const { BASE_URL } = require('../../apibase');
const axios = require('axios');

const styles = theme => ({
  search: {
    position: 'relative',
    borderRadius: 0,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
    flexGrow: 1,
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
});

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestions: {},
      text: '',
      focus: false,
      submit: false,
    };
  }

  inputFocus = () => {
    this.setState({ focus: true });
  };

  inputBlur = () => {
    this.setState({ focus: false });
  };

  onSubmit = e => {
    const { text } = this.state;
    const page = 1;
    if (text.length > 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.setState({ text: '' });
        this.props.history.push(`/search/${page}?searchQuery=${text}`);
      }
    }
  };

  onQueryChange = e => {
    const query = e.target.value;

    this.setState({ suggestions: {}, text: query });

    if (query.length > 0) {
      axios
        .get(`${BASE_URL}buyer/search-name?searchQuery=${query}`)
        .then(res => {
          this.setState({ suggestions: res.data });
        })
        .catch(err => console.log(err.data));
    } else {
      this.setState({ suggestions: {} });
    }
  };

  suggestionSelected = value => {
    this.setState({
      suggestions: {},
      text: '',
    });
    const page = 1;
    this.props.history.push(`/search/${page}?searchQuery=${value}`);
  };

  renderSuggestions = () => {
    const { suggestions, text } = this.state;
    let list;

    if (Object.keys(suggestions).length > 0) {
      if (suggestions.product.length > 0 && suggestions.category.length > 0) {
        list = (
          <div className='suggestion-list'>
            <li key='-1' style={{ color: 'grey', marginLeft: '2%' }}>
              Products
            </li>
            {suggestions.product.map((item, key) => (
              <li className='list-item' key={key} onClick={() => this.suggestionSelected(item)}>
                {item}
              </li>
            ))}
            <li key='-2' style={{ color: 'grey', marginLeft: '2%' }}>
              Categories
            </li>
            {suggestions.category.map((item, key) => (
              <li className='list-item' key={key} onClick={() => this.suggestionSelected(item)}>
                {item}
              </li>
            ))}
          </div>
        );
      } else if (suggestions.product.length > 0 && suggestions.category.length === 0) {
        list = (
          <div className='suggestion-list'>
            <li key='-1' style={{ color: 'grey', marginLeft: '2%' }}>
              Products
            </li>
            {suggestions.product.map((item, key) => (
              <li className='list-item' key={key} onClick={() => this.suggestionSelected(item)}>
                {item}
              </li>
            ))}
          </div>
        );
      } else if (suggestions.category.length > 0 && suggestions.product.length === 0) {
        list = (
          <div className='suggestion-list'>
            <li key='-1' style={{ color: 'grey', marginLeft: '2%' }}>
              Categories
            </li>
            {suggestions.category.map((item, key) => (
              <li className='list-item' key={key} onClick={() => this.suggestionSelected(item)}>
                {item}
              </li>
            ))}
          </div>
        );
      }
    }

    // if(focus) {
    if (text.length > 0 && Object.keys(suggestions).length > 0) {
      return list;
    } else if (text.length > 0) {
      list = <Loader width='50px' />;
      return list;
    } else {
      return null;
    }
    // }
  };

  render() {
    const { classes } = this.props;
    const { text } = this.state;

    return (
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder='Search…'
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          onFocus={this.inputFocus}
          onBlur={this.inputBlur}
          onKeyDown={this.onSubmit}
          value={text}
          onChange={this.onQueryChange}
        />
        <div className='searchSuggestions'>{this.renderSuggestions()}</div>
      </div>
    );
  }
}

SearchBar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles, { withTheme: true })(SearchBar));
