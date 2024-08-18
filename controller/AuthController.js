const yup = require('yup')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const UserModal = require('../model/User')
const e = require("express");
let userShema = yup.object({
    username: yup.string().trim().required('Champ obigatoire'),
    email: yup.string().trim().required().email('email invalide'),
    password: yup.string().min(8,'minimun 8 caracères'),
    password_confirmation: yup.string().required().oneOf([yup.ref('password'),null],'le mot de passe ne correspond pas'),
});
const showFormLogin = (req,res) => {
  res.render('pages/auth/login')
}

const showFormRegister = (req,res) => {
    res.render('pages/auth/register')
}
const register = async (req, res) => {
    try {
        await userShema.validate(req.body, {abortEarly: false})

        UserModal.find({mail:req.body.email})
            .then(newUser =>{
                if (newUser.length>0){
                    req.flash('mail',true)
                    res.redirect('/register')
                }else{
                    let newUser = new UserModal({
                        name: req.body.username,
                        mail: req.body.email,
                        password:  bcrypt.hashSync(req.body.password, saltRounds)
                    }) ;
                    newUser.save();
                    res.redirect('/login');
                }
            })

    }catch (e) {
        req.flash('errors', e.inner)
        res.redirect('/register')
    }
}
const login = async (req,res) => {
    UserModal.find({mail:req.body.email})
        .then(newUser =>{
            if (newUser.length===0){
                req.flash('identifiant',true)
                res.redirect('/login')
            }else{
                if (!bcrypt.compareSync(req.body.password, newUser[0].password)){
                    req.flash('identifiant',true)
                    res.redirect('/login')
                }else {
                    let token_user = jwt.sign({
                        data: newUser[0]._id
                    }, 'secret', { expiresIn: '1h' });
                    res.cookie('user', token_user, { maxAge: 3600000, httpOnly: true })
                    res.redirect('/');
                }

            }
        }).catch(e =>{
        req.flash('errors', e.inner)
        res.redirect('/login')
    })
}
const logout = (req,res) => {
    res.cookie('user','',{maxAge: 1})
    res.redirect('/login')
}

module.exports={
    showFormRegister,
    showFormLogin,
    register,
    login,
    logout
}
