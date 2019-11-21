import React from 'react';
import './style.scss';

class Disc extends React.Component {
    constructor() {
        super();
    }

    componentWillMount() {
        console.log('disc componentWillMount');
    }

    render() {
        return (
            <div>
                disc
            </div>
        );
    }
}

export default Disc;
