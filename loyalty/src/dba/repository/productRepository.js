import crypto from "crypto";
import {
  APIError,
  STATUS_CODES,
  BadRequestError,
} from "../../utils/app-errors.js";
import { cartModel } from "../models/cart.js";
import { productModel } from "../models/product.js";
// Database operations

class ProductRepository {
  async CreateProduct({
    name,
    description,
    category,
    costPrice,
    sellingPrice,
    owner,
    imageUrl,
    quantity,
  }) {
    try {
      const newProduct = new productModel({
        name,
        description,
        category,
        sellingPrice,
        costPrice,
        owner,
        imageUrl,
        quantity,
      });
      console.log(newProduct, "new product");
      const saveProduct = await newProduct.save();
      console.log(saveProduct, "showing saved product");
      return saveProduct;
    } catch (err) {
      throw new APIError(
        "API ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to create Product ${err.message}`
      );
    }
  }
  // get a product
  async GetProduct({ productId }) {
    try {
      const product = await productModel.findById({ _id: productId });
      console.log(product, "from product model");
      return product;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to get product ${err.message}`
      );
    }
  }

  // get all products
  async GetAllProducts() {
    try {
      const allProducts = await productModel.find({});
      return allProducts;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to get all products ${err.message}`
      );
    }
  }

  // edit/ update product
  async UpdateProduct({ productId }) {
    try {
      const product = await productModel.findOne({ _id: productId });
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Data Not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }
  // previous update product
  async editProduct({
    name,
    description,
    category,
    price,
    imageUrl,
    quantity,
  }) {
    try {
      const filterProduct = { _id: id };
      const updateProduct = {
        name,
        description,
        category,
        price,
        imageUrl,
        quantity,
      };
      const updatedProduct = productModel.findByIdAndUpdate(
        filterProduct,
        updateProduct,
        { new: true }
      );
      return updatedProduct;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `can't update product ${err.message}`
      );
    }
  }
  // get cart
  async GetCart(cartowner) {
    try {
      const cart = await cartModel.findOne({ owner: cartowner });
      console.log("cart model found", cart);
      return cart;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  // create a new cart
  async CreateCArtSErvice({ productId, quantity }) {
    try {
      const cart = await cartModel.findOne({ owner });
      const product = await productModel.findOne({ _id: productId });
      if (!product) {
        console.log("product not found");
        return;
      }
      const productPrice = product.price;
      const productName = product.name;
      // check if user already has a cart
      if (cart) {
        const productIndex = cart.products.findIndex(
          (product) => product.productId === productId
        );
        // check if product already exists
        if (productIndex > -1) {
          let cartItems = cart.products[productIndex];
          cartItems.quantity += quantity;
          cart.bill = cart.products.reduce((acc, current) => {
            return acc + current.quantity * current.price;
          }, 0);
        }
      }
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  // create cart
  async CreateCart({
    owner,
    items: [{ productId, name, quantity, price, imageUrl }],
    bill,
  }) {
    try {
      const newCart = new cartModel({
        owner,
        items: [{ productId, name, price, quantity, imageUrl }],
        bill,
      });
      const newCartItems = await newCart.save();
      return newCartItems;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to Create User ${err.message}`
      );
    }
  }
  // delete an item
  async DeleteProduct() {}
}

export default ProductRepository;
