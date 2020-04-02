import React from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://www.nycinsiderguide.com/wp-content/uploads/2018/12/empire-state-building-nyc.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484,
      lng: -73.9857
    },
    creator: "u1"
  },
  {
    id: "p2",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://www.nycinsiderguide.com/wp-content/uploads/2018/12/empire-state-building-nyc.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484,
      lng: -73.9857
    },
    creator: "u2"
  }
];

const UserPlaces = () => {
  // react params are aware of any part of your route paths that start with : like :userId for example
  // basically gives us access to userId encoded in the url
  const userId = useParams().userId;
  // .filter filters out any content that is not associated with the userId in the URL
  const loadPlaces = DUMMY_PLACES.filter(place => place.creator === userId);
  return <PlaceList items={loadPlaces} />;
};

export default UserPlaces;
