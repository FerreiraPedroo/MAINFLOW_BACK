import { Global, Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";

@Global()
@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: "./temp",
        filename: (req, file, callback) => {
          return callback(null, file.originalname);
        },
      }),
    }),
  ],
  exports: [MulterModule],
})
export class MulterConfigModule {}
