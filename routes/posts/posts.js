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
            res.render('posts', {
                data: ''
            });
        } else {
            //render ke view posts index
            res.render('posts/index', {
                data: rows // <-- data posts
            });
        }
    });
});

/**
 * CREATE POST
 */
router.get('/create', function (req, res, next) {
    res.render('posts/create', {
        title: '',
        content: ''
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
    let is_return = req.body.is_return;
    let borrow_date = req.body.borrow_date;
    let return_date = req.body.return_date;
    let errors  = false;

    if(title.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Silahkan Masukkan Title");
        // render to add.ejs with flash message
        res.render('posts/create', {
            author: author,
            title: title,
            borrowed_name: borrowed_name,
            publish_year: publish_year,
            is_return: is_return,
            borrow_date: borrow_date,
            return_date: return_date
        })
    }

    if(content.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Silahkan Masukkan Konten");
        // render to add.ejs with flash message
        res.render('posts/create', {
            author: author,
            title: title,
            borrowed_name: borrowed_name,
            publish_year: publish_year,
            is_return: is_return,
            borrow_date: borrow_date,
            return_date: return_date
        })
    }

    // if no error
    if(!errors) {

        let formData = {
            author: author,
            title: title,
            borrowed_name: borrowed_name,
            publish_year: publish_year,
            is_return: is_return,
            borrow_date: borrow_date,
            return_date: return_date
        }
        
        // insert query
        connection.query('INSERT INTO book SET ?', formData, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('posts/create', {
                    author: formData.author,
                    title: formData.title,
                    borrowed_name: formData.borrowed_name,
                    publish_year: formData.publish_year,
                    is_return: formData.is_return,
                    borrow_date: formData.borrow_date,
                    return_date: formData.return_date
                })
            } else {                
                req.flash('success', 'Data Berhasil Disimpan!');
                res.redirect('/posts');
            }
        })
    }

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
            req.flash('error', 'Data Post Dengan ID ' + id + " Tidak Ditemukan")
            res.redirect('/posts')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('posts/edit', {
                id:      rows[0].id,
                author: rows[0].author,
                title: rows[0].title,
                borrowed_name: rows[0].borrowed_name,
                publish_year: rows[0].publish_year,
                is_return: rows[0].is_return,
                borrow_date: rows[0].borrow_date,
                return_date: rows[0].return_date
            })
        }
    })
})

/**
 * UPDATE POST
 */
router.post('/update/:id', function(req, res, next) {

    let author = req.body.author;
    let title = req.body.title;
    let borrowed_name = req.body.borrowed_name;
    let publish_year = req.body.publish_year;
    let is_return = req.body.is_return;
    let borrow_date = req.body.borrow_date;
    let return_date = req.body.return_date;
    let errors  = false;

    if(title.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Silahkan Masukkan Title");
        // render to edit.ejs with flash message
        res.render('posts/edit', {
            id: req.params.id,
            author: author,
            title: title,
            borrowed_name: borrowed_name,
            publish_year: publish_year,
            is_return: is_return,
            borrow_date: borrow_date,
            return_date: return_date
        })
    }

    if(content.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Silahkan Masukkan Konten");
        // render to edit.ejs with flash message
        res.render('posts/edit', {
            id:         req.params.id,
            author: author,
            title: title,
            borrowed_name: borrowed_name,
            publish_year: publish_year,
            is_return: is_return,
            borrow_date: borrow_date,
            return_date: return_date
        })
    }

    // if no error
    if( !errors ) {   
 
        let formData = {
            author: author,
            title: title,
            borrowed_name: borrowed_name,
            publish_year: publish_year,
            is_return: is_return,
            borrow_date: borrow_date,
            return_date: return_date
        }

        // update query
        connection.query('UPDATE book SET ? WHERE id = ' + id, formData, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('posts/edit', {
                    id:     req.params.id,
                    author: formData.author,
                    title: formData.title,
                    borrowed_name: formData.borrowed_name,
                    publish_year: formData.publish_year,
                    is_return: formData.is_return,
                    borrow_date: formData.borrow_date,
                    return_date: formData.return_date
                })
            } else {
                req.flash('success', 'Data Berhasil Diupdate!');
                res.redirect('/posts');
            }
        })
    }
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
            req.flash('error', err)
            // redirect to posts page
            res.redirect('/posts')
        } else {
            // set flash message
            req.flash('success', 'Data Berhasil Dihapus!')
            // redirect to posts page
            res.redirect('/posts')
        }
    })
})

module.exports = router;