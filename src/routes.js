const { Router } = require('express');
const Routes = require('./api/crContent/cr.routes');
const router = Router();

router.get('/', (req, res) => {
  res.send("HELLO")
});

router.use('/web', Routes);

module.exports = router;
