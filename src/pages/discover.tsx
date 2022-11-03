import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { WithContext as ReactTags, Tag } from "react-tag-input";
import HeroSection from "./components/HeroSection";
import Modal from "./components/Modal";

interface Album {
  name: string;
  id: string;
  images: Array<Image>;
  artists: Array<Artist>;
  release_date: string;
  external_urls: {
    spotify: string;
  };
}

interface Image {
  url: string;
}

interface Artist {
  name: string;
}

interface Track {
  album: {
    images: Array<{
      url: string;
    }>;
  };
}

const Browse: NextPage = () => {
  const [availableSeeds, setAvailableSeeds] = useState<Tag[]>([]);
  const [chosenSeeds, setChosenSeeds] = useState<Tag[]>([]);
  const [targetPopularity, setTargetPopularity] = useState<number>(50);

  const [albums, setAlbums] = useState<Array<Album>>([]);

  const [modalInfo, setModalInfo] = useState<Album>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const { data: session } = useSession();

  useEffect(() => {
    const getSeeds = async () => {
      if (session?.accessToken) {
        const response = await fetch(
          `/api/getavailableseeds?accessToken=${session?.accessToken}`
        );
        const seeds = await response.json();

        const seedsAsTags = seeds.genres.map((name: string, index: number) => {
          return {
            id: index.toString(),
            text: name,
          };
        });
        setAvailableSeeds(seedsAsTags);
      }
    };

    getSeeds();
  }, [session?.accessToken]);

  const KeyCodes = {
    comma: 188,
    enter: 13,
  };

  const delimiters = [KeyCodes.comma, KeyCodes.enter];

  const handleDelete = (i: number) => {
    setChosenSeeds(chosenSeeds.filter((tag, index) => index !== i));
  };

  const handleAddition = (seed: Tag) => {
    const tagIsValid = availableSeeds.find(
      (availableSeed) => availableSeed.id === seed.id
    );
    if (chosenSeeds.length < 5 && tagIsValid) {
      setChosenSeeds([...chosenSeeds, seed]);
    }

    return;
  };

  const handleDrag = (seed: Tag, currPos: number, newPos: number) => {
    const newChosenSeeds = chosenSeeds.slice();

    chosenSeeds.splice(currPos, 1);
    chosenSeeds.splice(newPos, 0, seed);

    setChosenSeeds(newChosenSeeds);
  };

  const handleSliderChange = (newValue: number) => {
    setTargetPopularity(newValue);
  };

  const handleBrowseSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAlbums([]);
    const seedNames = chosenSeeds.map((seed) => seed.text);
    const seedsAsString = seedNames.join(",");
    if (session?.accessToken) {
      const response = await fetch(
        `/api/getrecommendations/recommendations?seedgenres=${seedsAsString}&popularity=${targetPopularity}&accessToken=${session.accessToken}`
      );
      const result = await response.json();

      const resultAlbums = result.tracks
        .filter((track: Track) => track?.album?.images[1]?.url != undefined)
        .map((track: Track) => track?.album);
      setAlbums(resultAlbums);
    }
  };

  const passModalInfo = (albumId: string) => {
    const chosenAlbum = albums.find((album) => album.id === albumId);
    if (chosenAlbum) {
      setModalInfo(chosenAlbum);
      setModalVisible(true);
    }
  };

  const customRender = (tag: Tag) => {
    return (
      <div className="cursor-pointer text-spotartPurple hover:text-spotartLightPurple">
        {tag.text}
      </div>
    );
  };

  return (
    <main className="flex-1 overflow-y-scroll">
      <HeroSection backgroundName="record">
        <h1>Discover new albums</h1>
      </HeroSection>
      <div className="mx-20">
        <form onSubmit={handleBrowseSubmit} className="m-2 flex flex-col">
          <p className="py-2">Genres</p>
          <ReactTags
            classNames={{
              tags: "flex items-start pb-2",
              selected: "order-2 flex flex-wrap",
              tag: "bg-spotartPurple text-white rounded-lg p-2 mb-2 mr-2 !cursor-default",
              tagInput: "mr-2 order-1 rounded-lg border-2 border-black p-2",
              tagInputField: "focus:outline-none",
              remove: "pl-2",
              suggestions: "fixed bg-white z-1000 p-5 drop-shadow-xl mt-1",
            }}
            placeholder="Search Genres"
            renderSuggestion={(tag) => customRender(tag)}
            tags={chosenSeeds}
            suggestions={availableSeeds}
            delimiters={delimiters}
            handleDelete={handleDelete}
            handleAddition={handleAddition}
            handleDrag={handleDrag}
            inputFieldPosition="bottom"
            minQueryLength={1}
            autocomplete
          />
          <p className="py-2">Popularity</p>
          <input
            type="range"
            max={100}
            min={0}
            step={5}
            value={targetPopularity}
            onChange={({ target }) => handleSliderChange(Number(target.value))}
            className="w-1/3 py-2"
          />
          <button
            className="text-bold my-5 h-8 w-24 rounded-lg bg-spotartPurple uppercase text-white hover:bg-spotartLightPurple"
            type="submit"
          >
            Search
          </button>
        </form>
        <div>
          {albums.length > 0 && <p className="m-2">Results:</p>}
          <div className="flex flex-wrap">
            {albums.map((album, index) =>
              album.images[1] ? (
                <span
                  className="relative m-2 h-[300px] w-[300px] cursor-pointer"
                  onClick={() => passModalInfo(album.id)}
                  key={index}
                >
                  <Image src={album.images[1].url} alt="" layout="fill" />
                </span>
              ) : null
            )}
          </div>
        </div>
      </div>
      <Modal
        albumName={modalInfo?.name}
        imageUrl={modalInfo?.images[0]?.url}
        artists={modalInfo?.artists}
        releaseDate={modalInfo?.release_date}
        url={modalInfo?.external_urls.spotify}
        modalVisible={modalVisible}
        closeModal={() => setModalVisible(false)}
      />
    </main>
  );
};

export default Browse;
