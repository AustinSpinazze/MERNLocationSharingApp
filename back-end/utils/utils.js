const toPlaceResponseMapper = (object, protocol, host, baseUrl, fullUrl) => {

  const response = {
    placeId: object.placeId,
    title: object.title,
    description: object.description,
    address: object.address,
    location: {
      lat: object.location.lat,
      lng: object.location.lng
    },
    image: "https://images.pexels.com/photos/1563256/pexels-photo-1563256.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    creator: object.creator,
    _links: {
      self: {
        href: (protocol + "://" + host + baseUrl + "/places/" + object.placeId)
      },
      creator: {
        href: (protocol + "://" + host + baseUrl + "/user/" + object.creator)
      }
    }
  }

  return response;
}

exports.toPlaceResponseMapper = toPlaceResponseMapper;
