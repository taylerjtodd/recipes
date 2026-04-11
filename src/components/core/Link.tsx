import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { AnchorHTMLAttributes, forwardRef } from "react";

export type LinkProps = NextLinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProps> & {
    unstyled?: boolean;
  };

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, unstyled, children, ...props }, ref) => {
    const defaultClasses = unstyled
      ? ""
      : "text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors";

    const mergedClassName = [defaultClasses, className].filter(Boolean).join(" ");

    return (
      <NextLink ref={ref} className={mergedClassName} {...props}>
        {children}
      </NextLink>
    );
  }
);

Link.displayName = "Link";

export default Link;
