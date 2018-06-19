import React, { Component } from 'react';
import { Platform, StyleSheet, Text, TextInput,
  DatePickerIOS, Button, View } from 'react-native';
import { formatToSeconds } from './utils'
import axios from 'axios';
import TrackPlayer from 'react-native-track-player';
import BackgroundTimer from 'react-native-background-timer';
import BackgroundTaskRunner from './BackgroundTaskRunner';

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
    this.interval = BackgroundTimer.setTimeout(() => {
      console.log('okay baby')
    }, 10000);
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

    axios.get('https://api.soundcloud.com/resolve?url=https://soundcloud.com/' + this.state.username + '/likes&client_id=4d2526333de7872dbd870ebe98115a5c')
      .then(function (playlist) {
        const track = playlist.data[0]
        const streamUrl = track.stream_url + '?client_id=4d2526333de7872dbd870ebe98115a5c';
        alert(streamUrl)
        TrackPlayer.setupPlayer().then(async () => {
          await TrackPlayer.add({
              id: 'trackId',
              url: streamUrl,
              title: 'Track Title',
              artist: 'Track Artist'
          });
        });
        BackgroundTimer.setTimeout(() => {
          TrackPlayer.setupPlayer().then(async () => {
            await TrackPlayer.add({
                id: 'trackId',
                url: streamUrl,
                title: 'Track Title',
                artist: 'Track Artist'
            });
          });
          TrackPlayer.play()
          console.log('this is working')
        }, window.timeLeft * 1000)
        alert('alarm set to' + ' ' + track.title +
          ', by ' + track.user.username + ' playing in' + window.timeLeft + 'seconds')
        })
      .catch(function(error) {
        alert(error)
      })
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
