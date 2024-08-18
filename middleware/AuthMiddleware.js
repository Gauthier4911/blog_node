const jwt = require('jsonwebtoken');
const UserModal = require('../model/User')
const isAuthenticated = function (req, res, next) {
   if (req.cookies.user){
       jwt.verify(req.cookies.user, 'secret', function(err, decoded) {
           if (err){
               res.redirect('login')
           }else{
               console.log(decoded.data)
               next();
           }
       });
   }else{
    res.redirect('/login');
   }
}

const getInfoUser = function (req, res, next) {
    if (req.cookies.user){
        jwt.verify(req.cookies.user, 'secret', function(err, decoded) {
            if (err){
                res.locals.user=null;
                next();
            }else{
                UserModal.findById(decoded.data)
                    .then(user =>{
                        res.locals.user =user;
                        next();
                    })
                    .catch(err => {
                        res.locals.user=null;
                        next();
                    })
            }
        });
    }else{
       res.locals.user=null;
        next();
    }
}

module.exports={
    isAuthenticated,
    getInfoUser
}