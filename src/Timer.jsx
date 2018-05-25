import React, {Component, Fragment} from 'react';
import talking from './media/talking.mp3';
import voting from './media/voting.mp3';

const playlist = [talking, voting];

export default class Timer extends Component {
    intervalId

    state = {
        seconds: 300
    }

    componentDidMount() {
        this.props.audio.src = playlist[0];
        this.props.audio.play();

        this.props.audio.addEventListener('ended', this.startCounter);
    }

    componentDidUpdate() {
        if (this.state.seconds <= 0) {
            clearInterval(this.intervalId);

            this.props.audio.removeEventListener('ended', this.startCounter);

            this.props.audio.src = playlist[1];
            this.props.audio.play();
        }
    }

    startCounter = () => {
        this.intervalId = setInterval(this.tickOff, 1000);
    }

    tickOff = () => {
        this.setState((prevState) => {
            return {seconds: prevState.seconds - 1}
        });
    }

    render() {
        let seconds = this.state.seconds,
            min = (seconds - (seconds % 60)) / 60,
            sec = seconds % 60;

        if (sec < 10) sec = `0${sec}`

        return (
            <Fragment>
                <div className="timer">
                    <span>{min}</span><span> : </span><span>{sec === 0 ? `6${sec}` : sec}</span>
                </div>
            </Fragment>
        )
    }
}