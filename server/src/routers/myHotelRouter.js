const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary");
const hotelsBLL = require("../BLL/hotelsBLL");
const { verifyToken } = require("../middleware/authMiddleware");
const { body } = require("express-validator");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5mb
  },
});

router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per night is required and mnust be a Number"),
    body("description").notEmpty().withMessage("Description is required"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities are required"),
  ],
  upload.array("imageFiles", 6),
  async (req, res) => {
    try {
      const imageFiles = req.files;
      const newHotel = req.body;
      console.log("flagPre");
      const imageUrlsFunc = await uploadImages(imageFiles);
      newHotel.imageUrls = imageUrlsFunc;
      newHotel.lastUpdate = new Date();
      newHotel.userId = req.userId;
      console.log("flag1");
      hotelsBLL.addHotel(newHotel);
      console.log("flag2");
      res.status(201).send(newHotel);
    } catch (error) {
      console.log("Error creating Hotel: ", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.get("/", verifyToken, async (req, res) => {
  try {
    const hotels = await hotelsBLL.getAllHotels({ userId: req.userId });
    res.send(hotels);
  } catch (error) {
    console.log("Error creating Hotel: ", error);
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await hotelsBLL.getAllHotels({
      _id: id,
      userId: req.userId,
    });
    res.send(hotel[0]);
  } catch (error) {
    console.log("Error creating Hotel: ", error);
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

router.put(
  "/:id",
  verifyToken,
  upload.array("imageFiles"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updatedHotel = req.body;
      updatedHotel.lastUpdate = new Date();

      const files = req.files;
      const updatedImageUrls = await uploadImages(files);
      updatedHotel.imageUrls = [
        ...updatedImageUrls,
        ...(updatedHotel.imageUrls || []),
      ];

      const hotel = await hotelsBLL.updateHotel(updatedHotel, {
        _id: id,
        userId: req.userId,
      });

      if (!hotel) {
        return res.json(404).json({ message: "Hotel not found" });
      }
      res.status(201).json(hotel);
    } catch (error) {
      console.log("Error creating Hotel: ", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

async function uploadImages(imageFiles) {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString("base64");
    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    const response = await cloudinary.v2.uploader.upload(dataURI);
    return response.url;
  });
  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}

module.exports = router;
