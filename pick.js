import express from 'express'
import mysql from 'mysql2'
import path, {dirname} from 'path'
import {fileURLToPath} from 'url'
import bodyParser from 'body-parser'
import bcrypt from 'bcrypt'
import WebSocket, {WebSocketServer} from 'ws'
import multer from 'multer'
import http from 'http'
import session from 'express-session'


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


/*defining the port*/
const PORT = 3040
/*initialising the path to use the express function*/
const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({extend: true}))
// serving the uploads file so that admin can view the uploaded images
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

/*creating a connection by default*/
const db = mysql.createConnection({
host:'localhost',
user: 'root',
password: '',
database: 'pickndrop2'
})
/*checking if our connection is okay*/
db.connect(err=>{
    if(err) throw err
    console.log('connected successfully')

})
app.get('/', (req, res)=>{
res.sendFile(path.join(__dirname,'public','home.html'))
})

app.get('/sign', (req, res)=>{
res.sendFile(path.join(__dirname,'public','signup1.html'))
})
app.get('/upload', (req, res)=>{
res.sendFile(path.join(__dirname,'public','upload-images.html'))
})

app.get('/post', (req, res) => {
    // Only allow access if user is logged in
    if (!req.session.user) return res.redirect('/submit2');
    const user_id = req.session.user.id;
    // Check if KYC exists for this user
    db.query('SELECT * FROM kyc WHERE user_id = ?', [user_id], (err, results) => {
        if (err) return res.status(500).send('Database error');
        // If KYC exists, go straight to postTrip.html
        if (results.length > 0) {
            res.sendFile(path.join(__dirname, 'public', 'postTrip.html'));
        } else {
            // If no KYC, redirect to next.html for KYC upload
            res.redirect('/next');
        }
    });
})
app.get('/next', (req, res)=>{
res.sendFile(path.join(__dirname,'public','next.html'))
})
app.get('/findtrip', (req, res)=>{
res.sendFile(path.join(__dirname,'public','findtrip.html'))
})
app.get('/view', (req, res)=>{
res.sendFile(path.join(__dirname,'public','view_profile.html'))
})
app.get('/dashboard', (req, res)=>{
res.sendFile(path.join(__dirname,'public','Dashboard.html'))
})
app.get('/policy', (req, res)=>{
res.sendFile(path.join(__dirname,'public','policy.html'))
})

app.use(session({
    secret: 'pickndrop_secret',
    resave: false,
    saveUninitialized: true
}))

//endpoint for the signup login
app.post('/register', async (req,res) => {
    //accept the data coming in from body-parser
    const {FullName, UserName, Email, Password, Gender, agree} = req.body
//if any wrong input or no credential entered
    if(!FullName || !UserName || !Email || !Password || !Gender ){
        //error message for both backend and frontend
        return res.status(400).send('Please enter all details')
    }
    if (Password.length < 8){
        return res.status(404).send('password must be 8 characters')
    }
    // Backend validation
  if (!agree) {
    return res.status(400).json({ error: 'You must agree to the policy.' });
  }
    const hashedPassword = await bcrypt.hash(Password, 10)
    const sql = 'INSERT INTO appusers (FullName, UserName, Email, Password, Gender) VALUES(?,?,?,?,?)'

 db.query(sql,[FullName, UserName, Email, hashedPassword, Gender], (err,result) => {
        if(err){
            console.error(err)
            return res.status(500).send('Cannot access database! try again')
        }
        // Set session after registration
        req.session.user = { UserName, id: result.insertId }
        req.session.kycUploaded = false
        res.redirect('/dashboard')
    })
})

//endpoint to load login
app.get('/submit2', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'login.html'))
})

