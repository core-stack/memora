import Handlebars from 'handlebars';

export class PromptTemplate<T = any> {
  constructor(private template: string, private data?: T) { }

  build(data?: T): string {
    if (!this.data && !data) return this.template;
    if (!data) data = this.data;
    const template = Handlebars.compile(this.template);
    return template(data);
  }
}
