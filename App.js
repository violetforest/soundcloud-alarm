/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  DatePickerIOS,
  Button,
  View
} from 'react-native';

import { formatToSeconds } from './utils'
import axios from 'axios';
import TrackPlayer from 'react-native-track-player';
import BackgroundTaskRunner from './BackgroundTaskRunner';

// Creates the player
TrackPlayer.setupPlayer().then(async () => {

    // Adds a track to the queue
    await TrackPlayer.add({
        id: 'trackId',
        url: require('./tracks/drinky.mp3'),
        title: 'Track Title',
        artist: 'Track Artist'
    });

    // Starts playing it
    TrackPlayer.play();

});

type Props = {};

export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: '',
      username: '',
      date: new Date()
    };
  }

  componentDidMount() {
    this.tick = setInterval(() => this.handleCurrentTime(), 1000)
  }

  handleCurrentTime(){
    this.setState({
      currentTime: new Date().toLocaleTimeString('en-US', {hour12: false})
    });
  }

  handleValidation(){
    let formIsValid = true;
    if(this.state.username == 'undefined' || !this.state.username || this.state.date == 'undefined' || !this.state.date){
      formIsValid = false
      alert("Invalid form")
    } else {
      formIsValid = true
    }
    return formIsValid
  }

  createPlayer(timeLeft) {
    alert(this.state.username)
    axios.get('https://api.soundcloud.com/resolve?url=https://soundcloud.com/' + this.state.username + '/likes&client_id=4d2526333de7872dbd870ebe98115a5c')
      .then(function (playlist) {
        let track = playlist.data[0]
        alert(track.stream_url)
        // fetchURL(track.stream_url)
        // alert('alarm set to' + ' ' + track.title +
        //   ', by ' + "track.user.username" + " playing in" + window.timeLeft + "seconds")
    })
    .catch(function(error) {
      alert(error)
    })

    // const URL = mp3_url + '?client_id=4d2526333de7872dbd870ebe98115a5c';
    // setTimeout(play(URL), window.timeLeft)
    //
    // function play(URL) {
    //   ReactNativeAudioStreaming.play(URL, {showIniOSMediaCenter: true, showInAndroidNotifications: true});
    // }
  }

  logCurrent() {
    console.log(this.state.currentTime)
  }

  calculateTimeLeft() {
    const nowInSeconds = formatToSeconds(this.state.currentTime.toString())
    let alarmTimeInSeconds = formatToSeconds(this.state.date.toLocaleTimeString('en-US', {
        hour12: false
      }).toString())
    window.timeLeft = alarmTimeInSeconds - nowInSeconds
    console.log(window.timeLeft)
    alert(this.state.username)
    this.createPlayer(window.timeLeft)
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          <Text style={styles.header}>
            Soundcloud Likes Alarm
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Username"
            onChangeText={(username) => this.setState({username})}/>
          <DatePickerIOS
            style={styles.datePicker}
            date={this.state.date}
            mode="time"
            onDateChange={(date) => this.setState({date})}/>
          <Button
            title="Set Alarm"
            style={styles.button}
            onPress={(currentTime) => this.calculateTimeLeft(currentTime)}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    height: '100%'
  },
  container: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40
  },
  header: {
    fontSize: 30,
    marginBottom: 40,
    fontWeight: 'bold'
  },
  datePicker: {
    height: 'auto',
    width: '100%',
    backgroundColor: '#fff'
  },
  textInput: {
    width: '100%',
    height: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: 0,
    marginBottom: 40
  },
  button: {
    backgroundColor: 'yellow'
  }
})
