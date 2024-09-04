import React from 'react';
import { Spin } from 'antd';

import Movie from '../Movie';
import MovieServices from '../../services/MovieServices';

import './MovieList.css';

export default class MovieList extends React.Component {
  MovieServices = new MovieServices();

  state = {
    movies: undefined,
    errorText: '',
    isUserClickOnRate: false,
  };

  componentDidUpdate = (prevProps) => {
    if (
      (this.props.rated !== prevProps.rated && this.props.rated) ||
      (this.props.page !== prevProps.page && this.props.rated)
    ) {
      this.setState({
        movies: null,
      });

      this.getRatedMoviesAndUpdateDateAndState(this.props.page);

      return;
    }

    if (this.props.movieName !== prevProps.movieName || this.props.page !== prevProps.page) {
      this.setState({
        movies: null,
      });

      if (this.props.movieName !== undefined) {
        this.getMoviesAndUpdateDateAndState(this.props.movieName, this.props.page);
      } else {
        this.setState({
          movies: undefined,
        });
      }
    }
  };

  getMoviesAndUpdateDateAndState = (name, page) => {
    this.MovieServices.getMovies(name, page)
      .then((movies) => {
        if (page === 1) {
          this.props.onSetTotalPages(movies.total_results);
        }

        this.setState({
          movies: movies.results,
          errorText: '',
        });
      })
      .catch((error) => {
        this.handleError(error);
      });
  };

  getRatedMoviesAndUpdateDateAndState = (page) => {
    if (!this.state.isUserClickOnRate) {
      this.setState({
        movies: [],
        errorText: '',
      });

      return;
    }

    this.MovieServices.getRatedMovies(page)
      .then((movies) => {
        if (page === 1) {
          this.props.onSetTotalPages(movies.total_results);
        }

        this.setState({
          movies: movies.results,
          errorText: '',
        });
      })
      .catch((error) => {
        this.handleError(error);
      });
  };

  createArrayOfMovies = () => {
    return this.state.movies.map((movie) => {
      const {
        original_title: title,
        release_date: releaseDate,
        overview,
        poster_path: poster,
        vote_average: voteAverage,
        genre_ids: genresIds,
        id,
        rating = null,
      } = movie;

      return (
        <li key={movie.id}>
          <Movie
            title={title}
            release={releaseDate}
            description={overview}
            poster={poster}
            voteAverage={voteAverage}
            genreIds={genresIds}
            id={id}
            rating={rating}
            onSetIsUserClickOnRate={this.handleSetIsUserClickOnRate}
          />
        </li>
      );
    });
  };

  handleSetIsUserClickOnRate = () => {
    if (this.state.isUserClickOnRate) {
      return;
    }

    this.setState({
      isUserClickOnRate: true,
    });
  };

  handleError = (error) => {
    this.setState({
      errorText: error.message,
    });
  };

  render() {
    const { movies, errorText } = this.state;

    if (errorText) {
      return <p className="error">{errorText}</p>;
    }

    if (movies === undefined) {
      return <ul className="movie-list"></ul>;
    }

    if (movies === null) {
      return (
        <div className="spin">
          <Spin />
        </div>
      );
    }

    if (movies) {
      if (movies.length === 0) {
        return <p className="movie-list__no-relults">No results</p>;
      }
    }

    return <ul className="movie-list">{this.createArrayOfMovies()}</ul>;
  }
}
