import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/pro-solid-svg-icons";
import Alert from "reactstrap/lib/Alert";
import { DefaultComponentProps } from "./DefaultComponentProps";
import { CCCAPI } from "../CCCClasses/CCCAPI";
import IRefreshTarget from "../utils/IRefreshTarget";
import { LoadingComponent } from "./shared/LoadingComponent";

export interface AFetchComponentStates {
    dataLoaded: boolean;
}

export abstract class AFetchComponent<P extends DefaultComponentProps, S extends AFetchComponentStates> extends React.Component<P, S> implements IRefreshTarget {

    protected abstract handleReload(): Promise<void>;
    protected abstract renderFull(): JSX.Element;

    public async reload(): Promise<void> {
        this.setState({ dataLoaded: false });
        await this.handleReload();
        this.setState({ dataLoaded: true });
    }

    componentDidMount() {
        this.api.attach(this);
        this.reload();
    }

    componentWillUnmount() {
        this.api.detach(this);
    }

    protected get api(): CCCAPI {
        return this.props.env.api;
    }

    public render(): JSX.Element {
        if (this.state.dataLoaded) {
            return this.renderFull();
        }
        else {
            return <LoadingComponent />
        }
    }

}