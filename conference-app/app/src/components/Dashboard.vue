<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <ul>
      <li v-for="room in rooms">
        <router-link :to="{name: 'Room', params: {id:  room.sessionID}}">{{room.room}}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import config from '../config/tokbox.config'
import axios from 'axios'
export default {
  name: 'Dashboard',
  data () {
    return {
      msg: 'Choose rooms to join',
      rooms: []
    }
  },
  created () {
    axios.get(`${config.apiBaseUrl}/rooms`)
    .then(response => {
      this.rooms = response.data
    })
    .catch(e => {
      this.rooms.push(e)
    })
  },
  methods: {
    enterRoom: (room) => {
      console.log('Room Name:', room.room)
      console.log('Session ID:', room.sessionID)
      this.$router.push({name: 'Room', params: { id: room.sessionID }})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 10px 10px;
  padding: 10px;
  border: 2px solid;
}

a {
  color: #42b983;
}
</style>
