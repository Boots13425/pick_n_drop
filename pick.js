import express from 'express'
import mysql from 'mysql2'
import multer from 'multer'  
import path, {dirname} from 'path'
import {fileURLToPath} from 'url'
import jwt from 'jsonwebtoken'
import bodyParser from 'body-parser'
import { name } from 'ejs'
//import {error} from 'console'


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


/*defining the port*/
const port = 3045 || process.env.port

/*initialising the path to use the express function*/
const app = express();

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use (bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads',express.static(path.join(__dirname, 'uploads')))


/*creating a connection by default*/
const db = mysql.createConnection({
host:'localhost',
user: 'root',
password: '',
database: 'signupforpickndrop'
})

/*checking if our connection is okay*/
db.connect(err=>{
    if(err) throw err
    console.log('connected successfully')

})


//app.get('/pick', (req, res)=>{
//res.sendFile(path.join(__dirname,'public','sign up.html'))
//})

app.get('/server', (req, res)=>{
res.sendFile(path.join(__dirname,'public','home.html'))
})
app.get('/post', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'post trip.html'));
});

/*the register logic*/
app.get('/sign up2', (req, res)=>{
res.sendFile(path.join(__dirname,'public','sign up2.html'))
})

let currentUsername = "";
let currentEmail = "";
app.post('/submit1',(req, res)=>{
    const username = req.body.username;
    const {email,password} = req.body;

    if(!username ||!email ||!password){
      return res.status(400).send('All fields are required')
    }
    
    const insert = 'INSERT INTO users(username,email,password) VALUES(?,?,?)'                                        
    db.query(insert, [username,email,password],(err, result)=>{
        if(err) throw err;

        currentUsername = username;
        currentEmail = email;
        res.redirect('/Dashboard.html');
    })
})

app.get('/Profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Profile.html'));
});
app.get('/get_username', (req, res) => {
    res.json({ username: currentUsername });
});
app.get('/get_email', (req, res) => {
    res.json({ email: currentEmail });
});

/*login*/
app.get('/login1', (req, res)=>{
    res.sendFile(path.join(__dirname,'public','login.html'))
})

app.post('/submit2', (req, res)=>{
    const {username,email,password} = req.body;
    if(!username ||!email || !password){
        res.status(400).json({message:'All fields are required'})
    }
    const sql = 'SELECT * FROM users WHERE username= ? AND email= ? AND password= ?'
    
    if(sql){
        console.log('good')
    }
    else{
        console.log('bad')
    }
    db.query(sql, [username,email,password], (error, result)=>{
        if (error){
            console.error(error)
            return res.status(500).json({message: ('error')})
        }
        if(result.length>0){
            currentUsername = username;
            currentEmail = email;
            return res.json({redirect: '/Dashboard.html'})
        }else{
            return res.json ({message:'User not found. Please check credentials'})
        }
    })
})

// Multer storage config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // folder to store files
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
  const upload = multer({ storage: storage });
  
  // KYC POST route
  app.post('/api/kyc', upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'id_card', maxCount: 1 }
  ]), (req, res) => {
    const fullname = req.body;
    const photoPath = `/uploads/${req.files.photo[0].filename}`;
    const idCardPath = `/uploads/${req.files.id_card[0].filename}`;
  
    if (!req.files.photo || !req.files.id_card) {
      return res.status(400).json({ message: 'Both photo and ID card are required.' });
    }
  
    const sql = 'INSERT INTO kyc (fullname, photo, id_card) VALUES(?,?,?)'
    db.query(sql, [fullname, photoPath, idCardPath], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }
      res.json({ message: 'Submitted successfully' });
    });
  });

  app.post('/postTrip', (req, res) => {
    //accept the data coming in from body-parser
    const { username, Date, Time, Location, Destination, Items } = req.body;
    //if any wrong input or no credential entered
    if(!username || !Date || !Time || !Location || !Destination || !Items){
      return res.status(400).send('Please enter all details')
    }
    const sql = 'INSERT INTO posttrips (username, Date, Time, Location, Destination, Items) VALUES (?,?,?,?,?,?)';
    db.query(sql, [username, Date, Time, Location, Destination, Items], (err,result) => {
        if(err){
          console.error(err)
          return res.status(500).send('Cannot access database! try again')
        }
        res.redirect('/findtrips');
    })
})

app.get('/findtrips', (req,res)=>{
  res.sendFile(path.join(__dirname, 'public','/findtrips.html'))
})

// Retrieving post trip imputs from database
app.get('/api/post', (req, res) => {
  const sql = 'SELECT * FROM posttrips'
    db.query(sql, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error occured while posting trip')
      }
      res.json(results);
    })
})

//Saving Feedback to database
app.post('/subfeed',(req, res)=>{
  const {fullname,email,feedback} = req.body;

  if(!fullname ||!email ||!feedback){
    return res.status(400).send('All fields are required')
  }
  
  const insert = 'INSERT INTO feedbacks(Name,email,reviews) VALUES(?,?,?)'                                        
  db.query(insert, [fullname,email,feedback],(err, result)=>{
      if(err) throw err;
      res.json({redirect: "/Dashboard.html", message: "Thanks for your Feedback"})
  })
})

//Saving reports to database
app.post('/subrep',(req, res)=>{
  const {fullname,email,report} = req.body;

  if(!fullname ||!email ||!report){
    return res.status(400).send('All fields are required')
  }
  
  const insert = 'INSERT INTO reports(Name,email,reports) VALUES(?,?,?)'                                        
  db.query(insert, [fullname,email,report],(err, result)=>{
      if(err) throw err;
      res.json({redirect: "/Dashboard.html", message: "Report sent successfully"})
  })
})

app.listen(port, ()=>{
    console.log('server running')
})

//const jwt = require('jsonwebtoken');

// Middleware to verify token
//function requireAuth(req, res, next) {
  //const token = req.headers['authorization']?.split(' ')[1];
  //if (!token) return res.status(401).send('Token required');

  //jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    //if (err) return res.status(401).send('Invalid token');
    //req.user = decoded; // e.g., { id: userId, username: ... }
    //next();
  //});
//}

//app.delete('/api_trips/:id', requireAuth, (req, res) => {
  //const tripId = req.params.id;
  //const userId = req.user.id;

  // Check ownership
  //db.query('SELECT user_id FROM posttrips WHERE id = ?', [tripId], (err, rows) => {
    //if (err) return res.status(500).json({ message: 'Server error' });
    //if (!rows.length) return res.status(404).json({ message: 'Trip not found' });
    //if (rows[0].user_id !== userId) {
      //return res.status(403).json({ message: 'Not authorized to delete this trip' });
    //}

    // Perform delete
    //db.query('DELETE FROM posttrips WHERE id = ?', [tripId], (err2) => {
      //if (err2) return res.status(500).json({ message: 'Error deleting trip' });
      //res.json({ message: 'Trip deleted' });
    //});
  //});
//});

//function deleteTrip(postId) {
  //  fetch(`/api_trips/${postId}`, {
    //  method: 'DELETE',
      //headers: { 'Authorization': `Bearer ${yourJWTtoken}` }
    //})
      //.then(res => {
        //if (res.ok) {
          //document.querySelector(`[data-postid="${postId}"]`).remove();
        //} else {
          //alert('Could not delete trip');
        //}
    //});
//}