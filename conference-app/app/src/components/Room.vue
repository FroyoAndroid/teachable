<template>
  <div>
    <h2>{{msg}}</h2>
    <div class="content">
      <div id="publisherContainer"></div>
    </div>
    <div class="control">
      <button @click="joinRoom(sessionID)">Join Room</button>
      <button @click="mute()"> Mute / Unmute</button>
      <button @click="dropCall()">End Call</button>
    </div>
    <div id="subcriberContainer"></div>
  </div>
</template>


<script>
import config from '../config/tokbox.config'
import axios from 'axios'

let session = null
let OT = window.OT
let publisher = null
// let subscriber = null

export default {
  name: 'Room',
  props: ['id'],
  data () {
    return {
      msg: `Welcome Aboard`,
      sessionID: this.$route.params.id
    }
  },
  methods: {
    joinRoom (sessionId) {
      if (OT.checkSystemRequirements() === 1) {
        session = OT.initSession(config.apiKey, sessionId)
      } else {
        console.error('Browser does not support webrtc')
      }

      axios.post(`${config.apiBaseUrl}/rooms/token`, {
        sessionID: sessionId,
        tokenType: 'publisher',
        username: 'test'
      }).then((response) => {
        session.connect(response.data.token, (error) => {
          if (error) {
            console.error('Error', error)
          } else {
            this.bindSessionEvents(session)
            this.publishVideo()
          }
        })
      }).catch((error) => {
        console.error(error)
      })
    },

    bindSessionEvents (session) {
      console.log('session', session.connection.connectionId)
      session.on('connectionCreated', (event) => {
        if (event.connection.connectionId !== session.connection.connectionId) {
          console.log('Attending joining', event.connection.connectionId)
        } else {
          console.log('connection created', event.connection.connectionId)
        }
      })

      session.on('sessionDisconnected', (event) => {
        console.log('session disconnecting')
      })

      session.on('streamDestroyed', (event) => {
        console.log('stream disconnected')
      })
    },

    publishVideo () {
      let targetElement = 'publisherContainer'
      let publisherProperties = {
        insertMode: 'append'
      }

      publisher = OT.initPublisher(targetElement, publisherProperties, (error) => {
        if (error) {
          // the client can not publish
        } else {
          console.log('publisher initialised')
          this.bindPublisherEvent()
          this.publishVideoToSession()
        }
      })
    },

    publishVideoToSession () {
      session.publish(publisher, (error) => {
        if (error) {
          console.error(error)
        } else {
          console.log('publishing a stream')
        }
      })
    },

    bindPublisherEvent () {
      publisher.on({
        accessAllowed (event) {
          console.log('publish', event)
        },
        acessDenied (event) {
          console.log('publish', event)
        },
        streamCreated (event) {
          let subscriberOpions = {
            testNetwork: true
          }
          session.subscribe(event.stream, 'subcriberContainer', subscriberOpions, (error) => {
            console.error('subscriber', error)
          })
        }
      })
    },

    subscribeCallback (error) {
      console.error('subscriber', error)
    },

    mute () {
      console.log('Mute Called')
    },

    dropCall () {
      session.disconnect()
      session = null
      console.log('Drop call')
    }
  }
}
</script>
<style scoped>
h1,
h2 {
  font-weight: normal;
}

div.content {
  width: 80%;
  height: auto;
  margin: 0 auto;
}

div.control {
  margin: 12px auto;
}

div#publisherContainer {
  width: 60%;
  box-shadow: 0px 2px 6px 0px;
}
</style>
