import crypto from "crypto";
import {
  APIError,
  STATUS_CODES,
  BadRequestError,
} from "../../utils/app-errors.js";
import { cartModel } from "../models/cart.js";
import { productModel } from "../models/product.js";
import BusinessModel from "../models/user.js";
import { log } from "console";
import { shopListModel } from "../models/shopingList.js";
// Database operations

class ShopListRepository {
  // get all shop lists
  async GetAllShopLists() {
    try {
      // const allShopLists = await shopListModel
      //   .find()
      //   .populate("owner", "businessName");
      const allShopLists = await shopListModel.find();
      return allShopLists;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to get all products ${err.message}`
      );
    }
  }
  // get shop list
  async GetShopList(businessId) {
    try {
      const shopList = await shopListModel.findOne({ business: businessId });
      console.log("shop list found", shopList);
      return shopList;
    } catch (err) {
      throw new APIError("API Error", STATUS_CODES.INTERNAL_ERROR, err.message);
    }
  }

  // update shopList
  async UpdateShopList({
    shopListId,
    products: [
      { productId, name, quantity, price, imageUrl, sellingPrice, costPrice },
    ],
    bill,
  }) {
    try {
      const filterProduct = { _id: shopListId };
      const UpdateShopList = {
        products: [{ productId, name, quantity, price, imageUrl }],
        bill,
      };
      const updatedShopList = shopListModel.findByIdAndUpdate(
        filterProduct,
        UpdateShopList,
        { new: true }
      );
      return updatedShopList;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `can't update product ${err.message}`
      );
    }
  }

  // create shoplist
  async CreateShopList({
    business,
    products: [{ productId, name, quantity, price, imageUrl }],
    bill,
  }) {
    try {
      const newShopList = new shopListModel({
        business,
        products: [{ productId, name, price, quantity, imageUrl }],
        bill,
      });
      const newShopItems = await newShopList.save();
      return newShopItems;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to Create User ${err.message}`
      );
    }
  }
  // delete an item
  async DeleteProduct(productId) {
    try {
      const filterProduct = { _id: productId };
      const deleteProduct = await productModel.deleteOne(filterProduct);
      return deleteProduct;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to Delete Product ${err.message}`
      );
    }
  }

  // delete a shopList
  async DeleteShopList(shopListId) {
    try {
      const filtered = { _id: shopListId };
      const deleteShopList = await shopListModel.deleteOne(filtered);
      return deleteShopList;
    } catch (err) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to Delete Product ${err.message}`
      );
    }
  }
}

export default ShopListRepository;
