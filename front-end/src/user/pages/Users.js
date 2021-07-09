import React, { useEffect, useState, Fragment, useContext } from "react";

import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

const Users = () => {

  const [users, setUsers] = useState([]);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const auth = useContext(AuthContext);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await sendRequest(
          "/users",
          "get",
          "http://localhost:5000/api"
        );

        let cleanedResponse = response.data.users.filter((user, index, array) => {
          return user.userId !== auth.userId;
        });

        setUsers(cleanedResponse);

      } catch (error) {
        console.log(error);
      }
    };

    getUsers();

  }, [sendRequest, auth.userId]);

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
