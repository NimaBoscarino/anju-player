json.array!(@playlists) do |playlist|
  json.extract! playlist, :id, :songlist
  json.url playlist_url(playlist, format: :json)
end
