import React, { useState, useContext, Fragment } from 'react';
import axios from 'axios';

import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpin from '../../shared/components/UIElements/LoadingSpinner';

import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from '../../shared/util/validator';
import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from '../../shared/hooks/form-hook';
import './Authenticate.css';

const Authenticate = () => {
  const auth = useContext(AuthContext);

  const [isLoginMode, setIsLoginMode] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false
          }
        },
        false
      );
    }
    setIsLoginMode(prevMode => !prevMode);
  };

  const authSubmitHandler = async (event) => {

    event.preventDefault();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    };

    setIsLoading(true);

    try {
      if (isLoginMode) {
        const body = {
          email: formState.inputs.email.value,
          password: formState.inputs.password.value
        };

        const responseData = await axios.post("http://localhost:5000/api/users/login", body, config)
          .then(response => {
            return response.data;
          });

        setIsLoading(false);
        auth.login();
      } else {
        const body = {
          name: formState.inputs.name.value,
          username: formState.inputs.username.value,
          email: formState.inputs.email.value,
          password: formState.inputs.password.value
        };

        const responseData = await axios.post("http://localhost:5000/api/users/signup", body, config)
          .then(response => {
            return response.data;
          });

        setIsLoading(false);
        auth.login();
      }
    } catch (error) {
      console.log();
      setIsLoading(false);
      setError(error.response.data.message || "Something went wrong, please try again.");
    }
  };

  const errorHandler = () => {

    setError(null);
  }

  return (
    <Fragment>
      <ErrorModal error={error} onClear={errorHandler} />
      <Card className="authentication">
        {isLoading && <LoadingSpin asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Fragment>
              <Input
                element="input"
                id="name"
                type="text"
                label="Your Name"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a name."
                onInput={inputHandler}
              />
              <Input
                element="input"
                id="username"
                type="text"
                label="Your Username"
                validators={[VALIDATOR_MINLENGTH(5)]}
                errorText="Please enter a username."
                onInput={inputHandler}
              />
            </Fragment>
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid password, at least 5 characters."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
        </Button>
      </Card>
    </Fragment>
  );
};

export default Authenticate;
