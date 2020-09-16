import React from 'react';
import { DefaultComponentProps } from '../components/DefaultComponentProps';
import classnames from 'classnames';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { LoginComponent } from '../components/login/LoginComponent';
import { RegisterComponent } from '../components/login/RegisterComponent';
import { getUri } from '../openDocs';

export interface LoginProps extends DefaultComponentProps {

}

interface LoginStates {
    activeTab: string;
}


export class LoginPageComponent extends React.Component<LoginProps, LoginStates> {

    state = {
        activeTab: "1"
    };

    constructor(props: LoginProps) {
        super(props);

        this.toggle = this.toggle.bind(this);
    }

    toggle(tabId: number) {
        this.setState({
            activeTab: tabId.toString()
        });
    }

    render(): JSX.Element {
        return <div>
            <Nav tabs>
                <NavItem>
                    <NavLink
                        className={classnames({ active: this.state.activeTab === "1" })}
                        onClick={() => this.toggle(1)}>
                        Login
                    </NavLink>
                </NavItem>
                <NavItem>
                <NavLink
                        className={classnames({ active: this.state.activeTab === "2" })}
                        onClick={() => this.toggle(2)}>
                        Register
                    </NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                    <LoginComponent env={this.props.env} />
                </TabPane>
                <TabPane tabId="2">
                    <RegisterComponent env={this.props.env} />
                </TabPane>
            </TabContent> 
            <br/>
            <a href={getUri("FAQ")} target="_blank">
                <FontAwesomeIcon icon={faBook}/>
                Open FAQ
            </a>
        </div>;
    }

}