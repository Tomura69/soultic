import {
  Route,
  RouteConfigMultipleViews,
  RouteConfigSingleView,
} from 'vue-router/types/router'
import { TranslateResult } from 'vue-i18n'

export interface RouteMetaConfigSingleView extends RouteConfigSingleView {
  meta?: RouteMetaInformation
  children?: RouteMetaConfig[]
}

interface RouteMetaConfigMultipleViews extends RouteConfigMultipleViews {
  meta?: RouteMetaInformation
  children?: RouteMetaConfig[]
}

/**
 * RouteConfig using RouteMetaInformation.
 */
export type RouteMetaConfig =
  | RouteMetaConfigSingleView
  | RouteMetaConfigMultipleViews

type StaticBreadcrumb = {
  name: TranslateResult
  link?: string
}

type DynamicBreadcrumb = {
  genName: (arg: Route) => string
}

export type BreadcrumbType = StaticBreadcrumb | DynamicBreadcrumb

export type RouteMetaInformation = {
  rerender?: boolean
  layout?: 'blank'
  breadcrumbs?: BreadcrumbType[]
}
