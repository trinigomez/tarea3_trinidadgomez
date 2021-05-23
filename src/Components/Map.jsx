import React, {Component} from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet' 
import 'leaflet/dist/leaflet.css';
import io from 'socket.io-client'
import * as L from "leaflet";
import '../css/map.css'
import {Modal} from 'reactstrap'

// icons
import plane from '../images/avion.png'
import destination from '../images/destination.png'
import origin from '../images/origin.png'
import close from '../images/close.png'

const socket = io('wss://tarea-3-websocket.2021-1.tallerdeintegracion.cl', {
    path: '/flights'
});

class Map extends Component{

    state = {
        flights : [],
        positions: {},
        modals: {}
    }

    componentDidMount() {
        socket.on("FLIGHTS",  (data) => {
            this.setState({flights: data})
            this.state.flights.forEach(flight => {
                this.setState({modals: {...this.state.modals, [flight.code]: false}})
            });
        })
        window.onload = function () {
            socket.emit('FLIGHTS')
        }
        socket.on("POSITION", ({code, position}) => {
            this.setState({positions: {...this.state.positions, [code]: position}})
        })
    }

    showInformation = (code) => {
        console.log(this.state.modals)
        this.setState(prevState => ({ 
            modals: {
            ...this.state.modals,
            [code]: !prevState.modals[code] }}));
    }

    updateInfo = () => {
        socket.emit('FLIGHTS')
        this.setState({positions: {}})
    }

    render(){

        const planeIcon = L.icon({
            iconUrl: plane,
            iconSize: [60,60],
            iconAnchor: [30,30]
        });

        const destinationIcon = L.icon({
            iconUrl: destination,
            iconSize: [25,40],
            iconAnchor: [12, 40]
        })

        const originIcon = L.icon({
            iconUrl: origin,
            iconSize: [10,10],
            iconAnchor: [5,5]
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

        const allPositions = Object.keys(this.state.positions).map((code, index) => {
            return (
                <Marker position={[this.state.positions[code][0],this.state.positions[code][1]]} icon={planeIcon} key={index}>
                    <Popup>
                        Codigo: {code}
                    </Popup>
                </Marker>
            )
        })

        const flightInfo = this.state.flights.map((flight, index) => {
            return (
                <div key={index} className="flight" onClick={() => this.showInformation(flight.code)}>
                    <h1>{flight.code}</h1>
                    <h3>Origen:</h3>
                    <h4>lat: {flight.origin[0]}</h4>
                    <h4>long: {flight.origin[1]}</h4>
                    <h3>Destino:</h3>
                    <h4>lat: {flight.destination[0]}</h4>
                    <h4>long: {flight.destination[1]}</h4>
                    <Modal isOpen={this.state.modals[flight.code]} className='modal'>
                        <img src={close} alt="close" onClick={() => this.showInformation(flight.code)}/>
                        <h1>{flight.code}</h1>
                        <h3>Origen: {flight.origin}</h3>
                        <h3>Destino: {flight.destination}</h3>
                        <h3>Avion: {flight.plane}</h3>
                        <h3>Asientos: {flight.seats}</h3>
                        {flight.passengers.map(passenger => (
                            <li>{passenger.name} ({passenger.age})</li>
                        ))}
                    </Modal>
                </div>
            )
        });

        return (
            <div>
                <h1>Mapa</h1>
                <MapContainer center={[-34.505, -53.09]} zoom={5} scrollWheelZoom={false} className='map'>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"                    />
                    <div>{allFlights}</div>
                    <div>{allPositions}</div>
                    
                </MapContainer>
                <div className='flight-information'>
                    <div>
                        <h1>Informacion de vuelos</h1>
                        <button onClick={this.updateInfo} className='update-button'>Actualizar informacion</button>
                    </div>
                    {flightInfo}
                </div>
            </div>
        );
    }
}

export default Map;

