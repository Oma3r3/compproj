require('dotenv').config();

var express = require('express');
var mysql = require('mysql');
const moment = require('moment');
const path = require('path');
var nodemailer = require('nodemailer');
const notifier = require('node-notifier');
var con = require('./database');

var app = express();
var bp = require('body-parser');

var c = 0;
var rslt = {};

const users = require('./addusers');

app.use(express.static(path.join(__dirname, "images")));

app.set('view engine', 'ejs');

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage });

app.post('/images', upload.single('img'), function(req, res) {
    var imglink = req.file.filename;
    var str = "";
    str = "./" + req.file.filename;
    console.log(str);
    console.log(imglink);
    var name = req.body.name;
    var position = req.body.position;
    var query = "insert into clubinfo values(?, ?, ?);";
    con.query(query, [name, position, str]);
    res.redirect("/images");
    console.log("successful");
    notifier.notify({
        title: "WCE CLUB PORTAL",
        message: "ADDED MEMBER SUCCESSFULY",
    })

})

app.get('/', function(req, res) {
    function runquery(query, cb) {
        con.query(query, function(error, data, fields) {
            var rslt = JSON.parse(JSON.stringify(data));
            cb(rslt);
        })
    }

    function renderit(rslt) {
        const viewData = {
            myvar: rslt,

        }
        res.render("nhomepage", viewData);
    }
    var query = "SELECT * FROM clubevent;";
    runquery(query, renderit);
})
app.get('/homepage', function(req, res) {
    function runquery(query, cb) {
        con.query(query, function(error, data, fields) {
            var rslt = JSON.parse(JSON.stringify(data));
            cb(rslt);
        })
    }

    function renderit(rslt) {
        const viewData = {
            myvar: rslt,

        }
        res.render("homepage", viewData);
    }
    var query = "SELECT * FROM clubevent;";
    runquery(query, renderit);
})

app.get("/addevents", function(req, res) {
    res.render("addevents");
})
app.get('/fachomepage', function(req, res) {
    function runquery(query, cb) {
        con.query(query, function(error, data, fields) {
            var rslt = JSON.parse(JSON.stringify(data));
            cb(rslt);
        })
    }

    function renderit(rslt) {
        const viewData = {
            myvar: rslt,

        }
        res.render("fachomepage", viewData);
    }
    var query = "SELECT * FROM clubevent;";
    runquery(query, renderit);
})

app.get("/addevents", function(req, res) {
    res.render("addevents");
})

app.post('/addevents', upload.single('imagee'), function(req, res) {
    var imglink = req.file.filename;
    console.log(imglink);
    var str = "";
    str = "./" + req.file.filename;
    var clubname = req.body.cl_name;
    var eventname = req.body.ev_name;
    var description = req.body.desc_area;
    var date = req.body.date;
    var time = req.body.ev_time;
    var location = req.body.location;
    var hashtags = req.body.hashtags;
    var fee = req.body.fees;

    var query = "insert into clubevent values(?, ?, ?, ?, ?, ?, ?, ?,?)";
    con.query(query, [clubname, eventname, description, date, time, location, hashtags, fee, str]);
    res.redirect('/addevents');
    notifier.notify({
        title: "WCE CLUB PORTAL",
        message: "ADDED EVENT SUCCESSFULY",
    })
})

app.get("/loginpage", function(req, res) {
    res.render("loginpage");
})

const { error } = require('console');
const { json } = require('stream/consumers');
const { run } = require('node:test');

con.connect(function(error) {
    if (error) throw error;
})



// app.get('/', function(req, res) {
//     res.render("homepage");
// })

// app.get('/addpage', function(req, res) {
//     res.render("addpage");
// })

// app.post('/addpage', function(req, res) {
//     var name = req.body.uname;
//     const query = 'INSERT INTO clubdetails VALUES(?)';
//     con.query(query, [name]);
//     res.redirect("/");
// })

app.get("/images", function(req, res) {
    function runquery(query, cb) {
        con.query(query, function(error, data, fields) {
            if (error) {
                throw error;
            }
            var rslt = JSON.parse(JSON.stringify(data));
            cb(rslt);
        })
    }

    function renderit(rslt) {
        const viewData = {
            dt: rslt,
        }
        res.render("images", viewData);
    }

    const query = "select * from clubinfo";
    runquery(query, renderit);

})

app.get('/reservations', function(req, res) {
    const arr = [];
    var today = moment();
    var dt = today.format('YYYY-MM-DD');

    function runquery(query, cb) {
        con.query(query, function(error, data, fields) {
            if (error) throw error;
            var rslt = JSON.parse(JSON.stringify(data));
            console.log(rslt);
            cb(rslt);
        })
    }

    function renderpage(rslt) {
        var today = moment();
        var date = today.format('YYYY-MM-DD');
        console.log(date);
        const str = `DISPLAYING AVAILABLE CLASSES ON ${dt} `;
        const arr = [];
        for (i = 0; i < Object.keys(rslt).length; i++) {
            if (rslt[i].bookingdate == date) {
                arr[i] = rslt[i].classname;
            }
        }
        const viewData = {
            myvar: arr,
            mymessage: str,
            datevar: dt,
        }
        console.log(arr);
        res.render("reservations", viewData);
        // console.log(rslt);
    }
    var querya = "select classname, DATE_FORMAT(bookingdate, '%Y-%m-%d') as bookingdate from res union select classname, DATE_FORMAT(bookingdate, '%Y-%m-%d') as bookingdate from facultyres";
    runquery(querya, renderpage);
    console.log("ifpart");
})



