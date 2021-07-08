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

    const sendRequest = useCallback(async (
        url,
        method = "get",
        baseURL, data = {},
        headers = {},
        params = {}) => {

        setIsLoading(true);

        const responseData = await axios.request({
            url,
            method,
            baseURL,
            headers,
            params,
            data,
            cancelToken: createNewCancelToken()
        }).then(response => {
            return response;
        }).catch(error => {
            if (isCancel(error)) {
                return;
            }
            else {
                setError(
                    error.response.data.message
                    || "Something went wrong, please try again.");
            }
        });

        setIsLoading(false);

        return responseData;

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