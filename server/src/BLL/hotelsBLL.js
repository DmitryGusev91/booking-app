const Hotel = require("../models/hotelModel");

const addHotel = async (hotelInfo) => {
  const hotel = new Hotel(hotelInfo);
  await hotel.save();
  return "Hotel created";
};

const getAllHotels = async (
  obj = {},
  skip = 0,
  limit = 0,
  sort = { _id: 1 }
) => {
  return Hotel.find(obj).sort(sort).skip(skip).limit(limit);
};

const updateHotel = async (obj, ids) => {
  const hotel = await Hotel.findByIdAndUpdate(ids, obj, { new: true });
  return hotel;
};

const countDocumets = async (query) => {
  return await Hotel.countDocuments(query);
};

const getHotelById = (id) => {
  return Hotel.findById(id);
};

module.exports = { getHotelById,countDocumets, addHotel, getAllHotels, updateHotel };
