import React, { useRef, useState, useEffect } from 'react';

import Button from "./Button";
import "./ImageUpload.css";

const ImageUpload = (props) => {
    const filePickerRef = useRef();

    const [pickedFile, setPickedFile] = useState();

    const [previewUrl, setPreviewUrl] = useState();

    const [isValid, setIsValid] = useState(false);

    const pickImageHandler = () => {
        filePickerRef.current.click();
    }

    const pickedImageHandler = (event) => {

        let file;

        let fileIsValid = isValid;

        if (event.target.files && event.target.files.length === 1) {
            file = event.target.files[0];
            setPickedFile(file);
            setIsValid(true);
            fileIsValid = true;
        }
        else {
            setIsValid(false);
            fileIsValid = false;
        }

        props.onInput(props.id, file, fileIsValid);
    }

    useEffect(() => {
        if (!pickedFile) {
            return;
        }

        const fileReader = new FileReader();

        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        };

        fileReader.readAsDataURL(pickedFile);


    }, [pickedFile])

    return (
        <div className="form-control">
            <input
                id={props.id}
                ref={filePickerRef}
                style={{ display: "none" }}
                type="file"
                accept=".jpg,.png,.jpeg"
                onChange={pickedImageHandler}
            />
            <div className={`image-upload ${props.center && "center"}`}>
                <div className="image-upload__preview">
                    {previewUrl && <img src={previewUrl} alt="Preview" />}
                    {!previewUrl && <p>Please pick an image.</p>}
                </div>
                <Button type="button" onClick={pickImageHandler}>Pick Image</Button>
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div >
    )
}

export default ImageUpload;
