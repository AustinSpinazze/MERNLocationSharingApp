import { useState, useCallback, useRef, useEffect } from 'react';
import axios, { isCancel } from 'axios';

export const useHttpClient = () => {

    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState(null);

    const axiosSource = useRef(null);

    const createNewCancelToken = () => {
        axiosSource.current = axios.CancelToken.source();
        return axiosSource.current.token;
    };

    const sendRequest = useCallback(async (url, method = "get", baseURL, headers = {}, params = {}, data = {}) => {

        setIsLoading(true);

        try {
            const responseData = await axios.request({
                url,
                method,
                baseURL,
                headers,
                params,
                data,
                cancelToken: createNewCancelToken()
            }).then(response => {
                console.log(response);
                return response.data;
            }).catch(error => {
                if (isCancel(error)) {
                    return;
                }
            });

            setIsLoading(false);

            return responseData;
        } catch (err) {
            console.log(err);
            setError(
                err
                || "Something went wrong, please try again.");

            setIsLoading(false);

            throw err;
        }

    }, []);

    const clearError = () => {
        setError(null);
    }

    // Cancel all pending requests when unmounting the component
    useEffect(
        () => () => {
          if (axiosSource.current) axiosSource.current.cancel();
        },
        []
      );

    return { isLoading, error, sendRequest, clearError };
};