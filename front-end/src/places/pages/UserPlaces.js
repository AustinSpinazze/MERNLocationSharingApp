import React, { useEffect, useState, Fragment } from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const UserPlaces = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [loadedPlaces, setLoadedPlaces] = useState([]);

  // react params are aware of any part of your route paths that start with : like :userId for example
  // basically gives us access to userId encoded in the url
  const userId = useParams().userId;

  useEffect(() => {
    const getPlacesByUserId = async () => {
      try {
        const response = await sendRequest(
          `/${userId}`,
          "get",
          "http://localhost:5000/api/user"
        );

        setLoadedPlaces(response.data.places);
      } catch (error) {
        console.log(error);
      }
    }

    getPlacesByUserId();
  }, [sendRequest, userId])

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (<div className="center">
        <LoadingSpinner asOverlay />
      </div>)}
      {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} />}
    </Fragment>
  );
};

export default UserPlaces;
