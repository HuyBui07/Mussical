// Home component
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  UserCircleIcon,
} from "@heroicons/react/16/solid";
import Song from "../../Components/Song";
import MusicPlayer from "../../Components/MusicPlayer";
import axios from "axios";
import AddToPlaylistPopup from "../../Components/UtilComponents/AddToPlaylistPopup";
import SearchBar from "../../Components/SearchBar";
import LoadingCircle from "../../Components/UtilComponents/LoadingCircle";

import "../../../index.css";
const limit = 4;
export default function Home() {
  const navigate = useNavigate();
  const [songs, setSongs] = useState<SongData[]>([]);
  const [selectedSong, setSelectedSong] = useState<SongData | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [currentAddSong, setCurrentAddSong] = useState<SongData | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const email = useSelector((state: any) => state.user.email);

  // Loading circle state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get<SongData[]>("http://localhost:4000/api/songs/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          page,
          limit: 4,
        },
      })
      .then((res) => {
        setSongs(res.data);
        setTotalPage(res.headers["x-total-count"] / limit);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [page]);

  const handleSongClick = (song: SongData) => {
    setSelectedSong(song);
  };
  const handleAddToPlaylistPopup = () => {
    setShowPopup(true);
  };
  const handleCancelAddToPlaylist = () => {
    setCurrentAddSong(null);
    setShowPopup(false);
  };
  return (
    <>
      <div
        className="m-2 ml-4 bg-zinc-800 h-full"
        style={{ borderRadius: "10px" }}
      >
        <div className="flex flex-row w-full">
          <SearchBar invisible={true} />
          <div className="flex flex-row ml-auto mr-3 mt-6 items-center">
            <UserCircleIcon
              className="text-white w-8 mr-4"
              onClick={() => navigate("/home/profile")}
            />
            <p className="text-white">{email}</p>
          </div>
        </div>
        <div className="mt-[14px] mx-3 bg-gray-600 h-[1px]" />
        <div className="mt-[14px] h-[70vh]" style={{ overflow: "auto" }}>
          <div className="mx-auto max-w-2xl lg:max-w-7xl lg:px-8">
            <div className="flex flex-row justify-between">
              <h2 className="text-lg text-white my-4 font-bold">
                Recent Songs
              </h2>
              <div className="flex flex-row">
                <ChevronLeftIcon
                  color="white"
                  className="w-6 chevron-icon"
                  onClick={() => {
                    page > 1 && setPage(page - 1);
                  }}
                />
                <ChevronRightIcon
                  color="white"
                  className="w-6 chevron-icon"
                  onClick={() => {
                    page < totalPage && setPage(page + 1);
                  }}
                />
              </div>
            </div>
            {loading ? (
              <LoadingCircle color="white" />
            ) : (
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                {songs.map((song) => (
                  <Song
                    key={song._id}
                    data={song}
                    onClick={() => handleSongClick(song)}
                    onClickAdd={() => {
                      setCurrentAddSong(song);
                      handleAddToPlaylistPopup();
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="mt-[14px] mx-auto max-w-2xl lg:max-w-7xl lg:px-8">
            <div className="flex flex-row justify-between">
              <h2 className="text-lg text-white my-4 font-bold">
                Top Picks For You
              </h2>
              <div className="flex flex-row">
                <ChevronLeftIcon className="w-6 chevron-icon" />
                <ChevronRightIcon className="w-6 chevron-icon" />
              </div>
            </div>
            {loading ? (
              <LoadingCircle color="white" />
            ) : (
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                {songs.map((song) => (
                  <Song
                    key={song._id}
                    data={song}
                    onClick={() => handleSongClick(song)}
                    onClickAdd={() => {
                      setCurrentAddSong(song);
                      handleAddToPlaylistPopup();
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mx-2 ml-4 bg-zinc-800" style={{ borderRadius: "10px" }}>
        <MusicPlayer selectedSong={selectedSong} />
      </div>
      {showPopup && (
        <AddToPlaylistPopup
          songId={currentAddSong?._id}
          message="Add to Playlist"
          afterConfirm={() => setShowPopup(false)}
          onCancel={handleCancelAddToPlaylist}
        />
      )}
    </>
  );
}
