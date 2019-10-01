import { Alert } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/pro-solid-svg-icons";
import React from "react";

export function LoadingComponent(): JSX.Element {
    return <Alert color="info">
        <FontAwesomeIcon icon={faSync} spin />
        <strong>Loading Data... Please wait...</strong>
    </Alert>;
}