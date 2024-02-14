import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const register = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/register`,
      formData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else if (error.request) {
      throw new Error("No response received from the server");
    } else {
      throw new Error("Error setting up the request");
    }
  }
};

export const signIn = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, formData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else if (error.request) {
      throw new Error("No response received from the server");
    } else {
      throw new Error("Error setting up the request");
    }
  }
};

export const getCurrentUser = async () => {
  const response = await axios.get(`${API_BASE_URL}/users/me`, {
    withCredentials: true,
  });
  if (!response.data) {
    throw new Error("Error fetching user");
  }

  return response.data;
};

export const validateToken = async () => {
  const response = await axios.get(`${API_BASE_URL}/auth/validate-token`, {
    withCredentials: true,
  });

  if (!response.data) {
    throw new Error("Token invalid");
  }
  console.log("validation succeseded");
  return response.data;
};

export const signOut = async () => {
  const response = await axios.post(
    `${API_BASE_URL}/auth/logout`,
    {},
    {
      withCredentials: true,
    }
  );
  if (response.data) {
    throw new Error("Error during sign out");
  }
};

export const addMyHotel = async (hotelFormData) => {
  const response = await axios.post(
    `${API_BASE_URL}/my-hotels`,
    hotelFormData,
    {
      withCredentials: true,
    }
  );
  if (!response.data) {
    throw new Error("Failed to add hotel");
  }

  return response.data;
};

export const getMyHotels = async () => {
  const response = await axios.get(`${API_BASE_URL}/my-hotels`, {
    withCredentials: true,
  });
  if (!response.data) {
    throw new Error("Error fetching hotels");
  }

  return response.data;
};

export const getMyHotelById = async (hotelId) => {
  const response = await axios.get(`${API_BASE_URL}/my-hotels/${hotelId}`, {
    withCredentials: true,
  });
  if (!response.data) {
    throw new Error("Error fetching hotels");
  }

  return response.data;
};

export const updateMyHotel = async (hotelFormData) => {
  const response = await axios.put(
    `${API_BASE_URL}/my-hotels/${hotelFormData.get("hotelId")}`,
    hotelFormData,
    {
      withCredentials: true,
    }
  );
  if (!response.data) {
    throw new Error("Failed to update hotel");
  }

  return response.data;
};

export const searchHotels = async (searchParams) => {
  const queryParams = new URLSearchParams();
  queryParams.append("destination", searchParams.destination || "");
  queryParams.append("checkIn", searchParams.checkIn || "");
  queryParams.append("checkOut", searchParams.checkOut || "");
  queryParams.append("adultCount", searchParams.adultCount || "");
  queryParams.append("childCount", searchParams.childCount || "");
  queryParams.append("page", searchParams.page || "");

  queryParams.append("maxPrice", searchParams.maxPrice || "");
  queryParams.append("sortOptions", searchParams.sortOptions || "");

  searchParams.facilities?.forEach((facility) =>
    queryParams.append("facilities", facility)
  );
  searchParams.types?.forEach((type) => queryParams.append("types", type));
  searchParams.stars?.forEach((star) => queryParams.append("stars", star));

  const response = await axios.get(
    `${API_BASE_URL}/hotels/search?${queryParams}`
  );
  if (!response.data) {
    throw new Error("Error fetching hotel");
  }
  return response.data;
};

export const getHotels = async () => {
  const response = await axios.get(`${API_BASE_URL}/hotels`);
  if (!response.data) {
    throw new Error("Error fetching hotels");
  }

  return response.data;
};

export const getHotelById = async (hotelId) => {
  const response = await axios.get(`${API_BASE_URL}/hotels/${hotelId}`);
  if (!response.data) {
    throw new Error("Error fetching hotels");
  }

  return response.data;
};

export const createPaymentIntent = async (hotelId, numberOfNights) => {
  const response = await axios.post(
    `${API_BASE_URL}/hotels/${hotelId}/bookings/payment-intent`,
    { numberOfNights },
    {
      withCredentials: true,
    }
  );
  if (!response.data) {
    throw new Error("Error fetching payment intent");
  }

  return response.data;
};

export const createRoomBooking = async (formData) => {
  const response = await axios.post(
    `${API_BASE_URL}/hotels/${formData.hotelId}/bookings`,
    formData,
    {
      withCredentials: true,
    }
  );

  if (!response) {
    throw new Error("Error booking room");
  }
};

export const getMyBookings = async () => {
  const response = await axios.get(`${API_BASE_URL}/my-bookings/`, {
    withCredentials: true,
  });

  if (!response.data) {
    throw new Error("Unable to fetch bookings");
  }

  return response.data;
};
