import * as Papa from 'papaparse';
import tmdbApi from '../api/tmdbApi';
import { UserMovie } from '../storage/movieStorage';

/**
 * CSV columns: title, watchDate, sawInTheaters, recommendedBy
 * Returns: Array of UserMovie objects (with TMDB data filled in)
 */
export async function importMoviesFromCSV(
  csvString: string
): Promise<{ imported: UserMovie[]; errors: string[] }> {
  const results = Papa.parse(csvString, {
    header: true,
    skipEmptyLines: true,
  });

  const imported: UserMovie[] = [];
  const errors: string[] = [];

  for (const row of results.data as any[]) {
    const title = row.title?.trim();
    const watchDate = row.watchDate?.trim() || '';
    const sawInTheaters = row.sawInTheaters?.toLowerCase() === 'true';
    const recommendedBy = row.recommendedBy?.trim() || '';

    if (!title) {
      errors.push('Missing title in row: ' + JSON.stringify(row));
      continue;
    }

    try {
      // Search TMDB for the movie by title
      const searchResponse = await tmdbApi.searchMovies(title);
      if (!searchResponse || searchResponse.results.length === 0) {
        errors.push(`No TMDB match for "${title}"`);
        continue;
      }
      const tmdbMovie =  searchResponse.results[0];

      // Optionally, fetch full details (for runtime, genres, etc.)
      const movieDetails = await tmdbApi.getMovieDetails(tmdbMovie.id);
      const movieCredits = await tmdbApi.getMovieCredits(tmdbMovie.id);

      const userMovie: UserMovie = {
        id: movieDetails.id,
        tmdbId: movieDetails.id,
        title: movieDetails.title,
        year: movieDetails.release_date ? movieDetails.release_date.slice(0, 4) : '',
        posterPath: movieDetails.poster_path,
        watchDate,
        rating: 0,
        notes: '',
        genres: movieDetails.genres ? movieDetails.genres.map((g: any) => g.name) : [],
        director:
          movieCredits.crew?.find((c: any) => c.job === 'Director')?.name || '',
        runtime: movieDetails.runtime ?? 0,
        addedDate: new Date().toISOString().split('T')[0],
        sawInTheaters,
        recommendedBy,
      };

      imported.push(userMovie);
    } catch (err) {
      errors.push(`Error importing "${title}": ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return { imported, errors };
}