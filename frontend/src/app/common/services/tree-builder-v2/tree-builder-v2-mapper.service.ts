import { Injectable } from '@angular/core';
import { ContentSection } from '../../models/section.model';
import { ServiceLogger } from '../../logger/loggers';

@Injectable({
  providedIn: 'root',
})
@ServiceLogger()
export class TreeBuilderV2MapperService {
  constructor() {}
  mapTokensToNodes(lexResult: any, sections: ContentSection[]) {
    const newSections: ContentSection[] = [];
    lexResult = lexResult.filter((res) => {
      return res.type !== 'space';
    });
    for (let i = 0; i < sections.length; i++) {
      let section = sections[i];
      const resSection = lexResult[i];
      this.map(resSection, section, newSections);
    }
    return newSections;
  }

  private map(resSection: any, section: ContentSection, newSections: ContentSection[]) {
    if (!resSection || resSection.type == 'space') {
      console.warn('Some sections were merged and not parsed separately!', resSection, section);
      return;
    }
    if (['text', 'list_item'].indexOf(resSection.type) !== -1) {
      this.mapContent(resSection, section, newSections);
    } else {
      this.mapSection(resSection, section, newSections);
    }
  }

  private mapContent(res: any, section: ContentSection, newSections: ContentSection[]) {
    if (res.type == 'br') {
      console.warn('br token found, skipping', res, section);
      return;
    }
    section.lexType = res?.type || '';
    const newSection = { ...res, ...section };
    this.verifyNameMatch(newSection, res, section, 'content');
    newSections.push({ ...res, ...section });
  }

  private verifyNameMatch(newSection: any, res: any, section: ContentSection, content: string) {
    if (
      newSection.name.indexOf(newSection.text || 'NO_TEXT') == -1 &&
      (newSection.text || 'NO_TEXT').indexOf(newSection.name) === -1
    )
      console.error(
        'NAME MISMATCH: map result: ' + content + ': res:',
        res,
        content,
        section,
        'newSection:',
        newSection
      );
  }

  private mapSection(resSection: any, section: ContentSection, newSections: ContentSection[]) {
    if (resSection.type == 'br') {
      console.warn('br token found, skipping', resSection, section);
      return;
    }
    section.lexType = resSection?.type || '';
    const newSection = { ...resSection, ...section };
    this.verifyNameMatch(newSection, resSection, section, 'section');
    newSections.push({ ...section, ...resSection });
  }
}
