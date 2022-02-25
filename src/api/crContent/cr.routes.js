const router = require("express").Router();
const controller = require("./cr.controller");
const config = require("../../config");

var whitelist = [
    "localhost:3000",
    "ksmart-react.herokuapp.com"
    // "localhost:5000",
];

router.get('/', (req, res) => {
    res.send('Inside user....');
});

const corsOptionsDelegate = (req, res, next) => {
    try {
        // console.log(req);
        // console.log(req.headers.referer);
        if (req.headers.origin !== undefined) {
            const splitReferer = req.headers.referer.split("/");
            const splitOrgin = req.headers.origin.split("/");
            const reqOrgin = splitOrgin[2];
            const reqReferer = splitReferer[2];
            console.log(splitReferer[2] + "->" + splitOrgin[2]);
            if (
                whitelist.indexOf(reqOrgin) !== -1 &&
                whitelist.indexOf(reqReferer) !== -1
            ) {
                next();
            } else {
                res.status(400).json("Unauthorized Routes");
            }
        } else {
            res.status(400).json("Unauthorized Routes");
        }
    } catch (error) {
        res.status(401).json({
            status: 401,
            message: "Invalid Request"
        });
    }
};
router.route('/DataUpdate/:table/:id')
    .put(corsOptionsDelegate, controller.Updatedata);
router.route('/GetData/:type').post(corsOptionsDelegate, controller.GetData);

router
    .route("/delete")
    .post(controller.Delete);
router.route('/loginCheck').put(controller.loginCheck);
router.route('/GetRandomNumber').get(controller.GetRandomNumber);

module.exports = router;
