import React from 'react';
import { DefaultComponentProps } from '../DefaultComponentProps';
import { SettingsComponent, SettingsStates } from './SettingsComponent';
import { IconDefinition, faPuzzlePiece, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Input, InputGroup, InputGroupAddon, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CCCSettings } from '../../CCCClasses/CCCSettings';

interface AddonsStates extends SettingsStates {
    addons: string[];
}

export class AddonsComponent extends SettingsComponent<DefaultComponentProps, AddonsStates> {

    state = {
        addons: JSON.parse(this.props.env.settings.get("addons")),
        collapsed: false
    }

    icon: IconDefinition = faPuzzlePiece;
    title: string = "Autoload Addons";

    constructor(p: DefaultComponentProps) {
        super(p);

        this.onAdd = this.onAdd.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.onValueChange = this.onValueChange.bind(this);
    }

    protected save(settings: CCCSettings) {
        settings.set("addons", JSON.stringify(this.state.addons));
        settings.save();
    }

    private onValueChange(event: React.ChangeEvent<HTMLInputElement>) {
        let target = event.target;
        let itemId = parseInt(target.name);

        this.setState(s => {
            s.addons[itemId] = target.value;
            return {
                addons: s.addons
            }
        });
    }

    private onAdd() {
        this.setState(s => {
            s.addons.push("");
            return {
                addons: s.addons
            }
        });
    }

    private onRemove(index: number) {
        this.setState(s => {
            s.addons.splice(index, 1);
            return {
                addons: s.addons
            }
        });
    }

    renderInner(): JSX.Element {
        return <>
            Autoload a mod on CC start.
            <br />
            Need to reload CC.
            <br />
            {
                this.state.addons.map((a,i) => <InputGroup>
                    <InputGroupAddon addonType="prepend">
                        <Button onClick={() => this.onRemove(i)} color="danger">
                            <FontAwesomeIcon icon={faTrash} />
                        </Button>
                    </InputGroupAddon>
                    <Input name={i.toString()} type="url" value={a} onChange={this.onValueChange} />
                </InputGroup>)
            }
            <Button onClick={this.onAdd}>
                <FontAwesomeIcon icon={faPlus} />
                Add
            </Button>
        </>;
    }

}