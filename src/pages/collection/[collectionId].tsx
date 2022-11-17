import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import HeroSection from "../components/HeroSection";
import AlbumInfo from "../components/AlbumInfo";

import getSessionInfo from "../components/helpers/getSessionInfo";
import getSeveralAlbums from "../components/helpers/getSeveralAlbums";
import getCollections from "../components/helpers/getCollections";

import { Album, Collection } from "../../types";

const CollectionPage: NextPage = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [collectionName, setCollectionName] = useState<string>("");
  const [modalAlbumInfo, setModalAlbumInfo] = useState<Album | null>(null);

  const router = useRouter();
  const { collectionId } = router.query;

  useEffect(() => {
    const getAlbums = async () => {
      const session = await getSessionInfo();

      if (session && session.user && session.accessToken) {
        const collection: Collection = await getCollections(
          session.user.id,
          collectionId as string
        );

        if (collection && collection.albums) {
          setCollectionName(collection.name);

          const albumIds = collection.albums
            .map((album) => album.albumId)
            .join(",");

          if (albumIds) {
            const albumsForCollection = await getSeveralAlbums(
              session.accessToken,
              albumIds as string
            );
            setAlbums(albumsForCollection);
          }
        }
      }
    };

    getAlbums();
  }, [collectionId]);

  const handleDeleteAlbum = (albumId: string) => {
    const updatedAlbums = albums.filter((album) => album.id !== albumId);
    setAlbums(updatedAlbums);
    setModalAlbumInfo(null);
  };

  return (
    <main className="flex-1 overflow-y-scroll">
      <HeroSection backgroundName="record-store">
        <h1 className="opacity-100">{collectionName ?? ""}</h1>
      </HeroSection>
      <div className="flex flex-wrap justify-center">
        {albums.length === 0 ? (
          <p>Loading...</p>
        ) : albums.length > 0 ? (
          albums.map((album) => {
            return album.images[1] ? (
              <span
                className="relative m-2 h-[300px] w-[300px] cursor-pointer"
                onClick={() => setModalAlbumInfo(album)}
                key={album.id}
              >
                <Image src={album.images[1].url} alt="" layout="fill" />
              </span>
            ) : null;
          })
        ) : (
          <p>No albums</p>
        )}
      </div>
      {modalAlbumInfo ? (
        <AlbumInfo
          {...modalAlbumInfo}
          deleteAlbumFromState={handleDeleteAlbum}
          openedFrom="collection"
          collectionId={collectionId as string}
          closeModal={() => setModalAlbumInfo(null)}
        />
      ) : null}
    </main>
  );
};

export default CollectionPage;