import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

//MAIN ROUTES
import AdminDashboard from '../admin-dashboard/index';
import SellerDashboard from '../seller-dashboard/index';
import BuyerDashboard from '../buyer-dashboard/index';
import MyReviews from '../buyer-dashboard/myreviews';
import AddReview from '../buyer-dashboard/addreview';
import Product from '../buyer-dashboard/product';
import Onboarding from '../seller-dashboard/Onboarding';
import AdminOnboarding from '../admin-dashboard/Onboarding';
import VerifyAccount from '../admin-dashboard/VerifyAccount';
import Login from '../components/Dashboard/Login';
import AllProducts from '../components/Dashboard/buyer/AllProducts';
import SearchResult from '../components/Search/SearchResult';
import Checkout from '../buyer-dashboard/checkout';
import OrderStatus from '../buyer-dashboard/orderStatus';
import OrderStatusInfo from '../buyer-dashboard/orderStatusInfo';
import FAQ from '../components/FAQs/FAQ';
import ContactUs from '../components/ContactUs/ContactUs';
import EachOrder from '../seller-dashboard/Orders/EachOrder';

export default class AppRoutes extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>

          <Route path='/admin' component={AdminDashboard} />
          <Route path='/sell/' component={SellerDashboard} />
          <Route path='/seller/login' component={Onboarding} />
          <Route path='/adm/login' component={AdminOnboarding} />
          <Route path='/adm/verify' component={VerifyAccount} />
          <Route path='/login' component={Login} />

          <Route exact path='/' component={Login} />
          <Route exact path='/buy' component={BuyerDashboard} />
          <Route exact path='/buy/dashboard' component={BuyerDashboard} />
          <Route path='/buys/product/:ProdID' component={Product} />
          <Route path='/products/:pageNumber' component={AllProducts} />
          <Route path='/search/:pageNumber' component={SearchResult} />
          <Route path='/checkout' component={Checkout} />
          <Route path='/order-status' component={OrderStatus} />
          <Route path='/order-status-info/:orderId' component={OrderStatusInfo} />
          <Route path='/faqs' component={FAQ} />
          <Route path='/contact' component={ContactUs} />
          <Route exact path='/buy/myreviews' component={MyReviews} />
          <Route exact path='/buy/add-review/:productId' component={AddReview} />

        </div>
      </BrowserRouter>
    );
  }
}
