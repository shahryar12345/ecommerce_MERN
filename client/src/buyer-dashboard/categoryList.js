import React, { Component } from 'react';

import { BASE_URL } from './../apibase';
import axios from 'axios';

class CategoryList extends Component {
  state = {
    categories: [],
  };

  componentDidMount() {
    this.getCategories();
  }

  getCategories = async () => {
    const res = await axios.get(`${BASE_URL}buyer/category`);

    if (res) {
      this.setState({ categories: res.data });
    }
  };

  render() {
    const { categories } = this.state;

    let displayCategories;

    if (categories.length < 1) {
      displayCategories = null;
    } else {
      displayCategories = categories.map((cate, key) =>
        cate.subCategories.length > 0 ? (
          <div key={cate._id} className='dropright category'>
            <a
              href='#'
              className='list-group-item list-group-item-action d-flex justify-content-between align-items-center dropdown-toggle'>
              {cate.name}
            </a>
            <div className='dropdown-menu open-category'>
              {cate.subCategories.map((sub, key) =>
                sub.subCategories.length > 0 ? (
                  <div key={key} className='dropright sub-category'>
                    <a
                      className='dropdown-item d-flex justify-content-between align-items-center dropdown-toggle'
                      href='#'>
                      {sub.name}
                    </a>
                    <div className='dropdown-menu open-sub-category'>
                      {sub.subCategories.map((subSub, key) => (
                        <a key={key} className='dropdown-item' href='#'>
                          {subSub.name}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <a key={key} className='dropdown-item' href='#'>
                    {sub.name}
                  </a>
                ),
              )}
            </div>
          </div>
        ) : (
          <a key={cate._id} href='#' className='list-group-item list-group-item-action'>
            {cate.name}
          </a>
        ),
      );
    }

    return (
      <div className='category-box'>
        <div className='list-group text-left'>{displayCategories}</div>
      </div>
    );
  }
}

export default CategoryList;
