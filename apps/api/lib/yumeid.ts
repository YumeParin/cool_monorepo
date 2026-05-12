/**
 * YumeID for Posts
 * Format : [timestamp][7-random-digits]
 */
export const yumeid = () => {
  const SWISSOKYO_EPOCH = 1767229261000;
  const relativeTimestamp = Date.now() - SWISSOKYO_EPOCH;

  const randomness = Math.floor(Math.random() * 10000000)
    .toString()
    .padStart(7, "0");

  return `${relativeTimestamp}${randomness}`;
};
