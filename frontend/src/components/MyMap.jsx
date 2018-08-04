import React, { Component } from 'react';
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import DrawControl from 'react-mapbox-gl-draw';
import PropTypes from 'prop-types';
import * as _ from 'lodash';

// Don't forget to import the CSS
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

const route = require('../fixtures/route.json');

const lineLayout = {
    'line-cap': 'round',
    'line-join': 'round'
  };

  const linePaint = {
    'line-color': '#4790E5',
    'line-width': 12
  };

class MyMap extends Component {
    static propTypes = {
        treeTable: PropTypes.arrayOf(PropTypes.object),
        viewport: PropTypes.object,
    };

    render() {
        const Map = ReactMapboxGl({
            accessToken: 'pk.eyJ1IjoidHJlbmdyaiIsImEiOiJjamtmNmQzM2owNTl2M3ZvYWUwbTc1eml1In0.tw1JvqFYa_St23kJl-aUEg'
        });
        const mappedRoute = _.map(this.props.treeTable, (row) => {
            const data = JSON.parse(row.message);

            return [
                data.lat,
                data.lng
            ];
        });

        return (
            <Map
                style="mapbox://styles/trengrj/cjkfcle0d0ov12sn4g18r78ln"
                center={mappedRoute[0]}
                containerStyle={{ height: '100%', width: '100%' }}
            >
                <DrawControl />

                <Layer type="line" layout={lineLayout} paint={linePaint}>
                    <Feature coordinates={mappedRoute} />
                </Layer>

                <Layer
                    type="symbol"
                    id="marker"
                    layout={{ "icon-image": "marker-15" }}>
                    <Feature coordinates={[151.1956613, -33.8726628]}/>
                </Layer>

                <Layer
                    type="symbol"
                    id="marker"
                    layout={{ "icon-image": "marker-15" }}
                >
                    {
                        _.map(this.props.treeTable, (row) => {
                            const data = JSON.parse(row.message);

                            return (
                                <Feature
                                    key={row.id}
                                    coordinates={[ data.lat, data.lng ]}
                                />
                            );
                        })
                    }
                </Layer>
            </Map>
        );
    }
}

export default MyMap;
