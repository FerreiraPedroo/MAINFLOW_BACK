// import { ParseFilePipeBuilder } from "@nestjs/common";

// const FILE_TYPES = {
//   img: "jpeg|png|jpg",
//   pdf: "pdf",
//   doc: "doc|docx",
// };
// export const uploadFilePipe = ({
//   fileType,
//   fileSize,
//   fileRequired,
// }: {
//   fileType: keyof typeof FILE_TYPES;
//   fileSize: number;
//   fileRequired: boolean;
// }) => {
//   console.log({ fileType, fileSize, fileRequired });
//   return new ParseFilePipeBuilder()
//     .addFileTypeValidator({
//       fileType: FILE_TYPES[fileType],
//       errorMessage: "O tipo do arquivo não é válido.",
//     })
//     .addMaxSizeValidator({
//       maxSize: fileSize,
//       errorMessage: `Tamanho do arquivo excedido, limite máximo: ${(fileSize / 1024).toFixed(0)}KB`,
//     })
//     .build({ fileIsRequired: fileRequired });
// };

// export type UploadFilePipe = typeof uploadFilePipe;
