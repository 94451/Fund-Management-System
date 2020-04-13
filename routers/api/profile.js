// @profile
const express = require("express");
const router = express.Router();
const passport = require('passport');

//引入数据模型
const Profile = require('../../models/Profile');

/** $route GET api/profiles/test
 *  @desc 返回的请求的json数据
 *  @access public
 */
router.get('/test', (req, res) => {
    res.json({ msg: 'profile works...' });
});

/** $route POST api/profiles/add
 *  @desc 创建信息接口
 *  @access Private
 */
// router.get("/currnt", "验证token", (req, res) => {})
router.post("/add", passport.authenticate('jwt', { session: false }), (req, res) => {
    const profileFields = {};

    if (req.body.type) profileFields.type = req.body.type;
    if (req.body.describe) profileFields.describe = req.body.describe;
    if (req.body.carat) profileFields.carat = req.body.carat;
    if (req.body.Perton) profileFields.Perton = req.body.Perton;
    if (req.body.intotal) profileFields.intotal = req.body.intotal;
    if (req.body.remak) profileFields.remak = req.body.remak;

    new Profile(profileFields).save().then(profile => {
        res.json(profile);
    });
});

/** $route GET api/profiles
 *  @desc 获取所有信息
 *  @access Private
 */
router.get("/", passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.find()
        .then(profile => {
            if (!profile) {
                return res.status(404).json('没有任何内容')
            }

            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

/** $route GET api/profiles/:id
 *  @desc 获取单个信息
 *  @access Privateid
 */
router.get("/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ _id: req.params.id })
        .then(profile => {
            if (!profile) {
                return res.status(404).json('没有任何内容')
            }

            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

/** $route POST api/profiles/edit
 *  @desc 编辑信息接口
 *  @access Private
 */
// router.get("/currnt", "验证token", (req, res) => {})
router.post("/edit/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    const profileFields = {};

    if (req.body.type) profileFields.type = req.body.type;
    if (req.body.describe) profileFields.describe = req.body.describe;
    if (req.body.carat) profileFields.carat = req.body.carat;
    if (req.body.Perton) profileFields.Perton = req.body.Perton;
    if (req.body.intotal) profileFields.intotal = req.body.intotal;
    if (req.body.remak) profileFields.remak = req.body.remak;

    Profile.findOneAndUpdate({ _id: req.params.id }, { $set: profileFields }, { new: true })
        .then(profile => res.json(profile));
});

/** $route DELETE api/profiles/delete/:id
 *  @desc 删除信息接口
 *  @access Private
 */
router.delete("/delete/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.remove({ _id: req.params.id }, (err, data) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json({ data: data })
        }
    })

    /*  Profile.findOneAndRemove({ _id: req.params.id }, function(err, res) {
        if (err) {
            console.log("Error:" + err);
        } else {
            console.log("Res:" + res);
        }
    }) */
});

module.exports = router;

/* .then(profile => {
    profile.save().then(profile => res.json(profile));
})
.catch(err => res.status(404).json('删除失败!')); */