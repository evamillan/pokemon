import React, { Component } from 'react';
import Search from './components/Search';
import PokemonList from './components/PokemonList';

class App extends Component {
  constructor(props){
    super(props);
    const numberOfPokemon = 5;
    const numbers = [...Array(numberOfPokemon).keys()].map(n => n + 1);
    const pokemons = numbers.map(number =>({
        id: number,
        name: ''
      }));
    this.state = {
      pokemons,
      filter: ''
    };
  }

  handleFilterChange = query => {
    this.setState({
      filter: query
    });
  }

  filterPokemon(){
    return this.state.pokemons.filter(
      pokemon => pokemon.name.includes(this.state.filter)
    )
  }

  componentDidMount(){
    const baseURL = 'http://pokeapi.co/api/v2/';
    const pokemonURL = num => `${baseURL}pokemon/${num}/`;

    this.state.pokemons.map( pokemon =>
      fetch(pokemonURL(pokemon.id))
        .then(response =>
          response.json()
        )
        .then(json => {
          const{
            name,
            sprites: {front_default: image},
            types: [{type: {name: type}}],
            species: {url: speciesURL}
          } = json;

          this.setState((prevState, props) => {
            const pokemons = [...prevState.pokemons];
            pokemons[pokemon.id - 1] = { ...pokemon, name, image, type };
            return {pokemons};
          });
          fetch(speciesURL)
          .then(response2 =>
            response2.json()
          )
          .then(json2 => {
            if (json2.evolves_from_species != null) {
              const{
                evolves_from_species: {name: evolved_from}
              } = json2;

              this.setState((prevState, props) => {
                const pokemons = [...prevState.pokemons];
                pokemons[pokemon.id - 1] = { ...pokemon, name, image, type, evolved_from };
                return {pokemons};
              });
            }

          }

        )
        })
    );
  }

  render() {
    return (
      <div>
        <Search onFilterChange={this.handleFilterChange} />
        <PokemonList pokemons={this.filterPokemon()} />
      </div>
    );
  }
}

export default App;
