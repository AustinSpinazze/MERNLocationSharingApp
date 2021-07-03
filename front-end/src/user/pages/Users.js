import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";

import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const Users = () => {

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState(null);

  const [users, setUsers] = useState([]);

  useEffect(() => {

    const sendRequest = async () => {

      setIsLoading(true);

      try {
        const responseData = await axios.get("http://localhost:5000/api/users")
          .then(response => {
            return response.data;
          });

        setUsers(responseData.users);

        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        setError(error.response.data.message || "Something went wrong, please try again.");
      }

      setIsLoading(false);
    };

    sendRequest();

  }, []);

  const errorHandler = () => {
    setError(null);
  }

  return (
    <Fragment>
      <ErrorModal error={error} onClose={errorHandler} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && users && <UsersList items={users} />}
    </Fragment>);
};

export default Users;
