import ProductRepository from "../dba/repository/productRepository.js";
import { FormatData } from "../utils/index.js";

import {
  APIError,
  BadRequestError,
  STATUS_CODES,
  ValidationError,
} from "../utils/app-errors.js";
import ShopListRepository from "../dba/repository/shopListRepository.js";

export default class ProductService {
  constructor() {
    this.shopListRepository = new ShopListRepository();
    this.productRepository = new ProductRepository();
  }

  // get all shop lists
  async GetShopLists() {
    try {
      const shopLists = await this.shopListRepository.GetAllShopLists();
      return shopLists;
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Product Not Created",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  // get shop list
  async GetAShopList({ businessId }) {
    try {
      const shopList = await this.shopListRepository.GetShopList({
        businessId,
      });
      return shopList;
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Product Not Created",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  // creating shoplist
  async CreateMyShopList({ businessId, quantity, owner, productId }) {
    try {
      const shopList = await this.shopListRepository.GetShopList(businessId);
      const product = await this.productRepository.GetProduct({
        productId,
      });
      if (!product) {
        // return null;
        throw new APIError("Product not found");
      }
      const price = product.price;
      const name = product.name;
      const imageUrl = product.imageUrl;
      // check if user already have a cart
      if (shopList) {
        const productIndex = cart.items.findIndex(
          (item) => item.productId === productId
        );
        // check if product exist
        if (productIndex > -1) {
          let cartProduct = cart.items[productIndex];
          cartProduct.quantity += quantity;
          cart.bill = cart.items.reduce((acc, curr) => {
            return acc + curr.quantity * curr.price;
          }, 0);
          cart.items[productIndex] = cartProduct;
          const updateCart = await cart.save();
          return updateCart;
        } else {
          cart.items.push({ productId, name, quantity, price, imageUrl });
          cart.bill = cart.items.reduce((acc, curr) => {
            return acc + curr.quantity * curr.price;
          }, 0);
          let updatedCart = await cart.save();
          return updatedCart;
        }
      } else {
        const newCart = await this.productRepository.CreateCart({
          owner,
          items: [{ productId, name, quantity, price, imageUrl }],
          bill: quantity * price,
        });
        return newCart;
      }
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Data Not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  async CreateShopList({
    business,
    products: [{ productId, name, quantity, price, imageUrl }],
    bill,
  }) {
    console.log("creating shop list");
    try {
      const createShopList = await this.shopListRepository.CreateShopList({
        business,
        products: [{ productId, name, quantity, price, imageUrl }],
        bill,
      });
      return createShopList;
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Product Not Created",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  async UpdateShopList({
    business,
    businessId,
    products: [{ productId, name, quantity, price, imageUrl }],
    bill,
  }) {
    try {
      console.log("updating shop list");
      const existingShopList = await this.shopListRepository.GetShopList({
        businessId,
      });
      console.log(existingProduct, "existing product");
      if (existingProduct) {
        const updateNew = {
          name: name
            ? (existingProduct.name = name)
            : (existingProduct.name = existingProduct.name),
          costPrice: costPrice
            ? (existingProduct.costPrice = Number(costPrice))
            : (existingProduct.costPrice = existingProduct.costPrice),
          sellingPrice: sellingPrice
            ? (existingProduct.sellingPrice = Number(sellingPrice))
            : (existingProduct.sellingPrice = existingProduct.sellingPrice),
          coinValue: coinValue
            ? (existingProduct.coinValue = Number(coinValue))
            : (existingProduct.coinValue = existingProduct.coinValue),
          description: description
            ? (existingProduct.description = description)
            : (existingProduct.description = existingProduct.description),
          imageUrl: imageUrl
            ? (existingProduct.imageUrl = imageUrl)
            : (existingProduct.imageUrl = existingProduct.imageUrl),
          category: category
            ? (existingProduct.category = category)
            : (existingProduct.category = existingProduct.category),
          productLocation: productLocation
            ? (existingProduct.productLocation = productLocation)
            : (existingProduct.category = existingProduct.category),
          quantity: quantity
            ? (existingProduct.quantity = Number(quantity))
            : (existingProduct.quantity = existingProduct.quantity),
        };
        const updateProduct = await this.productRepository.editProduct({
          productId: productId,
          ...updateNew,
        });
        console.log(updateProduct, "update product from service");
        return updateProduct;
      } else {
        throw new BadRequestError("product not found");
      }
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Updating a product failed",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  async EditProduct({ product, productId }) {
    const productUpdates = Object.keys(product);
    const allowProductUpdate = [
      "name",
      "description",
      "category",
      "costPrice",
      "sellingPrice",
      "imageUrl",
      "quantity",
    ];
    // checking if it's valid operation
    const isProductValid = productUpdates.every((productUpdate) =>
      allowProductUpdate.includes(productUpdate)
    );
    if (!isProductValid) {
      throw new BadRequestError("invalid product update");
    }
    try {
      const existingProduct = await this.productRepository.GetProduct(
        productId
      );
      if (!existingProduct) {
        throw new BadRequestError("product not found");
      }
      productUpdates.forEach(
        (itemName) => (itemName[productUpdates] = product[itemName])
      );
      await existingProduct.save();
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Updating a product failed",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  async DeleteProduct(productId) {
    try {
      const deleteProduct = await this.productRepository.DeleteProduct(
        productId
      );
      return deleteProduct;
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Product Not Created",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }
  async BuyProduct(ids) {
    const { productIds } = ids;
    try {
    } catch (err) {
      throw new APIError(
        err.message ? err.message : "product not added",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  // Get All Products in a Store
  async GetEveryProductsofaStore(id) {
    try {
      const products = await this.productRepository.GetProductsOfAStore(id);

      return FormatData({
        products,
      });
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Data Not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  async GetCart(cartowner) {
    try {
      const cart = await this.productRepository.GetCart(cartowner);
      if (cart && cart.items.length > 0) {
        return cart;
      } else {
        console.log("cart empty");
        throw new APIError("cart empty");
      }
    } catch (err) {
      throw new APIError(
        err.message ? err.message : "cart get error",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
      // console.log(err);
    }
  }

  // creating a cart

  // creating a cart
  async CreateCart({ productId, quantity, owner }) {
    try {
      const cart = await this.productRepository.GetCart(owner);
      const product = await this.productRepository.GetProduct({
        productId,
      });
      if (!product) {
        // return null;
        throw new APIError("Product not found");
      }
      const price = product.price;
      const name = product.name;
      const imageUrl = product.imageUrl;
      // check if user already have a cart
      if (cart) {
        const productIndex = cart.items.findIndex(
          (item) => item.productId === productId
        );
        // check if product exist
        if (productIndex > -1) {
          let cartProduct = cart.items[productIndex];
          cartProduct.quantity += quantity;
          cart.bill = cart.items.reduce((acc, curr) => {
            return acc + curr.quantity * curr.price;
          }, 0);
          cart.items[productIndex] = cartProduct;
          const updateCart = await cart.save();
          return updateCart;
        } else {
          cart.items.push({ productId, name, quantity, price, imageUrl });
          cart.bill = cart.items.reduce((acc, curr) => {
            return acc + curr.quantity * curr.price;
          }, 0);
          let updatedCart = await cart.save();
          return updatedCart;
        }
      } else {
        const newCart = await this.productRepository.CreateCart({
          owner,
          items: [{ productId, name, quantity, price, imageUrl }],
          bill: quantity * price,
        });
        return newCart;
      }
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Data Not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  async DeleteCart({ cartId }) {
    try {
      const deleteCart = await this.productRepository.DeleteCart(cartId);
      return deleteCart;
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Data Not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }
}
