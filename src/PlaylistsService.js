const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistById(playlistId) {
    console.log(`Sebelum ${playlistId}`);
    const queryPlaylist = {
      text: 'SELECT * FROM playlists WHERE id = $1',
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
    }

    const song = await this._pool.query(querySongsInPlaylist);

    const querySongs = {
      text: 'SELECT id, title, performer FROM songs WHERE id = $1',
      values: [song],
    };

    const songResult = await this._pool.query(querySongs);

    playlist.songs = songResult.rows;

    console.log(`Sesudah ${playlist}`);

    return playlist;
  }
}

module.exports = PlaylistsService;