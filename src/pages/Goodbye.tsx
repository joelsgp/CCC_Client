import { Jumbotron, Container } from "reactstrap";
import React from "react";

export default function Goodbye(): JSX.Element {
    return <Jumbotron fluid>
        <Container fluid>
            <h1 className="display-3">Goodbye!></h1>
            <p className="lead">
                Thanks for using Cookie Clicker Cloud!
            </p>
        </Container>
    </Jumbotron>;
}