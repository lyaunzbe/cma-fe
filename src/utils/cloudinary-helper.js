const cloudName = process.env.CLOUDINARY_NAME
const cloudinaryTransformUrlFromHash = (publicId, maxWidth, maxHeight) => {
  return `https://res.cloudinary.com/${cloudName}/w_${maxWidth},h_${maxHeight},c_limit/${publicId}.jpg`
}

export { cloudinaryTransformUrlFromHash }
