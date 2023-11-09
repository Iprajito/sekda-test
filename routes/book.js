var express = require('express');
var router = express.Router();

//import database
var connection = require('../library/database');

/**
 * INDEX POSTS
 */
router.get('/', function (req, res, next) {
    //query
    connection.query('SELECT * FROM book ORDER BY id desc', function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('book', {
                data: ''
            });
        } else {
            //render ke view posts index
            res.render('book/index', {
                data: rows // <-- data posts
            });
        }
    });
});

/**
 * CREATE POST
 */
router.get('/create', function (req, res, next) {
    res.render('book/create', {
        author: '',
        title: '',
        borrowed_name: '',
        publish_year: '',
        is_returned: '',
        borrowed_date: '',
        return_date: ''
    })
})

/**
 * STORE POST
 */
router.post('/store', function (req, res, next) {
    
    let author = req.body.author;
    let title = req.body.title;
    let borrowed_name = req.body.borrowed_name;
    let publish_year = req.body.publish_year;
    let is_returned = req.body.is_returned;
    let borrowed_date = req.body.borrowed_date;
    let return_date = req.body.return_date;
    // let errors  = false;

    let formData = {
        author: author,
        title: title,
        borrowed_name: borrowed_name,
        publish_year: publish_year,
        is_returned: is_returned,
        borrowed_date: borrowed_date,
        return_date: return_date
    }
    
    // insert query
    connection.query('INSERT INTO book SET ?', formData, function(err, result) {
        //if(err) throw err
        if (err) {
            // req.flash('error', err)
             console.log(err);
            // render to add.ejs
            res.render('book/create', {
                author: formData.author,
                title: formData.title,
                borrowed_name: formData.borrowed_name,
                publish_year: formData.publish_year,
                is_returned: formData.is_returned,
                borrowed_date: formData.borrowed_date,
                return_date: formData.return_date
            })
        } else {                
            // req.flash('success', 'Data Berhasil Disimpan!');
            res.redirect('/book');
        }
    })
})

/**
 * EDIT POST
 */
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    connection.query('SELECT * FROM book WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            // req.flash('error', 'Data Post Dengan ID ' + id + " Tidak Ditemukan")
            // res.redirect('/posts')
            console.log('No data');
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('book/edit', {
                id:      rows[0].id,
                author: rows[0].author,
                title: rows[0].title,
                borrowed_name: rows[0].borrowed_name,
                publish_year: rows[0].publish_year,
                is_returned: rows[0].is_returned,
                borrowed_date: formatDate(rows[0].borrowed_date),
                return_date: formatDate(rows[0].return_date)
            })
        }
    })
})

/**
 * UPDATE POST
 */
router.post('/update', function(req, res, next) {

    let id = req.body.id;
    let author = req.body.author;
    let title = req.body.title;
    let borrowed_name = req.body.borrowed_name;
    let publish_year = req.body.publish_year;
    let is_returned = req.body.is_returned;
    let borrowed_date = req.body.borrowed_date;
    let return_date = req.body.return_date;
    // let errors  = false;

    let formData = {
        id: id,
        author: author,
        title: title,
        borrowed_name: borrowed_name,
        publish_year: publish_year,
        is_returned: is_returned,
        borrowed_date: borrowed_date,
        return_date: return_date
    }

    // update query
    connection.query('UPDATE book SET ? WHERE id = ' + id, formData, function(err, result) {
        //if(err) throw err
        if (err) {
            res.render('book/edit', {
                id:     formData.id,
                author: formData.author,
                title: formData.title,
                borrowed_name: formData.borrowed_name,
                publish_year: formData.publish_year,
                is_returned: formData.is_returned,
                borrowed_date: formData.borrowed_date,
                return_date: formData.return_date
            })
        } else {
            res.redirect('/book');
        }
    })
})

/**
 * DELETE POST
 */
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    connection.query('DELETE FROM book WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            // req.flash('error', err)
            // redirect to posts page
            res.redirect('/book')
        } else {
            // set flash message
            // req.flash('success', 'Data Berhasil Dihapus!')
            // redirect to posts page
            res.redirect('/book')
        }
    })
})

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}
module.exports = router;