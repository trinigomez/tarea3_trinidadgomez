import React, {Component} from 'react'

class Map extends Component{

    render(){

        let receta = {
            nombre: 'Pizza',
            ingredientes: ['Tomate', 'Queso'],
            calorias: 400
        };

        return (
            <div>
                <h1>{'Receta:' + receta.nombre}</h1>
                <h2>{'Calorias:' + receta.calorias}</h2>
                {
                    receta.ingredientes.map((ingrediente, i) => {
                        return (
                            <li key={i}>
                                {ingrediente}
                            </li>
                        )
                    })
                }
            </div>
        );
    }
}

export default Map;

