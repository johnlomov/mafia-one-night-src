import React, {Component, Fragment} from 'react';

import './App.css';

import images from './img/index';
import config from './config';
import beginningAudio from './media/beginning.mp3';
import endAudio from './media/end.mp3';


const characters = config.characters;

class App extends Component {
    constructor() {
        super()

        this.state = {
            phase: 1,
            selected: [],
            playlist: [beginningAudio]
        }
    }

    onCharacterClick = (id, add) => {
        this.setState((prevState, props) => {
            if (add) {
                return {
                    selected: [...prevState.selected, id]
                }
            } else {
                return {
                    selected: [...prevState.selected.filter((item) => {
                        return item !== id;
                    })]
                }
            }
        }, () => console.log('state: ', this.state))
    }

    onStart = (e) => {
        e.preventDefault();

        if (this.state.selected.length > 0) {
            this.setState((prevState, props) => {
                let playlist = prevState.playlist,
                    sortSelected = prevState.selected.sort((a, b) => {
                        return parseInt(a, 10) - parseInt(b, 10);
                    });

                sortSelected.forEach((id) => {
                    let intId = parseInt(id, 10);

                    if (characters[intId].night) {
                        playlist = playlist.concat(characters[intId].media);
                    }
                });

                playlist.push(endAudio);

                return {
                    phase: 2,
                    playlist
                }
            }, () => console.log('state: ', this.state));
        }
    }

    render() {
        return (
            <div className="App">
                <div className="main">
                    {
                        this.state.phase === 1
                            ?
                            <Fragment>
                                <div className="head">Выберите персонажей</div>
                                {renderCharacters(this.onCharacterClick, this.state)}
                                <a href=""
                                   className="button"
                                   onClick={this.onStart}
                                >Начать игру</a>
                            </Fragment>
                            :
                            <Fragment>
                                <Player playlist={this.state.playlist}/>
                            </Fragment>
                    }
                </div>
            </div>
        );
    }
}

class Player extends Component {
    index = 0

    delay = 2000

    constructor() {
        super();

        this.state = {
            isPlay: true
        }
    }

    componentDidMount() {
        let playlist = this.props.playlist;

        this.audio.src = playlist[this.index];
        this.audio.play();
        this.audio.addEventListener('ended', () => {
            let src = playlist[++this.index];

            if (src) {
                this.audio.src = src;

                setTimeout(() => {
                    this.audio.play();
                }, this.delay);
            }

            if (this.index === 1) this.delay = 5000;
            if (this.index === playlist.length - 2) this.delay = 2000;
        });
    }

    onClick = () => {
        if (this.state.isPlay) this.audio.pause();
        else this.audio.play();

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
                <audio ref={(el) => {
                    this.audio = el
                }} src=''/>
            </Fragment>
        )
    }
}

function renderCharacters(onCharacterClick, state) {
    let template = [];

    for (let key in characters) {
        template.push(
            <Character
                key={key}
                id={key}
                state={state}
                src={images[characters[key].name]}
                onCharacterClick={onCharacterClick}
            />
        );
    }

    return (
        <div className="characters">
            {template}
        </div>
    )
}

function Character(props) {
    let {id, state, onCharacterClick, src} = props,
        add,
        active = false;

    if (state.selected.indexOf(id) >= 0) active = true;

    add = !active;

    return <img
        className={active ? 'active' : null}
        onClick={() => onCharacterClick(id, add)}
        src={src}
        alt=""
    />
}

export default App;
