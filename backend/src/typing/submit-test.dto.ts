import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class SubmitTestDto {
  @IsString()
  @IsNotEmpty()
  typedText: string;

  @IsNumber()
  @IsNotEmpty()
  timeElapsedSeconds: number;

  @IsString()
  @IsNotEmpty()
  paragraphId: string;
}