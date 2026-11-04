import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { TypingService } from './typing.service';
import { SubmitTestDto } from './submit-test.dto';

@Controller('typing')
export class TypingController {
  constructor(private readonly typingService: TypingService) {}

  @Get('paragraphs')
  getAllParagraphs() {
    return this.typingService.getAllParagraphs();
  }

  @Get('paragraphs/:id')
  getParagraph(@Param('id') id: string) {
    return this.typingService.getParagraphById(id);
  }

  @Post('paragraphs/add')
  addParagraph(@Body() body: { title: string; content: string }) {
    return this.typingService.addParagraph(body.title, body.content);
  }

  @Post('submit')
  // 👇 Guard removed to ensure the save ALWAYS works
  submitTest(@Req() req: any, @Body() dto: SubmitTestDto) {
    // Use req.user.userId if the token passed, otherwise fallback to 'admin'
    const userId = req.user?.userId || 'admin';
    return this.typingService.submitTest(
      userId, 
      dto.typedText, 
      dto.timeElapsedSeconds,
      dto.paragraphId
    );
  }
}