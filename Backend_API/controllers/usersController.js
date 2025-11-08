// controllers/usersController.js
const con = require('../db/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const util = require('util');
const { body, Result } = require('express-validator');
const { error } = require('console');
const unlinkAsync = util.promisify(fs.unlink);

const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_secret';
const BCRYPT_SALT_ROUNDS = 10;
const PASSWORD_RESET_EXPIRY_HOURS = 2;


exports.register = async(req,res) => {
    try {
        const {full_name, username, email, password, role} = req.body;
        if(!username || !email || !password) 
            return res.status(400).json({error: "Missing fields"});
        con.query('select user_id from users where username = ? or email = ?',[username,email], async (error,results) => {
            if(error) 
                return res.status(400).json({error:error.message});
            if(results.length) 
                return res.status(409).json({error: "Username or email already exits"});
            const hash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
            con.query(
                'insert into users (full_name, username, email, password_hash, role) values (?,?,?,?,?)',
                [full_name || null,username,email,hash,role ||"user"],
                (error,results) => {
                    if(error) 
                        return res.status(500).json({error:error.message});
                    res.json({message: "Register success",user_id: results.insertId})
                }
            )
        });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}
exports.login = async(req,res) => {
    const {usernameOrEmail, password} = req.body;
    if(!usernameOrEmail || !password)
        return res.status(400).json({error: "Missing credentials"});
    con.query(
        'select user_id, username, email, password_hash, role from users where username = ? or email = ?',
        [usernameOrEmail,usernameOrEmail],
        async(error,results) => {
            if(error) 
                return res.status(500).json({error: error.message});
            if(!results.length)
                return res.status(401).json({error: 'Invalid credentials'});

            const user = results[0];
            const match = await bcrypt.compare(password, user.password_hash);
            if(!match)
                return res.status(401).json({error: 'Invalid credentials'});
            const token = jwt.sign({user_id: user.user_id, role: user.role}, JWT_SECRET, {expiresIn: '7d'});
            res.json({token, user: {user_id: user.user_id, username: user.username, role: user.role}})
        }
    )
}