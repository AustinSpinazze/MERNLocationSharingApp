import React, { useEffect, useState, Fragment } from "react";

import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Users = () => {

  const [users, setUsers] = useState([]);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await sendRequest(
          "/users",
          "get",
          "http://localhost:5000/api"
        );

        setUsers(response.data.users);

      } catch (error) {
        console.log(error);
      }
    };

    getUsers();

  }, []);

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && users && <UsersList items={users} />}
    </Fragment>);
};

export default Users;
