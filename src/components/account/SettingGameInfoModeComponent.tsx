import React from 'react';
import { DefaultComponentProps } from '../DefaultComponentProps';
import { Card, CardTitle, CardBody, FormGroup, Label, CustomInput, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag } from '@fortawesome/pro-solid-svg-icons';
import { GetGameAttrModes } from '../home/GameAttrModes';

interface SettingGameInfoModeStates {
    selectedItem: string;
}


export class SettingGameInfoModeComponent extends React.Component<DefaultComponentProps, SettingGameInfoModeStates> {

    constructor(props: DefaultComponentProps) {
        super(props);
        this.state = {
            selectedItem: props.env.settings.get("attrMode")
        }
    }

    async onValueChange(event: React.ChangeEvent<HTMLSelectElement>) {
        let settings = this.props.env.settings;
        this.setState({
            selectedItem: event.target.value
        });
        settings.set("attrMode", event.target.value);
        await settings.save();
    }

    render(): JSX.Element {
        return <Card body inverse color="info" className="mt-3 text-left">
            <CardTitle>
                <FontAwesomeIcon icon={faTag} />
                Game Information Mode
            </CardTitle>
            <CardBody>
                Select how the Game Information (like Cookies, CpS, etc.) should shown
                <FormGroup>
                    <Input type="select" value={this.state.selectedItem} onChange={this.onValueChange.bind(this)}>
                        {
                            GetGameAttrModes().map((a,i) => <option value={i}>{a.desc}</option>)
                        }
                    </Input>

                </FormGroup>
            </CardBody>
        </Card>;
    }
}