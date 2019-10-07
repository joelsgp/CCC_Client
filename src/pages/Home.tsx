import React from 'react';
import { DefaultComponentProps } from '../components/DefaultComponentProps';
import { AFetchComponentStates, AFetchComponent } from '../components/AFetchComponent';
import { CCCSave } from '../apiTypes/CCCSave';
import { SaveComponent } from '../components/home/SaveComponent';
import { SelectSorterComponent } from '../components/home/SelectSorterComponent';
import { CCCSaveComparator, getCurrentSorter } from '../CCCClasses/helpers/CCCSaveSorter';
import { RefreshButtonComponent } from '../components/shared/RefreshButtonComponent';
import { AttrMode, getCurrentAttrMode } from '../components/home/GameAttrModes';
import { ButtonGroup } from 'reactstrap';
import { SelectAttrModeComponent } from '../components/home/SelectAttrModeComponent';

export interface HomeProps extends DefaultComponentProps {

}

interface HomeStates extends AFetchComponentStates {
    saves: CCCSave[];
    currentAttrMode: AttrMode;
}

export class HomeComponent extends AFetchComponent<HomeProps, HomeStates> {

    currentSorter: CCCSaveComparator;
    currentAttrMode: AttrMode;

    constructor(props: HomeProps) {
        super(props);
        this.state = {
            dataLoaded: false,
            saves: [],
            currentAttrMode: getCurrentAttrMode(this.props.env)
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

    onChangeAttrMode(currentAttrMode: AttrMode) {
        this.setState({ currentAttrMode });
    }

    renderFull(): JSX.Element {
        return <>
            <RefreshButtonComponent env={this.props.env} />

            <ButtonGroup>
                <SelectSorterComponent onSortSelection={this.onSorterChange.bind(this)} env={this.props.env} />
                <SelectAttrModeComponent env={this.props.env} onSelection={this.onChangeAttrMode.bind(this)} />
            </ButtonGroup>

            {this.state.saves.map(s => <SaveComponent env={this.props.env} save={s} attrMode={this.state.currentAttrMode} />)}
        </>;
    }
}