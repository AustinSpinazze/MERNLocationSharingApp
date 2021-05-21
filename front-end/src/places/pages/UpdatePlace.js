import React from "react";
import { useParams } from 'react-router-dom';

const UpdatePlace = () => {
  //grabs placeId from url?
  const placeId = useParams().placeId;
  return <h1>UpdatePlace</h1>;
};

export default UpdatePlace;
