import * as apiClient from "../api-client";
import { useQuery } from "react-query";
import BookingForm from "../forms/BookingForm/BookingForm";
import { useEffect, useState } from "react";
import BookingDetailSummary from "../components/BookingDetailSummary";
import { useSearchContext } from "../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { useAppContext } from "../contexts/AppContext";

function Booking() {
  const { stripePromise } = useAppContext();
  const search = useSearchContext();
  const { hotelId } = useParams();

  const { data: currentUser } = useQuery(
    "getCurrentUser",
    apiClient.getCurrentUser
  );

  const { data: hotel } = useQuery(
    "getHotelByID",
    () => apiClient.getHotelById(hotelId),
    {
      enabled: !!hotelId,
    }
  );

  const [numberOfNights, setNumberOfNights] = useState(0);

  useEffect(() => {
    if (search.checkIn && search.checkOut) {
      const nights =
        Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
        (1000 * 60 * 60 * 24);
      setNumberOfNights(Math.ceil(nights));
    }
  }, [search.checkIn, search.checkOut]);

  const { data: paymentIntentData } = useQuery(
    "createPaymentIntent",
    () => apiClient.createPaymentIntent(hotelId, numberOfNights.toString()),
    {
      enabled: !!hotelId && numberOfNights > 0,
    }
  );

  if (!hotel) {
    return <></>;
  }

  return (
    <>
      <div className="grid md:grid-cols-[1fr_2fr]">
        <BookingDetailSummary
          checkIn={search.checkIn}
          checkOut={search.checkOut}
          adultCount={search.adultCount}
          childCount={search.childCount}
          numberOfNights={numberOfNights}
          hotel={hotel}
        />
        {currentUser && paymentIntentData && (
          <Elements
            key={paymentIntentData.clientSecret}
            stripe={stripePromise}
            options={{
              clientSecret: paymentIntentData.clientSecret,
            }}
          >
            <BookingForm
              paymentIntent={paymentIntentData}
              currentUser={currentUser}
            />
          </Elements>
        )}
      </div>
    </>
  );
}

export default Booking;
