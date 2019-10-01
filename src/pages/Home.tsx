import React from 'react';
import { DefaultComponentProps } from '../components/DefaultComponentProps';
import { AFetchComponentStates, AFetchComponent } from '../components/AFetchComponent';
import { CCCSave } from '../apiTypes/CCCSave';
import { SaveComponent } from '../components/home/SaveComponent';

export interface HomeProps extends DefaultComponentProps {

}

interface HomeStates extends AFetchComponentStates {
    saves: CCCSave[];
}

export class HomeComponent extends AFetchComponent<HomeProps, HomeStates> {
    constructor(props: HomeProps) {
        super(props);
        this.state = {
            dataLoaded: false,
            saves: []
        };

    }

    protected async handleReload(): Promise<void> {
        this.setState({
            saves: (await this.api.getSaves()).games
        });
    }

    renderFull(): JSX.Element {
        return <>
            {this.state.saves.map(s => <SaveComponent env={this.props.env} save={s} />)}
        </>;
    }
}