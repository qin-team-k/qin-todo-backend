import { NotAcceptableException } from '@nestjs/common';

export const multerOptions = {
  limits: { fileSize: 1000000 },
  fileFilter: (_req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return callback(
        new NotAcceptableException('Only image files are allowed!'),
        false,
      );
    }
    callback(null, true);
  },
};
