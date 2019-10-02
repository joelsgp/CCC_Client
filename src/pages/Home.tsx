import React from 'react';
import { DefaultComponentProps } from '../components/DefaultComponentProps';
import { AFetchComponentStates, AFetchComponent } from '../components/AFetchComponent';
import { CCCSave } from '../apiTypes/CCCSave';
import { SaveComponent } from '../components/home/SaveComponent';
import { SelectSorterComponent } from '../components/home/SelectSorterComponent';
import { CCCSaveComparator, getCurrentSorter } from '../CCCClasses/helpers/CCCSaveSorter';
import { RefreshButtonComponent } from '../components/shared/RefreshButtonComponent';

export interface HomeProps extends DefaultComponentProps {

}

interface HomeStates extends AFetchComponentStates {
    saves: CCCSave[];
}

export class HomeComponent extends AFetchComponent<HomeProps, HomeStates> {

    currentSorter: CCCSaveComparator;

    constructor(props: HomeProps) {
        super(props);
        this.state = {
            dataLoaded: false,
            saves: []
        };
        this.currentSorter = getCurrentSorter(props.env);
    }

    protected async handleReload(): Promise<void> {
        this.setState({
            saves: (await this.api.getSaves()).games.sort(this.currentSorter.compare)
        });
    }

    onSorterChange(currentSorter: CCCSaveComparator) {
        this.currentSorter = currentSorter;
        let saves = this.state.saves.sort(currentSorter.compare);
        this.setState({ saves });
    }

    renderFull(): JSX.Element {
        return <>
            <RefreshButtonComponent env={this.props.env} />
            <SelectSorterComponent onSortSelection={this.onSorterChange.bind(this)} env={this.props.env} />
            {this.state.saves.map(s => <SaveComponent env={this.props.env} save={s} />)}
        </>;
    }
}