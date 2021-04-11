import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Alert from 'react-s-alert';

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import { Button } from '@material-ui/core';

import axios from 'axios';
import { BASE_URL } from './../../../apibase';

const styles = theme => ({
  cardContent: {
    marginLeft: 50,
    marginRight: 50,
    marginBottom: 20,
    [theme.breakpoints.down('md')]: {
      marginLeft: 30,
      marginRight: 30,
    },
    [theme.breakpoints.down('sm')]: {
      marginLeft: 20,
      marginRight: 20,
    },
    [theme.breakpoints.down('xs')]: {
      marginLeft: 10,
      marginRight: 10,
    },
  },
  textFieldMulti: {
    marginLeft: 10,
    marginRight: 10,
  },
  card: {
    marginTop: 30,
  },
  cardContent2: {
    marginBottom: 0,
  },
  buttonType1: {
    backgroundColor: 'rgb(39,44,48)',
    boxShadow: 'none',
    color: 'rgb(236,239,234)',
    '&:hover': {
      backgroundColor: 'rgb(48,54,58)',
    },
    '&:focus': {
      boxShadow: 'none',
    },
  },
  buttonType2: {
    color: 'rgb(39,44,48)',
  },
  root: {
    '&$checked': {
      color: 'rgb(53,60,66)',
    },
  },
  checked: {},
  link: {
    color: '#272C30',
    '&:hover': {
      color: '#272C30',
      textDecoration: 'none',
    },
  },
  approvalCheckBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previousFormSubmittedError: {
    fontSize: '105%',
    color: 'red',
  },
});

class RequestApproval extends Component {
  constructor(props) {
    super(props);
    this.state = {
      term_condition_Checked: false,
      privacy_policy_Checked: false,
      dataSending: false,
    };
    // this.getApproval();
  }

  // getApproval = () => {
  //   axios
  //     .get(BASE_URL + 'seller/pendingrequest', { withCredentials: true })
  //     .then(response => {
  //       console.log(response.data);
  //     })
  //     .catch(error => {
  //       console.log(error.response);
  //     });
  // };

  submitForApproval = () => {
    this.setState({ dataSending: true });

    const { sellerDataFromLocation } = this.props.location;
    const { sellerData } = this.props;

    if (sellerDataFromLocation) {
      if (
        sellerDataFromLocation.sellerAddresses.length < 1 ||
        sellerDataFromLocation.idInformation.length < 1 ||
        sellerDataFromLocation.bankDetails.length < 1
      ) {
        this.setState({ dataSending: false });

        return Alert.error(
          'Kindly fill the previous steps first! If you already have filled all the forms, try reloading this page adn then submit it.',
          {
            position: 'bottom-right',
            effect: 'slide',
          },
        );
      }
    } else if (!sellerDataFromLocation) {
      if (
        sellerData.sellerAddresses.length < 1 ||
        sellerData.idInformation.length < 1 ||
        sellerData.bankDetails.length < 1
      ) {
        this.setState({ dataSending: false });

        return Alert.error(
          'Kindly fill the previous steps first! If you already have filled all the forms, try reloading this page adn then submit it.',
          {
            position: 'bottom-right',
            effect: 'slide',
          },
        );
      }
    }

    const json = {};
    axios
      .post(BASE_URL + 'seller/approval-request', json, { withCredentials: true })
      .then(response => {
        console.log(response);
        this.setState({ dataSending: false });

        if (response.data.status === 'success') {
          Alert.success('Request Sent Successfully', {
            position: 'bottom-right',
            effect: 'slide',
          });

          this.props.history.push('/sell/dashboard');
        }
      })
      .catch(error => {
        this.setState({ dataSending: false });
        console.log(error.response);

        Alert.error('Kindly fill the previous steps first', {
          position: 'bottom-right',
          effect: 'slide',
        });
      });
  };

  handleValueChange = name => event => {
    if (name === 'term_condition_Checked') {
      this.setState({
        term_condition_Checked: !this.state.term_condition_Checked,
      });
    } else if (name === 'privacy_policy_Checked') {
      this.setState({
        privacy_policy_Checked: !this.state.privacy_policy_Checked,
      });
    }
  };

