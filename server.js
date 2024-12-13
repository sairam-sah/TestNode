const express = require('express')
const mongoose = require('mongoose')
const Product = require('./models/productModel')
require('dotenv').config();

const app  = express()

// middleware
app.use(express.json())
app.use(express.urlencoded({extended : false}))

//routes

app.get('/',(req,res) => {
    res.send('Hello NODE API')
})

app.get('/blog', (req,res)=> {
    res.send('Hello Blog, My name is Sai') 
})

app.get('/products', async(req,res) => {
    try {
      const products = await Product.find();
      res.status(200).json(products)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

app.get('/products/:id', async(req,res) => {
    try {
        const {id} = req.params;
      const product = await Product.findById(id);
      res.status(200).json(product)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})



app.post('/product',async(req,res) => {
   try {
    const product = await Product.create(req.body)
    res.status(200).json(product);

   } catch(error) {
    console.log(error.message);
    res.status(500).json({message: error.message})

   }
} )

app.post('/products', async (req, res) => {
    try {
        // Check if the request body contains an array
        if (!Array.isArray(req.body)) {
            return res.status(400).json({ message: "Request body must be an array of products" });
        }

        // Create multiple products using `Product.insertMany`
        const products = await Product.insertMany(req.body);

        res.status(200).json(products); // Respond with the created products
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message }); // Handle server errors
    }
});


// Update a product
app.put('/products/:id', async(req,res) => {
  try{
     const{id} = req.params;
     const product = await Product.findByIdAndUpdate(id, req.body);
     // we cannot find any product in database
     if(!product){
        return res.status(404).json({message : 'cannot find any product with ID ${id}'})
      }
      const updateProduct = await  Product.findById(id);
      res.status(200).json(updateProduct);
  }catch(error) {
     res.status(500).json({ message: error.message }); 
     
  }
})

// Delete a product
app.delete('/products/:id', async(req, res) => {
    try {
        const{id} = req.params;
        const product = await Product.findByIdAndDelete(id);
        if(!product){
            return res.status(404).json({message : 'cannot find any product with ID ${id}'})
        } 
        res.status(200).json(product);
       } catch (error) {
        res.status(500).json({message: error.message});
    }
})

// Database Connection
mongoose.
connect(process.env.MONGO_URI)
.then(()=> {
    console.log('connected to Mongodb')
    app.listen(4000, ()=> {
        console.log('Node API app on port 4000')
    });
    }).catch((error)=> {
    console.log(error)
})