// utils/maskAuthor.js
function maskIfAnonymous(doc) {
  const obj = doc.toObject ? doc.toObject() : doc;

  if (obj.isAnonymous) {
    return {
      ...obj,
      author: {
        _id: obj.author?._id || null,
        name: "Anonymous User",
        avatar: null, // 🔹 hide avatar for anonymous
      },
      authorId: obj.author?._id || null,
      authorName: "Anonymous User",
      authorAvatar: null,
    };
  }

  // 🔹 Non-anonymous: use activeAvatar first, then fallback
  return {
    ...obj,
    author: {
      _id: obj.author?._id || null,
      name: obj.author?.name || null,
      avatar:
        obj.author?.activeAvatar ||
        obj.author?.avatar ||
        null, // ✅ support new schema
    },
    authorId: obj.author?._id || null,
    authorName: obj.author?.name || null,
    authorAvatar:
      obj.author?.activeAvatar ||
      obj.author?.avatar ||
      null, // ✅ support new schema
  };
}

module.exports = maskIfAnonymous;
