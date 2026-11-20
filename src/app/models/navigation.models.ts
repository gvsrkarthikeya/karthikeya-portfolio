export interface NavItem {
  label: string;
  /** Route path without the leading slash. Empty for the home page. */
  path: string;
  /** Id of a section on that page to scroll to, without the `#`. */
  fragment?: string;
}
