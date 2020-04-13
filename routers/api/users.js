// @login & register
const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tools = require('../../config/tools');
const gravatar = require('gravatar');
const keys = require("../../config/keys");
const passport = require('passport')

//引入数据模型
const User = require('../../models/User');

/** $route GET api/users/test
 *  @desc 返回的请求的json数据
 *  @access public
 */
router.get('/test', (req, res) => {
    res.json({ msg: 'login works' });
});

/** $route POST api/users/register
 *  @desc 返回的请求的json数据
 *  @access public
 */
router.post('/register', (req, res) => {
    // console.log(req.body);

    //查询数据库中是否拥有邮箱
    User.findOne({
        email: req.body.email
    }).then((user) => {
        if (user) {
            return res.status(400).json('邮箱已被注册！')
        } else {
            // 头像
            const avatar = gravatar.url(req.body.email, { s: '200', r: 'pg', d: 'mm' });
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                identity: req.body.identity,
                password: tools.enbcrypt(req.body.password) // 加密 bcryptjs模块
            });

            //存储到数据库中
            newUser.save()
                .then(user => res.json(user))
                .catch(err => console.log(err));
        }
    })
});

/** $route POST api/users/login
 *  @desc 返回token jwt passport
 *  @access public
 */
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // 查询数据库
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json('用户不存在');
            }

            //密码匹配
            var result = bcrypt.compareSync(password, user.password);
            // 验证通过
            if (result) {
                const rule = {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar,
                    identity: user.identity
                }; // 可以在加avatar等

                jwt.sign(rule, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                    if (err) throw err;
                    res.json({
                        success: true,
                        token: 'bearer ' + token
                    });
                });
                // jwt.sign("规则", "加密名字", '过期时间', '箭头函数');
                // res.json({ msg: "success" });
            } else {
                return res.status(400).json('密码错误');
            }

        })
});

/** $route GET api/users/current
 *  @desc 返回用户信息
 *  @access Private
 */
// router.get("/currnt", "验证token", (req, res) => {})
router.get("/current", passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        identity: req.user.identity
    });
});

module.exports = router;