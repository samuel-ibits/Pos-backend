import { IsAuthenticated } from "../../isAuthenticated.js";
import ProductService from "../service/product.js";
import {
  ValidateSignature,
  upload,
  UploadImage,
  uploadTwo,
} from "../utils/index.js";
import { consumeMessage } from "../utils/messaging-que.js";
import { PublishProductService } from "../utils/rabbitMqConnection.js";
export const product = (app, channel) => {
  const productService = new ProductService();

  // get products
  app.get("/products", async (req, res) => {
    try {
      const products = await productService.GetProducts();
      return res.status(200).json(products);
    } catch (err) {
      console.log(err);
    }
  });

  // create a product
  app.post("/product", IsAuthenticated, async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.json({ msg: "File Missing " });
      } else if (req.files === undefined) {
        return res.status(500).json({ msg: "File Missing..." });
      } else {
        if (req.files) {
          const reqfiles = [];
          for (let i = 0; i < req.files.length; i++) {
            var localFilePath = req.files[i].path;
            var result = await UploadImage(localFilePath);
            reqfiles.push(result.url);
          }
          req.body.imageUrl = reqfiles;
          try {
            const product = await productService.CreateProduct({
              ...req.body,
              owner: req.user._id,
            });
            return res.status(200).json({
              message: "product created successfully",
              product: product,
            });
          } catch (err) {
            console.log(err);
            return res.status(500).json({ msg: "error creating product" });
          }
        }
      }
    });
  });

  // GetEveryEmployeesofaStore
  app.get("/products/:id", async (req, res, next) => {
    try {
      const id = req.params.id;
      const { data } = await productService.GetEveryProductsofaStore(id);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  // get product
  app.get("/product/:id", async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await productService.GetAProduct({ productId });
      res.status(200).send(product);
    } catch (err) {
      res.status(404).send(err.message);
    }
  });

  // delete product
  app.delete("/delete-product/:id", async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await productService.DeleteProduct(productId);
      res
        .status(200)
        .send({ msg: "product deleted successful", product: product });
    } catch (err) {
      res.status(404).send(err.message);
    }
  });

  // consume message to update product quantity
  const consumeOrder = async () => {
    await consumeMessage(
      channel,
      "order-updates",
      "product-updates",
      async (content) => {
        const completedOrder = JSON.parse(content);
        let products = completedOrder.products;
        for (let product of products) {
          const productId = product.productId;
          const getProduct = await productService.GetAProduct({ productId });
          // console.log(getProduct);
          const newQuantity =
            Number(getProduct.quantity) - Number(product.quantity);
          const updateProduct = await productService.UpdateProduct({
            productId,
            quantity: newQuantity,
          });
          console.log(updateProduct, "updated product quantity");
        }
        console.log(products, "completed order update");
        // console.log(`Received product update: ${completedOrder.products}`);
      }
    );
  };

  consumeOrder();
  app.patch(
    "/edit-product/:id",
    IsAuthenticated,
    uploadTwo.array("images", 5),
    async (req, res) => {
      const productId = await req.params.id;
      if (req.files) {
        const reqfiles = [];
        for (let i = 0; i < req.files.length; i++) {
          var localFilePath = req.files[i].path;
          console.log(localFilePath, "from file path");
          var result = await UploadImage(localFilePath);
          reqfiles.push(result.url);
        }
        req.body.images = reqfiles;
        console.log(reqfiles);
        try {
          console.log(productId, "from product id");
          const { name, discount, description, category, price, quantity } =
            req.body;
          const imageUrl = req.body.images;
          const product = {
            name,
            discount,
            description,
            category,
            price,
            quantity,
          };
          const editProduct = await productService.UpdateProduct({
            productId,
            ...req.body,
            imageUrl: req.body.images,
          });
          // console.log(product, "products");
          return res.status(200).json({
            message: "product edited successfully",
            product: editProduct,
          });
        } catch (err) {
          console.log(err.msg);
        }
      } else {
        const editProduct = await productService.UpdateProduct({
          productId,
          ...req.body,
        });
        console.log(editProduct);
        return res.status(200).json({
          message: "product edited successfully",
          product: editProduct,
        });
      }
    }
  );

  // edit product
  app.patch("/product/:id", IsAuthenticated, async (req, res) => {
    try {
      const { product } = req.body;
      const { productId } = req.params.id;
      // the editProduct requires two arguements: productId and product
      const requiredEditParameters = { product, productId };
      const { editedProduct } = await productService.EditProduct(
        requiredEditParameters
      );
      console.log(editedProduct);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });

  // get cart
  app.get("/cart", IsAuthenticated, async (req, res) => {
    const cartowner = req.user._id;
    // const cartowner = req.params.cartowner;
    console.log(cartowner, "the ownner");
    try {
      const cart = await productService.GetCart(cartowner);
      res.status(200).send(cart);
    } catch (err) {
      console.log(err);
    }
  });

  // create cart
  app.post("/cart", IsAuthenticated, async (req, res) => {
    const owner = req.user._id;
    const { quantity, productId } = req.body;
    // const requiredCartParameters = { owner, productId, quantity };
    try {
      const cart = await productService.CreateCart({
        owner,
        productId,
        quantity,
      });
      console.log(cart, "cart created successfully");
      return res.status(200).send(cart);
    } catch (err) {
      console.log(err);
    }
  });

  app.post("/checkout", IsAuthenticated, async (req, res) => {
    const owner = req.user._id;
    // const { quantity, productId } = req.body;
    const cart = await productService.GetCart(owner);
    // const requiredCartParameters = { owner, productId, quantity };
    try {
      console.log(cart, "from cart");
      return res.status(200).send(cart);
    } catch (err) {
      console.log(err);
    }
  });
};
