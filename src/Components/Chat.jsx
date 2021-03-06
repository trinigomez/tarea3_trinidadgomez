import React, {Component} from 'react'
import io from 'socket.io-client'

const socket = io('wss://tarea-3-websocket.2021-1.tallerdeintegracion.cl', {
    path: '/flights'
});

class Chat extends Component{

    state = {
        name: "",
        message: "",
        messages: [],
    };

    componentDidMount() {
        socket.onopen = () => {
          console.log('WebSocket Client Connected');
        };
        socket.on("CHAT", ({name, date, message}) => {
            this.setState({messages: [ ...this.state.messages, {name, date, message}]})
        });
      }
    componentDidUpdate() {
        this.executeScroll();
      }

    onMessageChange = e => {
        this.setState({ message: e.target.value})
    }

    onNameChange = e => {
        this.setState({ name: e.target.value})
    }

    onMessageSubmit = e => {
        e.preventDefault()
        const name = this.state.name
        const message = this.state.message
        socket.emit('CHAT', { name, message })
        this.setState({message: ""})
        this.executeScroll()
    }

    executeScroll = () => {
        this.messagesEnd.scrollIntoView()
    }
    

    render(){

        const messages = this.state.messages.map(({name, date, message}, index) => {
            return (
                <div key={index}>
                    <div className='name-date'>
                        <h3>{name}:</h3>
                        <h5>{new Date(date).toLocaleString()}</h5>
                        
                    </div>
                    <h4>{message}</h4>
                    
                </div>
            )
        });
    
        return(
            <div>
                <h1>Chat</h1>
                <div className="messages">
                    {messages}
                    <div ref={(el) => {this.messagesEnd = el; }}></div> 
                </div>
                    <form onSubmit={this.onMessageSubmit} className="send-message">
                        <div className="flex">
                            <h2>Nombre: </h2>
                            <input
                                name="name"
                                onChange={(e) => this.onNameChange(e)}
                                value={this.state.name}
                                label="name"
                                placeholder='Escribe tu nombre...'
                            />
                        </div>
                        <div className="flex">
                            <h2>Mensaje:</h2>
                            <input
                                name="message"
                                onChange={(e) => this.onMessageChange(e)}
                                value={this.state.message}
                                label="Message"
                                placeholder='Escribe un mensaje...'
                            />
                        </div>
                        <button className='update-button'>Enviar</button>
                    </form>
            </div>
          )
    }
}

export default Chat;