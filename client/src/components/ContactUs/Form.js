import React, { Component } from 'react';

class Form extends Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    orderNumber: '',
    issueType: '',
    message: '',
  };

  inputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  formSubmit = e => {
    e.preventDefault();
    const { firstName, lastName, email, orderNumber, issueType, message } = this.state;
    let formData = {};

    formData.firstName = firstName;
    formData.lastName = lastName;
    formData.email = email;
    formData.orderNumber = orderNumber;
    formData.issueType = issueType;
    formData.message = message;

    console.table(formData);
  };

  render() {
    const { firstName, lastName, email, orderNumber, issueType, message } = this.state;

    return (
      <div className='container-fluid bg-dark text-white text-left py-4'>
        <div className='row'>
          <div className='col-12'>
            <h4 className='h4'>Email Us</h4>
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <p>
              If your enquiry is urgent, please contact us via live chat or call us during our
              opening hours. Our current response time through our contact form is 1 business day.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={this.formSubmit}>
          <div className='row'>
            <div className='col-lg-6'>
              <div className='form-row'>
                <div className='form-group col-lg-6 col-md-6 col-sm-12'>
                  <label>First Name *</label>
                  <input
                    type='name'
                    name='firstName'
                    value={firstName}
                    className='form-control'
                    placeholder='First Name'
                    required
                    onChange={this.inputChange}
                  />
                </div>
                <div className='form-group col-lg-6 col-md-6 col-sm-12'>
                  <label>Last Name *</label>
                  <input
                    type='name'
                    name='lastName'
                    value={lastName}
                    className='form-control'
                    placeholder='Last Name'
                    required
                    onChange={this.inputChange}
                  />
                </div>
              </div>
              <div className='form-row'>
                <div className='form-group col-lg-8 col-md-8 col-sm-12'>
                  <label>Email *</label>
                  <input
                    type='email'
                    name='email'
                    value={email}
                    className='form-control'
                    placeholder='Email'
                    required
                    onChange={this.inputChange}
                  />
                </div>
                <div className='form-group col-lg-4 col-md-4 col-sm-12'>
                  <label>Order Number</label>
                  <input
                    type='name'
                    name='orderNumber'
                    value={orderNumber}
                    className='form-control'
                    placeholder='Order Number'
                    required
                    onChange={this.inputChange}
                  />
                </div>
              </div>
              <div className='form-row'>
                <div className='form-group col-12'>
                  <label>Issue Type *</label>
                  <select
                    name='issueType'
                    value={issueType}
                    className='form-control'
                    onChange={this.inputChange}
                  >
                    <option value=''>Select an issue type</option>
                    <option value='query_error'>I am getting an error message</option>
                    <option value='query_nwio'>I got something different than I ordered</option>
                    <option value='query_range'>I have a question about your product range</option>
                    <option value='query_returns_process'>
                      I have a question about your returns process or policy
                    </option>
                    <option value='query_account'>I have a question regarding my account</option>
                    <option value='query_confirmation'>
                      I have placed an order but didn't get a confirmation
                    </option>
                    <option value='query_order_change'>I'd like to amend my order</option>
                    <option value='query_return_followup'>
                      I'd like to follow up on a return I lodged
                    </option>
                    <option value='query_promotion'>
                      I'd like to know more about a promotional Newsletter I received
                    </option>
                    <option value='query_order_missing'>I'd like to know where my order is</option>
                    <option value='query_returns_faulty'>
                      I'd like to return a faulty product
                    </option>
                    <option value='query_other'>My inquiry is not listed here</option>
                  </select>
                </div>
              </div>
            </div>

            <div className='col-lg-6'>
              <div className='form-row'>
                <div className='form-group col-lg-12'>
                  <label>Message *</label>
                  <textarea
                    name='message'
                    value={message}
                    className='form-control'
                    rows='6'
                    required
                    onChange={this.inputChange}
                  ></textarea>
                </div>
              </div>

              <button type='submit' className='btn btn-block btn-secondary'>
                Submit
              </button>
            </div>
          </div>
        </form>
        {/* Contact Form End */}
      </div>
    );
  }
}

export default Form;
