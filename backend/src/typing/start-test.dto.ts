import { IsString, IsOptional } from 'class-validator';

export class StartTestDto {
  @IsString()
  @IsOptional()
  paragraphId?: string;
}