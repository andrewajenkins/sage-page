import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, NgIf, NgSwitchCase } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRippleModule } from '@angular/material/core';
import { MainContentComponent } from './main-content/main-content.component';
import { NavMenuComponent } from './file-tree-panel/nav-menu.component';
import { BotWindowComponent } from './main-content/bot-window/bot-window.component';
import { EditorWindowComponent } from './main-content/editor-window/editor-window.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularSplitModule } from 'angular-split';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { BotWindowService } from './main-content/bot-window/bot-window.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SettingsPopoverComponent } from './settings-popover/settings-popover.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SettingsService } from './settings-popover/settings.service';
import { ToolbarComponent } from './main-content/editor-window/toolbar/toolbar.component';
import { ContentContainerComponent } from './main-content/editor-window/content-container/content-container.component';
import { ContentSectionComponent } from './main-content/editor-window/content-section/content-section.component';
import { ContentToolbarComponent } from './main-content/editor-window/content-toolbar/content-toolbar.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatTreeModule } from '@angular/material/tree';
import { FileTreeComponent } from './file-tree-panel/file-tree/file-tree.component';
import { FileTreeMenuComponent } from './file-tree-panel/file-tree-menu/file-tree-menu.component';
import { DataService } from './common/services/data.service';
import { NodeNameDialog } from './file-tree-panel/dialogs/create-file/node-name-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { LoggingInterceptorService } from './common/services/interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    MainContentComponent,
    NavMenuComponent,
    BotWindowComponent,
    EditorWindowComponent,
    SettingsPopoverComponent,
    ToolbarComponent,
    ContentContainerComponent,
    ContentSectionComponent,
    ContentToolbarComponent,
    FileTreeComponent,
    FileTreeMenuComponent,
    NodeNameDialog,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // environment.noAnimations ? NoopAnimationsModule : BrowserAnimationsModule,
    NoopAnimationsModule, // disable animations for testing
    MatIconModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatToolbarModule,
    NgIf,
    NgSwitchCase,
    MatRippleModule,
    FlexLayoutModule,
    AngularSplitModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    TextFieldModule,
    ScrollingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatDividerModule,
    MatTreeModule,
    MatDialogModule,
  ],
  providers: [
    BotWindowService,
    SettingsService,
    AngularSplitModule,
    DataService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoggingInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}