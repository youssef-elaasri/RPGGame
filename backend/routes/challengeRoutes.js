const express = require('express');
const challenge = require('../controllers/challenge');

const router = express.Router({ mergeParams: true }); // mergeParams is useful to not lose :userId which is defined in the general route in router.js

router.post('/python', challenge.python);
router.post('/python_script', challenge.pythonScript);


module.exports = router;