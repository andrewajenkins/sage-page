import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'readable',
})
export class ReadablePipe implements PipeTransform {
  transform(value: string): string {
    return value
      .replace(/^-/, '')
      .replace(/^[\#]+/g, '')
      .replace(/^[\s]+/, '')
      .replace(/<\/?[^>]+(>|$)/g, '')
      .replace(/\".*\[(.*?)\].*\"/g, '$1');
  }
}
