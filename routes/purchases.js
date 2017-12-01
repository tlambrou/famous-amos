const express = require('express')
const router = express.Router()

let pets = require('../json/pets')
let comments = require('../json/comments')
var stripe = require("stripe")(process.env.stripeTestSecretKey)

// NEW
router.get('/pets/:petId/purchase', (req, res) => {
  console.log('Here is the petId: ', req.params.petId)
  res.render('purchase-new', { pet: pets[req.params.petId]})
})

// CREATE
router.post('/pets/:petId/purchase', (req, res) => {
  console.log(req.body)

  stripe.charges.create({
    amount: pets[req.params.petId].priceInCents,
    currency: "usd",
    source: req.body.stripeToken.id, // obtained with Stripe.js
    description: "Charge for famous.amos@example.com"
  }, function(err, charge) {
    if (err) { return console.log(err) }

    pets[req.params.petId].purchasedAt = new Date();
    res.send("success!")
  });
})

module.exports = router
