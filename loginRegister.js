const express = require("express");
const port = 5000;
const form = express();
const mysql =  require("./connection").con;
form.set("view engine","hbs");
form.set("views","./views");
form.use(express.static(__dirname+"/public"));
form.use(express.urlencoded({extended:false}));
form.get("/",(req,res)=>{
    res.render("login");
})
form.get("/register",(req,res)=>{
    res.render("register");
})
form.get("/login",(req,res)=>{
    res.render("login");
})


form.post("/register-submit",(req,res)=>{
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    let qry1 = "select * from register where username=? or email=?";
    mysql.query(qry1,[username,password],(err,results)=>{
        if(err){
            throw err;
        }
        else{
            if(results.length>0){
                res.render("register",{check:true});
            }
            else{
                let qry2 = "insert into register values(?,?,?)";
                mysql.query(qry2,[username,email,password],(err,results)=>{
                    if(results.affectedRows>0){
                        res.render("register",{msg:true});
                    }
                })
            }
        }
    })
})

 form.post("/login-submit",(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    let qry = "select username,password from register where username = ? and password=?";
    mysql.query(qry,[username,password],(err,results)=>{
        if(err){
            throw err;
        }
        else{
            if(results.length>0){
                res.render("home");
            }
            else{
                res.render("login",{checkmsg:true});
            }
        }
    })
 })


form.listen(port,(err)=>{
    if(err){
        throw err;
    }
    else{
        console.log(`server started at port:${port}`);
    }
})