  render() {
    const { classes, sellerData } = this.props;
    const { term_condition_Checked, privacy_policy_Checked } = this.state;

    console.log('request approval', this.props);

    // let previousFormSubmitted = true;

    // if (
    //   sellerData.sellerAddresses.length < 1 ||
    //   sellerData.idInformation.length < 1 ||
    //   sellerData.bankDetails.length < 1
    // ) {
    //   previousFormSubmitted = false;
    // }

    return (
      <div className={classes.root}>
        <form>
          <Grid item sm={12} md={12} lg={12}>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent2}>
                <Grid container spacing={40}>
                  <Grid item sm={12} md={12} lg={12}>
                    <Typography variant='h4' align='center' className={classes.pageTitle}>
                      Terms & Conditions
                    </Typography>
                  </Grid>
                  <Grid item sm={1} md={1} lg={1}></Grid>
                  <Grid item sm={10} md={10} lg={10}>
                    <Typography variant='body2' align='left' className={classes.pageTitle}>
                      <strong>WHAT PARTS OF THESE TERMS APPLY TO ME? </strong> <br />
                      This agreement governs your use of the Lashcart platform, accessible at
                      Lashcart.com and Lashcart.com.au (Platform) and any goods or services <br />
                      made available through the Platform. By using the Platform, you agree to be
                      bound by this agreement which forms a <br />
                      binding contractual agreement between you, the User, and us, LASH CORPORATION
                      PROPRIETARY LIMITED ABN 58 631 616 156 (Lashcart, Lashcart, we or us). <br />
                      The remainder of this agreement is divided into three parts: <br />
                      • ‎Part 1 (All Users), which sets out terms that apply to all Users; <br />
                      • Part 2 (Sellers), which sets out additional terms that apply to Sellers,
                      being Users who register for a Seller Account and/or offer to <br />
                      sell goods or services through the Platform; and <br />• Part 3 (Customers),
                      which sets out additional terms that apply to Customers, being Users who
                      register for a Customer Account and/or offer <br />
                      to sell goods or services through the Platform. <br />
                      If you intend to use the Platform as a Seller, only Parts ‎1 and ‎2 of these
                      terms will apply to you. <br />
                      If you intend to use the Platform as a Customer, only Parts ‎1 and ‎3 of these
                      terms will apply to you. <br />
                      When we talk about the "Goods" in this agreement, we are referring to the
                      goods available through the Website via Sellers.
                    </Typography>
                  </Grid>
                  <Grid item sm={12} md={12} lg={12}>
                    <Typography variant='h6' align='center' className={classes.pageTitle}>
                      Part 1 : ALL USERS
                    </Typography>
                  </Grid>
                  <Grid item sm={1} md={1} lg={1}></Grid>
                  <Grid item sm={10} md={10} lg={10}>
                    <Typography variant='body2' align='left' className={classes.pageTitle}>
                      1. <strong>ELIGIBILITY</strong> <br />
                      (a) This Platform is not intended for unsupervised use by any person under the
                      age of 18 years old or any person who has previously <br />
                      been suspended or prohibited from using the Platform. By using the Platform,
                      you represent and warrant that you are either: <br />
                      &nbsp; (i) over the age of 18 years and accessing the Platform for personal
                      use; or <br />
                      &nbsp; (ii) accessing the Platform on behalf of someone under the age of 18
                      years old and consent to that person's use of the Platform. <br />
                      (b) Please do not access the Platform if you are under the age of 18 years old
                      and do not have your parent or guardian's consent, or if you <br />
                      have previously been suspended or prohibited from using the Platform. <br />
                      (c) If you use the Platform on behalf of a company or organisation you warrant
                      that you have the necessary authority from that company or <br />
                      organisation to do so. If you are signing up not as an individual but on
                      behalf of your company, your employer, an organisation, government <br />
                      or other legal entity (Represented Entity), then “you” or “User” means the
                      Represented Entity and you are binding the Represented Entity to this <br />
                      agreement. If you are accepting this agreement and using our Platform on
                      behalf of a Represented Entity, you represent and warrant that you are <br />
                      authorised to do so.
                      <br />
                      <br />
                      2. <strong>ACCOUNTS</strong> <br />
                      (a) In order to use most of the functionality of the Platform, all Users are
                      required to sign-up, register and receive an account through the <br />
                      Platform (an Account).
                      <br />
                      (b) As part of the Account registration process and as part of your continued
                      use of the Platform, you are required to provide personal <br />
                      information and details, such as your email address, first and last name,
                      preferred username, a secure password, billing, postal and
                      <br />
                      physical addresses, mobile phone number, bank account information, and other
                      information as determined by Lashcart from time to time.
                      <br />
                      (c) You warrant that any information you give to Lashcart in the course of
                      completing the Account registration process will always be <br />
                      accurate, honest, correct and up-to-date.
                      <br />
                      (d) Correspondence between Users must take place on the Platform. You agree to
                      ensure that your Account does not display any of your personal <br />
                      contact information at any time such that it can be viewed by any other User.
                      You agree to not give your contact details to any other User. <br />
                      (e) Once you complete the Account registration process, Lashcart may, in its
                      absolute discretion, choose to accept you as a registered user within <br />
                      the Platform and provide you with an Account.
                      <br />
                      (f) Lashcart reserves the right to contact you about any concerning behaviour
                      by you, or to seek a resolution with you.
                      <br />
                      (g) Lashcart may, in its absolute discretion, suspend or cancel your Account
                      for any reason, including for any failure to comply with this agreement.
                      <br />
                      <br />
                      <br />
                      3. <strong>USER OBLIGATIONS</strong> <br />
                      As a User, you agree: <br />
                      (a) not to intimidate, harass, impersonate, stalk, threaten, bully or endanger
                      any other User or distribute unsolicited commercial content, <br />
                      junk mail, spam, bulk content or harassment;
                      <br />
                      (b) to not share your Account with any other person and that any use of your
                      Account by any other person is strictly prohibited. You must <br />
                      immediately notify Lashcart of any unauthorised use of your Account, password
                      or email, or any other breach or potential breach <br />
                      of the Platform's security;
                      <br />
                      (c) to not use the Platform for any purpose other than for the purpose of
                      making arrangements to provide or receive Goods, including:
                      <br />
                      &nbsp; (i) you must not use the Platform in a manner that is illegal or
                      fraudulent or facilitates illegal or fraudulent activity <br />
                      &nbsp; (including requesting or accepting a job which includes illegal
                      activities or purposes); and <br />
                      &nbsp; (ii) you must not use the Platform in connection with any commercial or
                      money making or other promotional or marketing endeavours <br />
                      &nbsp; except those that are endorsed herein, or as approved in writing by
                      Lashcart; <br />
                      (d) not to act in any way that may harm the reputation of Lashcart or
                      associated or interested parties or do anything at all contrary to the <br />
                      interests of Lashcart or the Platform;
                      <br />
                      (e) you must not make any automated use of the Platform and you must not copy,
                      reproduce, translate, adapt, vary or modify the Platform without the <br />
                      expres written consent of Lashcart; <br />
                      (f) that Lashcart may change any features of the Platform or Goods offered
                      through the Platform at any time without notice to you;
                      <br />
                      (g) that information given to you through the Platform, by Lashcart or another
                      User including a Seller, is general in nature and we take no <br />
                      responsibility for anything caused by any actions you take in reliance on that
                      information; and <br />
                      (h) that Lashcart may cancel your account at any time if it considers, in its
                      absolute discretion, that you are in breach or are likely to breach <br />
                      this clause ‎3; <br />
                      (i) that in making or receiving any payments via the Platform, you warrant
                      that you have read, understood and agree to be bound by Stripe.com terms{' '}
                      <br />
                      at https://stripe.com/au/legal, or the terms of use of other third party
                      payment portals or other payment methods from time to time, that will be
                      available <br />
                      on the Stripe website and other payment portal websites.
                      <br />
                      <br />
                      4. <strong>POSTED MATERIALS</strong> <br />
                      4.1 WARRANTIES <br />
                      By providing or posting any information, materials or other content on the
                      Platform (Posted Material), you represent and warrant that: <br />
                      (a) you are authorised to provide the Posted Material (including by being
                      authorised to provide any services that you represent you provide);
                      <br />
                      (b) the Posted Material is accurate and true at the time it is provided;
                      <br />
                      (c) any Posted Material which is in the form of a review or feedback is
                      honest, accurate and presents a fair view of the relevant person <br />
                      and/or your experience; <br />
                      (d) the Posted Material is free from any harmful, discriminatory, defamatory
                      or maliciously false implications and does not contain any <br />
                      offensive or explicit material; <br />
                      (e) the Posted Material is not "passing off" of any product or service and
                      does not constitute unfair competition; <br />
                      (f) the Posted Material does not infringe any Intellectual Property Rights,
                      including copyright, trademarks, business names, patents, <br />
                      confidential information or any other similar proprietary rights, whether
                      registered or unregistered, anywhere in the world; <br />
                      (g) the Posted Material does not contain any viruses or other harmful code, or
                      otherwise compromise the security or integrity of the <br />
                      Platform or any network or system; and <br />
                      (h) the Posted Material does not breach or infringe any applicable laws.
                      <br />
                      <br />
                      4.2 LICENCE
                      <br />
                      (a) You grant to Lashcart a perpetual, irrevocable, transferable, worldwide
                      and royalty-free licence (including the right to sublicense) <br />
                      to use, copy, modify, reproduce and adapt any Intellectual Property Rights in
                      any Posted Material in order for Lashcart to use, <br />
                      exploit or otherwise enjoy the benefit of such Posted Material. <br />
                      (b) If it is determined that you retain moral rights (including rights of
                      attribution or integrity) in any Posted Material, you forever <br />
                      release Lashcart from any and all claims that you could assert against
                      Lashcart by virtue of any such moral rights. <br />
                      (c) You indemnify Lashcart against all damages, losses, costs and expenses
                      incurred by Lashcart arising out of any third party claim that your <br />
                      Posted Material infringes any third party's Intellectual Property Rights.
                      <br />
                      <br />
                      4.3 REMOVAL
                      <br />
                      (a) Lashcart acts as a passive conduit for the online distribution of Posted
                      Material and has no obligation to screen Posted Material in advance <br />
                      of it being posted. However, Lashcart may, in its absolute discretion, review
                      and remove any Posted Material (including links to you, your <br />
                      profile or listings you have posted on the Platform) at any time without
                      giving any explanation or justification for removing the Posted Material.
                      <br />
                      (b) You agree that you are responsible for keeping and maintaining records of
                      Posted Material.
                      <br />
                      <br />
                      <br />
                      5. <strong>REFUNDS, SERVICE INTERRUPTIONS AND CANCELLATIONS </strong> <br />
                      Lashcart will have no liability or obligation to you if: <br />
                      (a) a Customer or Seller cancels at any time after the time for performance of
                      the Listing is agreed; or <br />
                      (b) for whatever reason, including technical faults, the Goods cannot be
                      provided, and you will not be entitled to any compensation from Lashcart.
                      <br />
                      <br />
                      <br />
                      6. <strong>IDENTITY VERIFICATION</strong> <br />
                      (a) (Verification) We may offer or require Users to verify their details,
                      using our processes or an external identity verification service <br />
                      as applicable (Verification Service). <br />
                      (b) (Your personal information and privacy) We will collect your personal
                      information in accordance with our Privacy Policy as set out in clause ‎16.
                      <br />
                      Where a Verification Service is used, you acknowledge and agree that: <br />
                      &nbsp; (i) we may contact and share your personal information with a
                      Verification Service to verify your details;
                      <br />
                      &nbsp; (ii) you consent to us receiving, sharing and using this information to
                      enable us to carry out Verification Services.
                      <br />
                      (c) (Fees) We may charge non-refundable fees for Verification Services, as set
                      out on the Platform. <br />
                      (d) (Warranty and Indemnity) You acknowledge and agree that: <br />
                      &nbsp; (i) we are reliant on the information provided by the Verification
                      Service to verify your identity and to the extent permitted by law, <br />
                      we disclaim all warranties that the Verification Services will be accurate or
                      guarantee that Verification Services will ensure <br />
                      you contract with a suitable User; <br />
                      &nbsp; (ii) you should make your own inquiries as to other Users’ identities
                      before engaging in contracts with those Users; and <br />
                      &nbsp; (iii) we do not endorse any User, Listing or Verification Service.{' '}
                      <br />
                      <br />
                      <br />
                      7. <strong>RATINGS AND REVIEWS</strong> <br />
                      (a) Customers may rate a Listing, and Sellers may rate a Customer (each a
                      ‘Rating’) and Users may provide feedback to other Users regarding <br />
                      the relevant Goods or experience with that User (Review). <br />
                      (b) Ratings and Reviews may be able to be viewed by other Users and these may
                      remain viewable until the relevant Account and/or <br />
                      Listing is removed or terminated. <br />
                      (c) Users must provide true, fair and accurate information in their Reviews.
                      <br />
                      (d) If we consider that a Review is untrue, unfair, inaccurate, offensive or
                      inappropriate, we may delete the Review or ban the relevant <br />
                      User from posting the Review. We do not undertake to review each Review made
                      by a User. <br />
                      (e) To the maximum extent permitted by law, we are not responsible for the
                      content of any Reviews.
                      <br />
                      (f) You may not publish Reviews for Users to which you have personal or
                      professional relations.
                      <br />
                      (g) Users can only write a Review about another User if they have had a buying
                      or selling experience with that User, which means that:
                      <br />
                      &nbsp; (i) they have purchased a product or service from that Seller; or
                      <br />
                      &nbsp; (ii) they have sold a product or service to that Customer;
                      <br />
                      &nbsp; (iii) you have placed an order with the Seller;
                      <br />
                      &nbsp; (iv) you have had an order placed with you by the Customer; or
                      <br />
                      &nbsp; (v) you can otherwise document that you had a buying or selling
                      experience with that User, including via correspondence or <br />
                      other interaction with the User,
                      <br />
                      (collectively referred to as a Service Experience).
                      <br />
                      (h) You may only write about your own Service Experience. You are not
                      permitted to write a Review about somebody else’s Service <br />
                      Experience, such as that of a family member or friend. <br />
                      (i) You may not write a review about a Seller you have previously owned,
                      currently own, or which an immediate family member <br />
                      currently owns, or if you are an executive or employee of that Seller, or work
                      for the Seller. Similarly, you may not write
                      <br />
                      a Review about a direct competitor to the Seller you own, are employed by or
                      work for. <br />
                      (j) Your Service Experience must have occurred within the last 12 months. This
                      means within 12 months from the date on which you <br />
                      write the Review. (k) You are encouraged to be specific and factual in your
                      Reviews. If you have been offered an incentive by a User to write a Review,
                      <br />
                      you should include information about this in your Review. Incentives include
                      the User offering you a gift, reward, discount or <br />
                      advantage for writing a Review about the User on the Platform. <br />
                      <br />
                      <br />
                      8. <strong>SERVICE LIMITATIONS</strong> <br />
                      The Platform is made available to you strictly on an 'as is' basis. Without
                      limitation, you acknowledge and agree that Lashcart cannot <br />
                      and does not represent, warrant or guarantee that: <br />
                      (a) the Platform will be free from errors or defects;
                      <br />
                      (b) the Platform will be accessible at all times;
                      <br />
                      (c) messages sent through the Platform will be delivered promptly, or
                      delivered at all;
                      <br />
                      (d) information you receive or supply through the Platform will be secure or
                      confidential; or
                      <br />
                      (e) any information provided through the Platform is accurate or true.
                      <br />
                      <br />
                      <br />
                      9. <strong>INTELLECTUAL PROPERTY</strong>
                      <br />
                      (a) Lashcart retains ownership of all materials developed or provided (or
                      both, as the case may be) in connection with the Platform <br />
                      and the Goods (including text, graphics, logos, design, icons, images, sound
                      and video recordings, pricing, downloads and software) <br />
                      (Platform Content) and reserves all rights in any Intellectual Property Rights
                      owned or licensed by it not expressly granted to you.
                      <br />
                      (b) You may make a temporary electronic copy of all or part of the Platform
                      Content for the sole purpose of viewing it. You must not otherwise <br />
                      reproduce, transmit, adapt, distribute, sell, modify or publish the Platform
                      Content without prior written consent from Lashcart or as permitted by law.
                      <br />
                      (c) In this clause ‎9, "Intellectual Property Rights" means all copyright,
                      trade mark, design, patent, semiconductor and circuit layout rights, <br />
                      trade, business, company and domain names, confidential and other proprietary
                      rights, and any other rights to registration of such rights <br />
                      whether created before or after the date of this agreement both in Australia
                      and throughout the world.
                      <br />
                      <br />
                      <br />
                      10. <strong>THIRD PARTY CONTENT</strong> <br />
                      The Platform may contain text, images, data and other content provided by a
                      third party and displayed on the Platform (Third Party Content). Lashcart{' '}
                      <br />
                      accepts no responsibility for Third Party Content and makes no representation,
                      warranty or guarantee about the quality, suitability, accuracy, reliability,
                      <br />
                      currency or completeness of Third Party Content. <br />
                      <br />
                      <br />
                      11.<strong>THIRD PARTY TERMS </strong> <br />
                      (a) Any service that requires Lashcart to acquire goods and services supplied
                      by a third party on behalf of the Customer (including a third party payment
                      service,
                      <br />
                      like Stripe.com) may be subject to the terms and conditions of that third
                      party (Third Party Terms), including 'no refund' policies. <br />
                      (b) Users agree to familiarise themselves with any Third Party Terms
                      applicable to any such goods and services and, by instructing Lashcart to
                      acquire the goods or <br />
                      services on the User’s behalf, the User will be taken to have agreed to such
                      Third Party Terms. <br />
                      <br />
                      <br />
                      12. <strong>DISPUTES BETWEEN USERS </strong>
                      <br />
                      (a) You should direct any complaint relating to another User to that User.
                      Users must take all reasonable steps to resolve any dispute with another User
                      with that User. <br />
                      (b) If any issue or problem relating to the Platform remains unresolved after
                      directing a complaint to a relevant User, or if the complaint does not relate
                      to another User, <br />
                      you must report it to Lashcart via pr@lashcart.com.au. We will assess the
                      complaint and attempt to quickly and satisfactorily resolve it.
                      <br />
                      (c) Lashcart reserves the right to hold funds in relation to a dispute until
                      the dispute is resolved, either by us, the relevant parties or by a mediator
                      or arbitrator. <br />
                      We reserve the right to disperse funds held by us as we see fit, including by
                      providing a Customer a refund.
                      <br />
                      (d) Any costs you incur in relation to a complaint or dispute will be your
                      responsibility.
                      <br />
                      (e) Lashcart has the option to appoint an independent mediator or arbitrator
                      if needed. The cost of any mediator or arbitrator must be shared equally
                      between each of <br />
                      the parties to the dispute. <br />
                      (f) If you have a dispute with Lashcart, you agree to notify us first and
                      enter into discussion, mediation or arbitration with us for a minimum of a
                      120-day period before
                      <br />
                      pursuing any other proceedings. <br />
                      (g) Notwithstanding any other provision of this clause ‎12, you or Lashcart
                      may at any time cancel your Account or discontinue your use of the Platform.
                      <br />
                      <br />
                      <br />
                      13. <strong>SECURITY</strong>
                      <br />
                      Lashcart does not accept responsibility for loss or damage to computer
                      systems, mobile phones or other electronic devices arising in connection with
                      your use of <br />
                      the Platform. You should take your own precautions to ensure that the process
                      you employ to access the Platform does not expose you to the risk of viruses,
                      malicious <br />
                      computer code or other forms of interference.
                      <br />
                      <br />
                      <br />
                      14. <strong>DISCLAIMER</strong>
                      <br />
                      (a) (Introduction service) Lashcart is a medium that facilitates the
                      introduction of Customers and Sellers for the purposes of buying and selling
                      Goods. <br />
                      Lashcart simply collects a service fee in consideration for providing this
                      introduction service and does not have any obligations or liabilities to,{' '}
                      <br />
                      and is not a party to any contract between, Customers and Sellers in relation
                      to such Goods or otherwise resulting from the introduction. <br />
                      (b) (Limitation of liability) To the maximum extent permitted by applicable
                      law, Lashcart excludes completely all liability to any person for loss or
                      damage <br />
                      of any kind, however arising whether in contract, tort (including negligence),
                      statute, equity, indemnity or otherwise, arising from or relating in any way{' '}
                      <br />
                      to the Platform or its use or any services provided by any Seller. This
                      includes the transmission of any computer virus. <br />
                      (c) (Disclaimer) All express or implied representations and warranties are, to
                      the maximum extent permitted by applicable law, excluded. Where any law <br />
                      (including the Competition and Consumer Act 2010 (Cth)) implies a condition,
                      warranty or guarantee into this agreement which may not lawfully be excluded,{' '}
                      <br />
                      then to the maximum extent permitted by applicable law, Lashcart's liability
                      for breach of that non-excludable condition, warranty or guarantee will, at
                      our option, <br />
                      be limited to:
                      <br />
                      &nbsp; (i) in the case of goods, their replacement or the supply of equivalent
                      goods or their repair; and
                      <br />
                      &nbsp; (ii) in the case of services, the supply of the services again, or the
                      payment of the cost of having them supplied again.
                      <br />
                      (d) (Indemnity) You agree to indemnify Lashcart and its employees and agents
                      in respect of all liability for loss, damage or injury which may be suffered
                      by any person <br />
                      arising from you or your representatives': <br />
                      &nbsp; (i) breach of any term of this agreement; <br />
                      &nbsp; (ii) use of the Platform; or <br />
                      &nbsp; (iii) your provision or receipt of Goods from another User.
                      <br />
                      (e) (Consequential loss) To the maximum extent permitted by law, under no
                      circumstances will Lashcart be liable for any incidental, special or
                      consequential loss or <br />
                      damages, or damages for loss of data, business or business opportunity,
                      goodwill, anticipated savings, profits or revenue arising under or in
                      connection with the Platform, <br />
                      this agreement or their subject matter, or any services provided by any Seller
                      (except to the extent this liability cannot be excluded under the Competition
                      and <br />
                      Consumer Act 2010 (Cth)). 15. <strong>CONFIDENTIALITY </strong>
                      <br />
                      You agree that: <br />
                      (a) no information owned by Lashcart, including system operations, documents,
                      marketing strategies, staff information and client information, may be
                      disclosed or
                      <br />
                      made available to any third parties; and <br />
                      (b) all communications involving the details of other users on this Platform
                      and of the Seller are confidential, and must be kept as such by you and must
                      not be <br />
                      distributed nor disclosed to any third party. <br />
                      <br />
                      <br />
                      16. <strong>PRIVACY</strong>
                      <br />
                      You agree to be bound by the clauses outlined in Lashcart's Privacy Policy,
                      which can be accessed here LINK. <br />
                      <br />
                      <br />
                      17. <strong>TERMINATION </strong>
                      <br />
                      (a) Lashcart reserves the right to terminate a User's access to any or all of
                      the Platform (including any listings and memberships) at any time without
                      notice, <br />
                      for any reason. <br />
                      (b) In the event that a User's membership is terminated: <br />
                      &nbsp; (i) the User's access to all posting tools on the Platform will be
                      revoked; <br />
                      &nbsp; (ii) the User will be unable to view the details of all other Users
                      (including contact details, geographic details, any other personal details and
                      service <br />
                      listings or requests); and <br />
                      &nbsp; (iii) the User may be unable to view the details of all other Sellers
                      (including contact details, geographic details and any other details), and all
                      Listings <br />
                      previously posted by the respective User will also be removed from the
                      Platform. <br />
                      (c) Users may terminate their membership on Lashcart at any time by using the
                      Platform's functionality where such functionality is available. Where such
                      functionality <br />
                      is not available, Lashcart will effect such termination within a reasonable
                      time after receiving written notice from the User. <br />
                      (d) Notwithstanding termination or expiry of your membership or this
                      agreement, the provisions of ‎Part 1 and any other provision which by its
                      nature would reasonably <br />
                      be expected to be complied with after termination or expiry, will continue to
                      apply. <br />
                      <br />
                      <br />
                      18. <strong>TAX</strong> <br />
                      You are responsible for the collection and remission of all taxes associated
                      with the services you provide or receive or any transactions through your use
                      of the Platform, <br />
                      and Lashcart will not be held accountable in relation to any transactions
                      between Customers and Sellers where tax related misconduct has occurred.{' '}
                      <br />
                      <br />
                      <br />
                      19. <strong>RECORD / AUDIT </strong>
                      <br />
                      To the extent permitted by law, Lashcart reserves the right to keep all
                      records of any and all transactions and communications made through this
                      Platform between you and other <br />
                      Users (including conversations, user posts, job request bids, comments,
                      feedback, cookies, and I.P. address information) for administration purposes
                      and also holds the right to <br />
                      produce these records in the event of any legal dispute involving Lashcart.{' '}
                      <br />
                      <br />
                      <br />
                      20. <strong>NOTICES </strong> <br />A notice or other communication to a party
                      under this agreement must be: <br />
                      (a) in writing and in English; and <br />
                      (b) delivered via email to the other party, to the email address specified in
                      this agreement, or if no email address is specified in this agreement, then
                      the email address <br />
                      most regularly used by the parties to correspond for the purposes of the
                      subject matter of this agreement as at the date of this agreement (Email
                      Address). The parties may <br />
                      update their Email Address by notice to the other party. <br />
                      (c) Unless the party sending the notice knows or reasonably ought to suspect
                      that an email was not delivered to the other party's Email Address, notice
                      will be taken to be given: <br />
                      &nbsp; (i) 24 hours after the email was sent; or <br />
                      &nbsp; (ii) when replied to by the other party, <br />
                      whichever is earlier.
                      <br />
                      <br />
                      <br />
                      21. <strong>GENERAL </strong> <br />
                      21.1 GOVERNING LAW AND JURISDICTION <br />
                      This agreement is governed by the law applying in New South Wales, Australia.
                      Each party irrevocably submits to the exclusive jurisdiction of the courts of
                      New South Wales, <br />
                      Australia and courts of appeal from them in respect of any proceedings arising
                      out of or in connection with this agreement. Each party irrevocably waives any
                      objection to the <br />
                      venue of any legal process on the basis that the process has been brought in
                      an inconvenient forum.
                      <br />
                      21.2 WAIVER
                      <br />
                      No party to this agreement may rely on the words or conduct of any other party
                      as a waiver of any right unless the waiver is in writing and signed by the
                      party granting <br />
                      the waiver. <br />
                      21.3 SEVERANCE <br />
                      Any term of this agreement which is wholly or partially void or unenforceable
                      is severed to the extent that it is void or unenforceable. The validity and
                      enforceability of the
                      <br />
                      remainder of this agreement is not limited or otherwise affected. <br />
                      21.4 JOINT AND SEVERAL LIABILITY <br />
                      An obligation or a liability assumed by, or a right conferred on, two or more
                      persons binds or benefits them jointly and severally. <br />
                      21.5 ASSIGNMENT <br />
                      A party cannot assign, novate or otherwise transfer any of its rights or
                      obligations under this agreement without the prior written consent of the
                      other party. <br />
                      21.6 COSTS <br />
                      Except as otherwise provided in this agreement, each party must pay its own
                      costs and expenses in connection with negotiating, preparing, executing and
                      performing this agreement. <br />
                      21.7 ENTIRE AGREEMENT <br />
                      This agreement embodies the entire agreement between the parties and
                      supersedes any prior negotiation, conduct, arrangement, understanding or
                      agreement, express or implied, <br />
                      in relation to the subject matter of this agreement. <br />
                      21.8 INTERPRETATION <br />
                      (a) (singular and plural) words in the singular includes the plural (and vice
                      versa); <br />
                      (b) (gender) words indicating a gender includes the corresponding words of any
                      other gender;
                      <br />
                      (c) (defined terms) if a word or phrase is given a defined meaning, any other
                      part of speech or grammatical form of that word or phrase has a corresponding
                      meaning; <br />
                      (d) (person) a reference to "person" or "you" includes an individual, the
                      estate of an individual, a corporation, an authority, an association,
                      consortium or joint venture <br />
                      (whether incorporated or unincorporated), a partnership, a trust and any other
                      entity; <br />
                      (e) (party) a reference to a party includes that party's executors,
                      administrators, successors and permitted assigns, including persons taking by
                      way of novation and, <br />
                      in the case of a trustee, includes any substituted or additional trustee;{' '}
                      <br />
                      (f) (this agreement) a reference to a party, clause, paragraph, schedule,
                      exhibit, attachment or annexure is a reference to a party, clause, paragraph,
                      schedule, exhibit, <br />
                      attachment or annexure to or of this agreement, and a reference to this
                      agreement includes all schedules, exhibits, attachments and annexures to it;{' '}
                      <br />
                      (g) (document) a reference to a document (including this agreement) is to that
                      document as varied, novated, ratified or replaced from time to time; <br />
                      (h) (headings) headings and words in bold type are for convenience only and do
                      not affect interpretation; <br />
                      (i) (includes) the word "includes" and similar words in any form is not a word
                      of limitation; and <br />
                      (j) (adverse interpretation) no provision of this agreement will be
                      interpreted adversely to a party because that party was responsible for the
                      preparation of this <br />
                      agreement or that provision. <br />
                      <br />
                      <br />
                    </Typography>
                  </Grid>

                  <Grid item sm={12} md={12} lg={12}>
                    <Typography variant='h6' align='center' className={classes.pageTitle}>
                      Part 2 : SELLERS
                    </Typography>
                  </Grid>
                  <Grid item sm={1} md={1} lg={1}></Grid>
                  <Grid item sm={10} md={10} lg={10}>
                    <Typography variant='body2' align='left' className={classes.pageTitle}>
                      1. <strong>ELIGIBILITY </strong> <br />
                      You must verify that any Customer is over 18 years old or has their parent's
                      or guardian's consent to use the Platform. <br />
                      <br />
                      <br />
                      2. <strong>LISTINGS </strong> <br />
                      You acknowledge and agree that: <br />
                      (a) you must use your best endeavours to provide as much information as
                      possible in any listing you upload to offer to provide Goods on the Platform
                      (Listing); <br />
                      (b) Lashcart may choose not to accept any Listing you submit to the Platform,
                      and Lashcart may limit the number of Listings you can submit on the Platform;{' '}
                      <br />
                      (c) for each Listing you submit on the Platform that is requested by a
                      Customer via the Platform, Lashcart will collect a Service Fee in accordance
                      with clause 3 below; <br />
                      (d) you may only charge each Customer the amount you have quoted on the
                      Platform minus the Service Fee (Remaining Balance) for the Goods quoted and
                      you must not try to claim <br />
                      the Service Fee from the Customer; <br />
                      (e) the Remaining Balance will be paid by the Customer to Lashcart via the
                      Third Party Payment Platform (defined in Part 3 of this agreement), and
                      Lashcart will pay the <br />
                      Remaining Balance to you within a reasonable time after having received it
                      from the Customer; <br />
                      (f) delivery of Goods to Customers is the responsibility of the Seller; <br />
                      (g) you may charge for delivery of Goods to the Customer as part of a Listing,
                      such amount to form part of the Quoted Amount, however the amount charged for
                      delivery <br />
                      must be reasonable; <br />
                      (h) you must take all reasonable steps to provide the Goods as described in
                      every Listing that is accepted by a Customer, including by not cancelling any
                      part of such a Listing; <br />
                      (i) you must deal with any dispute with a Customer in accordance with clause
                      12 of ‎Part 1;
                      <br />
                      (j) Lashcart reserves the right to allocate the Quoted Amount between a
                      Customer and a Seller in accordance with any other agreement between that
                      Customer and Seller;
                      <br />
                      (k) any additional terms and conditions relating to a Listing or quote
                      provided via the Platform are solely between you and the Customer and do not
                      involve Lashcart in any way, <br />
                      except that they must not be inconsistent with your obligations under this
                      agreement; and <br />
                      (l) Lashcart will have no responsibility for the accuracy, reliability or
                      timeliness of the content provided by a Customer responding to a Listing.{' '}
                      <br />
                      <br />
                      <br />
                      3. <strong>FEES </strong> <br />
                      (a) Viewing the Platform and posting a Listing is free. <br />
                      (b) Once a Customer accepts a Listing on the Platform, the Customer will be
                      prompted to pay the amount you quoted (GST inclusive) in the Listing (Quoted
                      Amount) to you via the <br />
                      Third Party Payment Platform (defined in part 3 of this agreement). <br />
                      (c) After the Third Party Payment Platform receives payment from the Customer,
                      we will transfer the Remaining Balance to you, being the Quoted Amount minus a
                      service fee, being
                      <br />
                      the percentage of the Transaction Amount specified in the Platform from time
                      to time (Service Fee). The Service Fee will be a combination of the fee to be
                      taken by Lashcart, <br />
                      and the fee payable for the transaction to the Third Party Payment Platform.{' '}
                      <br />
                      (d) The Third Party Payment Platform may hold the Remaining Balance for a
                      reasonable period after receiving it from a Customer. For the purposes of this
                      clause, you understand and <br />
                      agree that 14 days is a reasonable period. Lashcart reserves the right to have
                      the Third Party Payment Platform hold the Remaining Balance and disperse this
                      amount, along with <br />
                      other amounts, to the Seller in a bulk monthly payment. <br />
                      (e) Sellers may request the Remaining Balance be paid to them earlier, by
                      providing evidence that the relevant product has been dispatched to the
                      relevant Customer. We may approve <br />
                      such requests, at our absolute discretion, and we may require Sellers to pay
                      additional fees in consideration for such approval.
                      <br />
                      (f) Lashcart reserves the right to change or waive the Service Fee at any time
                      by updating this agreement.
                      <br />
                      <br />
                      <br />
                      4. <strong>REFUNDS & CANCELLATIONS </strong> <br />
                      (a) Without limiting or otherwise affecting the terms of this agreement, if
                      you wish to cancel a Listing before you have fulfilled the requirements of the
                      Listing the Customer requested,
                      <br />
                      you must contact us using the Platform's functionality, including providing
                      details as to why you are cancelling. If Lashcart decides to investigate your
                      request, you must provide <br />
                      assistance and information to Lashcart as reasonably requested. <br />
                      (b) You must ensure that your cancellation policy and refund policy in
                      relation to Customers cancelling Goods is in compliance with all applicable
                      laws. <br />
                      (c) If we accept your request to a cancel a Listing already accepted by a
                      Customer, we may take one or more of the following actions:
                      <br />
                      (i) cancel your membership with Lashcart; <br />
                      (ii) refund the Service Fee to the relevant Customer; or <br />
                      (iii) require that you pay all or part of the Service Fee refunded to the
                      Customer and issue you an invoice for that amount. <br />
                      (d) The Service Fee is by default non-refundable. However, Lashcart may, in
                      its absolute discretion, issue refunds of the Service Fee in certain
                      circumstances. <br />
                      (e) You agree to honour and comply with the process set out in this clause ‎4
                      in the event of a pricing error on the Platform. <br />
                      <br />
                      <br />
                      5. <strong>BYPASSING</strong> <br />
                      (a) You agree that while you are a Seller on the Platform, regardless of the
                      reason that your Account was suspended or cancelled, you will not, either
                      directly or indirectly, solicit or <br />
                      attempt to solicit any business, work, income or other benefit, from any
                      Customer whom you came to know about, or with whom you provided services to
                      directly or indirectly, by using <br />
                      the Platform. This provision will apply whether or not the Customer or their
                      representative is still active on the Platform. <br />
                      (b) Lashcart may, in its absolute discretion, cancel your Account and suspend
                      you from using the Platform if it finds or suspects that you have breached or
                      are in breach of this clause ‎5. <br />
                      <br />
                      <br />
                      6. <strong> BINDING CONTRACT </strong> <br />
                      You agree that when a Customer accepts a Listing, this constitutes a binding
                      contract with you, where you will provide the Customer with the Goods in the
                      Listing they accepted in exchange <br />
                      for payment of the Quoted Amount in the Listing. A contract is formed in this
                      respect when the Customer responds to the Listing on the Platform confirming
                      that they accept the Seller’s offer.
                      <br />
                      7. <strong>WARRANTIES </strong> <br />
                      By listing yourself as a Seller on the Platform and posting a Listing, you
                      represent and warrant that:
                      <br />
                      (a) you are able to provide the Goods as specified in the Listing; and
                      <br />
                      (b) you will provide the relevant Goods to Customers in compliance with all
                      applicable laws.
                      <br />
                      <br />
                      <br />
                    </Typography>
                  </Grid>

                  <Grid item sm={12} md={12} lg={12}>
                    <Typography variant='h6' align='center' className={classes.pageTitle}>
                      Part 3 : CUSTOMERS
                    </Typography>
                  </Grid>
                  <Grid item sm={1} md={1} lg={1}></Grid>
                  <Grid item sm={10} md={10} lg={10}>
                    <Typography variant='body2' align='left' className={classes.pageTitle}>
                      1. <strong> LISTINGS AND FEES </strong> <br />
                      You acknowledge and agree that: <br />
                      (a) if you accept a Listing, that will constitute your entry into a contract
                      with the Seller; <br />
                      (b) for each Listing you respond to, you must pay the Quoted Amount, which
                      will be debited from your Account and Lashcart will keep a Service Fee which
                      will be a percentage of the <br />
                      Quoted Amount; and <br />
                      (c) any terms and conditions relating to Goods or a quote provided via the
                      Platform are solely between you and the Seller and do not involve Lashcart in
                      any way, except that they must not be <br />
                      inconsistent with your obligations under this agreement. <br />
                      <br />
                      <br />
                      2. <strong> PAYMENT </strong> <br />
                      (a) (Payment obligations) Unless otherwise agreed in writing with the Seller
                      you must pay for all Goods specified in a Listing prior to the Seller
                      performing those Goods. <br />
                      (b) (Card surcharges) Lashcart reserves the right to charge credit card
                      surcharges in the event that payments are made using a credit, debit or charge
                      card (including Visa, MasterCard, <br />
                      American Express or Diners Club). <br />
                      (c) (Online payment partner) Lashcart processes payments through the Platform
                      using Stripe.com (Online Payment Partner). In addition to this agreement, your
                      purchase of any Goods via the <br />
                      Platform will be subject to the terms and the privacy policy of the Online
                      Payment Partner, available on the Online Payment Partner's website. <br />
                      (d) (Release) You agree to release Lashcart and its employees and agents in
                      respect of all liability for loss, damage or injury which may be suffered by
                      any person arising from any act or <br />
                      omission of the Online Payment Partner, including any issue with security or
                      performance of the Online Payment Partner's platform or any error or mistake
                      in processing your payment. <br />
                      (e) (Pricing errors) In the event that we discover an error or inaccuracy in
                      any price at which your order was purchased via the Platform, we will attempt
                      to contact you and inform you of <br />
                      this as soon as possible. Subject to agreement with the Seller, you will then
                      have the option of purchasing the relevant services at the correct price, or
                      cancelling your order. If you choose <br />
                      to cancel your order and payment has already been debited, the full amount
                      will be credited back to your original method of payment.
                      <br />
                      <br />
                      <br />
                      3. <strong> CANCELLATIONS </strong> <br />
                      (a) Lashcart will have no liability or obligation to you if a Seller cancels a
                      job any time after you have accepted it and you will not be entitled to any
                      compensation from Lashcart, including <br />
                      any portion of the Service Fee. <br />
                      (b) If you wish to cancel a Good before the Seller has fulfilled the
                      requirements specified in the Listing, you must contact the Seller. If
                      Lashcart decides to investigate your cancellation, <br />
                      you must provide assistance and information to Lashcart as reasonably
                      requested. <br />
                      (c) If you cancel a Good, whether the Remaining Balance paid to the Seller is
                      refundable to you in respect of that Good will depend on the cancellation
                      policy and refund policy of the Seller. <br />
                      (d) The Service Fee is by default non-refundable. However, Lashcart may, in
                      its absolute discretion, issue refunds of the Service Fee in certain
                      circumstances. <br />
                      <br />
                      <br />
                      4. <strong>LINKED BUSINESSES </strong> <br />
                      You acknowledge and agree that: <br />
                      (a) the Platform provides links and introductions to Sellers owned and
                      operated by third parties that are not under the control of Lashcart; <br />
                      (b) the provision by Lashcart of introductions to Sellers does not imply any
                      endorsement or recommendation by Lashcart of any Seller; <br />
                      (c) Lashcart does not examine, determine or warrant the certification and/or
                      licensing, competence, solvency or information of any Seller who uses or is
                      listed on the Platform; and <br />
                      (d) any terms and conditions relating to a service, Listing or quote provided
                      via the Platform constitute a contract between you and the Seller and do not
                      involve Lashcart in any way. <br />
                      <br />
                      <br />
                      5. <strong> COMMUNICATION OUTSIDE THE PLATFORM </strong> <br />
                      (a) You must not communicate with a Seller, or request or entice a Seller to
                      communicate with you, outside the Platform (except in the course of accepting
                      the Seller's services). <br />
                      (b) Lashcart, in its absolute discretion, may cancel your Account and suspend
                      you from using the Platform if it finds or suspects that you have breached or
                      are in breach of this clause ‎5. <br />
                      <br /> <br />
                    </Typography>
                  </Grid>

                  <Grid item sm={12} md={12} lg={12}>
                    <Typography variant='h4' align='center' className={classes.pageTitle}>
                      PRIVACY POLICY
                    </Typography>
                  </Grid>
                  <Grid item sm={1} md={1} lg={1}></Grid>
                  <Grid item sm={10} md={10} lg={10}>
                    <Typography variant='body2' align='left' className={classes.pageTitle}>
                      1. <strong> INTRODUCTION </strong> <br />
                      This document sets out the privacy policy of LASH CORPORATION PROPRIETARY
                      LIMITED ABN 58 631 616 156 (referred to in these terms and conditions as 'we',
                      'us', or 'our'). <br />
                      We take our privacy obligations seriously and we've created this privacy
                      policy to explain how we store, maintain, use and disclose personal
                      information. <br />
                      By providing personal information to us, you consent to our storage,
                      maintenance, use and disclosing of personal information in accordance with
                      this privacy policy. <br />
                      We may change this privacy policy from time to time by posting an updated copy
                      on our website and we encourage you to check our website regularly to ensure
                      that you are aware of our <br />
                      most current privacy policy.
                      <br />
                      <br />
                      2. <strong> TYPES OF PERSONAL INFORMATION WE COLLECT </strong> <br />
                      The personal information we collect may include the following: <br />
                      • name; <br />
                      • mailing or street address; <br />
                      • email address;
                      <br />
                      • social media information; <br />
                      • telephone number and other contact details; <br />
                      • age;
                      <br />
                      • date of birth; <br />
                      • credit card or other payment information; <br />
                      • information about your business or personal circumstances; <br />
                      • information in connection with client surveys, questionnaires and
                      promotions; <br />• your device identity and type, I.P. address, geo-location
                      information, page view statistics, advertising data and standard web log
                      information; <br />
                      • information about third parties; and <br />
                      • any other information provided by you to us via our website or our online
                      presence, or otherwise required by us or provided by you. <br />
                      <br />
                      <br />
                      3. <strong> HOW WE COLLECT PERSONAL INFORMATION </strong> <br />
                      We may collect personal information either directly from you, or from third
                      parties, including where you: <br />
                      • contact us through our website;
                      <br />
                      • submit any of our online sign up forms;
                      <br />
                      • communicate with us via email, telephone, SMS, social applications (such as
                      LinkedIn, Facebook or Twitter) or otherwise; <br />
                      • interact with our website, social applications, services, content and
                      advertising; and
                      <br />
                      • invest in our business or enquire as to a potential purchase in our
                      business.
                      <br />
                      We may also collect personal information from you when you use or access our
                      website or our social media pages. This may be done through use of web
                      analytics <br />
                      tools, 'cookies' or other similar tracking technologies that allow us to track
                      and analyse your website usage. Cookies are small files that store information{' '}
                      <br />
                      on your computer, mobile phone or other device and enable and allow the
                      creator of the cookie to identify when you visit different websites. If you do
                      not wish <br />
                      information to be stored as a cookie, you can disable cookies in your web
                      browser. <br />
                      Optional: We may use Google Analytics to collect and process data, including
                      when you use third party websites or apps. To find out more see How Google
                      uses <br />
                      data when you use our partners’ sites or apps. <br />
                      <br />
                      <br />
                      4. <strong> USE OF YOUR PERSONAL INFORMATION </strong> <br />
                      We collect and use personal information for the following purposes: <br />
                      • to provide services or information to you; <br />
                      • for record keeping and administrative purposes; <br />
                      • to provide information about you to our contractors, employees, consultants,
                      agents or other third parties for the purpose of providing goods or services
                      to you; <br />
                      • to improve and optimise our service offering and customer experience;
                      <br />
                      • to comply with our legal obligations, resolve disputes or enforce our
                      agreements with third parties;
                      <br />
                      • to send you marketing and promotional messages and other information that
                      may be of interest to you and for the purpose of direct marketing <br />
                      (in accordance with the Spam Act). In this regard, we may use email, SMS,
                      social media or mail to send you direct marketing communications. <br />
                      You can opt out of receiving marketing materials from us by using the opt-out
                      facility provided (e.g. an unsubscribe link); <br />
                      • to send you administrative messages, reminders, notices, updates, security
                      alerts, and other information requested by you; and <br />
                      • to consider an application of employment from you.
                      <br />
                      We may disclose your personal information to cloud-providers, contractors and
                      other third parties located inside or outside of Australia. <br />
                      If we do so, we will take reasonable steps to ensure that any overseas
                      recipient deals with such personal information in a manner consistent with how
                      we deal with it. <br />
                      <br />
                      <br />
                      5. <strong>SECURITY</strong>> <br />
                      We take reasonable steps to ensure your personal information is secure and
                      protected from misuse or unauthorised access. Our information technology
                      systems are password <br />
                      protected, and we use a range of administrative and technical measure to
                      protect these systems. However, we cannot guarantee the security of your
                      personal information. <br />
                      <br />
                      <br />
                      6. <strong> LINKS </strong> <br />
                      Our website may contain links to other websites. Those links are provided for
                      convenience and may not remain current or be maintained. We are not
                      responsible for the privacy <br />
                      practices of those linked websites and we suggest you review the privacy
                      policies of those websites before using them. <br />
                      <br />
                      <br />
                      7.{' '}
                      <strong> REQUESTING ACCESS OR CORRECTING YOUR PERSONAL INFORMATION </strong>
                      <br />
                      If you wish to request access to the personal information we hold about you,
                      please contact us using the contact details set out below including your name
                      and contact details. <br />
                      We may need to verify your identity before providing you with your personal
                      information. In some cases, we may be unable to provide you with access to all
                      your personal information <br />
                      and where this occurs, we will explain why. We will deal with all requests for
                      access to personal information within a reasonable timeframe. <br />
                      If you think that any personal information we hold about you is inaccurate,
                      please contact us using the contact details set out below and we will take
                      reasonable steps to <br />
                      ensure that it is corrected. <br />
                      <br />
                      <br />
                      8. <strong> COMPLAINTS </strong> <br />
                      If you wish to complain about how we handle your personal information held by
                      us, please contact us using the details set out below including your name and
                      contact details.
                      <br />
                      We will investigate your complaint promptly and respond to you within a
                      reasonable timeframe. <br />
                      <br />
                      <br />
                      9. <strong> CONTACT US </strong> <br />
                      For further information about our privacy policy or practices, or to access or
                      correct your personal information, or make a complaint, please contact us
                      using the details set out below: <br />
                      Name: [insert name] <br />
                      Email: pr@lashcart.com.au. <br />
                      Our privacy policy was last updated on 7 February 2020. <br />
                      <br />
                      <br />
                      <br />
                    </Typography>
                  </Grid>
                  {/* <Grid item sm={2} md={2} lg={2}></Grid> */}
                  <Grid container direction='row' justify='center'>
                    <Grid item sm={12} md={6} lg={6} className={classes.approvalCheckBox}>
                      <Checkbox
                        // disabled={!previousFormSubmitted}
                        checked={term_condition_Checked}
                        onChange={this.handleValueChange('term_condition_Checked')}
                        classes={{
                          root: classes.root,
                          checked: classes.checked,
                        }}
                      />
                      <Typography variant='body2' align='left'>
                        Agree With Term & Conditions
                      </Typography>
                    </Grid>

                    <Grid item sm={12} md={6} lg={6} className={classes.approvalCheckBox}>
                      <Checkbox
                        // disabled={!previousFormSubmitted}
                        checked={privacy_policy_Checked}
                        onChange={this.handleValueChange('privacy_policy_Checked')}
                        classes={{
                          root: classes.root,
                          checked: classes.checked,
                        }}
                      />
                      <Typography variant='body2' align='left'>
                        Agree With Privacy Policy
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item sm={12} md={12} lg={12}>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent2}>
                <Grid container spacing={40}>
                  <Grid item sm={6} md={7} lg={7}></Grid>
                  <Grid item sm={3} md={2} lg={2}>
                    {/* TODO: Add back code react router */}
                    <Button variant='contained' fullWidth className={classes.buttonType2}>
                      <Link to='/sell/dashboard' className={classes.link}>
                        Back
                      </Link>
                    </Button>
                  </Grid>
                  <Grid item sm={3} md={3} lg={3}>
                    <Button
                      variant='contained'
                      fullWidth
                      className={classes.buttonType1}
                      disabled={
                        !term_condition_Checked || !privacy_policy_Checked || this.state.dataSending
                      }
                      onClick={this.submitForApproval}>
                      Submit for approval
                    </Button>
                  </Grid>

                  {/* {!previousFormSubmitted ? (
                    <Grid item sm={12} md={12} lg={12}>
                      <Typography className={classes.previousFormSubmittedError}>
                        You need to add previous details first! If you have filled and submitted
                        previous details and still seeing this error. Try reloading the webpage!
                      </Typography>
                    </Grid>
                  ) : null} */}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </form>
      </div>
    );
  }
}

RequestApproval.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(RequestApproval);
