import React from 'react';
import { Pagination } from 'antd';

import './normalize.css';
import './app.css';

import MovieList from '../movieList';
import Search from '../search';
import Tabs from '../tabs';
import MovieService from '../../services';
import { GenresProvider } from '../genresContext';

export default class App extends React.Component {
  movieService = new MovieService();

  state = {
    movieName: null,
    page: 1,
    totalPages: null,
    isRatedButtonPressed: false,
    genres: null,
  };

  componentDidMount() {
    this.movieService.createGuestSession().catch((error) => {
      throw new Error('Could not create guest session', error);
    });

    this.movieService.getGenres().then((result) => {
      this.setStateGenres(result.genres);
    });
  }

  setStateGenres = (genres) => {
    this.setState({
      genres,
    });
  };

  handleSetMovieName = (movieName) => {
    this.setState({
      movieName,
      page: 1,
    });
  };

  handleSetTotalPages = (totalPages) => {
    this.setState({
      totalPages,
    });
  };

  handleSetPage = (page) => {
    this.setState({
      page,
    });
  };

  handleChangeState = (booleanValue) => {
    if (booleanValue) {
      this.setState({
        isRatedButtonPressed: booleanValue,
        page: 1,
        movieName: null,
      });
    } else {
      this.setState({
        isRatedButtonPressed: booleanValue,
        page: 1,
        movieName: undefined,
        totalPages: null,
      });
    }
  };

  render() {
    const { movieName, page, totalPages, isRatedButtonPressed } = this.state;

    return (
      <div className="wrapper">
        <div className="main-page">
          <GenresProvider value={this.state.genres}>
            <Tabs onChangeState={this.handleChangeState} />
            {!isRatedButtonPressed ? <Search onSetMovieName={this.handleSetMovieName} /> : null}
            <MovieList
              rated={isRatedButtonPressed}
              movieName={movieName}
              onSetTotalPages={this.handleSetTotalPages}
              page={page}
            />
            <Pagination
              align="center"
              pageSize={20}
              onChange={(page) => {
                this.handleSetPage(page);
              }}
              current={page}
              showSizeChanger={false}
              total={totalPages}
            />
          </GenresProvider>
        </div>
      </div>
    );
  }
}
