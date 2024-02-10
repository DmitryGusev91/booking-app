import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import { AiFillStar } from "react-icons/ai";

import { useMutation, useQuery } from "react-query";
import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";

function Detail() {
  const { hotelId } = useParams();
  const { data: hotel } = useQuery(
    "getHotelById",
    () => apiClient.getHotelById(hotelId),
    { enabled: !!hotelId }
  );

  //In order for the page not to crash while reacts first render didnt load the hotel (takes time)
  if (!hotel) {
    return <></>;
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <span className="flex">
            {Array.from({ length: hotel.starRating }).map(() => {
              return <AiFillStar className="fill-yellow-400" />;
            })}
          </span>
          <h1 className="text-3xl font-bold">{hotel.name}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {hotel.imageUrls.map((image) => (
            <div className="h-[300px]">
              <img
                src={image}
                alt={hotel.name}
                className="rounded-md w-full h-full object-cover object-center"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
          {hotel.facilities.map((facilitie) => (
            <div className="border border-slate-300 rounded-sm p-3">
              {facilitie}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
          <div className="whitespace-pre-line">{hotel.description}</div>
          <div className="h-fit">
            <GuestInfoForm
              pricePerNight={hotel.pricePerNight}
              hotelId={hotel._id}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Detail;
