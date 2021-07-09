import React, { useEffect, useState, Fragment } from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const UserPlaces = () => {
  const { isLoading, sendRequest } = useHttpClient();

  const [loadedPlaces, setLoadedPlaces] = useState([]);

  const [error, setError] = useState(false);

  // react params are aware of any part of your route paths that start with : like :userId for example
  // basically gives us access to userId encoded in the url
  const userId = useParams().userId;

  const deletePlaceHandler = (deletedPlaceId) => {
    setLoadedPlaces(prevPlaces =>
      prevPlaces.filter(place => place.placeId !== deletedPlaceId));
  };

  useEffect(() => {
    const getPlacesByUserId = async () => {
      try {
        const response = await sendRequest(
          `/${userId}`,
          "get",
          "http://localhost:5000/api/user"
        );
        setError(false);
        setLoadedPlaces(response.data.places);
      } catch (error) {
        console.log("hey");
        setError(true);
      }
    }

    getPlacesByUserId();
  }, [sendRequest, userId]);

  return (
    <Fragment>
      {isLoading && (<div className="center">
        <LoadingSpinner asOverlay />
      </div>)}
      {!isLoading && loadedPlaces &&
        <PlaceList
          items={loadedPlaces}
          onDeletePlace={deletePlaceHandler}
          error={error}
          selectedUser={userId}
        />}
    </Fragment>
  );
};

export default UserPlaces;
