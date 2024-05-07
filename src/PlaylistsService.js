const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistById(playlistId) {
    const queryPlaylist = {
      text: 'SELECT id, name FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(queryPlaylist);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = result.rows[0];

    const querySongsInPlaylist = {
      text: 'SELECT song_id FROM playlist_songs WHERE playlist_id = $1',
      values: [playlist.id],
    };

    const song = await this._pool.query(querySongsInPlaylist);

    const querySongs = {
      text: 'SELECT id, title, performer FROM songs WHERE id = $1',
      values: [song.rows[0].song_id],
    };

    const songResult = await this._pool.query(querySongs);

    playlist.songs = songResult.rows;

    return playlist;
  }
}

module.exports = PlaylistsService;