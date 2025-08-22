import express from 'express'
import multer from 'multer'
import mysql from 'mysql2'
import path from 'path'

const app = express()

// this is to setup the multer storage on your computer.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'uploads'))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})
const upload = multer({ storage: storage })

//this is the mysql connect (do not add this to your code)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pickndrop2'
})

// serving the uploads file so that admin can view the uploaded images
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

//this is the route to hanble the upload process of the images
app.post('/upload-images', upload.array('images', 3), (req, res) => {
    if (!req.files || req.files.length !== 3) {
        return res.status(400).send('Please upload exactly 3 images.')
    }
    const filenames = req.files.map(file => file.filename)
    const sql = 'INSERT INTO kyc (image1, image2, image3) VALUES (?, ?, ?)'
    db.query(sql, filenames, (err, result) => {
        if (err) {
            console.error(err)
            return res.status(500).send('Database error')
        }
        res.send('Images uploaded successfully!')
        //you might want to redirect to the dashboard.
    })
})

// this is the route for the admin to view the images uploaded by users
app.get('/admin/images', (req, res) => {
    db.query('SELECT * FROM kyc', (err, results) => {
        if (err) {
            return res.status(500).send('Database error')
        }
        let html = '<h2>Uploaded Images</h2>'
        results.forEach(row => {
            html += `<div style="margin-bottom:20px;">
                <img src="/uploads/${row.image1}" width="120">
                <img src="/uploads/${row.image2}" width="120">
                <img src="/uploads/${row.image3}" width="120">
            </div>`
        })
        res.send(html)
    })
})

const PORT = 3400
app.listen(PORT, () => {
    console.log(`Multer server running at http://localhost:${PORT}`)
})
