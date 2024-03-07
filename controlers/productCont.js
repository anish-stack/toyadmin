const productDesc = require('../models/product.model')


exports.createProduct = async (req, res) => {
    try {
        const { productImg, Sizes, BoldDesc, para , productName } = req.body;
        if (!productImg || !Sizes || !BoldDesc || !para || !productName) {
            return res.status(403).json({
                success: false,
                message: "Please Provide All Fields"
            })
        }
        const newProduct = new productDesc({
            productImg,
            Sizes,
            BoldDesc,
            para,
            productName
        })
        await newProduct.save()
        res.status(200).json({
            success: true,
            data:newProduct,
            message: "Data Saved Succesfully"
        })

    }
    catch (error) {
        console.log(error);
    }
}


exports.getProduct = async (req,res) =>{
    try {
        const AllProducts = await productDesc.find();
        if (AllProducts.length <= 0) {
            return res.status(402).json({
                success: false,
                message: "No Product Found!!"
            })
        }
        res.status(200).json({
            success: true,
            data:AllProducts,
            message: "Data Fetched Succesfully"
        })
    } catch (error) {
        res.status(501).json({
            success: false,
            message: "Internal Server Error !!"
        })
    }
}



exports.getProductByName = async (req,res) =>{
    try{
        const prodName =  req.params.prodName;
        console.log(prodName)
        if(!prodName){
            res.status(501).json({
                success: false,
                message: "Please Enter data FIRST !!"
            })
        }
        const ExistingProduct = await productDesc.findOne({productName:prodName});
        if(!ExistingProduct){
            res.status(501).json({
                success: false,
                message: "Product Not Available !!"
            })
        }
        res.status(200).json({
            success: true,
            data:ExistingProduct,
            message: "Data Fetched Succesfully"
        })
    }
    catch(error){
        res.status(501).json({
            success: false,
            message: "Product Not Found !!"
        })
    }
}