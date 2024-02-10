import { useMutation } from "react-query";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import * as apiClient from "../api-client";

function AddHotel() {
  const { mutate, isLoading  } = useMutation(apiClient.addMyHotel, {
    onSuccess: () => {
      console.log("Hotel saved");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSave = (hotelFormData) => {
    mutate(hotelFormData);
  };

  return <ManageHotelForm onSave={handleSave} isLoading={isLoading} />;
}

export default AddHotel;
