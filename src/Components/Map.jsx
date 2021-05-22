import React, {Component} from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet' 
import 'leaflet/dist/leaflet.css';
import io from 'socket.io-client'
import * as L from "leaflet";
import '../css/map.css'

// icons
import plane from '../images/avion.png'
import destination from '../images/destination.png'
import origin from '../images/origin.png'

const socket = io('wss://tarea-3-websocket.2021-1.tallerdeintegracion.cl', {
    path: '/flights'
});

class Map extends Component{

    state = {
        flights : []
    }

    getFlights = e => {
        e.preventDefault()
        socket.emit('FLIGHTS')
    }

    componentDidMount() {
        socket.on ("FLIGHTS",  (data) => {
            console.log(data)
            this.setState({flights: data})
        })
        window.onload = function () {
            socket.emit('FLIGHTS')
        }
    }


    render(){

        const planeIcon = L.icon({
            iconUrl: plane,
            iconSize: [60,60]
        });

        const destinationIcon = L.icon({
            iconUrl: destination,
            iconSize: [25,40],
            iconAnchor: [12, 40]
        })

        const originIcon = L.icon({
            iconUrl: origin,
            iconSize: [16,16],
            iconAnchor: [8,8]
        })

        const allFlights = this.state.flights.map((flight, index) => {
            return (
                <div key={index}>
                    <Marker position={[flight.origin[0], flight.origin[1]]} icon={originIcon}></Marker>
                    <Marker position={[flight.destination[0], flight.destination[1]]} icon={destinationIcon}>
                        <Popup>
                        Codigo: {flight.code}
                        </Popup>
                    </Marker>
                    <Polyline positions={[flight.origin, flight.destination]} color={'red'} dashArray={'20'} className='polylines'/>
                </div>
            )
        });


        return (
            <div>
                <h1>Mapa</h1>
                <MapContainer center={[-34.505, -53.09]} zoom={5} scrollWheelZoom={false} className='map'>
                    <h1>asfkjhs</h1>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        maxZoom='6'
                    />
                    <div>{allFlights}</div>
                    
                </MapContainer>
            </div>
        );
    }
}

export default Map;

