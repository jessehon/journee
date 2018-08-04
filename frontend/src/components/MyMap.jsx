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
            latitude: -33.8726628,
            longitude: 151.1956613,
            zoom: 8
        }
    };

    render() {
        const Map = ReactMapboxGl({
            accessToken: 'pk.eyJ1IjoidG9tZmVsZGVyIiwiYSI6ImNqa2YwbWQxZTAycWgzd3BqMDg0b3R2bHEifQ.cR9TG3uNxHWFFtYa5MlktQ'
        });

        let stations = [
            {
                id: 1,
                position: [151.1956613, -33.8726628],
            }
        ];

        return (
            <Map
                style="mapbox://styles/tomfelder/cjkf18k8j0ijs2rqloxce3a9w"
                center={[151.1956613, -33.8726628]}
                containerStyle={{ height: '100%', width: '100%' }}>
                    <DrawControl />
                <Layer
                    type="symbol"
                    id="marker"
                    layout={{ "icon-image": "marker-15" }}>
                    <Feature coordinates={[151.1956613, -33.8726628]}/>
                </Layer>
                <Layer
                    type="symbol"
                    id="marker"
                    layout={{ "icon-image": "marker-15" }}>
                    {
                        stations
                            .map((station, index) => (
                                <Feature
                                    key={station.id}
                                    coordinates={station.position}/>
                            ))
                    }
                </Layer>
            </Map>
        );
    }
}

export default MyMap;
