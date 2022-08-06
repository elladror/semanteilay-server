import axios from "axios";

const BASE_URL = "https://semantle-he.herokuapp.com/api/distance?word=";

const guessWord = async (word: string) => {
  const url = encodeURI(decodeURI(`${BASE_URL + word}`));
  const res = await axios.get(url);

  if (res.status !== 200) throw new Error(`${res.status}: ${res.statusText}`);

  if (res.data.similarity === null) throw new Error("unknown word");

  return res.data;
};

export default guessWord;
