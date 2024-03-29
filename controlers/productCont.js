const productDesc = require('../models/product.model')
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary').v2;

const storage = multer.diskStorage({});
// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_API_NAME,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limiting file size to 5MB, adjust as needed
    fileFilter: (req, file, cb) => {
        // Check file type, you can customize this according to your requirements
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'));
        }
    },
}).single('image');

exports.createProduct = async (req, res) => {
    try {
        upload(req, res, async function (err) {
            if (err) {
                return res.status(400).json({ success: false, message: err.message });
            }
            console.log("Request Body:", req.body); // Log request body
            console.log("Uploaded File:", req.file); // Log uploaded file

            const { productName, Sizes, price, DiscountPrice, Tag, Description, Categorey, Keyword } = req.body;
            console.log(req.body)
  

            let productImg = ''; // Default value

            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path, { resource_type: "auto" });
                console.log("Cloudinary Upload Result:", result); // Log cloudinary upload result
                productImg = result.secure_url; // Retrieve the secure URL of the uploaded image
            }
            // Create a new product
            const newProduct = new productDesc({
                productImg: productImg,
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
            myCache.del('allProducts');
            res.status(200).json({
                success: true,
                data:newProduct,
                message: "Data Saved Successfully"
            });
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
      
       
        const allProducts = await productDesc.find();

        if (allProducts.length <= 0) {
            return res.status(402).json({
                success: false,
                message: "No Product Found!!",
            });
        }

      

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
exports.getProductByName = async (req, res) => {
    try {
        const prodName = req.params.prodName;
        console.log(prodName)
        if (!prodName) {
            return res.status(501).json({
                success: false,
                message: "Please Enter data FIRST !!"
            })
        }
        const ExistingProduct = await productDesc.findOne({ productName: prodName });
        if (!ExistingProduct) {
            return res.status(501).json({
                success: false,
                message: "Product Not Available !!"
            })
        }
        return res.status(200).json({
            success: true,
            data: ExistingProduct,
            message: "Data Fetched Succesfully"
        })
    }
    catch (error) {
        res.status(501).json({
            success: false,
            message: "Product Not Found !!"
        })
    }
}

exports.getProductByCategoreysName = async (req, res) => {
    try {
        const prodName = req.params.prodName;
        console.log(prodName)
        if (!prodName) {
            return res.status(501).json({
                success: false,
                message: "Please Enter data FIRST !!"
            })
        }
        const ExistingProduct = await productDesc.find({ Categorey: prodName });
        if (!ExistingProduct) {
            return res.status(501).json({
                success: false,
                message: "Product Not Available !!"
            })
        }
        return res.status(200).json({
            success: true,
            data: ExistingProduct,
            message: "Data Fetched Succesfully"
        })
    }
    catch (error) {
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

        // Check if there's an image file to upload
        if (req.file) {
            // Upload image to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, { resource_type: "auto" });
            console.log("Cloudinary Upload Result:", result); // Log cloudinary upload result
            existingProduct.productImg = result.secure_url; // Update product image URL
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

