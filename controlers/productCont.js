const productDesc = require('../models/product.model')
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary').v2;
const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 3600 });

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_API_NAME,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
 // Configure multer for image upload
 const storage = multer.memoryStorage();
 
 exports.createProduct = async (req, res) => {
    try {
        const { productName, Sizes, price, DiscountPrice, Tag, Description, Categorey, Keyword } = req.body;

        if (!Description || !price || !DiscountPrice || !productName || !Categorey) {
            return res.status(403).json({
                success: false,
                message: "Please Provide All Required Fields"
            });
        }

        let productImg = ''; // Default value

        // Check if there are files in the request
        if (req.files && req.files.length > 0) {
            // Upload images to Cloudinary
            const uploadPromises = req.files.map(async (file) => {
                const result = await cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (error, result) => {
                    if (error) {
                        console.log(error);
                    } else {
                        productImg = result.secure_url; // Update productImg if an image is uploaded
                    }
                }).end(file.buffer);

                return result;
            });

            // Wait for all uploads to complete before responding
            await Promise.all(uploadPromises);
        } else {
            // Use the default image URL when no images are uploaded
            productImg = 'https://i.ibb.co/0D0bJBL/image.png';
        }

        // Create a new product
        const newProduct = new productDesc({
            productImg,
            Sizes,
            price,
            DiscountPrice,
            Tag,
            Description,
            productName,
            Categorey,
            Keyword
        });

        // Save the new product
        await newProduct.save();

        res.status(200).json({
            success: true,
            message: "Data Saved Successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
exports.getProduct = async (req, res) => {
    try {
        const cachedProducts = myCache.get('allProducts');

        if (cachedProducts) {
            // If data is found in the cache, return it
            return res.status(200).json({
                success: true,
                data: cachedProducts,
                message: "Data Fetched Successfully from Cache",
            });
        }

        // If data is not found in the cache, fetch it from the database
        const allProducts = await productDesc.find();

        if (allProducts.length <= 0) {
            return res.status(402).json({
                success: false,
                message: "No Product Found!!",
            });
        }

        // Store the fetched data in the cache with a TTL of 1 hour
        myCache.set('allProducts', allProducts, 3600);

        res.status(200).json({
            success: true,
            data: allProducts,
            message: "Data Fetched Successfully",
        });
    } catch (error) {
        res.status(501).json({
            success: false,
            message: "Internal Server Error !!",
        });
    }
};
exports.getProductByName = async (req,res) =>{
    try{
        const prodName =  req.params.prodName;
        console.log(prodName)
        if(!prodName){
            return res.status(501).json({
                success: false,
                message: "Please Enter data FIRST !!"
            })
        }
        const ExistingProduct = await productDesc.findOne({productName:prodName});
        if(!ExistingProduct){
            return res.status(501).json({
                success: false,
                message: "Product Not Available !!"
            })
        }
        return res.status(200).json({
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

exports.getProductByCategoreysName = async (req,res) =>{
    try{
        const prodName =  req.params.prodName;
        console.log(prodName)
        if(!prodName){
            return res.status(501).json({
                success: false,
                message: "Please Enter data FIRST !!"
            })
        }
        const ExistingProduct = await productDesc.find({Categorey:prodName});
        if(!ExistingProduct){
            return res.status(501).json({
                success: false,
                message: "Product Not Available !!"
            })
        }
        return res.status(200).json({
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

exports.getAllCategoreyNameAndLength = async (req, res) => {
    try {
        const categoryCounts = await productDesc.aggregate([
            {
                $group: {
                    _id: '$Categorey',
                    count: { $sum: 1 },
                    image: { $first: '$productImg' }, // Assuming 'image' is the field for image in your schema
                },
            },
        ]);

        const result = categoryCounts.map((category) => ({
            categoryName: category._id,
            productCount: category.count,
            image: category.image,
        }));

        res.status(200).json({
            success: true,
            data: result,
            message: "Category names, product counts, and images retrieved successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

exports.deleteProductById = async (req, res) => {
    try {
        const productId = req.params.id;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }

        const deletedProduct = await productDesc.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            data: deletedProduct,
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

exports.updateProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const updates = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }

        // Find the existing product
        const existingProduct = await productDesc.findById(productId);

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // Update only the specified fields
        Object.keys(updates).forEach((key) => {
            existingProduct[key] = updates[key];
        });

        // Save the updated product
        const updatedProduct = await existingProduct.save();

        res.status(200).json({
            success: true,
            data: updatedProduct,
            message: "Product updated successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};