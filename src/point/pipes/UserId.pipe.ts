import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { isNumber } from "class-validator";

@Injectable()
export class UserIdPipe implements PipeTransform<number, number> {
  transform(value: number): number {
    if (!isNumber(value)) {
      throw new BadRequestException("Invalid type");
    }
    if (value <= 0) {
      throw new BadRequestException("Invalid value");
    }

    return value;
  }
}
