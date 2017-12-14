import React, {Component, Fragment} from 'react';
import config from './config';

const delay = config.delay;

export default class Player extends Component {
    timerId

    index = 0

    delay = delay

    state = {
        isPlay: true
    }

    componentDidMount() {
        let {playlist, onEnd} = this.props;

        this.audio.src = playlist[this.index];
        this.audio.play();

        this.checkPauseEl(playlist);

        this.audio.addEventListener('ended', () => {
            let src = playlist[++this.index];

            if (src) {
                this.audio.src = src;

                this.play();
            }

            this.checkPauseEl(playlist);

            if (this.index === playlist.length) onEnd();
        });
    }

    checkPauseEl = (playlist) => {
        if (playlist[this.index + 1] === ' ') {
            this.delay = 1500;

            this.index++;
        } else {
            this.delay = delay;
        }
    }

    play = () => {
        this.timerId = setTimeout(() => {
            this.audio.play();

        }, this.delay);
    }

    onClick = () => {
        if (this.state.isPlay) {
            this.audio.pause();

            clearTimeout(this.timerId);
        } else {
            this.play()
        }

        this.setState((prevState, props) => {
            return {isPlay: !prevState.isPlay};
        })
    }

    render() {
        return (
            <Fragment>
                <div onClick={this.onClick} className="icon">
                    {
                        this.state.isPlay ?
                            <i className="fa fa-pause" aria-hidden="true"></i> :
                            <i className="fa fa-play" aria-hidden="true"></i>
                    }
                </div>
                <p className="tip">Нажми на паузу если не успеваешь!</p>
                <audio ref={(el) => {
                    this.audio = el
                }} src=''/>
            </Fragment>
        )
    }
}