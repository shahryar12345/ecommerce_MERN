var express = require('express');
var router = express.Router();
const Seller = require('../model/seller');
const status = require('../statusCode');

//get top sellers
router.get('/sellers', async (req, res) => {
  var offset = parseInt(req.query.offset);
  var size = parseInt(req.query.size);
  try {
    var sellers = await Seller.getTopSellers(offset, size);
    res.status(200).json(sellers);
  } catch (err) {
    return res.status(400).json(Object.assign(status.SELLERS_FAILED, { data: err }));
  }
});

module.exports = router;