app.post('/reservations', function(req, res) {
        if (req.body.datepick == "datepick") {

            var date = req.body.dateofbirth;
            console.log(date);

            function runquery(querya, cb) {
                con.query(querya, function(error, data, fields) {
                    if (error) throw error;
                    var rslt = JSON.parse(JSON.stringify(data));
                    console.log(rslt);
                    cb(rslt);
                })
            }

            function renderpage(rslt) {
                var dt = req.body.dateofbirth;
                const str = `AVAILABLE CLASSES ON ${dt} `;
                const arr = [];
                for (i = 0; i < Object.keys(rslt).length; i++) {
                    if (rslt[i].bookingdate == date) {
                        arr[i] = rslt[i].classname;
                    }
                }
                const viewData = {
                    myvar: arr,
                    mymessage: str,
                    datevar: dt,
                }
                console.log(arr);
                res.render("reservations", viewData);
                notifier.notify({
                        title: "WCE CLUB PORTAL",
                        message: `SHOWING CLASSES AVAILABLE ON ${dt}`,
                    })
                    // console.log(rslt);
            }
            var querya = "select classname, DATE_FORMAT(bookingdate, '%Y-%m-%d') as bookingdate from res union select classname, DATE_FORMAT(bookingdate, '%Y-%m-%d') as bookingdate from facultyres";
            runquery(querya, renderpage);
            console.log("ifpart");
        }
        ////////////////////////////////-------------------------------------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        if (req.body.card == "card") {
            console.log("elsepart");


            function runotherquery(query, querya, dt, name, cb) {
                con.query(query, [name, dt]);
                con.query(querya, [dt], function(error, data, fields) {
                    if (error) throw error;
                    var rslt = JSON.parse(JSON.stringify(data));
                    cb(rslt);
                })
            }
            var name = req.body.classname;
            var dt = req.body.bookingdate;

            function renderpage(rslt) {
                const str = `DISPLAYING AVAILABLE CLASSES ON ${dt} `;
                const arr = [];
                for (i = 0; i < Object.keys(rslt).length; i++) {
                    if (rslt[i].bookingdate == dt) {
                        arr[i] = rslt[i].classname;
                    }
                }
                const viewData = {
                    myvar: arr,
                    mymessage: str,
                    datevar: dt,
                }
                console.log(arr);
                res.render("reservations", viewData);
                notifier.notify({
                    title: "WCE CLUB PORTAL",
                    message: `REQUEST SENT FOR ${name}!`,
                })
            }
            var query = "insert into facultyres values(?, ?);";
            var querya = "select classname, DATE_FORMAT(bookingdate, '%Y-%m-%d') as bookingdate from res union select classname, DATE_FORMAT(bookingdate, '%Y-%m-%d') as bookingdate from facultyres";
            runotherquery(query, querya, dt, name, renderpage);
            ////////////////////////////////////////////////////////////////////////////
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'omartarique2003@gmail.com',
                    pass: 'ibpz xefr qusy npjf'
                }
            });

            // Create a mailOptions object with the email information
            var mailOptions = {
                from: 'omartarique2003@gmail.com',
                to: 'siddheshsm17@gmail.com',
                subject: 'RECEIVED REQUEST FOR CLASSROOM',
                text: 'STATUS: PENDING'
            };

            // Use the transporter.sendMail method to send the email
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
    })
    //////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/faculty", function(req, res) {
        function runquery(query, cb) {
            con.query(query, function(error, data, fields) {
                if (error) throw error;
                var rslt = JSON.parse(JSON.stringify(data));
                console.log(rslt);
                cb(rslt);
            })
        }

        function renderpage(rslt) {
            const viewData = {
                myvar: rslt,
            }
            res.render("faculty", viewData);
            // console.log(rslt);
        }
        var query = "select classname, DATE_FORMAT(bookingdate, '%Y-%m-%d') as bookingdate FROM facultyres;";
        runquery(query, renderpage);
    })
    // ____________________________________________________________________________

app.post("/faculty", function(req, res) {

    function runquery(querya, queryb, name, dt, cb) {
        con.query(queryb, [name, dt]);
        con.query(querya, [name, dt]);
        cb();
    }

    function cb() {
        res.redirect("faculty");
    }
    var name = req.body.classname;
    var dt = req.body.bookingdate;
    console.log(name);
    var querya = "insert into res values(?, ?);";
    var queryb = "delete from facultyres where classname = ? and bookingdate = ?";
    runquery(querya, queryb, name, dt, cb);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'omartarique2003@gmail.com',
            pass: 'ibpz xefr qusy npjf'
        }
    });

    var txt = `STATUS: APPROVED FOR CLASS ID- ${name}`;

    // Create a mailOptions object with the email information
    var mailOptions = {
        from: 'omartarique2003@gmail.com',
        to: 'siddheshsm17@gmail.com',
        subject: 'REQUEST FOR CLASSROOM ACCEPTED',
        text: txt
    };

    // Use the transporter.sendMail method to send the email
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
})

app.post('/loginpage', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    squery = 'SELECT * from users where username = ? and password = ?;';
    fquery = 'SELECT position from users where username = ?;';
    con.query(squery, [username, password], function(error, data, fields) {
        if (error) throw error;
        if (data.length > 0) {
            var rslt = JSON.parse(JSON.stringify(data));
            console.log('matching data found');
            if (rslt[0].username == "sir") {

                res.redirect("/fachomepage");
            } else {
                res.redirect("/homepage");
            }
        } else {
            res.redirect("loginpage");
            notifier.notify({
                title: "WCE CLUB PORTAL",
                message: "WRONG PASSWORD! TRY AGAIN",
            })
        }
    })

})


app.listen(3000, function() {
    console.log("app listening on port 3000 h");
});