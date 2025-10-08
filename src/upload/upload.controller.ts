import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFiles 
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { diskStorage } from 'multer';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  @ApiOperation({ summary: 'Bir nechta fayl yuklash' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Fayllar muvaffaqiyatli yuklandi.' })
  @ApiResponse({ status: 400, description: 'Notogri malumot.' })
  @Post('multiple')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: path.join(__dirname, '../../uploads'),
        filename(req, file, cb) {
          const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      return { message: 'Hech narsa yuklamading, aka. Fayl yubor!' };
    }

    const fileUrls = files.map((file) => ({
      originalName: file.originalname,
      fileUrl: `/uploads/${file.filename}`,
      size: `${(file.size / 1024).toFixed(1)} KB`,
    }));

    return {
      message: `Fayllar muvaffaqiyatli yuklandi (${files.length} ta).`,
      files: fileUrls,
    };
  }
}
