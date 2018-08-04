import React, { Component } from 'react';
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import DrawControl from 'react-mapbox-gl-draw';

// Don't forget to import the CSS
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

class MyMap extends Component {

    state = {
        viewport: {
            width: 400,
            height: 400,
            latitude: 37.7577,
            longitude: -122.4376,
            zoom: 8
        }
    };

    render() {
        const Map = ReactMapboxGl({
            accessToken: 'pk.eyJ1IjoidG9tZmVsZGVyIiwiYSI6ImNqa2YwbWQxZTAycWgzd3BqMDg0b3R2bHEifQ.cR9TG3uNxHWFFtYa5MlktQ'
        });
        return (
            <Map
                style="mapbox://styles/tomfelder/cjkf18k8j0ijs2rqloxce3a9w"
                containerStyle={{ height: '100%', width: '100%' }}>
                    <DrawControl />
                <Layer
                    type="symbol"
                    id="marker"
                    layout={{ "icon-image": "marker-15" }}>
                    <Feature coordinates={[37.7577, -122.4376]}/>
                </Layer>
            </Map>
        );
    }
}

export default MyMap;
