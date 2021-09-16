import React, { useState } from 'react';
import pokemon from 'pokemon';
import axios from 'axios';

import NavBar from './componenets/NavBar';

import Home from './pages/Home.js';
import Pokemon from './pages/Pokemon.js';
import Stats from './pages/Stats.js'

import './css/App.css'
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';

const App = () => {

  // Using the history from React Router to change pages
  const history = useHistory();
  const location = useLocation();

  const [pokemonData, setPokemonData] = useState({
    default: true,
    name: 'default',
    id: 900,
    types: [],
    height: 0,
    weight: 0,
    sprites: [],
    image: null,
    description: 'This is the ilusive pokemon that never appears.',
    evolution_chain_URL: null
  })

  const [searchBar, showSearchBar] = useState(true);

  // TODO: This could be an integer or string. Make sure to use typeOf to determine that
  const [search, setSearch] = useState('')

  const baseNormalURL = 'https://pokeapi.co/api/v2/pokemon/'; // Ex: https://pokeapi.co/api/v2/pokemon/1/

  // Has more information about each pokemon
  const baseSpeciesURL = 'https://pokeapi.co/api/v2/pokemon-species/'; // Ex: https://pokeapi.co/api/v2/pokemon-species/1/

  // This depends on if the pokemon has an evolution chain. We can create an array to check to see which pokemon do and do not client-side instead of having to run unnecessary API calls
  // const baseEvolutionURL = 'https://pokeapi.co/api/v2/evolution-chain/';

  const fetchPokemonData = (name) => {
    let pokemonID = pokemon.getId(name); // pokemon.getId(pokemon.random());
    let pokeData = {}
    axios.all([
      axios.get(`${baseNormalURL}${pokemonID}`),
      axios.get(`${baseSpeciesURL}${pokemonID}`)
    ])
      .then(axios.spread((data1, data2) => {
        pokeData.name = data1.data.name;
        pokeData.id = data1.data.id;
        pokeData.types = data1.data.types;
        pokeData.height = data1.data.height;
        pokeData.weight = data1.data.weight;
        pokeData.sprites = data1.data.sprites;
        pokeData.image = data1.data.sprites.other.dream_world.front_default;

        // Gets the description in English. Some pokemon have descriptions that are not
        // English first. This goes through the array and finds the first description set that is 
        // in English.
        pokeData.description = data2.data.flavor_text_entries.find(set => {
          return set.language.name === "en"
        }).flavor_text; // description of our pokemon
        pokeData.is_legendary = data2.data.is_legendary;
        pokeData.is_mythical = data2.data.is_mythical;
        pokeData.evolution_chain_URL = data2.data.evolution_chain.url;

        // Stops use from making unnecessary API calls
        pokeData.default = false;
        setPokemonData(pokeData);
        setSearch('');
      }));
  }

  const updateSearch = (event) => {
    setSearch(event.target.value);
  }

  // Sets 'search' to be the default value for text
  const submitSearch = (event, text = search, input = true) => {
    if (!isNaN(text)) {
      let id = parseInt(text);
      if (id > 0 && id < 898) {
        let name = pokemon.getName(parseInt(text));
        fetchPokemonData(name);
        history.push(`/pokemon/${id}`);
      } else {
        if (input) {
          alert("This pokemon does not exist");
          setSearch('');
        } else {
          // Takes us to the homepage if the pokemon does not exist
          history.push('/')
        }
      }
    } else {
      // This capitalizes the first letter of the name
      text = text.charAt(0).toUpperCase() + text.substring(1);
      // Checks to see if the pokemon actually exist
      if (pokemon.all().includes(text)) {
        fetchPokemonData(text);
        history.push(`/pokemon/${text.toLowerCase()}`);
      } else {
        if (input) {
          alert("This pokemon does not exist");
          setSearch('');
        } else {
          // Takes us to the homepage if the pokemon does not exist
          history.push('/')
        }
      }
    }
  }

  // Handles my routing system to go back to the previous page
  const goBack = () => {
    let currPath = location.pathname;
    switch (currPath.toLowerCase()) {
      case `/`:
        break;

      case `/pokemon/${pokemonData.id}`:
        history.push('/');
        resetData();
        break;

      case `/pokemon/${pokemonData.name}`:
        history.push('/');
        resetData();
        break;

      case `/pokemon/${pokemonData.id}/stats/details`:
        history.push(`/pokemon/${pokemonData.id}`);
        break;

      case `/pokemon/${pokemonData.name}/stats/details`:
        history.push(`/pokemon/${pokemonData.name}`);
        break;

      default:
        history.goBack();
        break;
    }
  }

  const resetData = () => {
    setPokemonData({
      default: true,
      name: 'default',
      id: 900,
      types: [],
      height: 0,
      weight: 0,
      sprites: [],
      image: null,
      description: 'This is the ilusive pokemon that never appears.',
      evolution_chain_URL: null
    });
  }

  return (
    // Sets the background color for the page based on the current location. If '/', sets it to red
    <div id='app' className={`${location.pathname === '/' ? 'start_color' : ''}`}>
      <NavBar isHome={pokemonData.default} goBack={goBack} />
      <Switch>
        <Route exact path='/'>
          <Home pokemonData={pokemonData} showSearchBar={showSearchBar} />
        </Route>
        <Route exact path='/pokemon/:id'>
          <Pokemon pokemonData={pokemonData} submitSearch={submitSearch} showSearchBar={showSearchBar} />
        </Route>
        <Route exact path='/pokemon/:id/stats/:stat'>
          <Stats pokemonData={pokemonData} showSearchBar={showSearchBar} />
        </Route>
      </Switch>
      <div style={{ display: searchBar ? 'flex' : 'none' }} className={`end ${location.pathname === '/' ? 'start_color' : ''}`}>
        <div id="searchBar">
          <input id="searchText" type='text' value={search} onChange={updateSearch} />
          <button id="random" onClick={submitSearch}>Search</button>
        </div>
      </div>
    </div>
  )
};


export default App;