/*login*/
app.post('/submit2', (req, res)=>{
    const {UserName, Password} = req.body
    if(!UserName || !Password){
        res.status(400).json({message:'All fields are required'})
        
    }
    const sql = 'SELECT * FROM appusers WHERE UserName = ? '

    db.query(sql, [UserName], async (err, result)=>{
        if (err){
            console.error(err)
          return  res.status(500).json({message: ('error')})
        }
        if(result.length>0){
            const match = await bcrypt.compare(Password, result[0].Password)
            if(match){
                // Set session after login
                req.session.user = { UserName: result[0].UserName, id: result[0].id }
                // Check if KYC exists
                db.query('SELECT * FROM kyc WHERE user_id = ?', [result[0].id], (err, kycRes) => {
                    req.session.kycUploaded = (kycRes && kycRes.length > 0)
                    res.redirect('/dashboard')
                })
            }
            else {
                res.status(401).send('user not found. Please check credentials' )
            }
        }
        else{
            res.status(401).send('user not found. Please check credentials')
           
        }
         
    })
})
//realtime messaging logic

let clients = []

app.get('/realtime', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'realtime.html'))
})

const server = http.createServer(app)
const wss = new WebSocketServer({ server })

wss.on("connection", ws => {
    clients.push(ws)
    console.log("new user connected")

    ws.on("message", message => {
        clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message.toString())
            }
        })
    })

    ws.on("close", () => {
        clients = clients.filter((client) => client !== ws)
        console.log("user disconnected")
    })
})

// //endpoint for KYC
// app.post('/kyc', async (req,res) => {
//     //accept the data coming in from body-parser
//     const {idSnapshot,selfie,passport} = req.body
// //if any wrong input or no credential entered
//     if(!idSnapshot || !selfie || !passport){
//         //error message for both backend and frontend
//         return res.status(400).send('Please enter all details')
//     }
    
//     const sql = 'INSERT INTO KYC (idSnapshot, selfie, passport) VALUES(?,?,?)'

//  db.query(sql,[idSnapshot, selfie, passport], (error,result) => {
//         if(error){
//             console.error(err)
//             return res.status(500).send('Cannot access database! try again')
//         } 
//         upload.single('selfie'), (req,res) => {
//             console.log(req.file);
//             if(req.file){
//                 console.log('Image uploaded successfully')
//             }
//         }
//         res.sendFile(path.join(__dirname, 'public', 'postTrip.html'))
//     })
// })



//end point for post trip
app.post('/post_trip', (req,res) => {
    if (!req.session.user) return res.status(401).send('Not logged in')
    const user_id = req.session.user.id
    db.query('SELECT * FROM kyc WHERE user_id = ?', [user_id], (err, results) => {
        if (err) return res.status(500).send('Database error')
        if (!results || results.length === 0) {
            return res.status(403).send('Please complete KYC before posting a trip.')
        }
        // Check status
        if (results[0].status !== 'approved') {
            return res.status(403).send('Your KYC documents are pending approval by admin.')
        }
        
        //accept the data coming in from body-parser
        const {Date,Location,Destination,Items} = req.body
        if(!Date || !Location|| !Destination || !Items){
            return res.status(400).send('Please enter all details')
        }
        const sql = 'INSERT INTO post_trip (user_id, Date,Location,Destination,Items) VALUES (?,?,?,?,?)'
        db.query(sql,[user_id, Date,Location,Destination,Items], (error,result) => {
            if(error){
                 console.error(error)
                return res.status(500).send('Cannot access database! try again')
            }
            // Redirect to findtrip.html after posting a trip
            res.redirect('/findtrip')
        })
    })
})


//create an endpoint to collect data from the database
app.get('/api/post', (req,res) => {
    const sql = 'SELECT * FROM post_trip'
    db.query(sql, (err, result) =>{
        if(err){
            console.error(err)
            return res.status(500).send('database error')
        }
        res.json(result)
    })
    
})
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

