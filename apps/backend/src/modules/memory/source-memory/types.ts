import { Field } from '@/shared/model';

export class RecentSearch {
  @Field({ type: "string", description: 'The text of the recent search' })
  text: string;

  @Field({ type: "number", description: 'The count of the recent search' })
  count: number;

  @Field({ type: "date", description: 'The last used date of the recent search' })
  lastUsed: Date;
};