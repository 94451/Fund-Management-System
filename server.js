const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const app = express();

// 引入user.js && profile.js
const users = require('./routers/api/users');
const profiles = require('./routers/api/profile');

// DB config
const db = require('./config/keys').mongoURI;

// 使用body-parser中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Connect to mongodb
mongoose.connect(
        db, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    .then(() => console.log("MongoDb Connnected..."))
    .catch(err => console.log(err));

// passport 初始化
app.use(passport.initialize());

require('./config/passport')(passport);

// app.get('/', (req, res) => {
//     res.send("Hello Word!");
// });

// 中间件使用routers
app.use("/api/users", users);
app.use("/api/profiles", profiles);


// 执行前端静态页面
if (process.env.NoDE_ENV === 'production') {
    app.use(express.static('client/dist'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
    });
}


// 端口号
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})