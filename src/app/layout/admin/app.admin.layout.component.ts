import { Component, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { AdminLayoutService } from './service/app.admin.layout.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AppAdminSidebarComponent } from './sidebar/app.admin.sidebar.component';
import { AppAdminTopBarComponent } from './topbar/app.admin.topbar.component';

@Component({
    selector: 'app-admin-layout',
    templateUrl: './app.admin.layout.component.html',
})
export class AppAdminLayoutComponent implements OnDestroy {

  overlayMenuOpenSubscription: Subscription;

  menuOutsideClickListener: any;

  profileMenuOutsideClickListener: any;

  @ViewChild(AppAdminSidebarComponent) appSidebar!: AppAdminSidebarComponent;

  @ViewChild(AppAdminTopBarComponent) appTopbar!: AppAdminTopBarComponent;

  constructor(public layoutAdminService: AdminLayoutService, public renderer: Renderer2, public router: Router) {
    this.overlayMenuOpenSubscription = this.subscribeToAdminLayoutServiceOverlay()
  }

  subscribeToAdminLayoutServiceOverlay() {
    return this.layoutAdminService.overlayOpen$.subscribe(()=> {
        if (!this.menuOutsideClickListener) {
          this.menuOutsideClickListener = this.renderer.listen('document', 'click', event => {
              const isOutsideClicked = !(this.appSidebar.el.nativeElement.isSameNode(event.target) || this.appSidebar.el.nativeElement.contains(event.target)
                  || this.appTopbar.menuButton.nativeElement.isSameNode(event.target) || this.appTopbar.menuButton.nativeElement.contains(event.target));

              if (isOutsideClicked) {
                  this.hideMenu();
              }
          });
      }

      if (!this.profileMenuOutsideClickListener) {
          this.profileMenuOutsideClickListener = this.renderer.listen('document', 'click', event => {
              const isOutsideClicked = !(this.appTopbar.menu.nativeElement.isSameNode(event.target) || this.appTopbar.menu.nativeElement.contains(event.target)
                  || this.appTopbar.topbarMenuButton.nativeElement.isSameNode(event.target) || this.appTopbar.topbarMenuButton.nativeElement.contains(event.target));

              if (isOutsideClicked) {
                  this.hideProfileMenu();
              }
          });
      }

      if (this.layoutAdminService.state.staticMenuMobileActive) {
          this.blockBodyScroll();
      }
    })
  }

  hideMenu() {
    this.layoutAdminService.state.overlayMenuActive = false;
    this.layoutAdminService.state.staticMenuMobileActive = false;
    this.layoutAdminService.state.menuHoverActive = false;
    if (this.menuOutsideClickListener) {
        this.menuOutsideClickListener();
        this.menuOutsideClickListener = null;
    }
    this.unblockBodyScroll();
  }

  hideProfileMenu() {
      this.layoutAdminService.state.profileSidebarVisible = false;
      if (this.profileMenuOutsideClickListener) {
          this.profileMenuOutsideClickListener();
          this.profileMenuOutsideClickListener = null;
      }
  }

  blockBodyScroll(): void {
      if (document.body.classList) {
          document.body.classList.add('blocked-scroll');
      }
      else {
          document.body.className += ' blocked-scroll';
      }
  }

  unblockBodyScroll(): void {
      if (document.body.classList) {
          document.body.classList.remove('blocked-scroll');
      }
      else {
          document.body.className = document.body.className.replace(new RegExp('(^|\\b)' +
              'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
      }
  }

  get containerClass() {
    return {
        'layout-theme-light': this.layoutAdminService.config().colorScheme === 'light',
        'layout-theme-dark': this.layoutAdminService.config().colorScheme === 'dark',
        'layout-overlay': this.layoutAdminService.config().menuMode === 'overlay',
        'layout-static': this.layoutAdminService.config().menuMode === 'static',
        'layout-static-inactive': this.layoutAdminService.state.staticMenuDesktopInactive && this.layoutAdminService.config().menuMode === 'static',
        'layout-overlay-active': this.layoutAdminService.state.overlayMenuActive,
        'layout-mobile-active': this.layoutAdminService.state.staticMenuMobileActive,
        'p-input-filled': this.layoutAdminService.config().inputStyle === 'filled',
        'p-ripple-disabled': !this.layoutAdminService.config().ripple
    }
  }

  ngOnDestroy() {
    if (this.overlayMenuOpenSubscription) {
        this.overlayMenuOpenSubscription.unsubscribe();
    }
  }
}
