class MovieServices {
  apiBase = 'https://api.themoviedb.org/3/search/movie?query=';
  apiPoster = 'https://image.tmdb.org/t/p/w500';
  bearerToken =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiMGY3NjBlODU4ODA3MTcyNGFlOGY5OWY3OTJlM2JlNSIsIm5iZiI6MTcyNDg2NjI3My4zMjM2OCwic3ViIjoiNjZhZDA5MmE3OGU0ODYzNGQ1Y2Q4NDlkIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.bV-KXaw9joJnu-o9xJ35PTKuvbdGk7U5Qv9GQEBqq-U';

  async createGuestSession() {
    const res = await fetch('https://api.themoviedb.org/3/authentication/guest_session/new', {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this.bearerToken}`,
      },
    });

    if (!res.ok) {
      throw new Error('The guest session was not created');
    }

    const body = await res.json();

    window.guestSessionId = body.guest_session_id;
  }

  async getGenres() {
    const result = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.bearerToken}`,
        accept: 'application/json',
      },
    });

    if (!result.ok) {
      throw new Error('Сouldn`t get genres');
    }

    return await result.json();
  }

  async addRating(id, vote) {
    if (!window.guestSessionId) {
      throw new Error('The guest session was not created');
    }

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Bearer ${this.bearerToken}`,
      },
      body: `{"value":${vote}}`,
    };

    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/rating?guest_session_id=${window.guestSessionId}`,
      options
    );

    if (!res.ok) {
      throw new Error('Could not fetch "Add Rating"');
    }

    return await res.json();
  }

  async getRatedMovies(page) {
    if (!window.guestSessionId) {
      throw new Error('The guest session was not created');
    }

    const res = await fetch(
      `https://api.themoviedb.org/3/guest_session/${window.guestSessionId}/rated/movies?language=en-US&page=${page}&sort_by=created_at.asc`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${this.bearerToken}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error('Could not fetch "Rated Movies"');
    }

    return await res.json();
  }

  async getTopRated(page) {
    const res = await fetch(`https://api.themoviedb.org/3/movie/top_rated?page=${page}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this.bearerToken}`,
      },
    });

    if (!res.ok) {
      throw new Error('Could not fetch "Top Rated"');
    }

    return await res.json();
  }

  async getMovies(name, page) {
    if (!window.navigator.onLine) {
      throw new Error('The Internet is not connected');
    }

    const res = await fetch(`${this.apiBase}${name}&page=${page}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this.bearerToken}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Could not fetch ${name}`);
    }

    return await res.json();
  }

  async getPosterOfMovie(path) {
    const res = await fetch(`${this.apiPoster}${path}`);

    if (!res.ok) {
      throw new Error(`Could not fetch ${path}`);
    }

    const blob = await res.blob();

    return new Promise((onSuccess, onError) => {
      try {
        const reader = new FileReader();
        reader.onload = function () {
          onSuccess(this.result);
        };
        reader.readAsDataURL(blob);
      } catch (e) {
        onError(e);
      }
    });
  }
}

export default MovieServices;
