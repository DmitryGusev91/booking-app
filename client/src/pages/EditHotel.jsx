import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import { useQuery } from "react-query";
import { useMutation } from "react-query";

function EditHotel() {
  const { hotelId } = useParams();
  const { data: hotel } = useQuery("getMyHotelById", () =>
    apiClient.getMyHotelById(hotelId)
  );
  const { mutate, isLoading } = useMutation(apiClient.updateMyHotel, {
    onSuccess: () => {
      console.log("Hotel updated");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSave = (hotelFormData) => {
    mutate(hotelFormData);
  };

  return (
    <>
      <ManageHotelForm
        hotel={hotel}
        isLoading={isLoading}
        onSave={handleSave}
      />
    </>
  );
}

export default EditHotel;
