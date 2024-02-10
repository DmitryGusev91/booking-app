import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";


function SignOutButton() {
  const queryClient = useQueryClient();
  const mutation = useMutation(apiClient.signOut, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("validateToken");
      console.log("successfuly loged out");
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  const handleClick = () => {
    mutation.mutate();
  };
  return (
    <>
      <button
        className="text-blue-600 px-3 font-bold bg-white hover:bg-gray-100"
        onClick={handleClick}
      >
        Sign Out
      </button>
    </>
  );
}

export default SignOutButton;