//this is the route to handle the upload process of the images
app.post('/upload-images', upload.array('images', 3), (req, res) => {
    if (!req.session.user) return res.status(401).send('Not logged in')
    const user_id = req.session.user.id
    db.query('SELECT * FROM kyc WHERE user_id = ?', [user_id], (err, results) => {
        if (err) return res.status(500).send('Database error')
        if (results.length > 0) {
            return res.status(400).send(`<a href="postTrip.html">KYC already submitted, back to post</a>`)
        }
        if (!req.files || req.files.length !== 3) {
            return res.status(400).send('Please upload exactly 3 images.')
        }
        const filenames = req.files.map(file => file.filename)
        // Save images and create pending record for admin approval
        const sql = 'INSERT INTO kyc (user_id, idSnapshot, selfie, passport, status) VALUES (?, ?, ?, ?, ?)'
        db.query(sql, [user_id, ...filenames, 'pending'], (err, result) => {
            if (err) {
                console.error(err)
                return res.status(500).send('Database error')
            }
            req.session.kycUploaded = true
            // Redirect to postTrip.html after KYC
            res.redirect('/post')
        })
    })
})

// Admin API: fetch all pending KYC records for approval
app.get('/api/pending-kyc', (req, res) => {
    const sql = `
        SELECT kyc.id, kyc.user_id, kyc.idSnapshot, kyc.selfie, kyc.passport, appusers.UserName
        FROM kyc
        JOIN appusers ON kyc.user_id = appusers.id
        WHERE kyc.status = 'pending'
    `
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({error: 'Database error'})
        // Return image URLs for admin dashboard
        const pending = results.map(row => ({
            id: row.id,
            username: row.UserName,
            images: [
                `/uploads/${row.idSnapshot}`,
                `/uploads/${row.selfie}`,
                `/uploads/${row.passport}`
            ]
        }))
        res.json(pending)
    })
})

// Admin API: approve KYC
app.post('/api/approve-kyc', (req, res) => {
    const { id } = req.body
    db.query('UPDATE kyc SET status = "approved" WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({error: 'Database error'})
        res.json({success: true})
    })
})

// Admin API: reject KYC
app.post('/api/reject-kyc', (req, res) => {
    const { id } = req.body
    db.query('UPDATE kyc SET status = "rejected" WHERE id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({error: 'Database error'})
        res.json({success: true})
    })
})

// API to get current user info (for dashboard customization)
app.get('/api/me', (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: 'Not logged in' })
    res.json({ username: req.session.user.UserName })
})

//route to check if user has uploaded the kyc
app.get('/api/check-kyc', (req,res) =>{
    if (!req.session.user) return res.status(401).json({ error: 'Not logged in' })
    const user_id = req.session.user.id
    const query= 'SELECT * FROM kyc WHERE user_id = ?'
    db.query(query, [user_id], (err, results) =>{
        if (err) return res.status(500).json({error : 'Server error'});
        if (results.length > 0){
            res.json({kycUploaded: true})
        } else {
            res.json({kycUploaded: false})
        }
    })
})

// API: Get all users who have submitted KYC (pending or approved)
app.get('/api/kyc-users', (req, res) => {
    const sql = `
        SELECT kyc.id AS kyc_id, appusers.FullName AS name, appusers.Email AS email, kyc.status,
               kyc.idSnapshot, kyc.selfie, kyc.passport
        FROM kyc
        JOIN appusers ON kyc.user_id = appusers.id
        WHERE kyc.status IN ('pending', 'approved')
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({error: 'Database error'});
        // Attach image URLs for pending users
        const users = results.map(row => ({
            kyc_id: row.kyc_id,
            name: row.name,
            email: row.email,
            status: row.status,
            images: row.status === 'pending'
                ? [
                    `/uploads/${row.idSnapshot}`,
                    `/uploads/${row.selfie}`,
                    `/uploads/${row.passport}`
                  ]
                : undefined
        }));
        res.json(users);
    });
});

app.listen(PORT, ()=>{
    console.log(`server running on http://localhost:${PORT}`)})