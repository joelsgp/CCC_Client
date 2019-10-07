import React from 'react';
import { DefaultComponentProps } from '../DefaultComponentProps';
import { ButtonDropdown, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { AttrMode, GetGameAttrModes } from './GameAttrModes';

export interface SelectAttrModeProps extends DefaultComponentProps {
    onSelection: (current: AttrMode) => any;
}

interface SelectAttrModeStates {
    attrModes: AttrMode[];
    currentSelection: number;
    isOpen: boolean;
}

export class SelectAttrModeComponent extends React.Component<SelectAttrModeProps, SelectAttrModeStates> {

    state = {
        attrModes: GetGameAttrModes(),
        currentSelection: parseInt(this.props.env.settings.get("attrMode")),
        isOpen: false
    };

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    select(sorterNumber: number) {
        let item = this.state.attrModes[sorterNumber];
        this.setState({ currentSelection: sorterNumber });
        this.props.onSelection(item);
        this.props.env.settings.set("attrMode", sorterNumber.toString());
    }

    get current() {
        return this.state.attrModes[this.state.currentSelection];
    }

    render(): JSX.Element {
        return <ButtonDropdown isOpen={this.state.isOpen} toggle={this.toggle.bind(this)}>
            <DropdownToggle caret>
                Game attributes as {this.current.name}
            </DropdownToggle>
            <DropdownMenu>
                {
                    this.state.attrModes.map((a,i) =>
                        <DropdownItem active={i == this.state.currentSelection} onClick={() => this.select(i)}>
                            {a.name}
                        </DropdownItem>)
                }
            </DropdownMenu>
        </ButtonDropdown>;
    }
}