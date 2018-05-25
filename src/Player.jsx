import React, {Component, Fragment} from 'react';

export default class Player extends Component {
    timerId

    index = 0

    delay = this.props.delay

    state = {
        isPlay: true
    }

    componentDidMount() {
        let {playlist, onEnd, delay} = this.props;

        this.props.audio.src = playlist[this.index];
        this.props.audio.play();

        this.pauseWorker(playlist);

        this.props.audio.addEventListener('ended', () => {
            let src = playlist[++this.index];

            if (src) {
                this.props.audio.src = src;

                this.play();
            }

            this.pauseWorker(playlist, delay);

            if (this.index === playlist.length) onEnd();
        });
    }

    pauseWorker = (playlist, delay) => {
        if (playlist[this.index + 1] === ' ') {
            this.delay = 1500;

            this.index++;
        } else {
            this.delay = delay;
        }
    }

    play = () => {
        this.timerId = setTimeout(() => {
            this.props.audio.play();

        }, this.delay);
    }

    onClick = () => {
        if (this.state.isPlay) {
            this.props.audio.pause();

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
            </Fragment>
        )
    }
}