import React, {Component, Fragment} from 'react';

import './App.css';

import images from './img/index';
import config from './config';
import endAudio from './media/end.mp3';

import Player from './Player';
import Timer from './Timer';


const characters = config.characters;
const initialState = config.initialState;

class App extends Component {
    constructor() {
        super()

        this.state = initialState
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
        })
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
                        playlist.push(' ');
                    }
                });

                playlist.push(endAudio);

                return {
                    phase: 2,
                    playlist
                }
            });
        }
    }

    onEnd = () =>  {
        this.setState({phase: 3});
    }

    render() {
        let template,
            phase = this.state.phase;

        if (phase === 1) {
            template = <Fragment>
                <div className="head">Выберите персонажей</div>
                {renderCharacters(this.onCharacterClick, this.state)}
                <a href=""
                   className="button"
                   onClick={this.onStart}
                >Начать игру</a>
            </Fragment>
        }

        if (phase === 2) {
            template = <Player
                    playlist={this.state.playlist}
                    onEnd={this.onEnd}
                />
        }

        if (phase === 3) {
            template = <Fragment>
                <Timer onNewGame={this.onNewGame}/>
                <a href=""
                   className="button"
                >Новая игра</a>
            </Fragment>

        }

        return (
            <div className="App">
                <div className="main">
                    {template}
                </div>
            </div>
        );
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
