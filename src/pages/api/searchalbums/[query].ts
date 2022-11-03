import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const searchword = req.query.name as string;
  const offset = req.query.offset as string;
  const accessToken = req.query.accessToken;

  console.log("search made with offset: ", offset);

  if (searchword) {
    const searchParams = new URLSearchParams([
      ["query", searchword],
      ["type", "album"],
      ["offset", offset],
    ]);

    const response = await fetch(
      `https://api.spotify.com/v1/search?${searchParams}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const search = await response.json();

    return res.status(200).send(search);
  }

  return res.status(401).json({ error: "no valid searchword" });
};

export default handler;
