import multer from 'multer';

const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'additionalDoc', maxCount: 1 },
]);

export { multerUploads };
