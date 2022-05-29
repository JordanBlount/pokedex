import { useSelector } from 'react-redux';

import Tag from './Tag';

import '../css/PokemonInfo.css'
import legendaryBadge from '../assets/legendary.svg';
import mythicalBadge from '../assets/myth.svg';

import noPokemonImg from '../assets/no-image.svg';
import { capitalize } from '../utility';

const PokemonInfo = (props) => {

    const pokemonData = useSelector(state => state.pokemonData);

    const setId = (id) => {
        switch (id.toString().length) {
            case 1:
                return `#00${id}`
            case 2:
                return `#0${id}`
            case 3:
                return `#${id}`
            default:
                return id.toString()
        }
    }

    return (
        // FIXME: I need to fix this prop.pokemon.type because I want the info background to be colored based on the FIRST type that the pokemon is.
        // ${pokemonData.types[0].type.name}
        <div className={`pokemon-info ${pokemonData.color}`}>
            <div className={`container`}>
                <div className='identity'>
                    <div className="identity_left-side">
                        <h1 className='pokemon-name'>{capitalize(pokemonData.name)}</h1>
                        {
                            pokemonData.is_legendary ? <img className="legendary" src={legendaryBadge} alt="legendary badge"></img> : null
                        }
                        {
                            pokemonData.is_mythical ? <img className="mythical" src={mythicalBadge} alt="mythical badge"></img> : null
                        }
                    </div>
                    <div className="identity_right-side">
                        <p className='pokemon-id'>{setId(pokemonData.id)}</p>
                    </div>
                </div>

                <div className="tag-container">
                    {
                        // Gets only the first 2 tags out of the types
                        pokemonData.types.slice(0, 2).map((tag, index) => (
                            <Tag key={index} type={tag.type.name} />
                        ))
                    }
                </div>
                <img className="pokemon-image" src={pokemonData.image !== null ? pokemonData.image : noPokemonImg} alt={pokemonData.name}></img>
            </div>
        </div>
    );
};

export default PokemonInfo;