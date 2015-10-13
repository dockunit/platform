'use strict';

import React from 'react';
import updateShowHelp from '../actions/updateShowHelp';
import ApplicationStore from '../stores/ApplicationStore';
import {connectToStores} from 'fluxible-addons-react';

@connectToStores(['ApplicationStore'], (context, props) => ({
    ApplicationStore: context.getStore(ApplicationStore).getState()
}))
class Help extends React.Component {
	constructor(props, context) {
    	super(props, context);

        this.toggleHelp = this.toggleHelp.bind(this);
    }

    static contextTypes = {
        executeAction: React.PropTypes.func
    }

    toggleHelp() {
        this.context.executeAction(updateShowHelp, !this.props.ApplicationStore.showHelp);
    }

	render() {
		return (
			<button className="btn btn-success btn-sm" type="button" onClick={this.toggleHelp}>
				Help
			</button>
		);
	}
}

export default Help;
