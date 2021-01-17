const express = require("express");

const router = express.Router();
const auth = require("../../middleware/auth");
const moment = require("moment")
const Shop = require("../../models/Shop");

// @route   GET api/dashbaord/changeStatus/(status)
// @desc    Change Shop status
// @access  Private
router.get("/changeStatus/:status", auth,
  async (req, res) => {
    try {

      await Shop.updateOne({}, {
        $set: {
            status: req.params.status,
            shopStartTime: new Date(),
        }
      });
      res
      .status(200)
      .json({ msg: "Shop updated Successfully" });

    } catch (err) {

      console.log(err);
      res
        .status(500)
        .send("Server Error!");
    }
  });

// @route   GET api/dashbaord/shops
// @desc    Get all shops
// @access  Private
router.get("/shops", 
async (req, res) => {
  try {
    const shops = await Shop.find();
    res.json(shops);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send("Server Error!");
  }
});

module.exports = router;
