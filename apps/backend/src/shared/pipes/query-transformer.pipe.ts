import { queryToFilter } from "@/generics";
import { Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class QueryTransformerPipe implements PipeTransform {
  constructor() {}

  transform(value: any) {
    return queryToFilter(value);
  }
}