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
import * as sharp from 'sharp';

@Controller('upload')
export class UploadController {
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
  async uploadTemp(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) return { message: 'Fayl yubor, aka!' };

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(
          __dirname,
          '../../uploads/temp',
          file.filename,
        );

        try {
          if (!fs.existsSync(filePath)) {
            console.error(`❌ Fayl topilmadi: ${filePath}`);
            return;
          }

          const tempCompressed = `${filePath}.tmp`;

          await sharp(filePath)
            .rotate()
            .resize(1080, 1280, {
              fit: 'cover', // Markazdan kesib, kadrni to‘ldiradi
              position: 'center', // O‘rtadan joylashtiradi
            })
            .jpeg({
              quality: 80, // Fayl kichik bo‘ladi (~300–600 KB)
              progressive: true, // Brauzer bosqichma-bosqich yuklaydi
              chromaSubsampling: '4:2:0', // Rang ma’lumotini siqadi
              mozjpeg: true, // Optimal siqish
            })
            .toFile(tempCompressed);

          fs.renameSync(tempCompressed, filePath);
        } catch (err) {
          console.error(`⚠️ ${file.filename} siqishda xatolik:`, err);
        }
      }),
    );

    return {
      files: files.map((f) => ({
        fileName: f.filename,
        fileUrl: `${baseUrl}/uploads/temp/${f.filename}`,
      })),
    };
  }

  @Delete('temp')
  deleteTemp(@Body('fileName') fileName: string) {
    const filePath = path.join(__dirname, '../../uploads/temp', fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return { message: 'Rasm o‘chirildi ✅' };
    }
    return { message: 'Bunday fayl yo‘q ❌' };
  }

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
