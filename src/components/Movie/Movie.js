import React from 'react';
import { format } from 'date-fns';
import { Rate, Spin } from 'antd';

import MovieServices from '../../services/MovieServices';
import { GenresConsumer } from '../GenresContext';

import './Movie.css';

export default class Movie extends React.Component {
  MovieServices = new MovieServices();

  state = {
    image: null,
  };

  componentDidMount() {
    const { poster } = this.props;

    if (!poster) {
      this.setState({
        image: 'uknown',
      });

      return;
    }

    this.MovieServices.getPosterOfMovie(poster).then((image) => {
      this.setState({
        image,
      });
    });
  }

  createGenresElements = (genres, genreIds) => {
    return genreIds.map((genreId) => {
      const genre = genres.filter((genre) => {
        return genre.id === genreId;
      });

      return (
        <div key={genreId} className="genres">
          <p className="genres__type">{genre[0].name}</p>
        </div>
      );
    });
  };

  determineСolorOfRating = (vote) => {
    let voteColor;

    if (vote < 3) {
      voteColor = 'terrible';
    } else if (3 <= vote && vote < 5) {
      voteColor = 'bad';
    } else if (5 <= vote && vote < 7) {
      voteColor = 'normal';
    } else {
      voteColor = 'good';
    }

    return voteColor;
  };

  handleChange = async (id, value) => {
    await this.MovieServices.addRating(id, value);
    this.props.onSetIsUserClickOnRate();
  };

  render() {
    let {
      title = 'unknown',
      release = 'unknown',
      description = 'unknown',
      voteAverage,
      genreIds,
      id,
      rating,
    } = this.props;

    const vote = Math.round(voteAverage * 10) / 10;
    let voteCircleColor = this.determineСolorOfRating(vote);

    if (release) {
      const year = release[0] + release[1] + release[2] + release[3];
      const month = release[5] + release[6];
      const day = release[8] + release[9];

      release = format(new Date(year, month, day), 'PP');
    }

    return (
      <div className="movie">
        {this.state.image !== 'uknown' && this.state.image ? (
          <img className="movie__image" src={this.state.image} alt="Image of movie" />
        ) : null}
        {this.state.image === 'uknown' ? (
          <div className="movie__uknown">
            <p className="movie__uknown-text">Uknown</p>
          </div>
        ) : null}
        {this.state.image === null ? (
          <div className="movie__spin">
            <Spin />
          </div>
        ) : null}

        <div className="movie__description">
          <h2 className="movie__name">{title}</h2>
          <p className="movie__release-date">{release}</p>
          <div className="movie__genres">
            <GenresConsumer>
              {(genres) => {
                if (genreIds.length !== 0) {
                  return this.createGenresElements(genres, genreIds);
                }

                return;
              }}
            </GenresConsumer>
          </div>
          <p className="movie__description-text">{description}</p>
          <Rate
            allowHalf
            className="rating-of-stars"
            style={{ fontSize: '15px' }}
            onChange={(value) => this.handleChange(id, value)}
            defaultValue={rating ? rating : null}
            count={10}
          />
          <div className={voteCircleColor + ' round-rating'}>{vote}</div>
        </div>
      </div>
    );
  }
}
