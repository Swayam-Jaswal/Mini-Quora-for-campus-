// utils/maskAuthor.js
function maskIfAnonymous(doc) {
  const obj = doc.toObject ? doc.toObject() : doc;

  if (obj.isAnonymous) {
    return {
      ...obj,
      author: obj.author
        ? { _id: obj.author._id, name: "Anonymous User" }
        : { name: "Anonymous User" },
      authorId: obj.author?._id || null,
      authorName: "Anonymous User",
    };
  }

  // Non-anonymous: keep actual info
  return {
    ...obj,
    authorId: obj.author?._id || null,
    authorName: obj.author?.name || null,
  };
}

module.exports = maskIfAnonymous;
