import React, { useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import PlaceItem from "./PlaceItem";
import Button from "../../shared/components/FormElements/Button";
import { AuthContext } from "../../shared/context/auth-context";
import "./PlaceList.css";

const PlaceList = props => {
  const auth = useContext(AuthContext);

  if (props.items.length === 0 || props.error) {
    return (
      <div className="place-list center">
        {props.selectedUser === auth.userId ?
          <Card>
            <h2>No places found. Maybe create one?</h2>
            <Button to={'/places/new'}>Share Place</Button>
          </Card> :
          <Card>
            <h2>This user has not added any posts yet. Maybe check out another user's profile?</h2>
            <Button to={'/'}>Back To User List</Button>
          </Card>}
      </div>
    );
  }

  return (
    <ul className="place-list">
      {props.items.map((place, index) => (
        <PlaceItem
          key={index}
          placeId={place.placeId}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creator={place.creator}
          coordinates={place.location}
          onDelete={props.onDeletePlace}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
