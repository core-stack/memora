import { Field } from "@/shared/model";

export class GetOAuth2UrlResponseDto {
  @Field({
    type: "string",
    url: true,
    description: "The url to redirect to",
    example: "https://google.com"
  })
  url: string;

  constructor(data: Partial<GetOAuth2UrlResponseDto>) {
    Object.assign(this, data);
  }
}
