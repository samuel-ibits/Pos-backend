import { IsAuthenticated } from "../../isAuthenticated.js";
import ProductService from "../service/product.js";
import { ValidateSignature, upload, UploadImage } from "../utils/index.js";
// import { PublishProductService } from "../utils/rabbitMqConnection.js";
export const product = (app, channel) => {
  const productService = new ProductService();

  // get products
  app.get("/products", async (req, res) => {
    try {
      const products = await productService.GetProducts();
      console.log(products);
      return res.status(200).json(products);
    } catch (err) {
      console.log(err.msg);
    }
  });
  // create a product
  app.post(
    "/product",
    IsAuthenticated,
    upload.array("images", 5),
    async (req, res) => {
      if (req.files) {
        console.log(req.files);
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
          // const {
          //   name,
          //   description,
          //   category,
          //   price,
          //   owner,
          //   quantity,
          //   discount,
          // } = req.body;

          console.log(req.body.images);
          console.log(req.body);
          const product = await productService.CreateProduct({
            ...req.body,
            imageUrl: req.body.images,
            owner: req.user._id,
          });
          // console.log(product, "products");
          return res.status(200).json({
            message: "product created successfully",
            product: product,
          });
        } catch (err) {
          console.log(err.msg);
        }
      }
    }
  );

  // get product
  app.get("/product/:productId", async (req, res) => {
    try {
      const productId = req.params.productId;
      const product = await productService.GetAProduct({ productId });
      console.log("Product, api product service");
      res.status(200).send(product);
    } catch (err) {
      res.status(404).send(err.message);
    }
  });
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
};
