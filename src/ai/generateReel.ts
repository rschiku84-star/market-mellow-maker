export const generateReel = (
  product: string,
  offer: string,
  image: string
) => {
  return [
    {
      scene: 1,
      image: image,
      text: `Introducing ${product}`
    },
    {
      scene: 2,
      image: image,
      text: `Special Offer ${offer}`
    },
    {
      scene: 3,
      image: image,
      text: `Limited Time Deal`
    },
    {
      scene: 4,
      image: image,
      text: `Visit Store Now`
    }
  ];
};
