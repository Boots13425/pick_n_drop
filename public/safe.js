import express from 'express'
import mysql from 'mysql2'
import path, {dirname} from 'path'
import {fileURLToPath} from 'url'
import bodyParser from 'body-parser'
import bcrypt from 'bcrypt'


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/*defining the port*/
const PORT = 3043
/*initialising the path to use the express function*/
const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({extend: true}))

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


app.get('/pick', (req, res)=>{
res.sendFile(path.join(__dirname,'public','sign up.html'))
})

// /*the register logic*/
app.post('/submit',(req, res)=>{
    const {FullName,UserName,Email,Password,Gender} = req.body
     const insert = 'INSERT INTO app users(FullName,UserName,Email,Password,Gender) VALUES(?,?,?,?,?)'                                        
     db.query(insert,[FullName,UserName,Email,Password,Gender],(error, result)=>{
         if(error){
console.log('error inserting to db')         }
         res.json({redirect:'/signup1', name:FullName})
    } )
})
app.get('/home', (req, res)=>{
res.sendFile(path.join(__dirname,'public','home.html'))
})
app.get('/', (req, res)=>{
res.sendFile(path.join(__dirname,'public','signup1.html'))
})
app.get('/next', (req, res)=>{
res.sendFile(path.join(__dirname,'public','next.html'))
})
app.get('/login1', (req, res)=>{
res.sendFile(path.join(__dirname,'public','login.html'))
})
//endpoint for the signup login
app.post('/register', async (req,res) => {
    //accept the data coming in from body-parser
    const {FullName, UserName, Email, Password, Gender} = req.body
//if any wrong input or no credential entered
    if(!FullName || !UserName || !Email || !Password || !Gender){
        //error message for both backend and frontend
        return res.status(400).send('Please enter all details')
    }
    if (Password.length < 8){
        return res.status(404).send('password must be 8 characters')
    }
    const hashedPassword = await bcrypt.hash(Password, 10)
    const sql = 'INSERT INTO appusers (FullName, UserName, Email, Password, Gender) VALUES(?,?,?,?,?)'

 db.query(sql,[FullName, UserName, Email, hashedPassword, Gender], (error,result) => {
        if(error){
            console.error(err)
            return res.status(500).send('Cannot access database! try again')
        }
        res.sendFile(path.join(__dirname, 'public', 'Dashboard.html'))
    })
})


app.post('/submit1',(req, res)=>{
    const {UserName,Password} = req.body

    if(!UserName ||!Password){
        res.status(400).send('all fields are required')
    }
    
    const insert = 'INSERT INTO users(UserName,Password) VALUES(?,?)'                                        
    db.query(insert,[UserName,password],(error, result)=>{
        if(error){
            console.log('error inserting to db')
        }
        res.json({redirect:'/Dashboard.html'})
    } )
})


/*login*/
app.post('/submit2', (req, res)=>{
    const {UserNameame, Password} = req.body
    if(!UserName || !Password){
        res.status(400).json({message:'All fields are required'})
        
    }
    const sql = 'SELECT * FROM users WHERE UserName= ? AND password= ?'
    if(sql){
        console.log('good')
    }
    else{
        console.log('bad')
    }
    db.query(sql, [UserName, Password], (error, result)=>{
        if (error){
            console.error(error)
            res.status(500).json({message: ('error')})
        }
        if(result.length>0){
            res.json({redirect: '/Dashboard.html'})
        }
        else{
            res.json ({message:'user not found. Please check credentials'})
        }

    })
})
//create an endpoint to collect data from the database
app.get('/api/users', (req,res) => {
    const sql = 'SELECT * FROM users'
    db.query(sql, (err, result) =>{

        if(err){
            console.error(err)
            return res.status(500).send('database error')
        }
        res.json(result)
    })
    
})
//rendering the page to yhe userbygender
app.get('/genderPage', (req,res) => {
    res.sendFile(path.join(__dirname,'public','users-by-gender.html'))
})
//api endpoint that filters based on gender
app.get ('/api/users/gender/:gender', (req,res) => {
    //requesting for a particular gender from the database and give us back in gender
    const gender = req.params.gender
    const sql = 'SELECT * FROM users WHERE gender = ?'
    db.query(sql, [gender], (err, result) =>{
        if(err){
            console.error(err)
            return res.status(500).send('database error')
        }
        res.json(result)
    })
})

app.listen(PORT, ()=>{
    console.log(`server running on http://localhost:${PORT}`)})