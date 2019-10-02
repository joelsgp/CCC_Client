import React from 'react';
import { DefaultComponentProps } from '../DefaultComponentProps';
import { CCCSaveComparator, getComparators } from '../../CCCClasses/helpers/CCCSaveSorter';
import { ButtonDropdown, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export interface SelectSorterProps extends DefaultComponentProps {
    onSortSelection: (current: CCCSaveComparator) => any;
}

interface SelectSorterStates {
    currentSelection: number;
    isOpen: boolean;
}

export class SelectSorterComponent extends React.Component<SelectSorterProps, SelectSorterStates> {

    private allSorters: CCCSaveComparator[] = getComparators();

    state = {
        currentSelection: parseInt(this.props.env.settings.get("sorter")),
        isOpen: false
    };

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    select(sorterNumber: number) {
        let sorter = this.allSorters[sorterNumber];
        this.setState({ currentSelection: sorterNumber });
        this.props.onSortSelection(sorter);
        this.props.env.settings.set("sorter", sorterNumber.toString());
    }

    get current() {
        return this.allSorters[this.state.currentSelection];
    }

    render(): JSX.Element {
        return <ButtonDropdown isOpen={this.state.isOpen} toggle={this.toggle.bind(this)}>
            <DropdownToggle caret>
                Sort by {this.current.label}
            </DropdownToggle>
            <DropdownMenu>
                {
                    this.allSorters.map((a,i) =>
                        <DropdownItem active={i == this.state.currentSelection} onClick={() => this.select(i)}>
                            {a.label}
                        </DropdownItem>)
                }
            </DropdownMenu>
        </ButtonDropdown>;
    }
}