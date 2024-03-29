const express = require('express')
const path = require('path')

const redirectControllers = {

    login: async(req, res)=>{
        try {
            res.sendFile(path.join(process.cwd() +'/html/login.html'))
        } catch (err) {
            res.status(502).json(err); 
        }
    },

    signup: async(req, res)=>{
        try {
            res.sendFile(path.join(process.cwd() +'/html/signup.html'))
        } catch (err) {
            res.status(502).json(err); 
        }
    },


    logout: async(req, res)=>{
        try {
            res.sendFile(path.join(process.cwd() +'/html/logout.html'))
        } catch (err) {
            res.status(502).json(err); 
        }
    },

    home: async(req, res)=>{
        try {
            res.sendFile(path.join(process.cwd() +'/html/home.html'))
        } catch (err) {
            res.status(502).json(err); 
        }
    },
    chat: async(req, res)=>{
        try {
            res.sendFile(path.join(process.cwd() +'/html/chat.html'))
        } catch (err) {
            res.status(502).json(err); 
        }
    },
    s3: async(req, res)=>{
        try {
            res.sendFile(path.join(process.cwd() +'/html/upload.html'))
        } catch (err) {
            res.status(502).json(err); 
        }
    },
}

module.exports = redirectControllers;