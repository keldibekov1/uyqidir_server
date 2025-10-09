import {
  Controller,
  Post,
  Delete,
  Body,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';

@Controller('upload')
export class UploadController {
  // 🔹 1. TEMPGA YUKLASH
  @Post('temp')
  @UseInterceptors(
    FilesInterceptor('file', 10, {
      storage: diskStorage({
        destination: path.join(__dirname, '../../uploads/temp'),
        filename(req, file, cb) {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = path.extname(file.originalname);
          cb(null, `${unique}${ext}`);
        },
      }),
    }),
  )
  uploadTemp(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) return { message: 'Fayl yubor, aka!' };

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    return {
      files: files.map((f) => ({
        fileName: f.filename,
        fileUrl: `${baseUrl}/uploads/temp/${f.filename}`,
      })),
    };
  }

  // 🔹 2. TEMP FAYLNI O‘CHIRISH
  @Delete('temp')
  deleteTemp(@Body('fileName') fileName: string) {
    const filePath = path.join(__dirname, '../../uploads/temp', fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return { message: 'Rasm o‘chirildi ✅' };
    }
    return { message: 'Bunday fayl yo‘q ❌' };
  }

  // 🔹 3. TEMP → FINALGA O‘TKAZISH
  @Post('move-to-final')
  moveToFinal(@Body('files') files: string[]) {
    if (!Array.isArray(files) || files.length === 0)
      return { message: 'Fayllar yo‘q' };

    const finalUrls: string[] = [];

    for (const name of files) {
      const tempPath = path.join(__dirname, '../../uploads/temp', name);
      const finalPath = path.join(__dirname, '../../uploads/final', name);

      if (fs.existsSync(tempPath)) {
        fs.renameSync(tempPath, finalPath);
        finalUrls.push(`/uploads/final/${name}`);
      }
    }

    return {
      message: `Ko‘chirish tugadi (${finalUrls.length} ta fayl) ✅`,
      finalUrls,
    };
  }
}
