import { Controller, Get, Post, Param, Req } from '@nestjs/common';
import { LikeService } from './like.service';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(':adId')
  async toggle(@Param('adId') adId: string, @Req() req) {
    const userId = req.user.id; 
    return this.likeService.toggle(userId, { adId });
  }

  @Get('count/:adId')
  async count(@Param('adId') adId: string) {
    const count = await this.likeService.count(adId);
    return { adId, count };
  }

  @Get('my')
  async myLikes(@Req() req) {
    const userId = req.user.id;
    return this.likeService.findUserLikes(userId);
  }
}
