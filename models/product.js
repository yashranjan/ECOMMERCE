const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    imageUrl : {
        type : String,
        required : true
    },
    userId : {
        type:Schema.Types.ObjectId,
        ref : 'User',
        required : true
    }
});

module.exports = mongoose.model('Product',productSchema);



// //Import mongoConnect function to connect to MongoDB
// // const getDb = require('../util/database').getDb;
// const ObjectId = require('mongodb').ObjectId;

// class Product{
//     constructor(title,price,description,imageUrl,id,userId){
//         this._id= id?new ObjectId(id):null;
//         this.title = title;
//         this.price = price;
//         this.description = description;
//         this.imageUrl = imageUrl;
//         const date = new Date();
//         this.date = date.toDateString();
//         this.time = date.toLocaleTimeString();
//         this.userId = userId;
//     };
//     save(){
//         const db = getDb();
//         let dbOp;
//         if(this._id){
//             dbOp = db.collection('products')
//             .updateOne({_id:this._id},{$set:this});
//         }else{
//             dbOp = db.collection('products').insertOne(this);
//         }
//         return dbOp.then((result) => {
//         }).catch((err) => {
//             console.log(err); 
//         });
//     };
//     static fetchAll(){
//         const db = getDb();
//         return db.collection('products')
//         .find()
//         .toArray()
//         .then((products)=>{
//                 return products;
//             }
//         )
//         .catch((err) => {
//             console.log(err);    
//         });
//     };
//     static findById(prodId){
//         const db = getDb();
//         return db.collection('products')
//         .findOne({_id : ObjectId(prodId)})
//         .then((product)=>{
//             return product;
//         })
//         .catch((err)=>{
//             console.log(err);
//         });
//     };
//     static deleteById(prodId){
//         const db = getDb();
//         return db.collection('products')
//         .deleteOne({_id:new ObjectId(prodId)})
//         .then((result)=>{
//             console.log('Deleted a product');
//         })
//         .catch(err=>{
//             console.log(err);
//         });
//     };
// }

// module.exports = Product;