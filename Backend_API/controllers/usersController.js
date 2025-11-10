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
exports.me = (req,res)=> {
    const userId = req.user.user_id;
    con.query(
        'select user_id, full_name, username, email, avatar_url, role, status, created_at from users where user_id = ?',
        [userId],
        (err, results) => {
            if(err) 
                return res.status(500).json({error: err.message});
            if(!results.length)
                return res.status(404).json({ error: 'User not found' });
            res.json(results)
        }
    )
}
exports.getAllUser = (req,res) => {
    con.query(
        'SELECT user_id, full_name, username, email, role, status, created_at FROM users',
        (err,results) => {
            if(err) 
                return res.status(500).json({error: err.message})
            res.json(results)
        }
    )
}
exports.getUserById = (req,res) => {
    const id = req.params.id
    con.query('select user_id, full_name, username, email, avatar_url, role, status from users',
        [id],
        (err,results) => {
            if(err) 
                return res.status(500).json({error: err.message});
            if(!results.length) 
                return res.status(404).json({error: 'Not found'});
            res.json(results)
        }
    )
}
exports.updateProfile = (req,res) => {
    const id = req.params.id
    const role = req.user.user_id != id && req.user.role 
    if(role !== 'admin') 
        return res.status(403).json({error: 'Forbidden'});
    const {full_name, email, avatar_url} = req.body
    con.query('update users set full_name=? , email =?, avatar_url =? , updated_at = CURRENT_TIMESTAMP where user_id = ?',
        [full_name, email, avatar_url, id],
        (err)=> {
            if(err) 
                return res.status(500).json({error: err.message});
            res.json({message: 'Profile updated'})
        }
    )
}
exports.changePassword = async (req,res) => {
    const id = req.params.id;
    const role = req.user.user_id != id && req.user.role 
    if(role !== 'admin')
        return res.status(403).json({error: 'Forbidden'});
    const {oldPassword, newPassword} = req.body
    if(!newPassword) 
        return res.status(400).json({error: 'Missing new password'});
    con.query('select password_hash from users where user_id = ?',
        [id],
        async(err,results) => {
            if(err)
                return res.status(500).json({ error: err.message });
            if(!results.length)
                return res.status(404).json({ error: 'User not found' });
            if(req.user.role !== 'admin') {
                const ok = await bcrypt.compare(oldPassword || '', results[0].password_hash)
                if(!ok) 
                    return res.status(403).json({error: 'Old password incorrect' });
            }
            const hash = await bcrypt.compare(newPassword, BCRYPT_SALT_ROUNDS);
            con.query('UPDATE users SET password_hash = ? WHERE user_id = ?',
                [hash,id],
                (err)=> {
                    if (err) 
                        return res.status(500).json({ error: err.message });
                    res.json({ message: 'Password changed' });
                }
            )
                
        }
    )
}
exports.uploadAvatar = async (req,res) => {
    const id = req.params.id
    const role = req.user.user_id != id && req.user.role 
    if(role !== 'admin') 
        return res.status(403).json({error: 'Forbidden'});
    if (!req.file) 
        return res.status(400).json({ error: 'No file' });
    const publicUrl = `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`;
    con.query('update users set avatar_url = ? where user_id = ?',
        [publicUrl,id],
        (err) => {
            if(err)
                return res.status(500).json({error: err.message})
            res.json({ message: 'Avatar uploaded', avatar_url: publicUrl });
        }
    )
}
exports.deleteUser = (req,res) => {
    const id =  req.params.id
    const role = req.user.user_id != id && req.user.role
    if(role !== 'admin') 
        return res.status(403).json({error: 'Forbidden'});
    con.query('delete from users where user_id = ?',
        [id],
        (err) => {
            if (err) 
                return res.status(500).json({ error: err.message });
            res.json({ message: 'User deleted' });
        }
    )
}
exports.requestPasswordReset = (req,res) => {
    const {email} = req.body
    if (!email) 
        return res.status(400).json({ error: 'Missing email' });
    con.query('select user_id from users where email = ?',
        [email],
        (err, results) => {
            if (err) 
                return res.status(500).json({ error: err.message });
            if (!results.length) 
                return res.status(404).json({ error: 'Email not found' });
            const userId = results[0].user_id;
            const token = uuidv4()
            const expiresAt = new Date(Date.now() + PASSWORD_RESET_EXPIRY_HOURS * 3600 * 1000);
            con.query('INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES (?, ?, ?)', 
                [userId, token, expiresAt], 
                (err) => {
                    if (err) 
                        return res.status(500).json({ error: err.message });
                    res.json({ message: 'Password reset created (send email in production)', token });
                }
                
            )
        }
    )
}
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) 
    return res.status(400).json({ error: 'Missing token or newPassword' });

  con.query('SELECT reset_id, user_id, expires_at FROM password_resets WHERE token_hash = ?', 
    [token], 
    async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!results.length) return res.status(400).json({ error: 'Invalid token' });

        const row = results[0];
        if (new Date(row.expires_at) < new Date()) return res.status(400).json({ error: 'Token expired' });

        const hash = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
        con.query('UPDATE users SET password_hash = ? WHERE user_id = ?', [hash, row.user_id], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        con.query('DELETE FROM password_resets WHERE reset_id = ?', [row.reset_id], (err) => {
            // ignore delete error
            res.json({ message: 'Password reset successful' });
        });
    });
  });
};