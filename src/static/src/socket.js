import {io} from 'socket.io-client'

/**
 * @brief Implement client socket in order to communicate with server 
 */
class Socket {
    /**
     * @param namespace string
     */
    constructor(namespace) {
        this.namespace = namespace
        this.socket = io(this.namespace)
        this.socket.on('connect', () => {this.onconnect()})
    }

    /**
     * @brief Reconnect client.
     */
    connect() {
        this.socket = io(this.namespace)
    }

    /**
     * @brief Handler at connection client event.
     */
    onconnect () {
        console.log(`Socket: client socket is connected with id: ${this.socket.id}`)
    }

    /**
     * @brief Disconnect client socket.
     */
    disconnect() {
        this.socket.disconnect(true)
        console.log(`Socket: client socket is disconnected`)
    }

    /**
     * @brief Send data to server via channel
     * @param {*} channel string
     * @param {*} data object
     */
    emit(channel, data) {
        this.socket.emit(channel, data)
    }
}

export {Socket}