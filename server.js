import express from "express"
import pg from "pg"
import cors from "cors"
import dotenv from "dotenv"

//express
const app = express();
//port
const port = process.env.PORT || 8000;
//dotenv path
dotenv.config({path: './.env'});
//pool
const { Pool } = pg;
const pool = new pg.Pool ({
    connectionString: process.env.DATABASE_URL
})

//server inst
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

//get all
app.get('/api/songs', async (req, res) => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM songs', []);
        res.json(result.rows);
    } 
    catch (error) {
        res.status(500).send(error);
    }
    finally{
        client.release();
    }
});

app.get('/api/users', async (req, res) => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM users', []);
        res.json(result.rows);
    } 
    catch (error) {
        res.status(500).send(error);
    }
    finally{
        client.release();
    }
});

//get one
app.get('/api/songs/:id', async (req, res) => {
    const client = await pool.connect();
    const {id} = req.params;
    try {
        const result = await client.query('SELECT * FROM songs WHERE id = $1', [id]);
        res.json(result.rows);
    } 
    catch (error) {
        res.status(500).send(error);
    }
    finally{
        client.release();
    }
});

app.get('/api/users/:id', async (req, res) => {
    const client = await pool.connect();
    const {id} = req.params;
    try {
        const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
        res.json(result.rows);
    } 
    catch (error) {
        res.status(500).send(error);
    }
    finally{
        client.release();
    }
});

//create one
app.post('/api/songs', async (req, res) => {
    const client = await pool.connect();
    const {song_title, band_name, genre, song_quote, recommend_why, user_id} = req.body;
    console.log(req.body.song_title);
    try {
        const result = await pool.query('INSERT INTO songs (song_title, band_name, genre, song_quote, recommend_why, user_id) VALUES ($1, $2, $3, $4, $5, $6)', [song_title, band_name, genre, song_quote, recommend_why, user_id]);
        res.json(req.body);
    } 
    catch (error) {
        res.status(500).send(error);
    }
    finally{
        client.release();
    }
});

//register route
app.post('/api/users/register', async (req, res) => {
    const client = await pool.connect();
    
    const {username, password} = req.body;
    
    try {
        const existingUser = await client.query('SELECT * FROM users WHERE username = $1', [username]);
        if(existingUser.rows.length > 0) {
            return res.status(400).json({error: 'Username already exists'});
        }
        
        const result = await client.query('INSERT INTO users (username, password, edit_all_permission) VALUES ($1, $2, FALSE) RETURNING *', [username, password]);
        const newUser = result.rows[0];
        console.log(newUser)
        res.status(200).json(newUser)
    } 
    catch (error) {
        res.status(500).send(error);
    }
    finally{
        client.release();
    }
});

//login route
app.post('/api/users/login', async (req, res) => {
    const client = await pool.connect();
    
    const {username, password} = req.body;
    
    try {
        const results = await client.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
        if(results.rows.length > 0) {
            const user = results.rows[0];
            res.status(200).json({user, success: true, message: 'Login Successful'});
        } else {
            res.status(400).json({message: 'Invalid User'})
        } 
    }catch(error) {
             console.log(error.stack);
             res.status(500).json({error: 'Internal Server Error'});
        }
        finally{
            client.release();
    }
});

//put one
app.put('/api/songs/:id', async (req, res) => {
    const client = await pool.connect();
    const {song_title, band_name, genre, song_quote, recommend_why, user_id} = req.body;
    const {id} = req.params;
    try {
        const result = await client.query('UPDATE songs SET song_title = $1, band_name = $2, genre = $3, song_quote = $4, recommend_why = $5, user_id =$6 WHERE id = $7', [song_title, band_name, genre, song_quote, recommend_why, user_id, id]);
        res.json(req.body);
    } 
    catch (error) {
        res.status(500).send(error);
    }
    finally{
        client.release();
    }
});

app.put('/api/users/:id', async (req, res) => {
    const client = await pool.connect();
    const {username, password} = req.body;
    const {id} = req.params;
    try {
        const result = await client.query('UPDATE users SET username = $1, password = $2, edit_all_permission = FALSE WHERE id = $3', [username, password, id]);
        res.json(req.body);
    } 
    catch (error) {
        res.status(500).send(error);
    }
    finally{
        client.release();
    }
});

//delete one
app.delete('/api/songs/:id', async (req, res) => {
    const client = await pool.connect();
    const {id} = req.params;
    try {
        const result = await client.query('DELETE FROM songs WHERE id = $1', [id]);
        res.json(req.body);
    } 
    catch (error) {
        res.status(500).send(error);
    }
    finally{
        client.release();
    }
});

app.delete('/api/users/:id', async (req, res) => {
    const client = await pool.connect();
    const {id} = req.params;
    try {
        const result = await client.query('DELETE FROM users WHERE id = $1', [id]);
        res.json(req.body);
    } 
    catch (error) {
        res.status(500).send(error);
    }
    finally{
        client.release();
    }
});

//listener
app.listen(port, () => {
    console.log('listening on port', port)
})

